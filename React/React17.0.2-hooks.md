# React17.0.2-hooks

## mount

### HooksDispatcherOnMountInDEV

hooks 在挂载阶段使用的方法

#### useState(initialState)

##### mountState(initialState)

###### mountState(initialState){

```
获取hook
var hook=mountWorkInProgressHook()
如果 initialState是方法，执行后得到initialState
if(typeof initialState === 'function'){
initialState = initialState()
}
将 initialState 赋值给 hook.memoizedState=hook.baseStaet
hook.memoizedState=hook.baseState = initialState
设置queue
var queue = hook.queue={
pending:null,
dispatch:null,
lastRenderedReducer: basicStateReducer,
lastRederedState:initialState
}
获取dispatch
var dispatch = queue.dispatch=dispatchAction.bind(null,currentlyRenderingFiber$1, queue )
}
返回 [hook.memoizedState , dispatch], 存储在hook的initialState，修改函数 dispatch
return [hook.memoizedState, dispatch]
```

}

#### readContext(context, observedBits)

observedBits 最大值为 Math.pow(2,30)-1

##### readContext(context, observedBits){

return context.\_currentValue;
}
observedBits 最大值为 Math.pow(2,30)-1

#### useCallback(callback, deps)

deps 只能是数组，undefined、null

##### mountCallback(callback, deps){

var hook = mountWOrkInProgressHook();
var nextDeps= deps===undefined?null: deps;
hook.memoizedState = [callback, deps];
return callback;
}

#### useContext(context, observedBits)

observedBits 最大值为 Math.pow(2,30)-1

##### readContext(context, observedBits)

#### useEffect(create, deps)

deps 只能是数组、undefined、null

##### mountEffect(create, deps)

###### mountEffectImpl(Update | Passive, Passive$1, create, deps){

```
var nextDeps = deps===undefined?null:deps
hook.memoizedState = pushEffect(HasEffect | hookFlags, create, undefined, nextDeps)
}

####### pushEffect(tag, create, destroy, deps){
var effect = {
tag: tag,
create: create,
destroy: destroy,
deps: deps,
// Circular
next: null
}
return effect
}
```

}

#### useMemo(create, deps)

deps 只能是数组、undefined、null

##### mountMemo(create, deps)

###### mountMemo(create,deps){

    var hook = mountWorkInProgressHook();
    var nextDeps = deps === undefined ? null : deps;

var nextValue = create();
hook.memoizedState[nextValue, deps]
return nextValue
}

#### useRef(initialState)

传入一个初始值

##### mountRef(initialState)

###### mountRef(initialState){

    var hook = mountWorkInProgressHook();

var ref={
current:initialState
}
封闭对象，使其无法添加新属性，已有属性无法配置
Object.seal(ref)
存储属性
hook.memoiszedState=ref
返回属性
return ref
}

#### useLayoutEffect(create, deps)

##### mountLayoutEffect(create, deps)

###### mountEffectImpl(Update, Layout, create, deps){

获取 hook
var hook = updateWorkInProgressHook();
判断传入依赖项
var nextDeps = deps === undefined ? null : deps;
将 pushEffect 返回值存储起来
hook.memoizedState=pushEffect(HasEffect|hookFlags, create, undefined, nextDeps)
}

#### useReducer(reducer, initialArg, init)

##### mountReducer(reducer, initialArg, init)

###### mountReducer(reducer, initialArg, init){

获取 hook
var hook = mountWorkInProgressHook();
var initialState
if(init!==undefined){
如果传入了 init 函数，将第二个参数 initialArg 作为 init 函数的参数执行，并返回挡住初始值
initialState=init(initialArg)
}else{
如果没有传入第三个参数 init，则将第二个参数 initialArg 作为初始值
initialState = initialArg
}
将初始值缓存
hook.memoizedState= hook.baseState= initialState

    var queue = hook.queue = {
      pending: null,
      dispatch: null,
      lastRenderedReducer: reducer,
      lastRenderedState: initialState
    };

获取 dispath 修改方法
var dispatch = queue.dispatch = dispatchAction.bind(null, currentlyRenderingFiber$1, queue);
返回缓存的初始值和修改函数
return [hook.memoizedState, dispatch]
}

#### useDebugValue

##### mountDebuggValue()

###### 通常不起作用

#### useDeferredValue(value)

##### mountDeferredValue(value)

###### mountDeferredValue(value){

