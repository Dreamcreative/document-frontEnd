# Redux

> Redux 本身只处理`同步的action`，如果想要处理`异步的 action`，那么需要使用 `Redux-thunk`、`Redux-promise`、`Redux-saga` 等中间件

> Redux 状态管理于 React 之间没有关系。Redux 支持 React、Angular、Ember、jQuery甚至是 JavaScript

## 三大原则

1. 单一数据流

  > 整个应用的`全局 state` 被存储在一个对象中，并且是`唯一的`

2. state只读

  > 唯一改变 state 的方式，就是触发 `action`, action 是用于描述已发生事件的普通对象

```js
store.dispatch({
  type: 'COMPLETE_TODO',
  index: 1
})
```

3. 使用纯函数来执行修改

> 为了描述 action 如何改变 state,需要编写纯的 reducers

```JS
function visibilityFilter(state = 'SHOW_ALL', action) {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter
    default:
      return state
  }
}
```



## 名词

1. [createStore(reducer, state, enhance)](./createStore.js) 创建一个 store

    > 参数

    1. reducer：修改 state 的方法
    2. state：初始 state
    3. enhance：传入的 middleware 中间件

    > 返回值

    1. getState():获取 state 值
    2. subscribe(listener)：订阅函数
    3. dispatch(action)：触发 action 更新state
    4. replaceReducer(reducer): 修改 reducer 函数

2. [combineReducers(reducers)](./combineReducers.js) 合并 reducer 函数

    > 参数
    1. reducers 需要合并的 reducer 方法

```js
combineReducers(reducers){
  const reducerKeys = Object.keys(reducers);
  return function combination(state, action){
    const nextState = {};
    for(let key of reducerKeys){
      const prevReducerForKey = reducers[key];
      const prevStateForKey = state[key];
      nextState[key] = prevReducerForKey(prevStateForKey, action);
    }
    return nextState;
  }
}
```

3. [applyMiddleware(...middlewares)](./applyMiddleware.js) 合并执行 middlewares 中间件

```js
// 当多个 middleware 调用时

// 之前
const logger = loggerMiddleware(store);
const exception = exceptionMiddleware(store);
const time = timeMiddleware(store);
const store = createState(reducer, initState);
store.dispatch = exception(time(logger(store.dispatch)));

// 之后
const newMiddleware =  applyMiddleware(logger,exception,time);
const store = createStore(reduncer, initState, newMiddleware);
```

```js
applyMiddleware(...middlewares){
  return (oldCreateStore)=>{
    return (reducer, state)=>{
      const store= oldCreateStore(reducer, state);
      const chain = middlewares.map((middleware)=> middleware({getState: store.getState}))
      const dispatch = compose(...chain)(store.dispatch);
      return {
        ...store,
        dispatch
      }
    }
  }
}
```

4. [compose(...fns)](./compose.js) 合并执行 middleware 中间件

```js
compose(...fns){
  const len = fns.length;
  if(len ===0)return (args)=> args;
  if(len===1) return fns[0];
  return fns.reducer((total, cur)=> (...args)=>total(cur(...args)))
}
```

5. [bindActionCreators(actions, dispatch)](./bindActionCreators.js) 将 action 和 dispatch 隐藏起来。

```js
const infoReducer = (state, action) => {
    switch (action.type) {
        case 'INCREMENT':
            return {
                ...state,
                count: state.count + 1
            }
        case 'DECREMENT':
            return {
                ...state,
                count: state.count - 1
            }
        default:
            return state
    }
}

// 处理之前
const state = {
  count:0
}
const store = createStore(infoReducer, state)
store.dispatch({type:'INCREMENT'})
store.dispatch({type:'DECREMENT'})

// 处理之后 ,隐藏了 action 和 dispatch
function increment() {
  return {
    type: 'INCREMENT'
  }
}
function decrement(name) {
  return {
    type: 'DECREMENT',
    name: name
  }
}
const state = {
  count:0
}
const store = createStore(infoReducer, state)
const actions = bindActionCreators({increment,decrement}, store.dispatch);
actions.increment();
actions.decrement();
```

```js
bindAction(action, dispatch){
  return function (){
    return dispatch(action.apply(this, arguments))
  }
}
bindActionCreators(actions, dispatch){
  const actionKeys = Object.keys(actions);
  return function(){
    let nextAction ={};
    for(let key of actionKeys){
      nextAction[key] = bindAction(actions[key] , dispatch);
    }
    return nextAction;
  }
}
```

6. [middleware](./middlewares/loggerMiddleware.js) 中间件

```js
// 中间件格式

// store ：传入 middleware 的 store 对象 ，具有 getState() 方法
loggerMiddleware= (store)=>{
  // dispatch：触发 action 的函数
  return (dispatch)=>{
    // action：修改触发的 action
    return (action)=>{

    }
  }
}
```