// 冒泡排序
/**
 * 1. 一次对比数组的前后2个值，如果后面的值小于前面的值，将前后值进行位置替换
 * 2. 由于每一轮遍历完后，数组最后的位置都是大值，所以不需要再遍历
 *
 * 使用内外两层循环， 外层循环遍历所有值，内层循环只需遍历为完成排序的值
 *
 * @param {*} arr
 */
function bubbleSort(arr) {
  const len = arr.length;
  for (let outer = 0; outer < len; outer++) {
    for (let inner = 0; inner < len - outer - 1; inner++) {
      if (arr[inner + 1] < arr[inner]) {
        [arr[inner + 1], arr[inner]] = [arr[inner], arr[inner + 1]];
      }
    }
  }
}

let arr = [145, 300, 248, 31, 45, 9, 11, 145];
bubbleSort(arr);
