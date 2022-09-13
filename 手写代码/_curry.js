// 函数柯里化
// 柯里化是一种将使用多个参数的一个函数转换为一系列使用一个参数的函数
function _curry() {
  const fn = [].shift.call(arguments);
  let _args = [...arguments];
  return function temp() {
    if (arguments.length) {
      _args = [..._args, ...arguments];
      return temp;
    }
    return fn.apply(this, _args);
  };
}
function add(...args) {
  return args.reduce((a, b) => a + b, 0);
}
let result = _curry(add, 5, 1);
console.log(result(5)(1, 2, 3)());
