# Flex(弹性布局)

任何容器都可以指定为flex布局
行内元素也可以使用flex布局
设置为flex布局之后，子元素的float、clear和vertical-align属性将失效

## 概念

1. 采用flex布局的元素，称为flex容器(flex container).并且它的所有子元素自动称为容器成员:flex项目(flex item)
2. 默认有两根轴：水平的主轴(main axis)/垂直的交叉轴(cross axis)。主轴起点叫(main start)、终点叫(main end)。交叉轴起点叫(cross start)、终点叫(cross end)
3. 项目默认沿主轴排列，单个项目占据的主轴空间叫(main size)也就是项目的宽,占据的交叉轴空间叫(cross size)也就是高

## 容器属性

### flex-direction

决定主轴方向

#### row 默认值

默认值:主轴为水平方向，起点在左端

#### row-reverse

主轴为水平方向,起点在右端

#### column

主轴在垂直方向,起点在上沿

#### column-reverse

主轴为垂直方向，起点在下沿

### flex-wrap

定义项目过多时如何换行


#### nowrap 默认值

默认： 不换行

#### wrap

换行，第一行在上方

#### wrap-reverse

换行，第一行在下方

### flex-flow

flex-flow是 flex-direction属性和flex-wrap属性的简写形式，默认值 row nowrap(水平方向 不分行)

### justify-content

项目在主轴方向的对齐方式

#### flex-start 默认值

左对齐

#### flex-end

右对齐

#### center

居中对齐

#### space-between

两端对齐，项目间的间隔相等

#### space-around

每个项目两端的间隔相等.所以项目之间的间隔比项目与边框之间的距离大一倍

### align-items

定义项目在垂直方向的对齐方式

#### flex-start

交叉轴的起点对齐(上沿对齐)

#### flex-end

交叉轴的终点对齐(下沿对齐)

#### center

交叉轴的中点对齐

#### baseline

项目第一行文字的基线对齐

#### stretch 默认值

如果项目未设置高度或设为auto，将沾满整个容器的高度

### align-content

定义了多根轴线的对齐方式。如果项目只有一根轴线，则不起作用


#### flex-start

与交叉轴的起点对齐

#### flex-end

与交叉轴的终点对齐

#### center

与交叉轴的中点对齐

#### space-between

与交叉轴两端对齐，轴线的间隔平均分布

#### space-around

每根轴线两侧间隔相等。所以轴线之间的间隔比轴线与边框之间的间隔大一倍

#### stretch 默认值

轴线沾满整个交叉轴

## 项目(Flex子元素flex-item)属性

### order

<number>不支持负数
默认值：0 ; 
定义项目的排列顺序。值越小，排列越靠前

### flex-grow

  <number>不支持负数
  定义项目的放大比例，默认0.即 如果存在剩余空间，也不放大
  将空间等比分配，如果某个项目的值为2，则会比其他为1的项目占据的空间大一倍
  当父元素的宽度大于所以子项目宽度的总和时，设置了flex-grow属性的子项目会将父元素超出宽度按照比例进行放大

### flex-shrink

<number>不支持负数
  定义了项目的缩小比例，默认为1.就是当空间不足时，项目会缩小
  如果所以项目的flex-shrink都为1，当空间不足时，所有项目都会等比缩小。
  当父元素的宽度小于子项目宽度之和时，设置了flex-shrink属性的子项目会按照比例进行缩小

### flex-basis

默认值：auto.即设置项目的初始宽度
定义了在分配多余空间之前，项目占据的主轴空间(main size)。浏览器根据这个属性，计算主轴是否有多余空间
flex-basis，basis英文意思是<主要成分>,表示当flex-basis与width同时存在时，width属性会被覆盖

### flex

是flex-grow、flex-shrink、flex-basis的简写
默认值: 0 1 auto
建议使用flex,而不是单独使用flex-grow、flex-shrink、flex-basis，因为浏览器会推算相关值

#### auto

值为 1 1 auto

#### none

值为 0 0 auto

#### 1

flex-grow     1 放大比例
flex-shrink   1 缩小比例
flex-basis    0	基础宽度

### align-self
属性值除了auto,其他与align-items属性完全一致

允许单个项目与其他项目具有不一样的对齐方式,可以覆盖align=items属性。
默认值是auto，表示继承父元素的align-items属性。如果没有父元素，则等同于stretch

#### auto 默认值

#### flex-start

#### flex-end

#### center

#### baseline

#### stretch
