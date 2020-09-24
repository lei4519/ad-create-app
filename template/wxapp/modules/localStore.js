/**
 * 保存数据 取出后自动删除
 */
export function flash(key, value) {
  key = '_LEJU_FLASH_' + key
  if (value === undefined) {
    let v = wx.getStorageSync(key)
    wx.removeStorageSync(key)
    return v
  }
  wx.setStorageSync(key, value)
}

export function removeStorage(key, isFlash) {
  if (!isFlash) {
    key = '_LEJU_' + key
  } else {
    key = '_LEJU_FLASH_' + key
  }
  wx.removeStorageSync(key)
}

export function storage(key, value) {
  key = '_LEJU_' + key
  if (value === undefined) {
    let v = wx.getStorageSync(key)
    return v
  }
  wx.setStorageSync(key, value)
}

export function getStorage(key) {
  return storage(key)
}

export function setStorage(key, value) {
  return storage(key, value)
}
