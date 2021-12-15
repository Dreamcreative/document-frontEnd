# React-Redux v7.2.6

## Provider 创建 Subscription，context 保存上下文

1. 首先创建一个 contextValue,里面包含一个创造出来的父级 `Subscription - 根级订阅器`，和 redux 提供的 store
2. 通过 React 上下文 context 将 contextValue 传递给子孙组件

## Subscription 订阅消息，发布更新

1. 搜集所有被 connect 包裹的组件的更新函数 `onstatechange`,然后形成一个 `callback` 链表，再由父级 `Subscription` 统一派发执行更新
2. Subscription 首先通过 `trySubscribe` 发起订阅模式，如果存在父级订阅者，就把自己的更新函数 `handleChangeWrapper`，传递给父级订阅者，然后父级有 `addNestedSub` 方法将此时的更新函数添加到当前的 `listeners` 中。如果没有父级元素（Provider 的情况），就将此更新函数添加到 `store.subscribe` 中，而 `notifyNestedSubs` 方法会通知 `listeners` 中的 `notify` 方法来触发更新。被 connect 包裹的组件生成的 `Subscription` 会将更新自身的方法 `handleChangeWrapper` 传递父级 parentSub 的 `Subscription`，来统一通知 connect 组件更新
3. 大致模型： `state 更改` -> `store.subscribe` -> 触发 `Provider` 的 `Subscription` 的更新函数(也就是 `notifyNestedSub`)-> 通知 `listeners.notify()`-> 通知每个被 connect 容器组件的更新 -> `callback` 执行 -> 触发子组件 `Subscriptiion` 的更新函数 -> 触发子 `onstatechange` 更新函数更新

## createListenerCollection

> 生成一个订阅集合

1. 收集订阅：以链表的形式收集对应的 listeners，每一个 Subscription 的 handleChangeWrapper 函数（更新函数）
2. 派发更新：通过 batch 方法（React-dom 中的 unstable_batchedUpdates）来进行批量更新。将一次事件循环中的所有更新一起批量处理到一个渲染过程中

## Provider 总结

1. `React-Redux` 中的 Provider作用，通过 React 的 context 传递 subscription 和 Redux 中的 store,并且建立一个最顶部的根 Subscription
2. Subscription 的作用：起到发布订阅作用，一方面订阅 connect 包裹组件的更新函数，一方面通过 `store.subscribe` 统一派发更新
3. Subscription 如果存在父级，则把自身的更新函数传递给父级 Subscription ，如果不存在父级，则将自身的更新函数存储到 `store.subscibe`

## connect 究竟做了什么

### connect 的用法

```js
const mapStateToProps = (state)=>({todos: state.todos});
const mapDispatchToProps = dispatch => {
  return {
    increment: () => dispatch({ type: 'INCREMENT' }),
    decrement: () => dispatch({ type: 'DECREMENT' }),
    reset: () => dispatch({ type: 'RESET' })
  }
}
/**
  mapStateToProps 就是 Redux 中的 state, 需要传入 包裹组件的 props 属性
  mapDispatchToProps 就是 Redux 中的 reducer 修改 state 的 纯函数
  mergeProps 如果没有这个参数，会默认进行合并传入的属性 {...ownProps, ...stateProps, ...dispatchProps}
  options {
    context: object, 自定义的上下文，不使用 React-Redux 提供的 context
    pure: boolean, 是否缓存更新。默认为 true ，默认开启缓存模式，每次更新时，会进行浅比较 state 和 props，如果有变化就重新渲染组件，无变化就不渲染组件；为 false时，无论 state /props 是否变化，都会重新渲染组件。相当于 PureComponent
    areStateEqual?: function , pure 为 true 时，比较 state 是否相等
    areOwnPropsEqual?: function , pure 为 true 时，比较 props 是否相等
    areStatePropsEqual?: function , pure 为 true 时，比较 mapStateToProps 是否相等
    areMergedPropsEqual?: function , pure 为 true 时，比较 经过合并后的 mergeProps 是否相等
    forwardRef?: boolean , 当为 true 时，可以通过 ref 来获取被 connect 包裹的组件实例
  }
*/
connect(mapStateToProps?, mapDispatchToProps?, mergeProps?, options?)
```

