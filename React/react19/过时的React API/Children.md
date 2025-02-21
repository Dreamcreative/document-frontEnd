# Children

使用 Children 的场景并不常见，使用它可能会削弱代码的健壮性

> Children 允许你处理和转化作为 `children` 的 JSX

1. Children.count(children): 获取 children 的节点数量，空节点（null, undefined 以及布尔值），字符串，数字，和 React 元素都会被统计为一个节点
2. Children.map(children, fn, thisArg?): 可以对 children 的每个节点进行映射或转换
3. Children.forEach(children, fn, thisArg?): 可以为 children 的每个节点执行一段代码
4. Children.toArray(children): 通过 children 创建一个数组。空节点（null, undefined, 以及布尔值）将在返回的数组中被忽略
5. Children.only(children): 判断 children 是否是一个 React 元素。是：返回这个元素，否：抛出一个异常
