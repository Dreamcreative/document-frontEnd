// https://leetcode-cn.com/problems/remove-duplicates-from-sorted-array-ii/solution/shan-chu-pai-xu-shu-zu-zhong-de-zhong-fu-yec2/

/**
 * @param {number[]} nums
 * @return {number}
 */
var removeDuplicates = function(nums) {
  /**
    方法一：
    采用 hash 存储 nums[i] 出现的次数，
    当 nums[i] 出现次数大于2次，将nums[i]与nums[len-1]进行替换
    最后进行排序
   */
  // hash 存储nums[i]出现的次数
  const map = new Map();
  // 数组长度
  let len = nums.length;
  for(let i=0;i<len;){
    const item = nums[i]
    // 获取当前 元素出现的次数
    const val =map.get(item)??0
    if(val >1){
      // 先将当前元素值 设为 Infinity,再将 nums[i] 与nums[len-1] 进行交换
      nums[i]= Infinity;
      swap(nums, i, len-1);
      len--;
      continue;
    }
    // 设置hash 值
    map.set(item,val+1);
    i++;
  }
  nums.sort((a,b)=>a-b)
  return len;
};
function swap(nums,index1,index2){
    let temp = nums[index1];
    nums[index1]=nums[index2]
    nums[index2]=temp
}


var removeDuplicates2=function (nums) {
  /**
    方法二：快慢指针
    题目要求 有序数组，每个元素最多出现 两次
      所以，当 len 小于等于 2 时，直接返回
    快慢指针 slow fast 从 索引 2 开始，
    slow 表示当前已处理好的数组长度，
    fast 表示当前数组检查到的数组元素索引
    由于 nums 是已经排好序的 ，所以，相同的元素都在一起
    只需要比较 fast 索引位置的值，是否与 slow -2 索引的值 相等 ，
    如果相等，表示 slow 索引之前的两个元素是相等的，fast 右移
    如果不等，表示 slow 索引之前的元素出现次数超过 2 ，则将 fast 索引位置的值 赋值给 slow 索引，同时 slow 右移，fast 右移
   */
  let len = nums.length;
  if(len<=2)return len;
  let slow = 2;
  let fast =2;
  while(fast<len){
    if(nums[slow-2]!==nums[fast]){
      nums[slow]=nums[fast];
      slow++;
    }
    fast++
  }
  return slow;
}
