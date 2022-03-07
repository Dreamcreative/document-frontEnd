# react 三种模式

1. legacy：使用`ReactDOM.render(<App />, container)`,默认模式，不支持新功能
2. blocking：使用`ReactDOM.createBlockingRoot(rootNode).render(<App />)`，正在实验中，仅提供了 `concurrent`模式的小部分功能，作为迁移到`concurrent`模式的第一个步骤
3. concurrent：使用`ReactDOM.createRoot(rootNode).render(<App />)`,这个模式开启了react 所有的功能
