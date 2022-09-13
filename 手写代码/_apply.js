/**
 * dosomething.apply(window,[a,b,c])
 * @param {*} context 调用apply的函数
 * @param {array} arg
 * @returns
 */
Function.prototype.myApply = function (context, arg) {
  if (typeof this !== 'function') throw new Error('not a function');
  context = context ?? window;
  context.fn = this;
  let result;
  if (arg) {
    result = context.fn(...arg);
  } else {
    result = context.fn();
  }
  delete context.fn;
  return result;
};
