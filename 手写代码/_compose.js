/**
 * 1. compose 的参数是函数，返回的也是一个函数
 * 2. 除了第一个函数接收参数之外，其他函数的参数都是上一个函数执行后的结果
 * 3. compose 可以接收任意参数，所有的参数都是函数
 */
/**
 * 函数组合
 * @param  {...function} fns 
 * @returns 
 */
function _compose(...fns) {
  return function (args) {
    return fns.reduce((total, cur) => cur(total), args)
  }
}
const _compose1 = (...fns) => (args) => fns.reduce((total, cur) => cur(total), args)