import {getCurrentHref} from './index'
import * as wxStore from './wxStore.js'

const c_v = wxStore.storage('version') || '1.0.0'
const c_model = wx.getSystemInfoSync().model
let app = getApp()

/**
 * 发送统计
 * @param {Object} data
 * uuid
 * guid
 * ename
 * c_source
 */
export function send(data) {
  data.uuid = createUUID(data.uuid)
  data.guid = createGUID(data.guid)
  wx.request({
    url: 'https://tongji.leju.com/e.gif',
    data: {
      c_bid: 32,
      nt: new Date().getTime(),
      ename: data.ename || '',
      u: getCurrentHref(),
      uuid: data.uuid,
      guid: data.guid,
      c_city_en: app.globalData.city
        ? app.globalData.city.city_en
        : app.globalData.info.defaultCity.city_en,
      c_source: data.c_source || '',
      c_v: c_v,
      c_model: c_model
    }
  })
}

export const ENAME = {}

export const C_SOURCE = {}

function createUUID(zid) {
  if (!zid) return ''
  return 'xb' + zid
}

function createGUID(zid) {
  if (zid) {
    return formatId(zid, 16)
  }
  let guid = wxStore.storage('TJ_guid')
  if (guid) {
    return guid
  }
  guid = 'fk' + uuid(14, 62)
  wxStore.storage('TJ_guid', guid)
  return guid
}

function formatId(zid, n) {
  zid = zid || ''
  zid = zid.toString()
  let id = ['xb', new Array(n - zid.length - 1).join('0'), zid]
  return id.join('')
}

function uuid(len, radix) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(
    ''
  )
  var uuid = [],
    i
  radix = radix || chars.length

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)]
  } else {
    // rfc4122, version 4 form
    var r

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16)
        uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r]
      }
    }
  }

  return uuid.join('')
}

/**
 * 发送formId统计
 * 此方法默认会自动触发(在触发任何page内方法或者component.methods时)
 * 并且会被自动注入到page和component.methods中(即可以调用this.sendMsgChance)
 */
export function sendMsgChance(e) {
  if (!e) return
  if (!e.detail) return
  if (!e.detail.formId) return
  wxp.request({
    url: app.globalData.urls.send_msg_chance,
    method: 'post',
    presetRequest: ['wa_code', 'open_id', 'bcode'],
    showLoading: false,
    catchResponse: false,
    data: {
      type: 0,
      form_id: e.detail.formId
    }
  })
}

/*
"添加事件方法为拼字符串发送到如下链接：http://tongji.leju.com/e.gif?
c_bid=&ename=&nt=&u=&uuid=&guid=（字符串以&连接）
说明：
c_bid必填（小程序项目固定为32）

nt（必填）毫秒
ename事件名：xcx_laike_index
u （必填）url
uuid 32位以内字符串（必填）（设备id）
guid 16位 字母数字（必填）（用户唯一id）（置业顾问id：xb开头，置业顾问结尾，中间用0补齐16位）
自定义参数——格式：
c_city_en:bj
c_source:点击版块名,如查看我的名片
c_v:版本号
c_model：设备型号"
*/
