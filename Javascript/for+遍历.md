# for 遍历

## for(let i=0;i<arr.length;i++){}

## for in 

### for(let key in obj){} 主要是用来遍历对象

### 只能获取对象的键名，不能获取键值

### 不仅会遍历自身属性，还会遍历原型 prototype 上的属性

### 不能遍历出Symbol类型的值， 需要使用
Object.getOwnPropertySymbols()

### 遍历时，属性顺序并不确定

## forEach

### 在遍历前，forEach 所遍历的数组会被缓存，之后目标
数组不会发生改变

## for of

### for (let item of arr){}

### 允许获取键值

### 对于没有部署 iterator 接口的普通对象，会报错

### 不能遍历出Symbol类型的值， 需要使用
Object.getOwnPropertySymbols()

## 问题

### for(){} 、for in 、 forEach遍历的缺陷
forEach不能break 、return
for in 在遍历时会遍历到原型属性，同时遍历的顺序不固定

### for of 遍历的是值，
不仅支持数组，还支持类数组、Map、Set

只有拥有 iterator 接口的类型还能使用 for of 遍历

## 具有iterator接口的结构

### 数组，

### 类数组对象

### Map和Set

## 给对象添加iterator方法

### let obj = {
	name:"1",
	[Symbol.iterator](){
	    const self = this
	    let keys = Object.keys(self)
	    let index=0
	    if(index< keys.length){
	        return {
	            value:self[keys[index++]],
	            done:false
	        }
	    }else{
	        return {
	            value:undefined,
	            done:true
	        }
	    }
	}
}

## 使用forEach、map遍历异步函数时。

### forEach、map 会把同步操作执行完成之后，再去执行异步任务

### 使用 for(){} 、for of遍历来代替，会等到异步任务完成之后再进行下一轮循环

### let arr= [1,2,3,4]
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
//     let result = arr.map(async()=>{
//         console.log("start")
//         let data = await getData()
//         return data
//     })
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
