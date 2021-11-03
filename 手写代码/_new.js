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
  // 创建一个空对象
  let obj = {};
  // 获取构造函数
  let construct = [].shift.call(arguments);
  // 将对象的原型链指向构造函数的原型属性
  obj.__proto__ = construct.prototype;
  // 修改构造函数的this指向
  let result = construct.apply(obj, arguments);
  // 构造函数返回的是一个对象 ，返回
  // 否则返回对象
  return typeof result === 'object' ? result : obj;

}