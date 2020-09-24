export default ((service) => {
  let hosts = {
    xcx: 'https://xcx.leju.com',
    src: 'https://src.leju.com'
  };
  let isTest = false;
  if (service === 'development') {
    hosts.xcx = 'https://xcxbch.leju.com';
  }
  if (service === 'development') {
    isTest = true;
  }
  return {
    // im聊天的传值
    isTest: isTest,
    //获取初始化配置信息
    get_setting: hosts.xcx + '/api/setting/index',
    //定位|获取城市信息
    get_city: hosts.xcx + '/api/map/get_city_info',
    //换取weixin_token
    get_weixin_token: hosts.xcx + '/api/login/jscode2session',
    // 判断token是否过期
    check_weixin_token: hosts.xcx + "/api/login/check_login",
    //保存|更新小程序用户授权信息
    save_weixin_user: hosts.xcx + '/api/user/save_oauth_info',
    //手机号授权|解密
    // get_weixin_phone: hosts.xcx + '/api/reservations/getphonemumber',
    get_weixin_phone: hosts.xcx + '/api/login/wx_authorized_login',
    wx_authorized_login: hosts.xcx + '/api/login/wx_authorized_login',
    // 没有会员中心登录时|更新小程序用户手机号
    bind_uid_mobile: hosts.xcx + '/api/reservations/save_user_mobile',
    // 发送模板消息的机会
    send_msg_chance: hosts.xcx + '/api/weixin/send_msg_chance',
    //第三方接口地址
    third_api: hosts.xcx + '/api/third/api_forward',

    // vr页面获取置业顾问列表
    get_house_online_zygw: hosts.xcx + '/api/adviser/get_house_online_zygw',
    // vr页面校验小b是否有效
    laike_zygw_status: hosts.xcx + '/api/xiaob/laike_zygw_status',
    // 获取vr链接
    get_vr_info: hosts.xcx + '/api/house/get_vr_info',
    // index
    index: hosts.xcx + '/api/building/index_yh',
    // 详情
    detail: hosts.xcx + '/api/brand_house/house_detail_yh',
    // 职业顾问列表
    getAdviserList: hosts.xcx + '/api/adviser/get_house_adviser_list',
    // 更多详情
    moredetail: hosts.xcx + '/api/house/get_house_info',
    // 动态订阅
    mySubscribe: hosts.xcx + '/api/myhome/my_subscribe',

    //登录 获取图片验证码
    getImgCode: hosts.xcx + '/api/login/verifycode',
    //登录 获取短信验证码
    getMsmPwd: hosts.xcx + '/api/login/send_code',
    //会员中心登陆
    login: hosts.xcx + '/api/login/ucenter',
    // 相册
    getHousePics: hosts.xcx + '/api/house/get_house_pics',
    // 获取户型详情
    getHouseTypeDetail: hosts.xcx + '/api/house/get_house_type_detail',
    // 楼盘周边配置
    getAroundList: hosts.xcx + '/api/house/get_around_list',
    // 获取最新动态列表
    getNewsList: hosts.xcx + '/api/house/get_house_information',
    // 获取最新动态详情
    newsInfo: hosts.xcx + '/api/information/get_detail',
    //心愿券详情
    quanInfo: hosts.xcx + '/api/card/quan_info',
    //获取卡券适用楼盘
    cityChange: hosts.xcx + '/api/card/city_change',
    // 创建订单接口
    createOrder: hosts.xcx + "/api/card/create_order",
    // 获取小程序支付参数
    getPayData: hosts.xcx + "/api/card/get_pay_data",
    // 支付用户信息收集
    userInfoCollect: hosts.xcx + "/api/card/user_info_collect",
    // 订单信息
    orderInfo: hosts.xcx + "/api/card/order_info",
    // 退款
    applyRefund: hosts.xcx + "/api/myhome/apply_refund",
    // 取消订单
    cancleOrder: hosts.xcx + "/api/myhome/cancel_order",
    // 获取订单列表
    getOrderList: hosts.xcx + "/api/myhome/get_all_order_info",
    // 获取退款详情
    getRefundDetail: hosts.xcx + "/api/myhome/get_refund_detail",
    // 获取卡包列表
    getCardList: hosts.xcx + "/api/myhome/get_all_info",
    // 获取已购买心愿券信息
    getQuanDetail: hosts.xcx + "/api/card/quan_detail",
    // 获取我的订阅
    getMySubscribeList: hosts.xcx + '/api/myhome/look_at_subscription',
    // 取消订阅
    cancelnotice: hosts.xcx + '/api/myhome/cancelnotice',
    //预约看房
    loupan_yuyue: hosts.xcx + '/api/reservations/loupan_yuyue',
    // 用户中心摇号列表
    myShakeList: hosts.xcx + '/api/myhome/my_shake_list',
    // 用户中心在线选房列表
    myOnlineLot: hosts.xcx + '/api/myhome/my_online_lot',
    // 用户中心选车位列表
    myOnlinePark: hosts.xcx + '/api/myhome/my_online_park',
    // 个人中心页面
    myhome_index: hosts.xcx + '/api/myhome/index',
    // 个人中心 码上专车列表页
    my_route_scar: hosts.xcx + '/api/myhome/my_route_scar',
    //分享 生成图片
    getdetailshare_url: hosts.xcx + '/api/Generation_sharing/index',
    // 个人中心 线下活动列表页
    offline_act_list: hosts.xcx + '/api/myhome/offline_act_list',
    // 拨打电话/复制微信关联接口
    setCallRelation: hosts.xcx + '/api/adviser/set_call_relation',
    //线下活动 报名接口
    offline_act_apply: hosts.xcx + '/api/brand_house/offline_act_apply',
    // 发送模板消息的机会
    send_msg_chance: hosts.xcx + '/api/weixin/send_msg_chance',
    // 码上专车约车按钮点击发送模板消息
    send_code_car: hosts.xcx + '/api/send_message/send_code_car',
    // 记录小程序用户浏览小程序的最新时间（小程序需要用户召回时使用 -- 记录用户访问小程序的最新时间）
    update_user_browsing_time: hosts.xcx + '/api/send_message/update_user_browsing_time',
    // 获取户型点评
    get_house_type_comment: hosts.xcx + '/api/house/get_house_type_comment',
    // 获取户型所属楼盘
    get_house_type_info: hosts.xcx + '/api/brand_house/get_house_type_info',
    // 获取楼盘其他户型
    get_house_type_other_info: hosts.xcx + '/api/brand_house/get_house_type_other_info',
    // 查看单个楼盘是否订阅
    get_house_subscribe: hosts.xcx + '/api/myhome/get_house_subscribe',
    // 取消楼盘订阅
    cancelnotice_type: hosts.xcx + '/api/myhome/cancelnotice_type',

    //user_view_latest
    floatImService: hosts.xcx + "/api/house/get_house_im_service",
    //访问顾问，保存记录，返回访问列表
    guwen_view_list: hosts.xcx + "/api/xiaob/guwen_view_list",
    user_view_latest: hosts.xcx + "/api/xiaob/user_view_latest",
    // 来客置业顾问详情接口
    get_adviser_info: hosts.xcx + '/api/adviser/get_adviser_info',
    // get_adviser_info: hosts.laike + '/miniprogram/zygw/get_adviser_info',
    // 更新用户第一次看到页面状态
    change_first_type: hosts.xcx + '/api/xiaob/change_first_type',
    //检查这个置业顾问是否属于当前小程序楼盘
    check_zid: hosts.xcx + '/api/xiaob/check_zid',

    //v2.3 楼盘详情 新闻列表 分页 v2.3模板需求V2.3（商业内容分发）
    get_news: hosts.xcx + '/api/brand_house/get_news',


    // 红包活动接口
    getRedPackData: hosts.xcx + '/api/cash_coupon/get_activity_info',
    // 抢红包接口
    getRedpacket: hosts.xcx + '/api/cash_coupon/get_redpacket',
    // 红包剩余领取次数
    get_remain_times: hosts.xcx + '/api/cash_coupon/get_remain_times',
    // 围观数据
    lookUserList: hosts.xcx + '/api/theme_pavilion/look_user_list',

    // 我的推客列表
    getMyTwitterList: hosts.xcx + '/api/myhome/my_twitter',
    // 我的专属券订单列表
    getMyZSquanList: hosts.xcx + '/api/myhome/get_zsquan_order_info',
    // 我的专属券订单——取消订单
    zsCancelOrder: hosts.xcx + '/api/myhome/cancel_zsorder',
    // 我的礼品列表
    myGift: hosts.xcx + '/api/myhome/my_prize',
    // 查看礼品说明
    lookGiftDes: hosts.xcx + '/api/myhome/my_prize_info',
    // 唤起微信红包
    weChartRedpacket: hosts.xcx + '/api/cash_coupon/get_redpacket_gift',
    // 我的活动
    myAction: hosts.xcx + '/api/myhome/my_activity',

    // 发起活动页面信息
    get_help_info: hosts.xcx + '/api/help_hand/get_help_info',
    // 发起助力活动
    launch_activity: hosts.xcx + '/api/help_hand/launch_activity',
    // 助力人页面信息
    get_help_user_info: hosts.xcx + '/api/help_hand/get_help_user_info',
    // 帮TA助力
    do_help: hosts.xcx + '/api/help_hand/do_help',
    // 邀请用户列表
    get_invite_list: hosts.xcx + '/api/help_hand/get_invite_list',
    //我的车票
    my_house_ticket: hosts.xcx + '/api/myhome/my_house_ticket',
    // 看房车票跳转获取登录参数
    make_transfertoken: hosts.xcx + '/api/login/make_transfertoken',
    // html转图服务
    invoke_html_to_image: hosts.src + '/api/resource/htmlToImage',
    // 分享 微信分享图
    getShareImageUrl: hosts.xcx + '/api/Generation_sharing/zygw_share',
    //置业顾问分享 生成图片
    getZygwSharUrl: hosts.xcx + '/api/Generation_sharing/zygw_share',
    // 按钮点击埋点
    reportData: hosts.xcx + '/api/analysis/report_data',
    // 城市维度pv、uv数据
    city_add_pv_data: hosts.xcx + '/api/cloud_shop/add_pv_data',
  };
});