调用 mountState 返回一个存储的初始值和一个更新函数
var \_mountState = mountState(value)
var prevValue = \_mountState[0]
var setValue = \_mountState[1]
调用 mountEffect 调用一次更新函数
mountEffect(()=>{
try{
setValue(value)
}finally{

}
}, [value])
返回使用 mountState 存储的初始值
return prevValue
}

#### useTransition()

???
使用为什么会需要传参

##### mountTransition()

###### mountTransition(){

设置 transition 是否开始 flag
var \_mountState2= mountState(false)
获取 mountState 返回的 值和设置直的方法
isPending=\_mountState2[0]
setPending=\_mountState2[1]
获取 start
var start = startTransition.bind(null, setPending)
将值通过 ref 的形式存储
mountRef(start)
返回[start, isPending]值
return [start, isPending]
}

#### useMutableSource(source, getSnaoshot, subscribe)

???

##### updateMutableSource(source, getSnaoshot, subscribe){

var hook = mountWorkInProgressHook()
return useMutableSource(hook, source, getSnapshot, subscribe)
}

###### useMutableSource(hook, source, getSnapshot, subscribe){

}

#### useOpaqueIdentifier()

???

##### updateOpaqueIdentifier()

###### updateOpaqueIdentifier(){

var id = updateState()[0]
return id
}

## update

### HooksDispatcherOnUpdateInDEV

hooks 在更新阶段使用的方法

#### useState(intialState|| function(){

return initialState
})

##### 作用：传入的 initialState 或者 function 会在组件初次渲染是返回，

同时会返回一个可以修改 initialState 的函数

##### updateState(basicStateReducer)

###### updateReducer(basicStateReducer){

获取 hook
var hook = updateWorkInProgressHook()
获取 hook 中的 queue
var queue= hook.queue
queue.lastRenderedReducer = reducer
var current = currentHook
var pendingQueue = queue.pending
if(pendingQueue!==null){
如果等待队列有值,将他们放入到基础队列中
if(baseQueue!==null){
基础队列有值，合并等待队列和基础队列
var baseFirst = baseQueue.next
var pendingFirst = pendingQueue.next
baseQueue.next = pendingFirst
pendingQueue.next = baseFirst
}
current.baseQueue = baseQueue=pendingQueue
queue.pending=null
}
if(baseQueue!==null){
如果基础队列有值
do{
遍历基础队列中的值
update = update.next
}while(update!==null && update!==first){

}
}
if(!objectIs(newState,hook.memoizedState)){
  通过 Object.is(newState, hook.memoizedState) 判断 修改前与修改后的值是否相等，
react 对 Object.is 做了 pollfil 
markWorkInProgressReceivedUpdate()
}
hook.memoizedState = newState;
hook.baseState = newBaseState;
hook.baseQueue = newBaseQueueLast;
queue.lastRenderedState = newState;
}
var dispatch = queue.dispatch
   return [hook.memoizedState, dispatch]
}

#### readContext(context, observedBits)

observedBits 最大值为 Math.pow(2,30)-1

##### 作用：读取 React 上下文

##### readContext(context, observedBits){

return context.\_currentValue;
}

#### useCallback(callback, deps)

deps 只能是数组、undefined、null
相当于：
useMemo(() => fn, deps)

##### 作用：返回一个被记忆的回调函数

只在当 deps 变化时，才会更新

##### updateCallback(callback, deps){

var hook=updateWorkInprogressHook()
var nextDeps= deps===undefined? null:deps
// 获取之前的存储的值
var prevState=  hook.memoizedState;
if( areHookInputsEqual(nextDeps, preDeps)){
 return preDeps[0]
}
return callback
}

#### useContext(context, observedBits)

observedBits 最大值为 Math.pow(2,30)-1

##### 作用：使用 React 上下文，context 必须是使用

React.createContext 创建的 当前值

const context = React.createContext({})
。。。
const result = useContext(context);

##### readContext(context, observedBits)

#### useEffect(create, deps)

deps 只能是数组、undefined、null

##### 作用：处理 React 函数组件中具有副作用的代码，

同时可以返回一个函数，该函数会在组件卸载时触发，
类似于 React 类组件的 componentWillUnmount 生命周期

##### updateEffect(create, deps){

return updateEffectImpl(Update | Passive, Passive$1, create, deps)
}

