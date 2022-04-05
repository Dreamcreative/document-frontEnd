// https://leetcode-cn.com/problems/remove-duplicates-from-sorted-array/solution/shan-chu-pai-xu-shu-zu-zhong-de-zhong-fu-tudo/

/**
 * @param {number[]} nums
 * @return {number}
 */
var removeDuplicates = function(nums) {
  /**
   * 方法一：双指针
   */
  const len = nums.length;
  // 当前遍历索引
  let i=0;
  outer:for( ;i<len;i++){
    // 移动指针，当前比较的索引
    let R=i+1;
    // 如果当前遍历值 等于 最后一个值，表示已经遍历处理完成，结束遍历
    if(nums[i]===nums[len-1])break;
    while(R<len){
      if(nums[i]>=nums[R]){
        // 当 索引 i 大于等于 与索引 R时，移动指针 右移
        R++;
      }else{
        // 否则 i 索引的下一个索引值 改为 R 索引位置的值
        nums[i+1]=nums[R];
        // 同时，将 移动指针右移
        R++;
        // 跳出 while,开始遍历下一个索引值
        continue outer;
      }
    }
  }
  return i+1;


};
