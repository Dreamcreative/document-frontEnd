# React 17.0.2 方法

## React.memo(type, compare) 是一个高阶组件

> 参数

   1. type：需要缓存的组件
   2. compare：自定义比较函数

> `React.memo`通过浅比较 props 属性，来判断是否重用上次的渲染节点

> `React.memo`与`React.PureComponent 纯组件` 类似

## React.Component

> 使用 `ES6 类`定义的 React 组件基类

## React.PureComponent

> `React.PureComponent`与`React.Component` 类似，区别主要在与 `React.PureComponent`实现了 `shouldComponentUpdate() 通过浅比较 prop 和 state`,

```js
const emptyObject = {};
function ComponentDummy() {}
ComponentDummy.prototype = Component.prototype;

PureComponent(props, context, updater){
    this.props = props;
    this.context = context;
    this.refs = emptyObject;
    this.updater = updater || ReactNoopUpdateQueue;
}
const purrComponentProperty = PureComponent.prototype = new ComponentDummy();
purrComponentProperty.constructor = PureComponent;
Object.assign(purrComponentProperty, Component.prototype);
purrComponentProperty.isPureReactComponent = true;

// packages/react-reconciler/src/ReactFiberClassComponent.new.js
// 判断组件是否需要更新
checkShouldComponentUpdate(
    workInProgress,
    // 组件实例
    ctor,
    // 旧props
    oldProps,
    // 新props
    newProps,
    // 旧 state
    oldState,
    // 新 state
    newState,
    nextContext,
){
    // 如果当前组件是纯组件 浅比较 props 和 state，如果都相等，则组件不需要更新
    if(ctor.prototype && ctor.prototype.isPureReactComponent){
        return !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState);
    }
}
// 浅比较对象
shallowEqual(objA, objB){
    if(is(objA, objB)){
        return true;
    }
    if(typeof objA ==='object' || objA===null || typeof objB ==='object' || objB===null){
        return false;
    }
    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);
    // 如果新旧对象的键值长度不相等，则 返回 false
    if(keysA.length !== keysB.length){
        return false;
    }
    // 新旧对象的键值 长度相等，则遍历比较每一个键值，有一个键值不相等，则返回false
    for(let i=0;i<keysA.length;i++){
        if(!hasOwnPrototype.call(objB, keysA[i]) || is(objA[keysA[i]], objB[keysA[i]])){
            return false;
        }
    }
    return true;
}
```

## React.createElement(type, props, children) 创建并返回给定类型的 React 元素

> 参数

   1. type 节点名称
   2. props 节点属性
   3. children 当前节点的子节点

```js
createElement(type, config, children){
    let propName;
    const props = {};
    let key = null;
    let ref = null;
    let self = null;
    let source = null;
    // config 存在
    if(config !==null){
        // 获取 ref
        if(hasValidRef(config)){
            ref = config.ref;
        }
        // 获取 key
        if(hasValidKey(config)){
            key = ''+config.key;
        }
        // 遍历config ,如果是自身属性，并且该属性不是保留属性，则添加到 props
        for(propName in config){
            if(hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)){
                props[propName] = config[propName];
            }
        }
    }
    // 设置 子节点
    const childrenLength = arguments.length -2;
    if(childrenLength ===1){
        props.children = children;
    }else if(childrenLength>1){
        // 创建一个 childrenLength 长度的 空数组
        const childArray = Array(childrenLength);
        for(let i = 0;i<childrenLength;i++){
            childArray[i] = arguments[i+2];
        }
        props.children = childArray;
    }
    // 设置默认属性
    if(type && type.defaultProps){
        const defaultProps = type.defaultProps;
        for(propName in defaultProps){
            if(props[propName] === undefined){
                props[propName] = defaultProps[propName];
            }
        }
    }
    // 生成 React 元素
    return ReactElement(
        type,
        key,
        ref,
        self,
        source,
        ReactCurrentOwner.current,
        props,
    )
}
```


## React.cloneElement(element, config, children) 克隆并返回一个新的 React 元素

> 参数

  1. element 需要克隆的 React 元素
  2. config 新节点包含的属性
  3. children 新的子节点，取代目标节点 element 的子节点

```js
// 克隆 React 元素
// 使用 config /children，替换掉目标元素 element 的属性，以element 的基础，克隆产生一个新的 React 元素
cloneElement(element, config, children){
    let propName;
    const props = Object.assign({}, element.props);
    let key = element.key;
    let ref = element.ref;
    const self = element._self;
    const source = element._source;
    const owner = element._owner;
    // config存在
    if(config !==null){
        // 获取 ref
        if (hasValidRef(config)) {
            ref = config.ref;
            owner = ReactCurrentOwner.current;
        }
        // 获取 key
        if (hasValidKey(config)) {
            key = '' + config.key;
        }
        let defaultProps ;
        // 先设置目标元素的默认属性
        if(element.type && element.defaultProps){
            defaultProps = element.type.defaultProps;
        }
        // 遍历 config，
        for(propName in config){
            // 如果propName是自身属性，且 不是React 保留属性
            if(hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)){
                // 设置 props,优先取 传入的 config，没有，则使用目标元素的属性
                if(config[propName] === undefined && defaultProps!== undefined){
                    props[propName] = defaultProps[propName];
                }else{
                    prop[propName]=config[propName];
                }
            }
        }
    }
    // 将传入的 子节点赋值给 props，直接替换目标元素的子节点，
    const childrenLength = arguments.length-2;
    if(childrenLength===1){
        props.children = children;
    }else if(children.length>1){
        // 创建一个 childrenLength 长度的 空数组
        const childArray = Array(childrenLength);
        for(let i=0;i<childrenLength;i++){
            childArray[i]=arguments[i+2];
        }
        props.children = childArray;
    }
    return ReactElement(element.type, key, ref, self, source, owner,props);
}
```

## React.createFactory(type) 返回一个生成给定类型的 React 元素的函数

```js
// 创建一个绑定了 元素类型的 函数
createFactory(type){
    const factory = createElement.bind(null, type);
    factory.type = type;
    return factory;
}

```

## React.isValidElement(object) 验证对象是一个 React 元素 ，true / flase

```js
isValidElement(object){
    return (
        typeof object ==='object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE
    )
}
```

## React.Children

### React.Children.map(children, function(){})

### React.Children.forEach(children, function(){})

### React.Children.count(children) 返回组件总数

### React.Children.only(children) 验证 children 只有一个子元素

### React.Children.toArray(children) 将 children 扁平化返回

## React.Fragment 空标签 ，简写形式：<></>

## React.createRef() 创建一个 ref 返回

## React.forwardRef() 创建一个 React 组件，将接收到的 ref 属性传递给创建的 React 元素

## React.lazy() 允许动态加载组件，

> `const SomeComponent = React.lazy(()=> import('./SomeComponent'))`

## React.Suspense() 在组件未完成渲染前，添加一个指定的加载组件

```js
const OtherComponent = React.lazy(()=> import('./OtherComponent'));
function MyComponent(){
    return(
        <React.Suspense fallback={<Spinner />}>
            <div>
                <OtherComponent />
            </div>
        </React.Suspense>
    )
}
```

## 参考

* [React Top-Level API](https://reactjs.org/docs/react-api.html)