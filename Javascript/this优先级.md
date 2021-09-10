# this优先级

## new 绑定

### 使用new关键字 var bar =new foo()。this指向新创建的对象

## 显示绑定(硬绑定)

### 通过call、apply或者硬绑定调用 （varb bar=foo.call(obj)）， this指向绑定的对象

## 隐式绑定

### 函数是否在某个上下文对象中调用。this绑定的时那个上下文对象

## 默认绑定

### 如果以上都不是，则使用默认绑定 （var bar = foo()）。
分为严格模式与非严格模式, 
严格模式下为 undefined，
非严格模式下为window

## 箭头函数的this

### 箭头函数的this指向 外层第一个普通函数的this.无法被改变
