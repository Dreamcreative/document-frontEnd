// 函数节流
// 持续触发函数，在 wait 时间内，不管触发多少次，只会触发一次函数
/**
 * 定时器方式
 * @param {function} func 节流函数
 * @param {number} wait 节流时间
 */
function _throttle(func, wait) {
  let timer = null;
  return function () {
    if (!timer) {
      timer = setTimeout(() => {
        func.apply(this, arguments);
        timer = null;
      }, wait);
    }
  };
}
