/**
 * dosomething.call(window,a,b,c)
 * @param {*} context 调用 call 的函数
 * @param  {...any} args 传入 call 的参数 可以是多个参数
 * @returns args 参数的调用结果
 */
Function.prototype.myCall = function (context, ...args) {
  if (typeof this !== 'function') throw new Error('not a function');
  context = context ?? window;
  context.fn = this;
  const result = context.fn(...args);
  delete context.fn;
  return result;
};
