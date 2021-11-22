/**
 * 数组完全扁平化
 * @param {array} arr 需要扁平化的数组
 * @returns {array}
 */
function _flatten(arr) {
  return arr.reduce((total, cur) => {
    return Array.isArray(cur) ? [...total, ...cur] : [...total, cur];
  }, [])
}