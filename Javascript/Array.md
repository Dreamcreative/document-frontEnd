# Array

## prototype 原型方法

* concat: 合并数组，不会改变现有数组，而是返回一个新的数组

* copyWithin: 浅复制数组的一部分到同一数组中的另一个位置，并返回，不会改变原数组

  > `arr.copyWithin(target[, start [,end]])`

    * `target<number>`: 从该位置开始替换数据，如果为负数，则从末尾算起，target 大于或等于 `arr.length`，则不发生复制
    * `start<number>`: 从0开始的索引，从该索引开始复制，如果为负数，则从数组末尾开始，默认为0
    * `end<number>`: 从0开始，复制从 `index>=start` `index<end` 之间的元素

  ```js
  [1,2,3,4,5].copyWithin(-2) // [1,2,3,1,2]
  [1,2,3,4,5].copyWithin(0,3) // [4,5,3,4,5]
  [1,2,3,4,5].copyWithin(0,3,4) // [4,2,3,4,5]
  [1,2,3,4,5].copyWithin(-2,-3,-1) // [1,2,3,3,4]
  [].copyWithin.call({length:5, 3:1},0, 3) // {0:1, 3:1, length:5}
  ```

* entries 返回一个新的 Array Iterator 对象，包含数组中每个索引的 `键/值`

  > `arr.entries()` 返回一个新的 Array Iterator 对象

  ```js
  var arr =[1,2,3]
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
  ```
* `every(callback(element, index, arr), thisArg)`: 数组内所有元素调用 callback, 如果都成功通过，则返回 true，如果有一个不通过，则返回 false。如果为空数组，则返回 true

  > callback( element, index, arr)

    * element, 当前元素
    * index: 当前元素下标
    * arr:  数组本身
    * thisArg:执行callback时的 this

* `fill(value[, start[, end]])`: 用一个固定的值，来填充一个数组内从 start - end 索引内的所有元素，`含头不含尾`

  * value: 用来填充的值
  * start: 起始索引，默认0
  * end: 终止索引，默认 `arr.length`

* `filter(callback(element, index, arr)[, thisArg])`:数组每个元素都执行 callback，如果 callback 返回 true 则返回该元素，false 则不返回

* `find(callback(element, index, arr)[, thisArg])`:返回数组中满足 callback 的第一个元素的值，否则返回 undefined

* `findIndex(callback(element, index, arr)[, thisArg])`:返回数组中满足 callback 的第一个元素的 索引，否则返回 -1

* `flat(depth)`:按照一个可指定的深度递归遍历数组，并将所有元素合并返回

* `Array.isArray(obj)`:判断一个值是否是数组，返回 true/false

* `Array.of(ele1,ele2,ele3,ele4)`: 通过传入的参数创建一个新的数组，数组元素为传入的参数

  ```js
  Array.of(1); // [1]
  Array.of(1, 2, 3); // [1, 2, 3]
  Array.of(undefined); // [undefined]
  ```
