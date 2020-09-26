import {
  wxp
} from 'enhance-wxapp'
import logger from './utils/wxLog'
import config from './app.config'
const app = getApp()

let loading = false
// 请求拦截器
wxp.request.interceptors.request.use(function (options) {
  options = Object.assign({
      showLoading: true, // 默认显示loading
      multiple: true, // 默认允许并行请求
      catchResponse: true, // 默认自动判断error_code
      presetRequest: [] // 预置参数列表
    },
    options
  )
  if (!options.multiple) {
    if (loading) {
      return Promise.reject({
        msg: '请求占用。'
      })
    }
    loading = true
  }
  if (options.method) {
    options.method = options.method.toUpperCase()
    options.header = {
      'content-type': 'application/x-www-form-urlencoded'
    }
  }
  options.data = options.data || {}
  const gData = app.globalData

  Object.keys(options.data).forEach(key => {
    if (options.data[key] === void 0) {
      options.data[key] = ''
    }
  })

  // 微信登录态
  if (config.request_weixin_token) {
    options.data.weixin_token = gData.user.weixin_token
  }
  // 乐居登录态
  if (config.request_ucenter_token) {
    options.data.ucenter_token = gData.user.ucenter_token
  }
  // 场景值
  if (
    config.request_scene ||
    options.presetRequest.indexOf('scene') !== -1
  ) {
    options.data.scene = gData.info.scene
  }
  // open_id
  if (options.presetRequest.indexOf('open_id') !== -1) {
    options.data.open_id = options.data.openid = gData.user.open_id
  }

  // 限于小程序平台
  if (config.is_open3rd) {
    // 账号唯一码
    if (options.presetRequest.indexOf('wa_code') !== -1) options.data.wa_code = gData.ext.app_info.wa_code
    // 业务唯一码
    if (options.presetRequest.indexOf('bcode') !== -1) options.data.bcode = gData.ext.app_info.bcode
    // 业务类型
    if (options.presetRequest.indexOf('btype') !== -1) options.data.btype = gData.ext.app_info.btype
  }

  // 请求开始
  options.showLoading && wx.showLoading({
    title: '加载中...',
    mask: true
  })
  console.log('request: ', options.data, options.url)
  logger.info('request:', options.data, options.url)

  return options
})

// 响应拦截器
wxp.request.interceptors.response.use(
  ({
    options,
    response: res
  }) => {
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
  ({
    options,
    response: res
  }) => {
    resetStatus(options)
    logger.info('response:fail' + err.errMsg)
    return Promise.reject(res)
  }
)
// complete
wxp.request.interceptors.response.use(
  (res) => {
    complete()
    return res
  },
  (res) => {
    complete()
    return Promise.reject(res)
  }
)

function complete() {
  //
}

function resetStatus(options) {
  if (!options.multiple) {
    loading = false
  }
  options.showLoading && wx.hideLoading()
}