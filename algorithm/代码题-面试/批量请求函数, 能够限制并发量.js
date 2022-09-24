// 批量请求函数, 能够限制并发量
const urls = ['www.baidu.com/index1.js', 'www.baidu.com/index2.js', 'www.baidu.com/index3.js', 'www.baidu.com/index4.js', 'www.baidu.com/index5.js'];
// 模拟请求
function request(url) {
  return new Promise((resolve, reject) => {
    // console.log(url);
    // setTimeout(() => {
    //   resolve(url);
    // }, 1000);

    if (!url) {
      // 当url为空时，直接返回
      // 出现 空url 是因为 urls 请求完毕之后，还会执行一次 请求操作，来确定
      return;
    }
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      setTimeout(() => {
        resolve(xhr.responseText);
      }, 1000);
    };
    xhr.open('GET', url, true);
    xhr.send();
  });
}
/**
 *
 * @param {Array} urls 接口集合
 * @param {number} max 请求限制数
 *
 * 主要实现逻辑
 * 初次一次性请求 max 个数
 * 之后 当之前发送的请求成功或失败后，
 * 检查是否还有剩余的接口需要请求，还有剩余，则继续请求下一个
 * 当所有接口请求完毕之后，返回所有结果
 *
 */
function multiRequest(urls = [], max = 5) {
  // 总请求数量
  const len = urls.length;
  // 如果请求限制数 大于 总请求数，max=len
  // max = len >= max ? max : len;
  // 存放请求结果
  const result = new Array(len).fill(false);
  // 已发送请求数量
  let count = 0;
  return new Promise((resolve, reject) => {
    // 首次会发送限制数量的请求
    while (count < max) {
      next();
    }
    function next() {
      // 每次执行 next() count++ 得到 当前需要执行的 urls 索引
      let current = count++;
      if (count > len && !result.includes(false)) {
        // 如果 count> len 并且 !result.includes(false)===true 表示urls 已全部请求完毕 直接返回
        // 边界处理
        // 当前执行的 urls 索引 超出了 urls 长度 并且，结果都已存在，返回请求的结果集合
        resolve(result);
        return;
      }

      // 当前请求的 url
      const url = urls[current];
      request(url).then(
        res => {
          // 接口请求成功，缓存结果
          result[current] = res;
          // 成功请求一个接口后，如果还有剩余的接口需要请求，继续请求下一个接口
          // 例如 6个接口需要请求，但是现在同时执行5个请求，也就是说还剩余一个请求
          // 当 前5个请求一起发送之后，完成一个请求，会继续请求剩余的下一个接口，一直到 urls 请求完成
          console.log(current, len);
          if (current < len) {
            next();
          }
        },
        err => {
          // 接口请求失败，缓存结果
          result[current] = err;
          // 成功请求一个接口后，如果还有剩余的接口需要请求，继续请求下一个接口
          // 例如 6个接口需要请求，但是现在同时执行5个请求，也就是说还剩余一个请求
          // 当 前5个请求一起发送之后，完成一个请求，会继续请求剩余的下一个接口，一直到 urls 请求完成
          if (current < len) {
            next();
          }
        }
      );
    }
  });
}
multiRequest(urls, 2).then(res => console.log(res));
