# cloneElement

cloneElement 允许使用一个元素作为初始值，创建一个新的 React 元素

## 注意

1. 克隆一个元素，`不会修改原始元素`
2. cloneElement 会使得跟踪数据流向变得困难

## 替代方案

1. 使用 props 传递属性
2. 使用 context 上下文传递属性
3. 使用 Hook 提取公共逻辑

## cloneElement(element, props, ...children)

1. element: 必须是一个有效的 React 元素，
2. props: 必须是一个对象或 null, 如果是 null,则使用 element 原先的属性，否则优先使用传入的 props 去覆盖 element 元素上相同的属性
3. 可选`...children`: 可以是任意 React 节点，传入后，会覆盖 `element.props.children`
