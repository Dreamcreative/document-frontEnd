# React合成事件与原生事件区别 

## React 使用合成事件原因

1. 进行浏览器兼容，实现更好的跨浏览器

  > React 采用的是顶层事件代理机制，能够保证冒泡一致性，可以跨浏览器执行。React 提供的合成事件用来抹平不同浏览器事件对象之间的差异

2. 避免垃圾回收

  > 事件可能会被频繁的创建和回收，因此 React 引入事件池，在事件池中获取或释放事件对象。即 React 事件对象不会被释放掉，而是存放进一个数组中，当事件触发时，就从这个数组中弹出，避免频繁的创建和销毁（垃圾回收）

3. 方便事件统一管理和事务机制

## 合成事件与原生事件的区别

1. 事件名称命名方式不同

  > 原生事件中命名为`纯小写 onclick`，React 中命名为 `小驼峰式 onClick`

2. 事件处理函数写法不同

  > 原生事件中事件处理函数为字符串，
  
  > React JSX 语法中，传入一个`函数`作为事件处理函数

  ```js
  <!-- 原生事件 -->
  <button onclick='handleClick()'>按钮</button>

  <!-- React 事件 -->
  const button = <button onClick={handleClick}></button>
  ```

3. 阻止默认行为方式不同

  > 原生事件中，可以通过返回 `false` 来阻止默认行为，或者`e.preventDefault() W3C`、`e.returnValue = false  IE`

  > React 中需要显示的调用 `e.preventDefault()`方式来阻止

4. 阻止事件冒泡方式

   1. 阻止 React 合成事件冒泡`e.stopPropagation()`
   2. 阻止合成事件与最外层`document`上的事件间的冒泡 `e.nativeEvent.stopImmediatePropagation()`
   3. 阻止合成事件与除最外层`document`上的原生事件的冒泡，通过`e.target`来避免

    ```js
      document.body.addEventListener('click',(e)=>{
        if(e.target && e.target.matches('a')) return;
      })
    ```

## React 事件与原生事件的执行顺序

> React 中，`合成事件`会以事件委托的形式绑定在组件最上层`document`节点，并在组件卸载阶段，自动销毁绑定的事件。

```js
Class App extends React.Component{
  parentRef:null;
  childRef:null;
  constructor(props){
    super(props);
    this.parentRef = React.createRef();
    this.childRef = React.createRef();
  }
  componentDidMount(){
    console.log("React componentDidMount！");
    this.parentRef.current?.addEventListener("click", () => {
      console.log("原生事件：父元素 DOM 事件监听！");
    });
    this.childRef.current?.addEventListener("click", () => {
      console.log("原生事件：子元素 DOM 事件监听！");
    });
    document.addEventListener("click", (e) => {
      console.log("原生事件：document DOM 事件监听！");
    });
  }
  parentClickFn(){
    console.log("React 事件：父元素事件监听！");
  }
  childClickFn(){
    console.log("React 事件：子元素事件监听！");
  }
  render(){
    return (
      <div ref={this.parentRef} onClick={this.parentClickFun}>
        <div ref={this.childRef} onClick={this.childClickFun}>
          分析事件执行顺序
        </div>
      </div>
    )
  }
}
```

上面输出结果

```js
原生事件：子元素 DOM 事件监听！
原生事件：父元素 DOM 事件监听！
React 事件：子元素事件监听！
React 事件：父元素事件监听！
原生事件：document DOM 事件监听！
```

> 通过上面流程，我们可以理解

1. React 中所有事件都是挂载在`document`对象上
2. 当真实 DOM 元素触发事件后，会冒泡到`document`对象后，再处理 React 事件。所以会先处理`原生事件`再处理`React 合成事件`
3. 最后执行`document`节点挂载的事件

# React 17 之后，合成事件的改变

1. React 17 之后，不再使用事件池
2. React 17 之后，`React 不再将事件代理在 document 节点上`，而是代理在`React 的渲染节点上 <div id='root'></div>`

## 参考

* [探索 React 合成事件](https://segmentfault.com/a/1190000038251163)