import { globalMixins, wxp } from 'enhance-wxapp'
import globalData from './app.data'
import * as wxStore from './utils/wxStore'
import * as utils from './utils'
import config from './app.config'
import { sendMsgChance } from './utils/lejuTJ'
let app = getApp()

globalMixins({
  app: {
    hooks: {
      onLaunch: [
        function onLaunch(options) {
          app = app || getApp()

          let {
            click_id,
            click_info,
            click_path,
            click_id_time
          } = wx.getStorageSync('globalData') // 保存一个月，只和周期有关系
          //#region storage manage
          wxStore.storage('BASE_VERSION', this.BASE_VERSION)
          const version = wxStore.storage('version')
          // 升版本清数据
          if (version != this.version) {
            wxStore.removeStorage('globalData')
            wxStore.removeStorage('auth_expires_begin')
            wxStore.storage('version', this.version)
          }
          // 存储过期设置
          const expires = config.auth_expires
          if (expires == -1) {
            // 无限
          } else if (expires == 0) {
            // 删除
            wxStore.removeStorage('globalData')
          } else if (expires > 0) {
            // 分钟
            const now = parseInt(new Date().getTime() / 1000 / 60)
            const begin = wxStore.storage('auth_expires_begin')
            if (!begin) {
              wxStore.storage('auth_expires_begin', now)
            } else if (begin + expires <= now) {
              wxStore.storage('auth_expires_begin', now)
              wxStore.removeStorage('globalData')
            }
          }
          //#endregion

          //#region globalData
          let data = wxStore.storage('globalData')
          if (data) {
            Object.assign(this.globalData, data)
          }
          if (click_id && click_info && click_path && click_id_time) {
            Object.assign(app.globalData, {
              click_id,
              click_info,
              click_path,
              click_id_time
            })
            if (!app.clickIdTimeFun(click_id_time)) {
              app.globalData.click_id = ''
              app.globalData.click_info = ''
              app.globalData.click_path = ''
              app.globalData.click_id_time = ''
            }
          }
          // 场景值
          this.globalData.info.scene = options.scene
          // 获取ext.json
          if (config.is_open3rd) {
            this.getExtSync()
          }
          // 生成接口地址
          if (typeof this.globalData.urls === 'function') {
            this.globalData.urls = this.globalData.urls(config.env_service)
          }
          // 检测是否过期
          if (this.globalData.user.weixin_code) {
            wxp.checkSession().catch(() => {
              this.clearWeixin('token')
            })
          }
          //#endregion

          //#region updateManager
          if (wx.getUpdateManager) {
            const updateManager = wx.getUpdateManager()
            updateManager.onCheckForUpdate(res => {
              // 请求完新版本信息的回调 res.hasUpdate
            })
            updateManager.onUpdateReady(() => {
              // 标记已准备好更新
              this.globalData.info.onUpdateReady = true
              wxp
                .showModal({
                  title: '更新提示',
                  content: '新版本已经准备好，重启应用更新。',
                  showCancel: false
                })
                .then(res => {
                  if (res.confirm) {
                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                    updateManager.applyUpdate()
                  }
                })
            })
            updateManager.onUpdateFailed(() => {
              // 新的版本下载失败
              wx.showModal({
                title: '更新提示',
                content: '新版本下载失败',
                showCancel: false
              })
            })
          }
          //#endregion
        }
      ],

      onShow: [
        function (options) {
          // 场景值
          this.globalData.info.scene = options.scene
          if (this.globalData.user.weixin_code) {
            // 检测是否过期
            wxp.checkSession().catch(() => {
              this.clearWeixin('token')
            })
          }
        }
      ],

      onHide: [
        function () {
          wxStore.storage('globalData', {
            user: this.globalData.user,
            city: this.globalData.city
          })
        }
      ]
    },

    globalData,
    version: '0.0.000.alpha',
    BASE_VERSION: '1.2.015.rc',

    clickIdTimeFun(click_id_time) {
      let now = new Date().getTime()
      let timer = now - click_id_time
      if (timer < 30 * 24 * 60 * 60 * 1000) return true
      // if (timer < (30 * 60 * 1000)) return true
      return false
    },
    //#region ext & setting
    /**
     * 获取ext.json(sync)
     */
    getExtSync() {
      if (config.is_open3rd) {
        if (wx.getExtConfigSync) {
          let res = wx.getExtConfigSync()
          this.globalData.ext = res
          return res
        } else {
          // 此处调用checkAuth无效
          console.log('版本不支持getExtConfigSync')
        }
      }
    },
    /**
     * 获取基础 页面的配置
     */
    getSetting(params) {
      const fn = params => {
        wxp
          .request({
            url: this.globalData.urls.get_setting,
            presetRequest: ['wa_code', 'bcode', 'btype'],
            catchResponse: false
          })
          .then(res => {
            let result = res.data
            if (!result.error_code) {
              this.globalData.setting = result.entry
              this.setTabBar()
              this.checkApply(params)
            } else {
              this.checkAuth({
                ...params,
                type: 'setting',
                msg: result.error
              })
            }
          })
          .catch(err => {
            this.checkAuth({
              ...params,
              type: 'setting',
              msg: '获取配置失败'
            })
          })
      }
      return utils.wxPromise(fn)(params)
    },
    /**
     * 设置顶部导航
     */
    setBasic() {
      if (!this.globalData.setting) return
      let basic_setting = this.globalData.setting.basic_setting
      if (utils.getCurrentPage().route == 'pages/helphand/helphand') {
        return
      }
      if (basic_setting) {
        wx.setNavigationBarTitle({
          title: basic_setting.app_name
        })
        let backgroundColor = basic_setting.app_bg_color || '#ffffff'
        let frontColor = basic_setting.app_ft_color || '#000000'
        wx.setNavigationBarColor({
          backgroundColor: backgroundColor,
          frontColor: frontColor
        })
      }
    },

    /**
     * 设置tabBar
     */
    setTabBar() {
      if (!this.globalData.setting) return
      wxp.request({
        url: this.globalData.urls.floatImService,
        presetRequest: ['wa_code'],
        data: {
          hid: this.globalData.setting.basic_setting.hid,
          city_en: this.globalData.setting.basic_setting.city_en
        },
        success: res => {
          let result = res.data
          if (!result.error_code) {
            this.globalData.info.floatImData = result.entry
          }
        }
      })
    },
    //#endregion

    //#region city
    /**
     * 定位授权成功获取城市信息
     */
    getCity(params) {
      const fn = params => {
        let opts = {}
        wxp
          .getLocation({
            type: 'gcj02'
          })
          .then(locRes => {
            Object.assign(opts, locRes)
          })
          .catch(noop)
          .finally(() => {
            // 请求接口
            this.getCityInfo(opts)
              .then(res => {
                this.checkApply(params)
              })
              .catch(err => {
                this.checkAuth({
                  ...params,
                  type: 'city',
                  msg: '获取城市失败'
                })
              })
          })
      }
      return utils.wxPromise(fn)(params)
    },
    /**
     *  根据定位获取的坐标返回坐标的城市信息
     *  解决定位城市不在后台配置城市列表中问题
     */
    getCityInfo(options) {
      const fn = options => {
        let data = {}
        if (options.latitude) {
          data.location_x = options.latitude
          data.location_y = options.longitude
        }
        wxp
          .request({
            url: this.globalData.urls.get_city,
            presetRequest: ['wa_code'],
            catchResponse: false,
            data: data
          })
          .then(res => {
            if (res.data.error_code) {
              options.fail(res.data)
            } else {
              this.globalData.city = res.data.entry
              options.success(res.data)
            }
          })
          .catch(options.fail)
          .finally(options.complete)
      }
      return utils.wxPromise(fn)(options)
    },
    //#endregion

    //#region weixin_token
    /**
     * 微信登录换取weixin_token
     * 授权的总入口
     */
    weixinLogin(params) {
      if (this.globalData.user.weixin_code) {
        const fn = params => {
          // 检测是否过期
          wxp
            .checkSession()
            .then(() => {
              // 未过期，weixin_code和weixin_token是有效的
              if (this.globalData.user.weixin_token) {
                // 验证服务端有效期
                if (params.checkWeixinToken) {
                  this.checkWeixinToken({
                    // 不自动清除
                    clear: false
                  })
                    .then(params.success)
                    .catch(() => {
                      this.globalData.user.weixin_code = ''
                      this.weixinLogin(
                        utils.replaceWithNoop(params, 'complete')
                      ).catch(noop)
                    })
                } else {
                  params.success()
                }
              } else {
                // 有code无token
                this.getWeixinToken(utils.replaceWithNoop(params, 'complete')).catch(
                  noop
                )
              }
            })
            .catch(() => {
              // 过期，重新调用login
              this.globalData.user.weixin_code = ''
              this.weixinLogin(utils.replaceWithNoop(params, 'complete')).catch(noop)
            })
            .finally(params.complete)
        }
        return utils.wxPromise(fn)(params)
      } else {
        const fn = params => {
          wxp
            .login()
            .then(res => {
              if (res.code) {
                // 1、得到微信code
                this.globalData.user.weixin_code = res.code
                // 2、code换取token 内部执行回调
                this.getWeixinToken(utils.replaceWithNoop(params, 'complete')).catch(
                  noop
                )
              } else {
                params.fail(res)
              }
            })
            .catch(params.fail)
            .finally(params.complete)
        }
        return utils.wxPromise(fn)(params)
      }
    },
    /**
     * weixin_token是否过期
     * 错误静默处理
     */
    checkWeixinToken(options) {
      const fn = options => {
        options = {
          clear: true,
          ...options
        }
        wxp
          .request({
            url: this.globalData.urls.check_weixin_token,
            type: 'GET',
            catchResponse: false
          })
          .then(res => {
            if (res.data.error_code) {
              options.clear && this.clearWeixin('token')
              options.fail(res.data)
            } else {
              options.success(res.data)
            }
          })
          .catch(options.fail)
          .finally(options.complete)
      }
      return utils.wxPromise(fn)(options)
    },
    /**
     * 换取token
     */
    getWeixinToken(params) {
      const fn = params => {
        wxp
          .request({
            url: this.globalData.urls.get_weixin_token,
            presetRequest: ['wa_code'],
            catchResponse: false,
            data: {
              js_code: this.globalData.user.weixin_code
            }
          })
          .then(res => {
            if (res.data.error) {
              this.clearWeixin('token')
              params.fail(res.data)
            } else {
              const entry = res.data.entry
              this.globalData.user.weixin_token =
                entry.weixin_token || entry.access_token
              this.globalData.user.open_id = entry.open_id
              // 成功获取 | success | then
              params.success(res.data)
              wx.setStorageSync('is_entry', res.data.entry.xiaob_entry.is_entry)
              if (res.data.entry.xiaob_entry.is_entry == 'on') {
                wx.setStorageSync('isShowBusCard', true)
                wx.setStorageSync('zid', res.data.entry.xiaob_entry.guwen_id)
              } else {
                wx.setStorageSync('isShowBusCard', false)
              }
              //1首次进入的是普通  2首次进入的名片
              wx.setStorageSync('first_type', res.data.entry.first_type)
            }
          })
          .catch(params.fail)
          .finally(params.complete)
      }
      return utils.wxPromise(fn)(params)
    },
    //#endregion

    //#region weixinTokenMain
    /**
     * 获取token结果
     * 强制校验token服务端有效期
     */
    weixinTokenMain(params) {
      const fn = params => {
        this.weixinLogin({
          checkWeixinToken: true
        })
          .then(res => {
            this.checkApply(params)
          })
          .catch(err => {
            this.checkAuth({
              ...params,
              msg: '微信登录失败',
              type: 'weixin_token'
            })
          })
      }
      return wxPromise(fn)(params)
    },
    //#endregion

    //#region weixinUser
    /**
     * 获取微信用户信息(依赖wx.login)
     */
    weixinUserMain(params) {
      const fn = params => {
        this.weixinLogin()
          .then(res => {
            // 微信接口 授权过一次不用再弹窗
            wxp
              .getUserInfo({
                withCredentials: true
              })
              .then(res => {
                this.getWeixinUser({
                  detail: res
                })
                  .then(() => {
                    this.checkApply(params)
                  })
                  .catch(() => {
                    this.checkAuth({
                      ...params,
                      msg: '个人信息授权',
                      type: 'weixin'
                    })
                  })
              })
              .catch(err => {
                this.checkAuth({
                  ...params,
                  msg: '个人信息授权',
                  type: 'weixin'
                })
              })
          })
          .catch(err => {
            this.checkAuth({
              ...params,
              msg: '微信登录失败',
              type: 'weixin_token'
            })
          })
      }
      return utils.wxPromise(fn)(params)
    },
    /**
     * 解密、存储微信用户信息
     */
    getWeixinUser(options) {
      const fn = options => {
        let detail = options.detail
        if (detail.errMsg === 'getUserInfo:ok') {
          // this.globalData.user.weixin = detail;
          //保存/更新小程序用户授权信息
          wxp
            .request({
              url: this.globalData.urls.save_weixin_user,
              presetRequest: ['wa_code', 'btype', 'bcode', 'scene'],
              catchResponse: false,
              data: {
                encrypted_data: detail.encryptedData,
                raw_data: detail.rawData,
                signature: detail.signature,
                iv: detail.iv
              },
              method: 'POST'
            })
            .then(res => {
              if (!res.data.error_code) {
                console.log('info', '保存用户信息成功')
                // 保存到本地
                this.globalData.user.weixin = detail
                if (IM.IMplugin.isLogin()) {
                  const { nickName = '', avatarUrl = '' } =
                    detail.userInfo || {}
                  IM.IMplugin.setUserInfo(nickName, avatarUrl)
                }
                options.success(res.data)
                this.globalData.user.weixin.uid = res.data.entry.uid
                //xiaob_entry=='on'为小B模式
                console.log(
                  res.data.entry.xiaob_entry.is_entry +
                    'res.data.entry.xiaob_entry.is_entry'
                )
                wx.setStorageSync(
                  'is_entry',
                  res.data.entry.xiaob_entry.is_entry
                )
                if (res.data.entry.xiaob_entry.is_entry == 'on') {
                  wx.setStorageSync('isShowBusCard', true)
                  wx.setStorageSync('zid', res.data.entry.xiaob_entry.guwen_id)
                } else {
                  wx.setStorageSync('isShowBusCard', false)
                }
                //1首次进入的是普通  2首次进入的名片
                wx.setStorageSync('first_type', res.data.entry.first_type)
              } else {
                console.log('warn', res)
                options.fail(res.data)
              }
            })
            .catch(() => {
              options.fail && options.fail()
            })
            .finally(() => {
              options.complete && options.complete()
            })
          // options.success();
        } else {
          options.fail()
          options.complete()
        }
        // options.complete();
      }
      return utils.wxPromise(fn)(options)
    },
    //#endregion

    //#region weixinPhone
    /**
     * 获取微信手机信息(依赖wx.login)
     */
    weixinPhoneMain(params) {
      // 电话必须主动触发
      const fn = params => {
        this.weixinLogin()
          .then(res => {
            this.checkAuth({
              ...params,
              msg: '手机号码授权',
              type: 'phone'
            })
          })
          .catch(err => {
            this.checkAuth({
              ...params,
              msg: '微信登录失败',
              type: 'weixin_token'
            })
          })
      }
      return utils.wxPromise(fn)(params)
    },

    getWeixinPhone(options) {
      const fn = options => {
        let detail = options.detail
        if (detail.errMsg === 'getPhoneNumber:ok') {
          // 解密
          wxp.request({
            url: this.globalData.urls.get_weixin_phone,
            method: 'POST',
            presetRequest: ['wa_code', 'bcode', 'btype'],
            catchResponse: false,
            data: {
              encrypted_data: detail.encryptedData,
              iv: detail.iv
            }
          })
            .then(res => {
              if (res.data.error_code) {
                options.fail(res.data)
              } else {
                this.globalData.user.phone = res.data.entry
                // 没有个人中心的项目建立uid关联
                if (config.bind_uid_mobile) {
                  wxp.request({
                    url: this.globalData.urls.bind_uid_mobile,
                    presetRequest: ['bcode', 'btype'],
                    catchResponse: false,
                    data: {
                      uid: this.globalData.user.weixin.uid,
                      mobile: this.globalData.user.phone.phoneNumber
                    }
                  })
                }
                options.success(res.data)
              }
            })
            .catch(options.fail)
            .finally(options.complete)
        } else {
          options.fail(detail)
          options.complete()
        }
      }
      return utils.wxPromise(fn)(options)
    },
    //#endregion

    //#region clear
    /**
     * 清除微信login
     */
    clearWeixin(scope = ['token', 'weixin', 'phone']) {
      if (typeof scope === 'string') scope = [scope]
      if (scope.indexOf('token') !== -1) {
        this.globalData.user.weixin_token = ''
        this.globalData.user.weixin_code = ''
      }
      if (scope.indexOf('weixin') !== -1) {
        this.globalData.user.weixin = null
      }
      if (scope.indexOf('phone') !== -1) {
        this.globalData.user.phone = null
      }
      return true
    },
    /**
     * 清除个人中心登录态
     */
    clearUcenter() {
      this.globalData.user.ucenter_token = ''
      this.globalData.user.ucenter = null
      return true
    },
    //#endregion

    //#region ucenter
    /**
     * 乐居会员中心登录
     * 建议根据业务重写
     */
    ucenterLogin() {
      var that = utils.getCurrentPage()
      if (that) {
        that.setData({
          isShowLoginModel: true
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '没有统一的登录方法，请联系开发',
          success: res => {}
        })
      }
    },
    /*
     *登录超时处理
     */
    ucenterTimeout(params) {
      wx.showModal({
        content: '登录信息超时！',
        success: res => {
          this.clearUcenter()
          this.ucenterLogin(params)
        }
      })
    },
    //#endregion

    //#region check
    check(params) {
      params = Object.assign(
        {
          url: utils.getCurrentHref(),
          mode: 'redirect',
          refresh: 'redirect',
          once: false
        },
        params
      )
      let promise = null,
        status = true
      // 获取ext.json
      // ext.json在onLaunch已经同步处理，直接返回结果无需异步操作
      // 必选条件
      if (params.type === 'ext' && !this.globalData.ext) {
        promise = utils.wxPromise(params => {
          this.checkAuth({
            ...params,
            type: 'ext',
            msg: '微信版本太低，请升级微信'
          })
        })(params)
        status = false
      }
      // 基础配置
      // 必选条件
      else if (params.type === 'setting' && !this.globalData.setting) {
        promise = this.getSetting(params)
        status = false
      }
      // 定位(与wx.login无关)
      else if (params.type === 'city' && !this.globalData.city) {
        promise = this.getCity(params)
        status = false
      }
      // 获取open_id、weixin_token(强制验证服务端有效期)
      else if (params.type === 'weixin_token') {
        promise = this.weixinTokenMain(params)
        status = false
      }
      // 微信用户信息授权(依赖wx.login)
      else if (
        params.type === 'weixin' &&
        (!this.globalData.user.weixin_token || !this.globalData.user.weixin)
      ) {
        promise = this.weixinUserMain(params)
        status = false
        // 微信电话授权(依赖wx.login)
      } else if (
        params.type === 'phone' &&
        (!this.globalData.user.weixin_token || !this.globalData.user.phone)
      ) {
        promise = this.weixinPhoneMain(params)
        status = false
      }
      // 登录乐居用户中心
      else if (
        params.type === 'ucenter' &&
        !this.globalData.user.ucenter_token
      ) {
        promise = this.ucenterLogin(params)
        status = false
      }
      // 直接通过验证
      else if (!promise) {
        promise = utils.wxPromise(params => {
          params.success(params.type)
          params.complete()
        })(params)
      }
      return {
        status: status,
        data: {
          onceUsed: this.getAuthOnce(params.url, params.type)
        },
        promise: promise
      }
    },
    // 检测通过
    checkApply(params) {
      if (params.refresh === 'redirect') {
        utils.redirectTo({
          url: params.url
        })
      }
      params.success && params.success(params.type)
      params.complete && params.complete()
    },
    // 授权处理
    checkAuth(params) {
      let msg = params.msg || '',
        url = params.url || '',
        type = params.type,
        once = params.once,
        onceUsed = this.getAuthOnce(url, type)
      if (params.mode === 'redirect') {
        if (
          (type === 'weixin' || type === 'phone') &&
          once &&
          this.getAuthOnce(url, type)
        ) {
          console.log('info', '限制1次授权', url, type)
        } else {
          if (this.globalData.info.messageLock) {
            console.log('warn', 'messageLock', params)
          }
          this.globalData.info.messageLock = true
          utils.redirectTo({
            // url: `/pages/utils/userauth?msg=${msg}&url=${encodeURIComponent(url)}&type=${type}&once=${once ? 1 : 0}`
            url: `/pages/utils/message?msg=${msg}&url=${encodeURIComponent(
              url
            )}&type=${type}`
          })
        }
      } else if (params.mode === 'modal') {
        wxp
          .showModal({
            content: msg,
            confirmText: '重试',
            showCancel: false
          })
          .then(res => {
            if (res.confirm) {
              utils.redirectTo({
                url
              })
            }
          })
      } else if (params.mode === 'none') {
        console.log('info', 'app checkAuth:', {
          msg,
          type,
          url,
          once,
          onceUsed
        })
      }
      params.fail &&
        params.fail({
          msg,
          type,
          url,
          once,
          onceUsed
        })
      params.complete && params.complete()
    },

    setAuthOnce(url, type) {
      url = url.split('?')[0]
      this.globalData.info.authOnce.add(url + ':' + type)
    },

    getAuthOnce(url, type) {
      url = url.split('?')[0]
      if (type === 'weixin' || type === 'phone') {
        return this.globalData.info.authOnce.has(url + ':' + type)
      }
      return false
    },

    deleteAuthOnce(url, type) {
      url = url.split('?')[0]
      this.globalData.info.authOnce.delete(url + ':' + type)
    }
    //#endregion
  },

  // 页面钩子
  page: {
    hooks: {
      onLoad: [
        function sendMsgChance(options) {
          app = app || getApp()

          // 装饰后续所有生命周期和方法，记录formId
          Object.entries(this).forEach(([key, val]) => {
            if (typeof val === 'function' && key !== 'sendMsgChance') {
              this[key] = function (...opts) {
                sendMsgChance.apply(this, opts)
                return val.apply(this, opts)
              }
            }
          })
          // onLoad自行调用一次
          this.sendMsgChance(options)
          return options
        },
        function processOptions(options) {
          Object.keys(options).forEach(key => {
            if (options[key] === 'undefined') {
              delete options[key]
            }
          })
          return options
        },
        function processConfig(options) {
          this.config = this.config || {}
          this.config = {
            ext: true,
            setting: true,
            ...{
              ext: config.enable_ext,
              setting: config.enable_setting
            },
            // 兼容旧项目
            ...config.pages_check['/' + this.route],
            // 新项目使用下面这个
            ...this.config
          }
          return options
        },
        function processExt(options) {
          if (!this.config.ext) return options
          let result = app.check({
            type: 'ext'
          })
          if (!result.status) {
            return result.promise.then(() => options)
          }
          return options
        },
        function processSetting(options) {
          if (!this.config.setting) return options
          let result = app.check({
            type: 'setting',
            mode: 'modal',
            refresh: 'none'
          })
          // 同步验证通过
          if (!result.status) {
            return result.promise.then(() => options)
          }
          return options
        },
        function processWXToken(options) {
          if (!this.config.weixin_token) return options
          let result = app.check({
            type: 'weixin_token',
            mode: 'modal',
            refresh: 'none'
          })
          if (!result.status) {
            return result.promise.then(() => options)
          }
          return options
        },
        function processWX(options) {
          if (!this.config.weixin) return options
          let conf = {
            ...this.config.weixin
          }
          let result = app.check({
            type: 'weixin',
            mode: 'redirect',
            refresh: 'none',
            once: conf.once
          })
          if (!result.status) {
            if (!conf.once) {
              return result.promise.then(() => options)
            }
            const fn = obj => {
              result.promise
                .then(res => {
                  obj.success(options)
                })
                .catch(err => {
                  if (err.once && err.onceUsed) {
                    obj.success(options)
                  }
                })
            }
            return utils.wxPromise(fn)()
          }
          return options
        },
        function processPhone(options) {
          if (!this.config.phone) return options
          let conf = {
            ...this.config.phone
          }
          let result = app.check({
            type: 'phone',
            mode: 'redirect',
            refresh: 'redirect',
            once: conf.once
          })
          if (!result.status) {
            if (!conf.once) {
              return result.promise.then(() => options)
            }
            const fn = obj => {
              result.promise
                .then(res => {
                  obj.success(options)
                })
                .catch(err => {
                  if (err.once && err.onceUsed) {
                    obj.success(options)
                  }
                })
            }
            return utils.wxPromise(fn)()
          }
          return options
        },
        function processCity(options) {
          if (!this.config.city) return options
          let result = app.check({
            type: 'city',
            mode: 'modal',
            refresh: 'none'
          })
          if (!result.status) {
            return result.promise.then(() => options)
          }
          return options
        },
        function processUcenter(options) {
          if (!this.config.ucenter) return options
          let result = app.check({
            type: 'ucenter',
            mode: 'redirect',
            refresh: 'redirect'
          })
          if (!result.status) {
            return result.promise.then(() => options)
          }
          return options
        }
      ],
      onReady: [
        function (opt) {
          if (config.auto_set_basic) app.setBasic()
          if (config.auto_set_tab_bar) app.setTabBar()
          return opt
        }
      ]
    },
    sendMsgChance,
    getAuthOnce(type) {
      return app.getAuthOnce('/' + this.route, type)
    },
    setAuthOnce(type) {
      app.setAuthOnce('/' + this.route, type)
    },
    deleteAuthOnce(type) {
      app.deleteAuthOnce('/' + this.route, type)
    },
    setDataExt(options, key = 'dataExt') {
      this.setData(options)
      this[key] = this[key] || {}
      for (let path in options) {
        let arr = path.split(/\.|\[/),
          k = arr[0]
        if (arr.length === 1) {
          this[key][k] = options[k]
        } else {
          let o = this.data[k]
          if (!this[key][k]) {
            this[key][k] = Array.isArray(o) ? [] : {}
          }
          Object.assign(this[key][k], o)
        }
      }
    },
    catchLifeCycleError(name, err) {
      console.error(`生命周期函数: ${name} 执行失败！`, err)
    }
  },

  component: {
    created: [
      function sendMsgChance(options) {
        app = app || getApp()

        // 装饰后续所有生命周期和方法，记录formId
        Object.entries(this).forEach(([key, val]) => {
          if (typeof val === 'function' && key !== 'sendMsgChance') {
            this[key] = function (...opts) {
              sendMsgChance.apply(this, opts)
              return val.apply(this, opts)
            }
          }
        })
        // created自行调用一次
        this.sendMsgChance(options)
        return options
      }
    ],
    sendMsgChance
  }
})