###### updateEffectImpl(Update | Passive, Passive$1, create, deps){

var hook = updateWorkInProgressHook()
var nextDeps = deps === undefined ? null : deps;
// 如果更新时的依赖 deps 与之前存储的依赖不同，
if(areHookInputsEqual(nextDeps, prevDeps)){
pushEffect(hookFlags, create, destroy, nextDeps);
}
var destroy = undefined;hook.memoizedState = pushEffect(HasEffect | hookFlags, create, destroy, nextDeps)
}

##### 合并了类组件中的

componentDIdMount、componentDidUpdate、componentWillUnmount
  这三个生命周期

#### useReducer(reducer, initialState, init)

##### 作用：替代 useState 的一种方法，

1. 当 intialState 包含多个值
2. 下一个 state 依赖上一个 state 时

###### function reducer(state, action) {

switch (action.type) {
 case 'increment': return {count: state.count + 1};
 case 'decrement': return {count: state.count - 1};
 case 'reset': return init(action.payload);
 default: throw new Error();
 }
}

dispatch({type: 'reset', payload: initialCount})
dispatch({type: 'increment'})

###### 使用方式一：没有第三个参数

const [count , dispatch] = useReducer(reducer, intialState);

###### 使用方式二：有第三个参数

const [count, dispath] = useReducer( reducer, intialState, function init( initialState){
 return { count : initialState}
})

##### updateReducer(reducer, initialArg, init)

###### updateReducer(reducer, initialArg, init){

获取 hook
var hook=updateWorkInprogressHook()
获取队列
var queue = hook.queue
将 reducer 存入队列的 lastRenderedReducer
queue.lastRenderedReducer = reducer;
var current = currentHook; 
var baseQueue = current.baseQueue;
var pendingQueue = queue.pending;
如果待执行队列存在任务需要更新
if(pendingQueue!==null){

}
如果基础队列存在任务需要更新
if(baseQueue!==null){
 do{

}while( update!==null && update!==first)
将得到的值存入到 hook 中
hook.memoizedState = newState
hook.baseState=newBaseState
hook.baseQueue=newBaseQueue
queue.laseRenderdState = newState
}
var dispatch = queue.dispatch
返回存储的上一次的 state、dispatch 更新函数
return [hook.memoizedState, dispatch]
}

#### useMemo(create, deps)

create 一个具有返回值的函数，
deps 只能是数组、undefined、null

##### 作用：返回一个被记忆的值

##### updateMemo(create, deps){

1. 获取 hook
   var hook = updateWorkInProgressHook();
2. 判断传入的是否具有依赖项 deps.
   var nextDeps = deps === undefined ? null : deps;
   获取在 挂载组件初始化阶段返回的默认值
   var prevState = hook.memoizedState;
   如果初始值存在
   if(prevState!==null){
   如果依赖项存在
    if(nextDeps!==null){
   获取之前的依赖项
     var prevDeps=prevState[1];
   判断当前依赖与之前依赖是否相同，
   if (areHookInputsEqual(nextDeps, prevDeps)) {
   相同，则返回之前存储的 值
    return prevState[0];
   } }
   }
   否则，重新计算传入的 create 方法
   var nextValue  = create();
   将 create 方法执行后返回的值、依赖项，进行存储
   hook.memoizedState=[nextValue, nextDeps];
   返回返回值
   return nextValue;
   }

#### useRef(initialState)

##### 作用：返回一个可变的对象，并在整个 React 生命周期内保持不变

const ref = useRef(null)
注意：当 ref 变化时，组件不会通知你，也不会重新渲染

如果需要在 ref 变化时通知，则使用 ref 回调的方式
const ref = (node)=>{
 // some code
}

<p ref= {ref}></p>

##### updateRef(){

获取 hook
var hook = updateWorkInProgressHook();
返回组件初始化时存储的值
return hook.memoizedState
}

#### useLayoutEffect(create, deps)

##### updateLayoutEffect(create, deps)

###### updateEffectImpl(Update, Layout, create, deps){

获取 hook
var hook = updateWorkInProgressHook();
获取依赖 deps
var nextDeps = deps === undefined ? null : deps;
var destroy = undefined;
如果当前 hook 不为空
if(currentHoo!==null){
获取上一次 缓存的值
var prevEffect=currentHook.memoizedState
获取 destory 方法
destory=prevEffect.destory
如果存在依赖 deps
if(nextDeps!==null){
获取之前的依赖 deps
var prevDeps = prevEffect.deps;
判断当前 deps 与之前 deps 是否相等
if (areHookInputsEqual(nextDeps, prevDeps)) {
pushEffect(hookFlags, create, destroy, nextDeps);
return;
}
}
}
设置缓存
hook.memoizedState=pushEffect(HasEffect | hookFlags, create, destroy, nextDeps)
}

