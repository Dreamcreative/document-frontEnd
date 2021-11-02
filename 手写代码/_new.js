/**
 * new 做了什么
 * 1. 创建一个全新的对象
 * 2. 这个对象会被执行 [[prototype]] 也就是__proto__链接
 * 3. 生成的新对象会绑定到函数调用的 this 
 * 4. 通过 new 创建的每一个对象将最终被 [[prototype]] 链接到 函数的 prototype 对象上
 * 5. 如果对象的类型不是 object，那么 new 表达式中的函数调用会返回这个新对象
 * @returns 
 */

function myNew() {
  let obj = {};
  let construct = [].shift(arguments);
  obj.__proto__ = construct.prototype;
  let result = construct.apply(obj, arguments);
  return typeof result === 'object' ? result : obj;

}