/**
 * 数组完全扁平化
 * @param {array} arr 需要扁平化的数组
 * @returns {array}
 */
function _flatten(arr) {
  return arr.reduce((total, cur) => {
    return Array.isArray(cur) ? [...total, ...cur] : [...total, cur];
  }, []);
}
// 可以控制 平铺层级的 扁平化
/**
 *
 * @param {Array} arr 需要扁平的数组
 * @param {*} depth 扁平深度
 * @param {*} init 初始值
 */
function _flatten2(arr, depth = 1, init = []) {
  return arr.reduce((total, cur) => {
    if (Array.isArray(cur) && depth > 1) {
      return _flatten2(cur, depth - 1, total);
    }
    return total.concat(cur);
  }, init);
}
