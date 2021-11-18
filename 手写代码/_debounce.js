// 防抖函数
// 防止事件频繁触发，wait 时间内只执行一次

/**
 * 防抖函数
 * @param {function} func 需要防抖的函数
 * @param {number} wait 函数触发的时间间隔
 */

function _debounce1(func, wait) {
  let timer = null;
  return function () {
    if (timer) clearInterval(timer);
    timer = setTimeout(() => {
      func.apply(this, arguments)
    }, wait)
  }
}
/**
 * 防抖函数
 * @param {function} func 需要防抖的函数
 * @param {number} wait 函数触发的时间间隔
 * @param {boolean} immediate 函数是否立即触发
 */
function _debounce2(func, wait, immediate) {
  let timer = null;
  return function () {
    if (timer) clearTimeout(timer);
    if (immediate) {
      let callNow = !timer;
      timer = setTimeout(function () {
        timer = null;
      }, wait)
      if (callNow) return func.apply(this, arguments);
    } else {
      timer = setTimeout(() => {
        func.apply(this, arguments)
      }, wait)
    }
  }
}

// 最终版
function _debounce(func, wait, immediate) {
  var timer, result;

  return function () {
    var context = this;
    var args = arguments;

    if (timer) clearTimeout(timer);
    if (immediate) {
      // 如果已经执行过，不再执行
      var callNow = !timer;
      timer = setTimeout(function () {
        timer = null;
      }, wait)
      if (callNow) result = func.apply(context, args)
    }
    else {
      timer = setTimeout(function () {
        func.apply(context, args)
      }, wait);
    }
    return result;
  }
}