#### useDebugValue

##### updateDebuggValue()

###### mountDebuggValue

####### 这个钩子通常不起作用

#### useDeferredValue(value)

##### updateDeferredValue(value)

###### updateDeferredValue(value){

调用 updateState 获取之前存储的值和更新函数
var \_updateState = updateState()
var prevValue=\_updateState[0]
var setValue = \_updateState[1]
调用 updateEffect 如果 value 不相等更新传入的 value 值
updateEffect(()=>{
try{
setValue(value)
}finally{
}
}, [value])
返回上一个值
return prevValue
}

#### useTransition()

##### updateTransition()

###### updateTransition(){

在 mountTransition 中使用 mountState()保存 transition 状态
在 updateTransition 中使用 updateState 获取状态
var \_updateState2=updateState()
isPending = \_updateState2[0]
获取存储为 ref 的 transition 状态
var startRef = updateRef()
var start= startRef.current
返回 [ start , isPending]保存在 ref 中的值和保存在 state 中的值
return [start, isPending]
}

#### useMutableSource(source , getSnapshot, subscribe)

???

##### updateMutableSource(source, getSnapshot, subscribe)

###### updateMutableSource(source, getSnapshot, subscribe){

var hook = mountWorkInProgressHook()
return useMutableSource(hook, source, getSnapshot, subscribe)
}

####### useMutableSource(hook, source, getSnapshot, subscribe){

}

#### useOpaqueIdentifier()

##### rerenderOpaqueIdentifier()

###### rerenderOpaqueIdentifier(){

var id = rerenderState()[0];
return id;

}

## hooks 通用方法

### 判断 hook 的 依赖是否相等

areHookInputsEqual(nextDeps, prevDeps){
for (var i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
if (objectIs(nextDeps[i], prevDeps[i])) {
continue;
}
return false;
}}

### 判断对象是否相等 使用 Object.is 或者是 react 自己实现的 is

objectis = typeof Object.is ==='function'?Object.is
: 
(x, y) =>{
 return x === y && (x !== 0 || 1 / x === 1 / y) || x !== x && y !== y 
}

### 返回 action

function basicStateReducer (state, action){
   return typeof action === 'function' ? action(state) : action;
}

## hook

### memoizedState: null,// 储存之前的 state 值

### baseState: null,// 

### baseQueue: null,

### queue: null, // 

### next: null // 当有多个相同的 hook 时，储存其他相同的 hook

## hook 使用规则

### 只能在函数最外层使用 hook，不能循环、if 语句和子函数中使用

### 只能在 react 的函数组件内使用，不能在 js 函数中调用。同时可以在自定义的 hook 中使用

## 区别

### useEffect 与 useLayoutEffect

#### 主要区别

##### useEffect:

uesEffect 是在渲染时异步执行，
当页面渲染完成之后才会调用 useEffect 中的 callback，
如果在 useEffect 中操作修改 DOM,会发生两次重绘、重排的过程

##### useLayoutEffect:

useLayoutEffect 是在渲染时同步执行，
会在渲染完成之前执行 useLayoutEffect 中的 callback,
最终只执行一次重绘重排，渲染代价更小

#### 对于 useEffect 和 useLayoutEffect 哪一个与

componentDidMount，componentDidUpdate
的是等价的

##### useLayoutEffect 与 componentDidMount、componentDidUpdate 等价。

因为 useLayoutEffect 的 callback 执行，会阻塞浏览器的渲染

#### useEffect 和 useLayoutEffect

哪一个与 componentWillUnmount 的是等价的

##### useLayoutEffect 的 destory 的调用位置、时机与

componentWillUnmount 等价，都是同步调用

## 实验阶段功能

### Concurrent UI 模式(并发模式)

#### 两种方式

##### 默认方式：Receded->Skeleton->Complete

后退-> 骨架->完成

##### 期望方式：Pending->Skeleton->Complete

等待->骨架->完成

#### 相关 hook

##### useTransition()

##### useDeferredValue(value)
