const formatDate = (date, fmt) => {
    if (null == date) return null;
    if (typeof date === 'number' || typeof date === 'string') {
        if (date.toString().length === 10) {
            date = date * 1000;
        }
        date = new Date(date);
    }
    var o = {
        "M+": date.getMonth() + 1,//month
        "d+": date.getDate(),
        "h+": date.getHours(),
        "m+": date.getMinutes(),//minutes
        "s+": date.getSeconds()
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function throttle(func, delay) {
    var to, that = this;
    return function (...args) {
        clearTimeout(to);
        to = setTimeout(function () {
            func.apply(that, args);
        }, delay);
    }
}

function compareVersion(v1, v2) {
    v1 = v1.split('.')
    v2 = v2.split('.')
    var len = Math.max(v1.length, v2.length)

    while (v1.length < len) {
        v1.push('0')
    }
    while (v2.length < len) {
        v2.push('0')
    }

    for (var i = 0; i < len; i++) {
        var num1 = parseInt(v1[i])
        var num2 = parseInt(v2[i])

        if (num1 > num2) {
            return 1
        } else if (num1 < num2) {
            return -1
        }
    }

    return 0
}

// 交换数组位置
function swapItems(arr, index1, index2) {
    arr[index1] = arr.splice(index2, 1, arr[index1])[0];
    return arr;
}

// 把obj的某属性替换为一个空函数 返回新对象
function replaceWithNoop(obj, fnName) {
    if (Array.isArray(fnName)) {
        for (let index = 0; index < fnName.length; index++) {
            const name = fnName[index];
            obj = replaceWithNoop(obj, name);
        }
        return obj;
    }
    return { ...obj, [fnName]: noop }
}
/**
 * @desc 函数防抖
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param immediate true 表立即执行，false 表非立即执行
 */
function debounce(func, wait = 1000, immediate = true) {
    let timeout;
    return function () {
        let context = this;
        let args = arguments;

        if (timeout) clearTimeout(timeout);
        if (immediate) {
            let callNow = !timeout;
            timeout = setTimeout(() => {
                timeout = null;
            }, wait)
            if (callNow) func.apply(context, args)
        }
        else {
            timeout = setTimeout(() => {
                func.apply(context, args)
            }, wait);
        }
    }
}
// 空函数
function noop() { }

// 事件
class Event {
    constructor() {
        this.events = new Map()
    }
    on(name, fn) {
        if (!this.events.has(name)) this.events.set(name, new Set())
        this.events.get(name).add(fn)
    }
    emit(name) {
        if (this.events.has(name)) {
        this.events.get(name).forEach(fn => {
            fn()
            if (fn.once) {
                this.off(name, fn)
            }
        })
        }
    }
    off(name, fn) {
        if (this.events.has(name)) {
        if (fn === void 0) {
            this.events.delete(name)
        } else {
            this.events.get(name).delete(fn)
        }
        }
    }
    once(name, fn) {
        if (!this.events.has(name)) this.events.set(name, new Set())
        fn.once = true
        this.events.get(name).add(fn)
    }
}
module.exports = {
    formatDate,
    throttle,
    compareVersion,
    swapItems,
    noop,
    replaceWithNoop,
    debounce,
    Event,
    eventBus: new Event()
}