### connect 逻辑

1. initMapStateToProps: 用于形成真正的 MapStateToProps 函数，将 store 中的 state 映射到 props 
2. initMapDispatchToProps：用于形成真正的 MapDispatchToProps ,将 dispatch 和自定义的 dispatch 注入到 props
3. initMergeProps: 用于形成真正的 MergeProps，合并业务组件的 props,state，映射的 props, dispatch 映射的 props

> mergeProps 函数非常重要。这个函数判断了整个 connect 是否更新组件的关键所在。

```js
// /src/connect/mergeProps.js
// 这个函数返回一个新的合并后的对象，作为新的 props 传入业务组件
function defaultMergeProps(stateProps, dispatchProps, ownProps){
  return {...stateProps, ...dispatchProps, ...ownProps};
}
```

### selectorFactory 形成新的 props 传递到被 connect 包裹的组件上

```js
// 得到真正connect 
function finalPropsSelectorFactory(
  dispatch,
  { initMapStateToProps, initMapDispatchToProps, initMergeProps, ...options }
) {
  // mapStateToProps mapDispatchToProps mergeProps 为真正connect 经过一层代理的 proxy 函数
  const mapStateToProps = initMapStateToProps(dispatch, options)
  const mapDispatchToProps = initMapDispatchToProps(dispatch, options)
  const mergeProps = initMergeProps(dispatch, options)

  const selectorFactory = options.pure ? pureFinalPropsSelectorFactory : impureFinalPropsSelectorFactory
   // 返回一个 函数用于生成新的 props 
  return selectorFactory(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
    dispatch,
    options
  )
}
// 通过闭包返回一个 pureFinalPropsSelector 函数。
// 如果是第一次组件渲染，就直接合并 ownProps, mapStateToProps, mapDispatchToProps 形成真正的 props
// 如果不是第一次组件渲染，就判断是 state 改变还是 props 改变，针对变化的属性，重新生成对应的 props,最终合并到真正的 props 上
function pureFinalPropsSelectorFactory(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
  dispatch,
  {areStatesEqual, areOwnPropsEqual, areStatePropsEqual}
  ){

}
```
```js
// /src/components/connectAdvanced.js
// 返回真正用于包裹 connect 传入组件的 HOC 高阶组件
function connectAdvanced(
  selectorFactory, // 每次 props,state改变执行 ，用于生成新的 props。
  {
    getDisplayName = name => `ConnectAdvanced(${name})`,
    //可能被包装函数（如connect（））重写
    methodName = 'connectAdvanced',
    //如果定义了，则传递给包装元素的属性的名称，指示要呈现的调用。用于监视react devtools中不必要的重新渲染。
    renderCountProp = undefined,
    shouldHandleStateChanges = true,  //确定此HOC是否订阅存储更改
    storeKey = 'store',
    withRef = false,
    forwardRef = false, // 是否 用 forwarRef 模式
    context = ReactReduxContext,// Provider 保存的上下文
    ...connectOptions
  } = {}
){
  return function wrapWithConnect(WrappedComponent){
    ...
  }
}
```

### wrapWithConnect connectAdvanced 返回的高阶组件，对传入的业务组件做了一些列的增强

1. 声明负责更新的 ConnectFunction 无状态组件。和负责合并 props 的 createChildSelector 方法
2. 如果 pure 属性为 true，则使用  `React.memo`包裹，减少组件不必要的渲染，会像 PureComponent 一样对 props 进行浅比较
3. 如果 connect 的 options 有 forwardRef 属性，将组件使用 `React.forwardRef` 处理，使得可以访问到业务组件的实例对象
4. 使用 `hoistStatics(Connect, WrappedComponent)`，把业务组件的静态方法/属性，继承到高阶组件上。因为 高阶组件包装业务组件的过程中，如果不对静态方法/属性特殊处理，是不会被包装后的组件访问到的。

### ConnectFunction 负责HOC 的更新

