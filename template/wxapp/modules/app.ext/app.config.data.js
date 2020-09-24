import urls from './app.config.urls'
let data = {
  // 基础配置-不要修改
  setting: null,
  // 用户信息-不要修改
  user: {
    // 临时登录凭证 5分钟过期 只能使用一次
    weixin_code: '',
    // 后台自定义登录态 关联用户唯一标识openid和会话密钥session_key
    weixin_token: '',
    // 微信小程序用户唯一标识
    open_id: '',
    // 乐居用户体系登录态
    ucenter_token: '',
    // 微信用户信息
    weixin: null,
    // 乐居用户信息
    ucenter: null,
    // 电话信息
    phone: null
  },
  // 定位|选择城市-不要修改
  city: null,
  // 业务数据
  info: {
    // 授权页标记（只作为记录用）
    messageLock: false,
    // 场景值
    scene: '',
    // 已准备好更新
    onUpdateReady: false,
    // 记录授权once参数
    authOnce: new Set(),
    // 新增其它数据...
    // defaultCity: { lat: "39.921849", lng: "116.396713", city_en: "bj", city_cn: "北京" },
    txMapKey: 'MTEBZ-K7H3F-LU6JQ-N3KQ3-C7UTS-NBBO5'
  },
  // ext.json自定义字段-不要修改
  ext: null,
  // 接口列表-app.config.urls.js
  urls: urls,
  pagesData: {
    //商业内容分发 模板需求V2.3
    mercial_source: ''
  }
}

export default data
