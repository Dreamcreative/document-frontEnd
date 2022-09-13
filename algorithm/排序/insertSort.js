// 插入排序
/**
 * 1. 从第二个元素开始，遍历它之前的元素
 * 2. 如果它之前的元素大于它，那么交换，并继续向前遍历之前比它大的元素
 * 3. 交换之后，将保存的当前位置的值赋值给最后遍历到的索引位置
 * @param {*} arr
 */
function insertSort(arr) {
  const len = arr.length;
  for (let outer = 1; outer < len; outer++) {
    let inner = outer;
    let temp = arr[outer];
    while (inner > 0 && arr[inner - 1] > temp) {
      arr[inner] = arr[inner - 1];
      inner--;
    }
    arr[inner] = temp;
  }
  return arr;
}
let arr = [146, 248, 31, 45, 9, 11, 145, 300];
// [31, 146, 248, 45, 9, 11, 145, 300]
insertSort(arr);
