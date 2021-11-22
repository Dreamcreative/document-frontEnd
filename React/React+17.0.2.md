# React 17.0.2

## 判断唯一 key 值

> 使用 `new Set()` 来判断节点中是否有相同的`key`值

```js
if(knownKeys === null){
	knownKeys=new Set();
	knownKeys.add(key);
	break;
}
if(knownKeys.has(key)){
	knownKeys.add(key);
	break;
}
```

## `createContext( defaultValue, calculateChangedBits)`创建上下文

> 参数

1. defaultValue：默认值
2. calculateChangedBits：函数，不知道干嘛（一个回调）

```js
let Context = React.createContext({}, function);
// let { Provider, Consumer} = Context;

// Provider._context 是一个 Context 的循环引用
```

## `useContext(Context, unstable_observedBits)`

> 参数

1. Context: `React.createContext(defaultValue, function)` 创建的上下文对象
2. unstable_observedBits：是为了未来使用

> 注意：要获取`Context.Provider传入的参数` ,useContext(Context) 必须是同一个 Context

## `React.memo(type, compare)`

> 参数

1. 必须是一个组件
2. 需要改变时的对比对象

## React Hooks 使用

> 必须在函数式组件中使用，并且是在组件的最顶级作用域。不能在函数组件的函数中使用

> 因为，hooks 是通过`单向链表`的形式相互串联，如果不安规定使用，会造成 hooks 的结构错误
