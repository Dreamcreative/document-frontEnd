// 278. 第一个错误的版本
// https://leetcode.cn/problems/first-bad-version/

/**
 * Definition for isBadVersion()
 * 
 * @param {integer} version number
 * @return {boolean} whether the version is bad
 * isBadVersion = function(version) {
 *     ...
 * };
 */

/**
 * @param {function} isBadVersion()
 * @return {function}
 */
var solution = function (isBadVersion) {
  /**
   * @param {integer} n Total versions
   * @return {integer} The first bad version
   */
  return function (n) {
    // 二分法 取中间版本，判断 是否错误版本，
    // 错误版本 right 移动到 mid-1 ,result = mid
    // 正确版本 left 移动到 mid+1
    let left = 1;
    let right =n;
    let result =1;
    while(left<=right){
      const mid = ~~((left+right)/2);
      if(isBadVersion(mid)){
        right=mid-1;
        result=mid
      }else{
        left = mid+1
      }
    }
    return result;
  };
};
