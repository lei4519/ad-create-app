import { interceptors } from 'enhance-wxapp'
import logger from './wxLog'

const app = getApp()

let loading = false
// 请求拦截器
interceptors.request.use(function (options) {
    options.data = options.data || {};

  // 第三方平台代理
  if (this.config.is_open3rd) {
    const { third_api } = app.globalData.urls;
    const { weixin_token } = app.globalData.user;
    const { wa_code, btype } = app.globalData.ext.app_info;
    options.url = `${third_api}?weixin_token=${weixin_token}&bcode=${wa_code}&btype=${btype}&wa_code=${wa_code}`;
    options.method = options.method || 'POST';
    options.data.params = JSON.stringify(options.params);
    options.data.api_url = options.api_url;
    // 账号唯一码
    if (options.presetRequest.indexOf('wa_code') !== -1)
      options.data.wa_code = gData.ext.app_info.wa_code
    // 业务唯一码
    if (options.presetRequest.indexOf('bcode') !== -1)
      options.data.bcode = gData.ext.app_info.bcode
    // 业务类型
    if (options.presetRequest.indexOf('btype') !== -1)
      options.data.btype = gData.ext.app_info.btype
  }
  options = Object.assign(
    {
      showLoading: true, // 默认显示loading
      multiple: true, // 默认允许并行请求
      catchResponse: true, // 默认自动判断error_code
      presetRequest: [] // 预置参数列表
    },
    options
  )
  if (!options.multiple) {
    if (loading) {
      return Promise.reject({ msg: '请求占用。' })
    }
    loading = true
  }
  if (options.method) {
    options.method = options.method.toUpperCase()
    options.header = {
      'content-type': 'application/x-www-form-urlencoded'
    }
  }
  // 接口接受的用户标识名
  options.data = options.data || {}

  Object.keys(options.data).forEach(key => {
    if (options.data[key] === void 0) {
      options.data[key] = ''
    }
  })

  const gData = app.globalData
  this.config = this.config || {}
  // 微信登录态
  if (this.config.request_weixin_token) {
    options.data.weixin_token = gData.user.weixin_token
  }
  // 乐居登录态
  if (this.config.request_ucenter_token) {
    options.data.ucenter_token = gData.user.ucenter_token
  }
  // 场景值
  if (
    this.config.request_scene ||
    options.presetRequest.indexOf('scene') !== -1
  ) {
    options.data.scene = gData.info.scene
  }
  // open_id
  if (options.presetRequest.indexOf('open_id') !== -1) {
    options.data.open_id = options.data.openid = gData.user.open_id
  }

  // 请求开始
  options.showLoading && wx.showLoading({ title: '加载中...', mask: true })
  console.log('request: ', options.data, options.url)
  logger.info('request:', options.data, options.url)

  return options
})

// 响应拦截器
interceptors.response.use(
  ({options, response: res}) => {
    resetStatus(options)
    // 请求成功
    console.log('response: ', res.data)
    logger.info('response:', res.data)
    if (options.catchResponse) {
      let result = res.data
      if (result.error_code) {
        wx.showModal({
          content: result.error,
          showCancel: false
        })
      }
    }
    return res
  },
  ({options, response: res}) => {
    resetStatus(options)
    logger.info('response:fail' + err.errMsg)
    return Promise.reject(res)
  }
)

function resetStatus(options) {
  if (!options.multiple) {
    loading = false
  }
  options.showLoading && wx.hideLoading()
}