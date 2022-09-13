// 偏函数
// 指定一个函数的一部分参数，然后产生一个更小元的函数
// 什么是元，元是只函数参数的个数，

/**
 *
 */
function _partial() {
  const fn = [].shift.call(arguments);
  let args = [...arguments];
  return function () {
    let newArgs = args.concat([...arguments]);
    return fn.apply(this, newArgs);
  };
}
