# Promise怎么取消和中断

1. Promise/A+ 标准，原 Promise 对象的状态跟新对象保持一致

> 当新对象保持`pending`状态时，原 Promise 链将会终止执行

```js
Promise.resolve().then(res=>{
  console.log('ok1');
  return new Promise(()=>{})// 返回 pending 状态的 Promise 对象
}).then(res=>{
  // 后续不会执行
  console.log('ok2')
}).catch(err=>{
  console.log('err---',err)
})
```

2. `Promise.race`竞速方法

```js
let p1 = new Promise((resolve, reject) => {
    resolve('ok1')
})

let p2 = new Promise((resolve, reject) => {
    setTimeout(() => {resolve('ok2')}, 10)
})

Promise.race([p2, p1]).then((result) => {
    console.log(result) //ok1
}).catch((error) => {
    console.log(error)
})
```

3. 利用 Promise 中抛出错误时，会被 catch 方法捕获,直到链路终点

```js
Promise.resolve().then(() => {
    console.log('ok1')
    // return new Promise(()=>{})
    throw 'throw error1'
}).then(() => {
    console.log('ok2')
}, err => {     
    // 捕获错误
    console.log('err->', err)
}).then(() => {   
    // 该函数将被调用
    console.log('ok3')
    throw 'throw error3'
}).then(() => {
    // 错误捕获前的函数不会被调用
    console.log('ok4')
}).catch(err => {
    console.log('err->', err)
})

```
