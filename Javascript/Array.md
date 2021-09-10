# Array

## prototype

### concat

#### 合并数组，不会改变现有数组，返回一个新数组

#### 浅拷贝，

### copyWithin

#### 浅复制数组的一部分到同一数组中的另一个位置，并返回，不会改变原数组的长度

#### arr.copyWithin( target [, start [, end]])

##### target: 要将序列复制到的从零开始的索引。如果为负，则从末尾算起。target大于或等于arr.length，则不发生复制

##### start: 从零开始的索引，从改索引开始复制，如果为负，从数组末尾开始算起。默认为0

##### end: 从零开始的索引， 复制从 start<= ,<end 之间的元素

#### 例子

##### [1, 2, 3, 4, 5].copyWithin(-2)
// [1, 2, 3, 1, 2]

##### [1, 2, 3, 4, 5].copyWithin(0, 3)
// [4,5,3,4,5]

##### [1, 2, 3, 4, 5].copyWithin(0, 3, 4)
// [4,2,3,4,5]

##### [1, 2, 3, 4, 5].copyWithin(-2, -3, -1)
// [1,2,3,3,4]

##### [].copyWithin.call({length: 5, 3: 1}, 0, 3);
// { 0 :1, 3:1 , length:5}

### entries

#### 返回一个新的Array  Iterator 对象，包含数组中每个索引的键/值对

#### arr.entries()

##### 返回一个新的 Array 迭代器对象

#### 例子

##### Array Iterator
{
value:[key,value],
done:boolean
}

###### var arr =[1,2,3]
var it = arr.entries();
var a= [];
for(let i = 0;i<arr.length; i++){
var item = it.next();
if(!item.done){
a[i]=item.value
}
}
console.log(a)
[
[0,1],
[1,2].
[2,3]
]

##### for of 遍历

###### var arr =[1,2,3]
var it = arr.entries();
for(let item of it){
console.log(item)
}
[0,1]
[1,2]
[2,3]

### every

#### 测试数组内的所有元素是否都能通过制定方法的测试 ， 返回boolean
不会改变原数组

#### arr.every( callback(element, index, arr) , thisArg)

##### arr 为空数组时，不管测试方法的执行 ，都返回 true

##### callback( element, index, arr)

###### element, 当前元素

###### index: 当前元素下标

###### arr:  数组本身

##### thisArg

###### 执行callback时的 this

### fill

#### 用一个固定值填充一个数组中从起始到终止索引内的所有元素，  含头不含尾

#### arr.fill(value[, start[, end]])

##### value: 用来填充的值

##### start: 起始索引，默认 0

##### end: 终止索引， 默认arr.length

#### 例子

##### [1, 2, 3].fill(4);               // [4, 4, 4]

##### [1, 2, 3].fill(4, 1);            // [1, 4, 4]

##### [1, 2, 3].fill(4, 1, 2);         // [1, 4, 3] 

##### [].fill.call({ length: 3 }, 4);  // {0: 4, 1: 4, 2: 4, length: 3}

##### // Objects by reference.
var arr = Array(3).fill({}) // [{}, {}, {}];
// 需要注意如果fill的参数为引用类型，会导致都执行都一个引用类型
// 如 arr[0] === arr[1] 为true
arr[0].hi = "hi"; 
// [{ hi: "hi" }, { hi: "hi" }, { hi: "hi" }]

### filter

#### 创建一个新数组，返回通过函数测试所有元素

#### var newArray = arr.filter(callback(element[, index[, array]])[, thisArg])

##### callback(element [, index [, arr]])

###### element: 当前元素

###### index:当前元素下标

###### arr: 数组本身

##### thisArg

###### 调用callback时的this

### find

#### 返回数组中满足 提供的测试函数的第一个元素的值，否则返回 undefined

#### arr.find(callback(element, index, arr)[, thisArg])

##### callback(element [, index [, arr]])

###### element: 当前元素

###### index:当前元素下标

###### arr: 数组本身

##### 调用callback时的this

### findIndex

#### 返回数组中满足提供的测试函数的第一个元素的索引，
 若没找到，返回-1

#### arr.findIndex(callback [, thisArg])

##### callback(element [, index [, arr]])

###### element: 当前元素

###### index:当前元素下标

###### arr: 数组本身

##### 调用callback时的this

### flat

#### 按照一个可指定的深度递归遍历数组，并将所有元素与遍历到的紫薯粥中的元素合并返回

