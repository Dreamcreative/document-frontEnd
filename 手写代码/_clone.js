// 浅克隆
// 1
function shallowCopy(obj) {
  // 只拷贝对象
  if (typeof obj !== 'object') return;
  // 为null 时，直接返回 null
  if (obj == null) return null;
  let newObj = obj instanceof Array ? [] : {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
}
// 针对数组，利用数组的一些方法，会返回一个新数组的特性 ， slice 、concat,实现数组的浅拷贝
let arr = ['old', 1, true, null, undefined];
let arr1 = arr.slice();
let arr2 = arr.concat();

// 深拷贝
// 1 ，利用 JSON.parse、JSON.stringify 实现，
// 但是 JSON 方法会忽略 函数、undefined，Symbol 会返回 null

let arrCopy = JSON.parse(JSON.stringify(arr));

function deepCopy(obj) {
  if (typeof obj !== 'object') return;
  if (obj == null) return null;
  let newObj = obj instanceof Array ? [] : {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const item = obj[key];
      newObj[key] = typeof item === 'object' ? deepCopy(item) : item;
    }
  }
  return newObj;
}
// 更完整的 深克隆，处理了循环引用
/**
 *
 * @param {object} obj 要拷贝的对象
 * @param {Map} map 用于存储循环引用对象
 */
function _deepClone(obj = {}, map = new Map()) {
  // 如果是基本类型，直接返回
  if (typeof obj !== 'object') {
    return obj;
  }
  // 处理 null
  if (typeof obj === 'object' && obj == null) return obj;
  // 如果 obj 已存在，直接返回，处理循环嵌套
  if (map.has(obj)) {
    return map.get(obj);
  }
  let result = {};
  // 判断 拷贝的对象是否是数组，使用两个条件判断，是为了防止 原型链被修改
  if (Array.isArray(obj) || Object.toString.call(obj) === '[object Array]') {
    result = [];
  }
  map.set(obj, result);
  for (const key in obj) {
    // 只处理对象自身属性
    if (obj.hasOwnProperty(key)) {
      result[key] = _deepClone(obj[key], map);
    }
  }
  return result;
}
