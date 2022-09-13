# this 优先级

## new 绑定

> 使用 new 关键字 `var bar = new Bar()` this 指向新创建的对象

## 显示绑定(硬绑定)

> 通过 `call`、`apply`硬绑定调用，this 指向绑定的对象

## 隐式绑定

> 函数是否在某个上下文对象中调用，this 绑定的是那个上下文对象

## 默认绑定

> 如果以上都不是，则使用默认绑定 `var bar = bar()`;

> 分为严格模式与非严格模式

- 严格模式下 this 为 window
- 非严格模式下 this 为 undefined

## 箭头函数 this

> 箭头函数的 this 指向外层第一个普通函数的 this,无法被改变