#### var newArr = arr.flat([depth])

##### depth: 指定嵌套数组的遍历深度 ，默认1

### flatMap

#### 使用映射函数映射每个元素，然后将结果压缩成一个新数组

跟arr.flatMap() 相当于 arr.map().flat(1)

#### var new_array = arr.flatMap(function callback(currentValue[, index[, array]]) {
	// return element for new_array
}[, thisArg])

##### callback(element [, index [, arr]])

###### element: 当前元素

###### index:当前元素下标

###### arr: 数组本身

##### 调用callback时的this

#### 例子

##### var arr1 = [1, 2, 3, 4];
arr1.map(x => [x * 2]);// [[2], [4], [6], [8]]
arr1.flatMap(x => [x * 2]);
// [2, 4, 6, 8]

### forEach

#### 对数组每个元素执行一次给定的函数

#### arr.forEach(callback(currentValue [, index [, array]])[, thisArg])

##### callback(element [, index [, arr]])

###### element: 当前元素

###### index:当前元素下标

###### arr: 数组本身

##### 调用callback时的this

### includes

#### 判断数组中是否含有一个指定的值，包含 返回true ,不包含返回false

#### arr.includes( value[, fromIndex])

##### value: 需要查找的值

##### fromIndex: 从fromIndex索引开始查找 ，默认0

### indexOf

#### 返回在数组可以找的一个给定元素的第一个索引，不存在则返回-1

#### arr.indexOf(searchElement[, fromIndex])

##### searchElement: 需要查找的元素

##### fromIndex：开始查找的索引

### join

#### 将一个数组或类数组的所有元素连接成一个字符串并返回

#### arr.join([separator])

##### separator: 字符串分隔符

#### 注意

##### 如果元素是 undefined /null  会转化为 空字符串

### keys

#### 返回数组中每个索引的 Array Iterator 对象

#### arr.keys()

### lastIndexOf

#### 返回指定元素在数组中的最后一个索引，不存在 返回-1
从数组后面向前找，从 fromIndex处向前找

#### arr.lastIndexOf(searchElement[, fromIndex])

##### searchElement: 需要查找的元素

##### fromIndex: 查找索引，从后向前查找

### map

#### 返回一个新数组，其结果是每个元素调用函数后的返回值

#### var new_array = arr.map(function callback(currentValue[, index[, array]]) {
 // Return element for new_array }[, thisArg])

##### callback(element, index, arr)

###### element: 当前元素

###### index:当前元素的索引

###### arr:数组自身

##### thisArg

###### callback执行时的this

### pop

#### 从数组中删除最后一个元素，并返回该元素，会修改原数组

#### arr.pop()

### push

#### 将一个或多个元素添加到数组最后，会修改原数组

#### arr.push(element1, ..., elementN)

##### element：需要添加的元素

### reduce

#### 对数组中的每个元素执行以下提供的函数，将其结果汇总为单个返回值

#### arr.reduce(function callback( accumulator, current, index, arr){}, initialValue)

##### callback(accumulator, current, index,arr)

###### accumulator：累计器累计值

###### current: 当前值

###### index: 当前值的索引

###### arr:数组本身

##### initialValue

###### 初始值，如果没有提供，则使用数组中的第一个元素

##### 第一次执行，

###### 如果没有initialValue,  accumulator 取数组第一个值， current取数组第二个值

###### 如果有initialValue, accumulatoor取 initialValue, current取数组第一个值

###### 数组为空， 且 initialValue 未提供，会报错

###### 数组仅有一个元素，无论位置， 并且没有initialValue .
将直接返回这个元素 ，callback不会执行

###### 数组为空，但是提供了 initialValue, 直接返回initialValue , callback不会执行

### reduceRight

#### 就是 数组从右向左 执行的  reduce() 方法

### reverse

#### 将数组中的元素位置颠倒，并返回该数组， 
会改变原数组

#### 可以对数组 或 类数组使用

### shift

#### 从数组中删除第一个元素，并返回删除的元素，会改变原数组

#### arr.shift()

### slice

#### 返回一个新的数组对象，是原数组的 浅拷贝， 原数组不会被改变

#### arr.slice(start , end)

##### start: 切割的起始索引，默认 0, 包含 start 位置的元素

##### end: 切到的终止索引，默认为arr.length ,  不包含end位置的元素

#### 类数组对象 使用

##### [].slice.call( arguments)

##### Array.prototype.slice.call(arguments)

