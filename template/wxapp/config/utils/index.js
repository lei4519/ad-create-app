/**
 * 跳转页面 合并switchTab *
 */
export function redirectTo(options) {
  const fn = options => {
      if (!options.url) return options.fail();
      if (getApp().globalData.info.onUpdateReady) return options.fail();
      wx.redirectTo(options);
      // wx.switchTab onLoad
  }
  return wxPromise(fn)(options);
}

export function getHref(page) {
  if (!page) return '';
  var url = "/" + page.route + "?";
  for (var k in page.options) {
      var v = page.options[k];
      url = url + k + '=' + v + "&";
  }
  return url.slice(0, -1);
}

export function getCurrentHref() {
  return getHref(getCurrentPage())
}

export function getCurrentPage() {
  return getCurrentPages().slice(-1)[0]
}

// 把obj的某属性替换为一个空函数 返回新对象
export function replaceWithNoop(obj, fnName) {
  if (Array.isArray(fnName)) {
      for (let index = 0; index < fnName.length; index++) {
          const name = fnName[index];
          obj = replaceWithNoop(obj, name);
      }
      return obj;
  }
  return { ...obj, [fnName]: noop }
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
