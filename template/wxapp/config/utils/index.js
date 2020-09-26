/**
 * 跳转页面 合并switchTab *
 */
export function redirectTo(options) {
  const fn = options => {
      const app = getApp();
      if (!options.url) return options.fail();
      if (app.globalData.info.onUpdateReady) return options.fail();
      wx.redirectTo(options);
      // wx.switchTab onLoad
  }
  return wxPromise(fn)(options);
}

export function getCurrentHref() {
  return getHref(getCurrentPage())
}

export function getCurrentPage() {
  return getCurrentPages().slice(-1)[0]
}



export function wxPromise(fn) {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      let { success, fail } = obj;
      obj.success = function (res) {
        typeof success === 'function' && success(res)
        //成功
        resolve(res)
      }
      obj.fail = function (res) {
        typeof fail === 'function' && fail(res)
        //失败
        reject(res)
      }
      if (typeof obj.complete !== 'function') {
        obj.complete = function () { }
      }
      // 改变obj的success和fail
      // 在原函数内需要执行回调函数而触发Promise
      fn(obj)
    })
  }
}