1. 判断是否开启 forwardRef 模式，通过判断是否更新真正的合并 props 函数 childPropsSelector
2. 创建子代 Subscription,层层传递 context，如果 connect 具有第一个参数 mapStateToProps,那么创建一个子的 Subscription 并与上层 Provider 的 Subscription建立关联
3. 保存信息，执行副作用钩子。判断 props/ state是否发生变化，从而确定是否更新 HOC，进一步更新组件。组件更新后，当前组件的订阅函数 `onStateChange` 绑定给父级的 subscription,进行层层订阅。为了防止渲染后，state 内容已经改变，所以先执行一次 `checkForUpdates`

![React-Redux层层订阅模型图](/images/React-Redux/React-Redux层层订阅模型图.jpeg)

```js
// 通过调用 childPropsSelector，来形成新的 props,然后判断之前的 props 与当前新的 props 是否相等，
// 相等，则不需要更新，同时通知子代容器组件，检查是否需要更新
// 不等，则证明 store.state 发生变化，则立即触发组件的更新
const checkForUpdates = () => {
    if (didUnsubscribe) {
      //如果写在了
      return
    }
     // 获取 store 里state
    const latestStoreState = store.getState()
    let newChildProps, error
    try {
      /* 得到最新的 props */
      newChildProps = childPropsSelector(
        latestStoreState,
        lastWrapperProps.current
      )
    } 
    //如果新的合并的 props没有更改，则此处不做任何操作-层叠订阅更新
    if (newChildProps === lastChildProps.current) { 
      if (!renderIsScheduled.current) {  
        notifyNestedSubs() /* 通知子代 subscription 触发 checkForUpdates 来检查是否需要更新。*/
      }
    } else {
      lastChildProps.current = newChildProps
      childPropsFromStoreUpdate.current = newChildProps
      renderIsScheduled.current = true
      // 此情况 可能考虑到 代码运行到这里 又发生了 props 更新 所以触发一个 reducer 来促使组件更新。
      forceComponentUpdateDispatch({
        type: 'STORE_UPDATED',
        payload: {
          error
        }
      })
    }
  }
```

![React-Redux层层更新模型图](/images/React-Redux/React-Redux整个更新模型图.jpeg)

## connect 流程总结

> 订阅流程：如果被 connect包裹，并且具有第一个参数。首先通过 context 获取最近的父 subscription,然后创建一个当前 subscription,并且与父级的 subscription 建立连接。当第一次 HOC 容器组价挂载完成后，在 useEffect里，进行订阅，将自己的订阅函数 `checkForUpdates`作为回调，通过， trySubscribe 和 `parentSub.addNestedSub`，加入到父级 subscription的 listeners 订阅集合中。`完成整个订阅流程`

> 更新流程：当 state 改变时，会触发最顶级订阅器（Provider 过程参数的 Subscription）的 `store.subscribe`，然后触发更新`checkForUpdates`，然后`checkForUpdates`根据 mapStateToProps, mergeProps 等操作，验证组件是否需要发起订阅。props 是否改变，并更新。如果发生改变，则触发业务组件的更新，如果没有发生改变，那个通知当前 subscription 的listeners 检查是否更新，层层向下检查被 connect 包裹的子组件是否需要更新。`完成整个更新流程`

## 问题 - 源码

1. Provider 是怎么把 store 放入 context 中的

> Provider 将数据由顶层注入

```js
/**
 import { Provider } from 'react-redux';

  <Provider store={store}>
      <App/>
    </Provider>
*/
/**
 * store 传入的 store
 * context 外部传入的 上下文
 * children 传入的子组件
*/

function Provider({store, context, children}){
  const contextValue = useMemo(()=>{
    // 创建一个监听器
    const subscription = createSubscription(store);
    // 绑定监听，当 state 变化时，通知订阅者更新页面，实际上就是在 connect 过程中被订阅到 subscription
    subscription.onStateChange = subscription.notifyNestedSub;
    // 返回 store 和监听器
    return {
      store,
      subscription
    }
  },[store]);
  // 保存之前的 state 值，用于与下一次 state 值进行比较，如果两次 state 不同，则更新 provider 组件
  const previousState = useMemo(()=> store.getState(),[store]);
  /**
   * useIsomorphicLayoutEffect 
   *    在 浏览器环境使用 useLayoutEffect
   *    在 服务器环境使用 useEffect
  */
  useIsomorphicLayoutEffect(()=>{
    // 获取当前订阅器
    const {subscription} = contextValue;
    // 开始更新订阅函数
    subscription.trySubscribe();
    if(previousState!== store.getState()){
      // 当 store 的 state 值变化时，通知订阅函数更新
      subscription.notifyNestSubs();
    }
    return ()=>{
      // 当组件卸载时，取消订阅和 state 变化绑定函数
      subscription.tryUnsubscribe();
      subscription.onStateChange = null;
    }
  },[contextValue, previousState])
  // ReactReduxContext = React.createContext()
  const Context = context || ReactReduxContext;
  // 将 contextValue 传入到 Context 上下文中
  return <Context.Provider value={contextValue}>{children}</Context.Provider>
}
```

