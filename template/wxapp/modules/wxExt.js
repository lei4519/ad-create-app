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
