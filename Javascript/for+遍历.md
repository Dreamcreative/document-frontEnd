# for 遍历

1. `for(let i=0; i< arr.length;i++){}`
2. `for in`

   - `for(let key in obj){}` 主要用来遍历对象
   - 只能获取对象的 key ,不能获取对象的 value
   - 不仅会遍历自身属性，还会遍历原型链上的属性
   - 不会遍历 `Symbol`类型的值
   - 遍历时，属性的顺序不确定

3. `for of`

   - `for(let item of arr){}`,获取遍历对象的值
   - 只能遍历具有 `iterator` 接口的对象，没有 `iterator`接口的对象遍历时会报错
   - 不能遍历 `Symbol`类型的值，需要使用`Object.getOwnPropertySymbols()`

## 具有 iterator 接口的结构

1. 数组
2. 类数组对象
3. Map
4. Set
5. String
6. NodeList 对象

## 给对象添加 iterator 接口

```js
let obj = {
  name: 1,
  [Symbol.iterator]() {
    const self = this;
    let keys = Object.keys(self);
    let index = 0;
    return {
      next() {
        if (index < keys.length) {
          return {
            value: self[keys[index++]],
            done: false
          };
        }
        return { value: undefined, done: true };
      }
    };
  }
};
```

## for(){}、for in、forEach、for of 的缺陷

1. forEach 不能 break、return
2. for in 在遍历时除了自身的属性，还会遍历原型属性，同时，属性的遍历顺序不一定。不能遍历 `Symbol`类型的字段
3. for of 只能遍历具有 `iterator`接口的结构，否则会报错

## for(){}、 forEach、map 性能对比

> for > forEach > map

在 chrome 中 for 循环比 forEach 快 1 倍，forEach 比 map 快 20%

- for: for 循环没有额外的调用栈和上下文，所以它的实现最为简单
- forEach: forEach 它的函数签名中包含了参数和上下文，所以性能低于 for
- map: map 最慢的原因是，会返回一个新数组，而数组的创建和赋值会导致分配内存空间，因此会带来较大的性能开销

## 参考

- [iterator](https://es6.ruanyifeng.com/#docs/iterator)