```js
// 创建监听器  Subscription 是 React-Redux 实现订阅更新的核心
function createSubscription(store, parentSub){
  let unsubscribe;
  // nullListeners = {
  //   notify(){},
  //   get:()=>{}
  // }
  let listeners = nullListeners;
  // 添加订阅
  function addNestedSub(listener){
    trySubscribe();
    return listeners.subscribe(listener)
  }
  // 通知订阅更新
  function notifyNestedSubs(){
    listeners.notify();
  }
  function handleChangeWrapper(){
    if(subscription.onStateChage){
      subscription.onStateChage();
    }
  }
  // 是否订阅
  function isSubscribed(){
    return Boolean(unsubscribe);
  }
  function trySubscribe(){
    // parentSub 实际上是 subscription 实例
    // unsubscribe 不存在并且 parentSub 没传，则使用 store 订阅
    if(!unsubscribe){
      unsubscribe = parentSub? 
        parentSub.addNestedSub(handleChangeWrapper):
        store.subscribe(handleChangeWrapper);
      // 创建一个订阅集合
      listeners = createListenerCollection();
    }
  }
  // 取消订阅
  function tryUnsubscribe(){
    if(unsubscribe){
      unsubscribe();
      unsubscribe = undefined;
      listeners.clear();
      listeners = nullListener;
    }
  }
  return {
    addNestedSub,
    notifyNestedSubs,
    handleChangeWrapper,
    isSubscribed,
    trySubscribe,
    tryUnsubscribe,
    getListeners: () => listeners,
  }
}
```

```js
// 创建订阅集合
function createListenerCollection(){
  // getBatch = (callback) => callback();
  // 执行函数
  const batch = getBatch();
  let first = null;
  let last = null;
  return {
    // 取消所有监听函数
    clear(){
      first = null;
      last = null;
    },
    // 更新所有监听函数
    notify(){
      batch(()=>{
        let listenter = first;
        while(listenter){
          listenter.callback();
          listenter = listenter.next;
        }
      })
    },
    // 获取所有的监听函数
    get(){
      let listeners = [];
      let listener = first;
      while(listener){
        listeners.push(listeners);
        listener =listener.next;
      }
      return listeners;
    }
    // 添加订阅函数
    subscribe(callback){
      let listener = last = {
        callback,
        next:null,
        prev: last,
      };
      if (listener.prev) {
          listener.prev.next = listener
      } else {
          first = listener
      }
      // 返回一个 取消订阅函数
      return function unsubscribe() {
          if (!isSubscribed || first === null) return
          isSubscribed = false

          if (listener.next) {
              listener.next.prev = listener.prev
          } else {
              last = listener.prev
          }
          if (listener.prev) {
              listener.prev.next = listener.next
          } else {
              first = listener.next
          }
      }
    }
  }
}
```

> 当 store 变化时，`Context.Provider` 的 value 变化，通知监听函数更新

> 当页面卸载时，取消函数订阅

2. 如何向组件中注入 state 和 dispatch

> 组件被 connect 包裹之后才能拿到 state 和 dispatch

> 由 Selector 生成组件的 props

