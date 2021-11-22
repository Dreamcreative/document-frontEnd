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
      newObj[key] = obj[key]
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

