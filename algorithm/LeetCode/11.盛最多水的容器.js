// https://leetcode-cn.com/problems/container-with-most-water/solution/sheng-zui-duo-shui-de-rong-qi-by-leetcode-solution/

// 给定一个长度为 n 的整数数组 height 。有 n 条垂线，第 i 条线的两个端点是 (i, 0) 和 (i, height[i]) 。
// 找出其中的两条线，使得它们与 x 轴共同构成的容器可以容纳最多的水。
// 返回容器可以储存的最大水量。

/**
 * @param {number[]} height
 * @return {number}
 */
// 双指针法
/**
 * 思路：
  盛水的最大面积是 ，height 数组中 左右两个值的最小值 min ,左值下标 到 右值下标的距离 
  Math.min(height[left], height[right])*(right-left)
  使用双指针的方式，从数组两边开始遍历，left、right, 遇到小值时，小值一侧的下标向中间移动，一直移动到 left、right 相等
 */
var maxArea = function(height) {
    let left =0;
    let right = height.length-1;
    let max =0;
    while(left !==right){
      max=Math.max(max, Math.min(height[left], height[right])* (right-left))
      if(height[left]<=height[right]){
        left++
      }else{
        right--;
      }
    }
    return max;
};
