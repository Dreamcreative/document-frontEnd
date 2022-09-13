# margin 和 padding 分别在什么情况下使用

## 使用 margin 的情况

1. 需要在 border 外侧添加空白时，
2. 空白处不需要背景色时
3. 上下相邻的两个盒子之间的空白需要相互抵消时，（margin 重叠）
4. 需要使用负值对页面布局时（margin 可以取负值，padding 不能取负值）

## 使用 padding 的情况

1. 需要在 border 内测添加空白
2. 空白处需要背景色时

> margin 主要是设置元素与元素之间的距离，而 padding 主要是设置 content 与 border 之间的距离

> 在盒模型中，标准盒模型 元素内容的宽高 只是 `content`。而怪异盒模型中，元素内容的宽高，包括了 `content+padding+border`
