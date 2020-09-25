{{#if isOpen3rd}}
const {
  env: { service }
} = wx.getExtConfigSync()
{{/if}}

let config = {
  // 是否小程序平台
  is_open3rd: {{ isOpen3rd }},
  // 环境为第三方平台时以ext.json里的配置为准，用于计算域名和api列表等
  {{#if isOpen3rd}}
  env_service: service,
  {{else}}
  env_service: 'development', //production/development
  {{/if}}

  // 建立uid与电话号码的关系（没有个人中心登录的项目，与产品和后端确认）
  bind_uid_mobile: false,

  // 授权本地存储过期时间(分钟) -1无限 0重启清除
  auth_expires: 60 * 24,

  // 每个页面自动验证ext.json
  enable_ext: true,

  // 每个页面自动获取|验证后台配置get_setting
  enable_setting: true,

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
