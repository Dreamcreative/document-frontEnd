// 数字转换为中文数字

let num = 112345111111;
function trans(num) {
  if (!num || isNaN(num)) return '零';
  num = parseInt(num, 10);
  // 0-9数字的中文
  var chinaNums1 = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  // 根据数字位数转换得到的 单位
  var chinaNums2 = ['', '十', '百', '千', '万', '十', '百', '千', '亿', '十', '百', '千', '万', '十', '百', '千', '亿'];
  // 将传入的数字转换为 字符数组
  const en = num.toString().split('');
  const len = en.length;
  // 返回的结果
  let result = '';
  for (var i = 0; i < len; i++) {
    // 从数字的地位到高位遍历
    const des_i = len - i - 1;
    // 得到每一位数字的 中文数字，单位
    //       中文数字                 单位            已转化完成的数字
    result = chinaNums1[en[des_i]] + chinaNums2[i] + result;
  }
  // 通过正则 去除转换后的中文数字 与正常写法不同的地方
  // 去除【零十】【零百】【零千】
  result = result.replace(/零(十|百|千)/g, '零').replace(/十零/g, '十');
  // 去除 【零+】
  result = result.replace(/零+/g, '零');
  // 将【零亿】换成【亿】【零万】换成【万】
  result = result.replace(/零亿/g, '亿').replace(/零万/g, '万');
  // 将【亿万】换成【亿】
  result = result.replace(/亿万/g, '亿');
  // 移除末尾的零
  result = result.replace(/零+$/, '');
  // 将【一十】换成【十】
  result = result.replace(/^一十/g, '十');

  return result;
}
