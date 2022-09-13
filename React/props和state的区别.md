# props 和 state 的区别

## props

- props 是传入组件的一个参数
- 类组件：`this.props`包含该组件调用或定义的 props

## state

- 表示组件内部可能随便会变化的数据
- state 有用户自定义，是一个普通的 JavaScript 对象

## 区别

- props 是传入组件的参数，state 是用户自定义的对象
- props 是不可修改的，
- state 在组件内部创建，一般在 constructor 中初始化 state
- state 是多变的，可修改的，每次 setState 都是异步更新的
