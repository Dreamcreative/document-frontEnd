# for 遍历

1. `for(let i=0; i< arr.length;i++){}`
2. `for in`

	* `for(let key in obj){}` 主要用来遍历对象
	* 只能获取对象的 key ,不能获取对象的 value
	* 不仅会遍历自身属性，还会遍历原型链上的属性
	* 不会遍历 `Symbol`类型的值
	* 遍历时，属性的顺序不确定

3. `for of`

	* `for(let item of arr){}`,获取遍历对象的值
	* 只能遍历具有 `iterator` 接口的对象，没有 `iterator`接口的对象遍历时会报错
	* 不能遍历 `Symbol`类型的值，需要使用`Object.getOwnPropertySymbols()`

## 具有 iterator 接口的结构

1. 数组
2. 类数组对象
3. Map
4. Set

## 给对象添加 iterator 接口

```js
let obj = {
	name:1,
	[Symbol.iterator](){
		const self = this;
		let keys = Object.keys(self);
		let index=0;
		return {
			next(){
				if(index< keys.length){
					return {
						value:self[keys[index++]],
						done: false
					}
				}
				return {value:undefined,done:true}
			}
		}
	}
}
```

## for(){}、for in、forEach、for of 的缺陷

1. forEach 不能 break、return
2. for in 在遍历时除了自身的属性，还会遍历原型属性，同时，属性的遍历顺序不一定。不能遍历 `Symbol`类型的字段
3. for of 只能遍历具有 `iterator`接口的结构，否则会报错

## 使用 forEach、map 遍历对象

1. forEach、map 会把同步任务执行完，再去执行异步任务
2. for(){} 、for of 会等到异步任务执行完毕之后，才会进行下一轮循环

```js
let arr= [1,2,3,4]
function getData(){
	return new Promise((resolve,reject)=>{
			setTimeout(()=>{
					resolve("data")
			})
	})
}
(
async function (){
// forEach。map遍历异步任务
	// let result = arr.map(async()=>{
	// 		console.log("start")
	// 		let data = await getData()
	// 		return data
	// })

// for 遍历异步任务
	let result =[]
	for(let i =0;i<arr.length;i++){
			console.log("start")
			let data = await getData()
			result.push(data)
	}
	console.log(result)
	}
)()
```

## 参考

* [iterator](https://es6.ruanyifeng.com/#docs/iterator)
