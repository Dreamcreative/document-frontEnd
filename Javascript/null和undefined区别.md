# null和undefined区别

## 相同点

  * 使用 Boolean 都为 false
  * 都是基础类型

## 不同点

  * undefined 不是保留字符，可以被修改；null 是 保留字符，不能被修改
  * `typeof null === 'object'`,`typeof undefined === 'undefined'`
  * 当定义一个变量不赋值时，默认为 undefined，而 赋值为 null 的变量，表示一个会返回一个对象
  * `undefined == null // true`,`undefined === null // false`
