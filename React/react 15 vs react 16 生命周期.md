#  react 17 vs  react 15 生命周期

## react17 

1. static getDerivedStateFromProps(nextProps, prevState){}
	1. 用于替换`componentWillReceiveProps`会在初始化和update时调用
	2. 该函数 是静态方法 `static` 所以取不到this
	3. 如果需要对比`prevProps`需要单独在`state`中维护
	4. `不能使用this.setState()`

2. shouldComponentUpdate(nextProps, nextState){}
	1. 判断是否需要更新组件，用于组件性能优化
	2. 返回 `true`需要更新，`false`不需要更新 
	3. `不能使用this.setState()`

3.  render(){}
	1. 渲染函数

4. componentDidMount(){}
	1. 组件挂载后调用
	2. 可以在该函数中进行请求和订阅 

5. getSnapshotBeforeUpdate(){}
	1. 用于获取最新的DOM数据，会在commit阶段的 before mutation阶段(`DOM更新之前`)调用 
	2. 返回的任何值，都会作为参数传递给`componentDidUpdate()`
	3. 可以读取DOM，但无法使用DOM
	4. `不能使用this.setState()`

6. componentWillUnmount(){}
	1. 组件即将销毁
	2. 用于移除订阅，定时器等等 

7. componentDidUpdate(){}
	1. 组件更新后调用 

### 组件挂载时调用

1. constructor
2. getDerivedStateFromProps(){}
3. render(){}
4. componentDidMount(){}

### 组件更新时调用

1. getDerivedStateFromProps(){}
2. shouldComponentUpdate(){}
3. render(){}
4. getSnapshotBeforeUpdate(){}
5. componentDidUpdate(){}

### 组件卸载时调用

1. componentWillUnmount(){}
	 
## react15 生命周期

1. constructor(){}
	1. state初始化
	2. 为事件函数绑定实例

2. componentWillMount(){}
	1. 组件将要挂载
	2. 无法操作DOM

3. componentDidMount(){}
	1. 组件挂载完成 
	2. 可以操作DOM

4. componentWillReceiveProps(){}
	1. 组件props变化(不管是不是自身使用的属性变化都会调用) 

5. shouldComponentUpdate(){}
	1. 组件是否应该更新，返回 true需要更新，false不需要更新
	2. 进行优化操作

6. componentWillUpdate(){}
	1. 	当shouldComponentUpdate()返回true时调用

7. componentDidUpdate(){}
	1. 组件更新完成 

8. render(){}

9. componentWillUnmount(){}
	1. 组件卸载时调用，进行 事件的解绑和定时器的注销 
	2. 这个阶段不应该调用 setState，因为组件已经卸载，不会再更新 

### 挂载阶段
1. constructor()
2. componentWillMount()
3. render()
4. componentDidMount()

### 更新阶段
1. componentWillReceiveProps()
2. shouldComponentUpdate()
3. componentWillUpdate()
4. render()
5. componentDidUpdate()

### 卸载阶段
1. componentWillUnmount()