```js
// connect 使用 参数有两种方式
// 1. 函数 2. 对象

// 1. 参数为函数时
const mapStateToProps = (state, ownProps) => {
  const { counter } = state
  return {
    num: counter.num
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    increaseAction: () => dispatch({
      type: INCREASE
    }),
    decreaseAction: () => dispatch({
      type: DECREASE
    })
  }
}

connect(mapStateToProps, mapDispatchToProps)(Child);

// 2. 参数为对象时
const mapStateToProps =  {
    num: counter.num
}

const mapDispatchToProps = {
    increaseAction: () => dispatch({
      type: INCREASE
    }),
    decreaseAction: () => dispatch({
      type: DECREASE
    })
}
connect(mapStateToProps, mapDispatchToProps)(Child);
```

```js
function createConnect(
  connectHOC = connectAdvanced,
  mapStateToPropsFactories = defaultMapStateToPropsFactories,
  mapDispatchToPropsFactories = defaultMapDispatchToPropsFactories,
  mergePropsFactories = defaultMergePropsFactories,
  selectorFactory = defaultSelectorFactory,
){
  return function connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
    {
      pure=true,
      areStatesEqual = strictEqual,
      areOwnPropsEqual = shallowEqual,
      areStatePropsEqual = shallowEqual,
      areMergedPropsEqual = shallowEqual,
      ...extraOptions
    } = {}
  ){
    // 返回一个 Selector 函数，根据 connect 传入的参数类型，来判断是否使用组件自身属性 props
    const initMapStateToProps = match(mapStateToProps, mapStateToPropsFactories, 'mapStateToProps');
    const initMapDispatchToProps = match(mapDispatchToProps, mapDispatchToPropsFactories, 'mapDispatchToProps');
    const initMergeProps = match(mergeProps, mergePropsFactories, 'mergeProps');
    // 以上过程
    // 生成 selector 函数 给 connectAdvanced() 执行
    // 合并 connect 传入的参数 mapStateToProps,mapDispatchToProps, mergeProps
    return connectHOC(selectorFactory,{
      methodName: 'connect',
      getDisplayName: (name)=> `Connect(${name})`,
      // 如果 mapStateToProps 没有传，则 Connect 组件不订阅 store 变化
      shouldHandleStateChanges: Boolean(mapStateToProps),
      initMapStateToProps,
      initMapDispatchToProps,
      initMergeProps,
      // 是否进行渲染优化，默认为 true ,重新渲染时，只有当 state 变化时才会渲染，为 false 时，每次都会重新渲染
      pure,
      areStatesEqual,
      areOwnPropsEqual,
      areStatePropsEqual,
      areMergedPropsEqual,
      ...extraOptions
    })
  }
}
```

```js
// arg : mapStateToProps、mapDispatchToProps、mergeProps 作为参数
// factories: 一个函数数组
// name: 执行报错时使用
function match(arg, factories, name){
  // 遍历函数数组，将 connect 传入的参数作为参数进行执行，如果有返回值，则返回
  for(let i = factories.length-1; i>=0 ;i++){
    const result = factories[i](arg);
    if(result) return result;
  }
}
```

