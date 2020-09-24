const {
  env: { service }
} = wx.getExtConfigSync()

let config = {
  // 是否小程序平台
  is_open3rd: true,
  // 环境为第三方平台时以ext.json里的配置为准，用于计算域名和api列表等
  env_service: service, //production/development

  // 建立uid与电话号码的关系（没有个人中心登录的项目，与产品和后端确认）
  bind_uid_mobile: false,

  // 授权本地存储过期时间(分钟) -1无限 0重启清除
  auth_expires: 60 * 24,

  // 每个页面自动验证ext.json
  enable_ext: true,

  // 每个页面自动获取|验证后台配置get_setting
  enable_setting: true,

  // 除非显示声明，onload将自动授权获取ext|setting
  pages_check: {
    '/pages/activity/activity': { weixin_token: true, ucenter: true },
    '/pages/package_my/card/card': { weixin_token: true, ucenter: true },
    '/pages/package_my/card/info': { weixin_token: true, ucenter: true },
    '/pages/index/index': { weixin_token: true },
    '/pages/adviser/businesscard': { weixin_token: true },
    '/pages/adviser/adviser': { weixin_token: true },
    '/pages/layout/detail': { weixin_token: true },
    '/pages/package_my/lottery/lottery': { weixin_token: true, ucenter: true },
    '/pages/my/my': { weixin_token: true, ucenter: true },
    '/pages/news/news_info': { weixin_token: true },
    '/pages/package_my/onlinelot/onlinelot': {
      weixin_token: true,
      ucenter: true
    },
    '/pages/order/order': { weixin_token: true, ucenter: true },
    '/pages/order/refund': { weixin_token: true, ucenter: true },
    '/pages/package_my/park/park': { weixin_token: true, ucenter: true },
    '/pages/quan/payInfo': { weixin_token: true, ucenter: true },
    '/pages/package_my/route/route': { weixin_token: true, ucenter: true },
    '/pages/subscribe/subscribe': { weixin_token: true, ucenter: true },
    '/pages/redpack/redpack': { weixin_token: true },
    '/pages/helphand/helphand': { weixin_token: true },
    '/pages/news/news_info': { weixin_token: true },
    '/pages/detail/detail': { weixin_token: true },
    '/pages/package_my/ticket/ticket': { weixin_token: true },
    '/pages/utils/feedback': { ext: false, setting: false },
    '/pages/utils/userauth': { ext: false, setting: false },
    '/pages/vr_room/package/room/room': { weixin_token: true },
    '/pages/vr_room/package/authorize/authorize': { weixin_token: true },
    // "/pages/utils/webview": { ext: false, setting: false },

    '/index/index': {
      // setting: false,
      // weixin和phone也会自动获取token 设置此项是为了强制验证服务端有效期
      // weixin_token: true,
      // 在用户允许一次授权后，将通过wx.getUserInfo获取，不再跳转到授权页
      // once：允许用户拒绝后不重试，默认false
      // weixin: { once: true },
      // 手机号码必须通过授权页点击获取,once：允许用户拒绝后不重试
      // phone: { once: true },
      // 获取城市定位，拒绝后后台接口返回默认城市
      // city: true,
      // ucenter:false
    }
  },

  // 自动在page.onLoad执行setBasic,bool 或 todo:Array<string>
  auto_set_basic: false,

  // 自动在page.onLoad执行setTabBar,bool 或 todo:Array<string>
  // 获取基础页面的配置(getSetting)之后会默认执行一次 setBasic则不会执行
  auto_set_tab_bar: false,

  // 自动携带weixin_token参数
  request_weixin_token: true,

  // 自动携带ucenter_token参数
  request_ucenter_token: true,

  // 自动携带scene参数
  request_scene: false
}

if (!config.is_open3rd) {
  config.enable_ext = false
}

export default config
