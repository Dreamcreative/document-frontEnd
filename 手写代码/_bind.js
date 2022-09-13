// bind 函数会返回一个已经绑定了 this 的函数，无论 bind 函数调用多少次，只有第一次调用的 bind 有效
/**
 * 1. 返回一个已绑定this的函数
 * 2. bind 方法传入的参会会被当作默认参数，与bind方法返回的函数参数拼接起来
 * 3. bind 方法返回的函数被当作构造函数时，bind方法传入的第一个参数失效
 * 4. 一个函数多次使用bind方法时，那么返回的函数还是使用第一次bind
 * @param {*} context
 * @param  {...any} args1
 * @returns
 */

// 特点1. bind 方法返回一个绑定了 this 的函数，同时可以缓存参数
Function.prototype.myBindF = function (context, ...args) {
  if (typeof this !== 'function') throw new Error('not a function');
  const _this = this;
  return function () {
    return _this.apply(context ?? window, [...args, ...arguments]);
  };
};
// 特点2. 当一个绑定函数作为构造函数是，bind 提供的 this 被忽略，同时调用时的参数被提供给模拟函数
// 这版 由于我们直接将绑定函数的 prototype 直接赋值给了 F 函数，当我们修改 F.prototype 时，也会同时修改掉绑定函数的 prototype
Function.prototype.myBindN = function (context, ...args) {
  if (typeof this !== 'function') throw new Error('not a function');
  const _this = this;
  let F = function () {
    return this.apply(this instanceof F ? this : context ?? window, [...args, ...arguments]);
  };
  // 修改返回函数的 prototype 为绑定函数的 prototype,实例就可以继承绑定函数原型中的值
  F.prototype = this.prototype;
  return F;
};

// 最终版
Function.prototype.myBind = function (context, ...args) {
  if (typeof this !== 'function') throw new Error('not a function');
  const _this = this;
  // 我们用一个空函数 FNOP 来中转一下 prototype，防止 F 函数的 prototype 修改时，同时会修改掉绑定函数的 prototype
  let FNOP = function () {};
  let F = function () {
    return _this.apply(this instanceof F ? this : context ?? window, [...args, ...arguments]);
  };
  // 将 this (调用 bind 方法的函数)的原型属性赋值给 FNOP
  FNOP.prototype = _this.prototype;
  // 将需要返回的 F 函数的原型属性设置为 已改变了 原型属性的 FNOP
  // 使用 FNOP 函数来作为中转，来修改 F 函数的原型属性，防止当 F 函数修改时，同时修改了 this (调用 bind 方法的函数)的原型属性
  F.prototype = new FNOP();
  return F;
};

Function.prototype.myBind1 = function (context, ...args1) {
  if (typeof this !== 'function') throw new Error('not a function');
  const _this = this;
  return function F(...args2) {
    if (this instanceof F) {
      return new _this(...args1, ...args2);
    }
    return _this.apply(context || window, [...args1, ...args2]);
  };
};

Function.prototype.myBind2 = function (context, ...args1) {
  if (typeof this !== 'function') throw new Error('not a function');
  // 需要绑定的 this
  context = context ?? window;
  // 需要绑定的函数
  let fToBind = this;
  let fNOP = function () {};
  // 返回的函数
  let fBound = function () {
    /**
     * this instanceof fBound 判断 bind 返回的函数是否被当作构造函数使用
     * 如果被当作构造函数使用，则 bind 传入的 context 失效，使用当前函数的 this
     * 否则使用 bind 传入的 context
     */

    return fToBind.apply(this instanceof fBound ? this : context, [...args1, ...arguments]);
  };
  fNOP.prototype = this.prototype;
  fBound.prototype = new fNOP();
  return fBound;
};