### some

#### 测试数组中是否有一个元素通过测试函数的检查。 返回 boolean

#### arr.some(callback(element[, index[, array]])[, thisArg])

##### callback

###### element: 当前元素

###### index: 当前元素索引

###### array: 数组本身

##### thisArg

###### 执行callback时的 this

### sort

#### 使用原地算法对数组元素进行排序，并返回数组。
默认排序是将元素转为字符串然后比较他们的ASCII码

#### arr.sort([compareFunction(first , second)])

##### first: 第一个用于比较的值

##### second: 第二个用于比较的值

#### 结果

##### compareFunction(a, b)小于0 ，a排在b前面

##### compareFunction(a, b)大于0，b排在a前面

##### compareFunction(a, b)等于0 , a,b位置不变

### splice

#### 通过删除或替换现有元素或者原地添加新的元素来修改数组，
会修改原数组

#### array.splice(start[, deleteCount[, item1[, item2[, ...]]]])

##### start: 指定修改的开始位置，从0计数，
为负数， 从length+start位置开始
大于数组长度，则从数组末尾开始添加元素

##### deleteCount：要移除的数组元素个数

##### item：要添加进数组的元素

#### 返回值： 被删除的元素组成的数组，如果没有删除元素，则返回 []

### toLocaleString

#### 数组中的元素将使用各自的 toLocaleString方法转换成字符串

#### arr.toLocaleString([locales[,options]]);

##### locales: 带有BCP 47 语言标记的字符串或字符串数组

##### options:一个可配置属性的对象

### toSource

#### 尽量别使用

##### 使用 arr.toSource方法来查看数组的内容

#### array.toSource()

#### 例子

##### var alpha = new Array("a", "b", "c");

alpha.toSource();   //返回["a", "b", "c"]

### toString

#### 返回一个字符串，表示指定的数组及其元素

#### arr.toString()

#### Array对象覆盖了 Object的 toString方法。
arr.toString()连接数组元素 并返回一个字符串，使用逗号隔开

### unshift

#### 将一个或多个元素添加到数组的开头，并返回新数组的长度，会改变原数组

#### arr.unshift(element1, ..., elementN)

##### element: 需要添加到数组头部的元素

### values

#### 返回一个新的Array Iterator对象，

#### arr.values()

##### let arr = ['w', 'y', 'k', 'o', 'p'];
let eArr = arr.values();
for (let letter of eArr) {
  console.log(letter);} 
//"w" "y "k" "o" "p"

## from

### 将 类数组对象 或 可迭代对象  转化为一个新的数组实例 ----浅拷贝的数组

### Array.from(arrayLike [, mapFn [, thisArg])

#### arrayLike: 想要转换成数组的类数组对象或可迭代对象

#### mapFn: 可选参数 ， 新数组中每个元素都会执行的回调方法

#### thisArg: 可选参数，mapFn函数的this对象

### 示例

#### 1.可迭代对象

##### Array.from('foo')
// ['f','o','o']

##### var a =new Set(['foo', 'bar', 'baz', 'foo'])
Array.from(a)
// [ "foo", "bar", "baz" ]

#### 2. 类数组对象

##### function f(){
return Array.from(arguments)
}
f(1,2,3)
// [1,2,3]

## isArray

### 用于确定传递的值是否是一个Array
返回true / false

### Array.isArray(obj)

#### obj: 需要检测的值

### 例子

#### true

##### Array.isArray([]);

##### Array.isArray([1]);

##### Array.isArray(new Array());

##### Array.isArray(new Array('a', 'b', 'c', 'd'))

#####  鲜为人知的事实：其实 Array.prototype 也是一个数组。
Array.isArray(Array.prototype);

#### false

##### Array.isArray();

##### Array.isArray({});

##### Array.isArray(null);

##### Array.isArray(undefined);

##### Array.isArray(17);

##### Array.isArray('Array');

##### Array.isArray(true);

##### Array.isArray(false);

##### Array.isArray(new Uint8Array(32))

##### Array.isArray({ __proto__: Array.prototype });

## of

### 创建一个具有可变数据参数的新数组实例，不考虑参数的数量或类型

### Array.of(element0[, element1[, ...[, elementN]]])

#### element0,element1 ....

##### 表示数组的值

### 例子

#### Array.of(1);         // [1]

#### Array.of(1, 2, 3);   // [1, 2, 3]

#### Array.of(undefined); // [undefined]