```js
// 1. 取到 store 的 state 和 dispatch,以及 ownProps
// 2. 执行 selector
// 3. 将执行的返回值注入到 组件中
function connectAdvanced(
  selectorFactory,
  {
    getDisplayName = (name)=>`ConnectAdvanced(${name})`,
    methodName = 'connectAdvanced',
    renderCountProp = undefined,
    // 确定此 HOC 是否订阅 store 的更改
    shouldHandleStateChanges = true,
    storeKey = 'store',
    withRef = false,
    forwardRef = false,
    // 上下文
    context = ReactReduxContext,
    ...connectOptions
  } = {}
){
  const Context = context;
  return function wrapWithConnect(WrappedComponent){
    const wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
    const displayName = getDisplayName(wrappedComponentName);
    const selectorFactoryOptions = {
      ...connectOptions,
      getDisplayName,
      methodName,
      renderCountProp,
      shouldHandleStateChanges,
      storeKey,
      displayName,
      wrappedComponentName,
      WrappedComponent,
    };
    const {pure} = connectOptions;
    function ConnectFunction(props){
      const [propsContext, reactReduxForwardedRef, wrapperProps] =
        useMemo(() => {
          const { reactReduxForwardedRef, ...wrapperProps } = props
          return [props.context, reactReduxForwardedRef, wrapperProps]
        }, [props])
        // 缓存 使用 React-Redux 提供的 Context, 还是使用 connect 传入的 Context
      const ContextToUse = useMemo(()=>{
        return propsContext&&
          propsContext.Consumer && isContextConsumer(<propsContext.Consumer />)
          ? propsContext: Context;
      },[propsContext, Context])
      const renderedChild = useMemo(()=>{
        // 订阅 store 更新
        if(shouldHandleStateChanges){
          return (
            <ContextToUse.Provider value={overriddenContextValue}>{renderedWrappedComponent}</ContextToUse.Provider>
          )
        }
        // 不订阅 store 更新
        return renderedWrappedComponent;
      }, [ContextToUse, renderedWrappedComponent, overriddenContextValue])
    }
    // useLayoutEffect || useEffect
    useIsomorphicLayoutEffectWithArgs(
        subscribeUpdates,
        [
          shouldHandleStateChanges,
          store,
          subscription,
          childPropsSelector,
          lastWrapperProps,
          lastChildProps,
          renderIsScheduled,
          childPropsFromStoreUpdate,
          notifyNestedSubs,
          forceComponentUpdateDispatch,
        ],
        [store, subscription, childPropsSelector]
      )
    const Connect = pure ? React.memo(ConnectFunction): ConnectFunction;
    Connect.WrappedComponent = WrappedComponent;
    Connect.displayName = ConnectFunction.displayName = displayName;
    return hoistStatics(Connect, WrappedComponent)
  }
}
```

```js
// 订阅更新
function subscribeUpdates(
  // 是否订阅 state 更新
  shouldHandleStateChanges,
  store,
  // 订阅集合
  subscription,
  childPropsSelector,
  lastWrapperProps,
  lastChildProps,
  renderIsScheduled,
  childPropsFromStoreUpdate,
  notifyNestedSubs,
  forceComponentUpdateDispatch
  ){
    const checkForUpdates = ()=>{
      // 获取最新的 state
      const latestStoreState = store.getState();
      let newChildProps, error
      try{
        // 使用 selector 获取最新的 props
        newChildProps = childPropsSelector(
          latestStoreState,
          lastWrapperProps.current
        )
      }catch(e){
        error = e;
        lastThrownError = e;
      }
      if(!error){
        lastThrownError = null;
      }
      if(newChildProps === lastChildProps.current){
        // 如果 props 没有变化，通知一下 订阅函数更新
        if (!renderIsScheduled.current) {
          notifyNestedSubs()
        }
      }else{
        // 如果 props 有变化，将新的 props 缓存起来，同时将新的 props 设置到 childPropsFromStoreUpdate.current
        // 确保在执行时能够识别出 props 是更新了
        lastChildProps.current = newChildProps
        childPropsFromStoreUpdate.current = newChildProps
        renderIsScheduled.current = true

        // props 更新了，重新渲染组件
        forceComponentUpdateDispatch({
          type: 'STORE_UPDATED',
          payload: {
            error,
          },
        })
      }
      subscription.onStateChange = checkForUpdates;
      subscription.trySubscribe();
      // 在第一次渲染后从存储中提取数据，以防从开始渲染后存储发生改变
      checkForUpdates();
      // 解除订阅
      const unsubscribeWrapper=()=>{
        subscription.tryUnsubscribe()
        subscription.onStateChange = null
      }
      return unsubscribeWrapper;
    }
}
```

3. Redux 中，可以通过 `store.subscribe()` 订阅一个更新页面的函数，来实现 store 变化，更新 UI，而 `React-Redux` 是如何做到 store 变化，被 connect 的组件也会更新的

> Provider 将数据放入 context, connect 的时候会从 context 上取出 store，获取到 mapStateToProps, maDispatchToProps,使用 selectorFactory 生成 Selector 作为 props 注入组件。其次订阅 store 的变化，每次更新组件会取到最新的 props.

## 参考

* [带着问题看 React-Redux 源码（一万四千字长文预警）](https://zhuanlan.zhihu.com/p/80655889)
* [「 源码解析 」 一文吃透 react-redux 源码（useMemo 经典源码级案例）](https://cloud.tencent.com/developer/article/1830553)