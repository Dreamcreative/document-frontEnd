# EcamScript 新特性

## ES7

### Array.prototype.includes(value,index) 

#### value:查找的值，index:开始索引

查找一个值在不在数组中 返回 boolean

### \*\* 

#### 求幂运算符 等价于 Math.pow()

## ES8

### async/await

#### (generator 的语法糖)避免过多的请求出现回调地狱问题

声明方式：
1 async function foo (){} 2. const foo= async function (){} 3. let obj= { async foo(){} } 4. const foo=async ()=>{}

### 修饰器

#### 类修饰器、方法修饰器

### Object.getOwnPropertyDescriptors()

#### 返回目标对象

中所有自身属性的属性描述符，不能是继承来的属性

### String.prototype.padStart()/String.prototype..padEnd()

####   字符串填充

### Object.values()

####   返回对象中的键值；Object.keys()返回对象中的键名

### Object.entries() 

#### 将对象中可枚举属性的键名与键值按

照二维数组返回 ，遇到 Symbol 时，会自动忽略

## ES9

### 正则表达式的改进：

### Unicode 属性转义 \p{} 和\P{}

### Rest(剩余)/Spread(展开) 属性  

####  ES6 中的 ... 只能处理数组 ，而在 ES9 中新增可以处理对象

### 正则表达式新增命名捕获组

####

### Promise.prototype.finally()

#### 无论 Promise 的状态是 fullfilled 或者 rejected finally 中的代码都会执行

### 异步迭代

#### for-await-of for await( let item of something ){]

## ES10

### Array.prototype.flat(value )

####  :将多维数据扁平化处理、去除数组中的空项 ;

value 表示扁平的深度

### Object.fromEntries():

####   将特定格式的数组转化为对象，

Object.entries()将对象自身的可枚举属性转化为二维数组，而 Object.fromEntries()正好相反

### String 新增 trimStart()/trimEnd() 

#### 去除字符串前后空格

### Array.prototype.flatMap()

#### 首先使用映射函数映射每个元素，

然后将结果压缩成一个新数组，与 map() / flat(1)几乎相同

## ES11(2020)

### 可选链操作符   ?.

#### 之前 let nestedProp = obj && obj.name&&

obj.name.age 获取 age 属性时，需要判断 obj、
obj.name 为非 null 和非 undefined
现在 let nestedProp = obj?.name?.age 否则返回
undefined

### 空位合并操作符

#### 之前 设置默认值时， let c= a?a:b

let c = a||b，会将 0、""、false、undefined、
null 等都会判断
现在 使用 ?? 只会判断 null、undefined

### Promise.allSettled

#### Promise.all(promises)，传入一个 Promise 的数组，如

果其中一个 promise 为 reject，则整个 promises 就会终
止，并返回一个 reject 状态的 Promise 对象。
现在 Promise.allSettled(promises),传入的每个
promise 都会被返回，无论是成功还是失败返回例子：
[
{status:"rejected",reason:{}},
{status:"fulfilled", value:{}}.
....
]

### String.prototype.matchAll(regex)

#### 处理正则时，返回所有匹配到的内容，而不需要添加

g 关键字   ，返回一个迭代器，可 for of 遍历

### 动态引入(Dynamic import)

#### 可动态引入资源

let module = await import("/module/module.js")

### BigInt

#### 新增一个数据类型 BigInt ,可以计算超过安全范围

的数字，与传统的 Number 类型 不能混合计算

### globalThis

#### 新增全局 this  globalThis ,在不同的环境返回不同的值

work.js globalThis === self 
node.js globalThis === global
browser.js  globalThis === window
提案规定， Object.prototype 必须在全局对象的原型
链中
Object.prototype.isPrototypeOf(globalThis) === true
