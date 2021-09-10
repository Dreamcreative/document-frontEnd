# Flex(弹性布局)

> 任何容器都可以使用 flex 布局。一旦使用 flex 布局后，子元素的 float、clear 和 vertical-align 等属性都将失效。行内元素也可以使用 flex 布局

## 概念

1. 采用 flex 布局的元素，称为 flex 容器(flex container).并且它的所有子元素自动称为容器成员: flex 项目(flex item)
2. 默认有两根轴：水平的主轴(main axis)/垂直的交叉轴(cross axis)。主轴起点叫(main start)、终点叫(main end)。交叉轴起点叫(cross start)、终点叫(cross end)
3. 项目默认沿主轴排列，单个项目占据的主轴空间叫(main size)也就是项目的宽,占据的交叉轴空间叫(cross size)也就是高

## 容器属性

1. flex-direction

> > 决定主轴方向

    1. row 默认值
    默认值:主轴为水平方向，起点在左端

    2. row-reverse
    主轴为水平方向,起点在右端

    3. column
    主轴在垂直方向,起点在上沿

    4. column-reverse
    主轴为垂直方向，起点在下沿

2. flex-wrap

> > 定义项目过多时如何换行

    1. nowrap 默认值
    默认： 不换行

    2. wrap
    换行，第一行在上方

    3. wrap-reverse
    换行，第一行在下方

3. flex-flow

> > flex-flow 是 flex-direction 属性和 flex-wrap 属性的简写形式，默认值 row nowrap (水平方向 不分行)

4.  justify-content

> > 项目在主轴方向的对齐方式

    1. flex-start 默认值
    左对齐

    2. flex-end
    右对齐

    3. center
    居中对齐

    4. space-between
    两端对齐，项目间的间隔相等

    5. space-around
    每个项目两端的间隔相等.所以项目之间的间隔比项目与边框之间的距离大一倍

5. align-items

> > 定义项目在交叉轴方向的对齐方式

    1. flex-start
    交叉轴的起点对齐(上沿对齐)

    2. flex-end
    交叉轴的终点对齐(下沿对齐)

    3. center
    交叉轴的中点对齐

    4. baseline
    项目第一行文字的基线对齐

    5. stretch 默认值
    如果项目未设置高度或设为auto，将占满整个容器的高度

6. align-content

> > 定义了多根轴线的对齐方式。如果项目只有一根轴线，则不起作用

    1. flex-start
    与交叉轴的起点对齐

    2. flex-end
    与交叉轴的终点对齐

    3. center
    与交叉轴的中点对齐

    4. space-between
    与交叉轴两端对齐，轴线的间隔平均分布

    5. space-around
    每根轴线两侧间隔相等。所以轴线之间的间隔比轴线与边框之间的间隔大一倍

    6. stretch 默认值
    轴线占满整个交叉轴

## 项目( Flex 子元素 flex-item )属性

1. order

> > `<number>` 不支持负数。
> > 默认值：0 ;
> > 定义项目的排列顺序。值越小，排列越靠前

2. flex-grow

> > `<number>` 不支持负数。
> > 定义项目的放大比例，默认 0。即 如果存在剩余空间，也不放大。
> > 将空间等比分配，如果某个项目的值为 2，则会比其他为 1 的项目占据的空间大一倍。
> > 当父元素的宽度大于所以子项目宽度的总和时，设置了 flex-grow 属性的子项目会将父元素超出宽度按照比例进行放大。

3. flex-shrink

> > `<number>` 不支持负数。
> > 定义了项目的缩小比例，默认为 1。就是当空间不足时，项目会缩小。
> > 如果所以项目的 flex-shrink 都为 1。当空间不足时，所有项目都会等比缩小。
> > 当父元素的宽度小于子项目宽度之和时，设置了 flex-shrink 属性的子项目会按照比例进行缩小。

4. flex-basis

> > 默认值：auto .即设置项目的初始宽度
> > 定义了在分配多余空间之前，项目占据的主轴空间(main size)。浏览器根据这个属性，计算主轴是否有多余空间。
> > flex-basis，basis 英文意思是<主要成分>,表示当 flex-basis 与 width 同时存在时， width 属性会被覆盖

5. flex

> > 是 flex-grow、flex-shrink、flex-basis 的简写。
> > 默认值:`0 1 auto`。
> > 建议使用 flex ,而不是单独使用 flex-grow、flex-shrink、flex-basis，因为浏览器会推算相关值

    1. auto
    值为 `1 1 auto`

    2. none
    值为 `0 0 auto`

    3. 1
    flex-grow     1 放大比例
    flex-shrink   1 缩小比例
    flex-basis    0	基础宽度

6.  align-self

    > > 属性值除了 auto ,其他与 align-items 属性完全一致。
    > > 允许单个项目与其他项目具有不一样的对齐方式,可以覆盖 align-items 属性。
    > > 默认值是 auto ，表示继承父元素的 align-items 属性。如果没有父元素，则等同于 stretch。

        1. auto 默认值

        2. flex-start
        左对齐

        3. flex-end
        右对齐

        4. center
        居中对齐

        5. baseline
        项目第一行文字的基线对齐

        6. stretch
        轴线占满整个交叉轴

## 参考

- [ Flex 弹性布局](https://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)
