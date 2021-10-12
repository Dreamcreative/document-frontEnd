# CSS 布局各种 FC (BFC、IFC、FFC、GFC)

## 三种文档流的定位方案

1. 常规流

   1. 盒子一个接一个排列
   2. 在块级格式化上下文中，他们竖着排列
   3. 在行内格式化上下文中，他们横着排列
   4. 当 position 为 static/relative，并且 float 为 none 时，会触发常规流
   5. 对于静态定位，position：static，盒的位置是常规流布局里的位置
   6. 对于相对定位，position：relative，盒的偏移由 top/left/right/bottom 属性定义。即使有偏移，仍然保留原有的位置，其他常规流不能占用这个位置

2. 浮动

   1. 左浮动尽可能靠左靠上，有浮动尽可能靠右靠上
   2. 导致常规流环绕在他们的周边，除非设置 `clear: both` 属性
   3. 浮动元素不会影响块级元素的布局
   4. 浮动元素会影响行内元素的布局，使其环绕在自己周围，撑大父级元素，间接影响块级元素的布局
   5. ...

3. 绝对定位

   1. 盒子从常规流中被移除，不影响常规流的布局
   2. 它的定位相对于它的父级元素最近的一个 relative/fixed/absolute 。如果没有，则相对于 html
   3. 如果元素的 position：absolute/fixed，那么它是绝对定位元素

## FC

> `Formating Context` 格式化上下文，指页面中一个渲染区域，拥有一套渲染规则，它决定了其子元素如何定位，以及其他元素的相互关系和作用

## BFC (块格式化上下文)

### BFC 基本概念

> block formating context 块格式化上下文，一个独立的块级渲染区域，该区域拥有一套渲染规格来约束块级盒子的布局，与该区域外部无关

### 如何创建 BFC

1. html 根元素
2. 浮动元素：float 除了 none 以外的值
3. 绝对定位元素：position：absolute/fixed
4. overflow 除了 visible 以外的值(hidden/auto/scroll)
5. display 为 inline-block/table-cell/table-caption
6. display：flex/inline-flex 元素的直接子元素
7. display：grid/inline-grid 元素的直接子元素
8. ...

### BFC 使用场景

1. 阻止元素被浮动元素覆盖

> 一个正常文档流的 block 元素可能被一个 float 元素覆盖，挤占正常文档流，因此可以设置一个元素的 float、display、position 等方式触发 BFC，以阻止被浮动盒子覆盖

2. 可以包含浮动元素

> 通过改变包含浮动子元素的父盒子的属性值，触发 BFC ,以此来包含子元素的浮动元素

> `注意`：这里触发 BFC 并不能阻止其他形式的脱离文档流的元素覆盖正常流元素

3. 阻止因为浏览器由于四舍五入造成的多列布局换行的情况

> 有时候因为多列布局采用小数点位的 width 导致浏览器因为四舍五入造成的换行的情况，可以在最后一列触发 BFC 的形式来阻止换行的发生

4. 阻止相邻元素的 margin 合并

> 属于同一个 BFC 的两个相邻子元素的上下 margin 会发生重叠。所以当两个相邻子元素分属不同的 BFC 时，可以阻止 margin 重叠。这里给人一个相邻盒子的外面包一个 div，生成一个 BFC 就可以使两个盒子分属于两个不同的 BFC ,解决 上下 margin 重叠的现象

## IFC (行内格式化上下文)

> IFC 的 `line box`(线框) 的高度由其包含行内元素中最高的实际高度计算而来(不受竖直方向的 padding/margin 影响)

### IFC 的特性

1. IFC 中的 `line box` 一般左右都贴紧整个 IFC，但是会因为 float 浮动元素而扰乱。float 元素会位于 IFC 与 line box 之间，使得 line box 宽度缩短

2. IFC 中是不可能有块级元素的，当插入块级元素时，会产生两个匿名块分割开，即产生两个 IFC，每个 IFC 对外表示为块级元素，与 div 垂直排列

### IFC 的应用

1. 水平居中：当一个元素要在容器中水平居中是，设置其为 inline-block 则会在外层产生 IFC，通过 `text-align:center` 则可以使其水平居中
2. 垂直居中：创建一个 IFC，用其中一个元素撑开父元素的高度，然后设置其 `vertical-align：middle` ,其他行内元素则可以在此父元素下垂直居中

## GFC (网格布局格式化上下文)

> 当一个元素设置 `display：grid` 时，此元素就会获得一个独立的渲染区域

## FFC (自适应格式化上下文)

> 当一个元素设置 `diplay:flex`时，此元素会成为一个伸缩容器，此容器内的子元素都是伸缩项目

## FFC 与 BFC 的区别

1. FFC 不支持 `::first-line`和`::first-letter`这两种伪元素
2. vertical-align 、float、clear 属性 对 FFC 中的子元素无效
3. grid 布局中的 (column-\*) 在 FFC 中无效
4. FFC 下的子元素不会继承父容器的宽

## 参考

- [MDN-BFC](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Block_formatting_context)
- [CSS 中重要的 BFC](https://segmentfault.com/a/1190000013023485)
- [css 布局的各种 FC 简单介绍：BFC，IFC，GFC，FFC
  ](https://segmentfault.com/a/1190000014886753)
