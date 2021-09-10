# React 17.0.2

## 判断唯一key值

### 使用new Set()来判断节点中是否有相同的key值

#### if (knownKeys === null) {
	              knownKeys = new Set();
	              knownKeys.add(key);
	              break;
	            }

	            if (!knownKeys.has(key)) {
	              knownKeys.add(key);
	              break;
	            }

## createContext(defaultValue, calculateChangedBits)

### 创建上下文
let Context=React,createContext({}, function)
//  {Provider, Consumer} = Context ;
2个参数：
 1. 默认值
 2. 函数，不知道干嘛(一个回调函数)

### Provider._context 是一个 Context的循环引用

## useContext(Context, unstable_observedBits)

### 使用 React.createContext()创建的 上下文

两个参数 
1. Context创建得到的上下文对象，
2. 第二个参数是为了未来使用

### 注意：
要获取 Context.Provider传入的 参数，
useContext()传入的参数必须是同一个Context

## React hooks使用，
必须是在函数式组件中，并且是在组件的最顶级作用域，
不能在函数组件的函数中使用

## React.memo(type, compare)

### React.memo() 
两个参数
1. 必须是一个组件
2. ？？
