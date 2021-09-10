# Grid网格布局

## 概述

### 与Flex弹性布局的区别

#### FLex是轴线布局(一维布局)，Grid是网格布局(二维布局)"行""列"

### 容器/项目

#### 父节点称为容器(container)，自己点称为项目(item)

### 行/列

#### 水平区域为"行"(row)，垂直区域为"列"(column) 横行竖列

## 容器属性

### display

#### grid

##### 默认情况 ，容器元素都是块元素

#### inline-grid

##### 行内元素

#### 注意

##### 设置为网格布局之后, 容器 项目的
float/display:inline-block/display:table-cell/vertical-align/column-*,
属性都将失效

### grid-template-rows/grid-template-columns

#### 定义每一行的行高/定义每一列的列宽

#### repeat()方法

##### 简化当网格很多时，重复写同样的值

##### grid-template-rows: 33.33% 33.33% 33.33%; 
===
 grid-template-rows: repeat(3, 33.33%);

##### grid-template-columns: 33.33% 33.33% 33.33%;
===
grid-template-columns: repeat(3, 33.33%);

##### 接受两个参数，第一个参数是重复的次数
（上例是3），第二个参数是所要重复的值。
gird-template-columns: repeat(2 , 100px 50px 20px);

#### auto-fill关键字

##### 自动填充内容，一直到容器无法容纳

###### grid-template-columns: repeat(auto-fill, 100px);

#### fr (fraction) 片段

##### grid-template-columns: 1fr 1fr;
表示 两列的宽度相同

##### grid-template-columns: 150px 1fr 2fr;
表示 第一列宽度固定150px 2列宽度是3列的一半

#### minmax() 方法，最小值和最大值

##### 产生一个范围,表示行/列的高度/宽度在这个范围内

##### grid-template-columns: 1fr 1fr minmax(100px, 1fr);

#### auto关键字

##### 由浏览器自己决定

#### 网格线的名称(方便以后的引用)

##### grid-template-columns: [c1] 100px [c2] 100px [c3] auto [c4];
 grid-template-rows: [r1] 100px [r2] 100px [r3] auto [r4];

### grid-row-gap(行间距)
grid-column-gap(列间距)
grid-gap(行间距/列间距的缩写)

#### grid-row-gap: 20px;  
grid-column-gap: 20px;
grid-gap:20px 20px

#### 最新标准 删除grid-
row-gap: 20px; 
column-gap: 20px;
gap:20px 20px

### grid-template-areas 指定区域，一个区域由单个或多个网格组成

#### grid-template-areas: 'a b c'                       'd e f'                       'g h i';

#### grid-template-areas: 'a a a'                     'b b b'                     'c c c';

#### 某些区域不需要利用，则使用"点"(.)表示
grid-template-areas: 'a . c'                     'd . f'                     'g . i';

#### 注意

##### 区域的命名会影响网格线
区域的
   起始网格线自动命名为 区域名-start
   终止网格线自动命名为 区域名-end

### grid-auto-flow  
划分网格后，容器的子元素会按顺序自动放置每一个网格

#### 分支主题

#### row （默认）先行后列

#### column 先列后行

#### row dense 某些项目指定后，剩余项目"先行后列"排列，尽量不出现空格

#### column dense 某些项目指定后，剩余项目"先列后行"排列，尽量不出现空格

### justify-items 单元格水平位置(左中右)
align-items  单元格垂直位置(上中下)
place-items  单元格水平/垂直位置的简写方式

#### start  起始对对齐

#### end 结束对齐

#### center 居中

#### stretch(默认值) 拉伸,占满单元格整个宽度

### justify-content 内容区域在容器的水平方向对齐方式
align-content 内容区域在容器的垂直方向对齐方式
place-content 水平方向/垂直方向对齐方式的简写

#### start 容器起始边框对齐

#### end 容器终止边框对齐

#### center 容器内部居中

#### stretch 项目没有指定大小时，拉伸占满整个容器

#### space-around 项目两侧间隔相等

#### space-between 项目与项目之间间隔相等，项目与边框之间没有间隔

#### space-evenly 项目与项目，项目与边框，间隔都相等

### grid-auto-columns 
grid-auto-rows

#### 当项目出现在网格外部，浏览器会自动创建多余的网格，以便放置项目，
 grid-auto-columns/grid-auto-rows 分别用来设置自动创建的网格的列宽/行高

### grid-template 属性
grid 属性

#### grid-template 
grid-template-columns/grid-template-rows/grid-template-areas 的合并简写

#### grid属性
grid-template-rows/grid-template-columns/grid-template-areas/ grid-auto-rows/grid-auto-columns/grid-auto-flow 的合并简写

## 项目属性

### 根据网格线，指定项目的位置
grid-row-start   上边框所在的水平网格线
grid-row-end 下边框所在的水平网格线
grid-column-start 左边框所在的垂直网格线
grid-column-end 右边框所在的垂直网格线

#### 指定网格线
grid-column-start: 1; 
 grid-column-end: 3; 
 grid-row-start: 2;
 grid-row-end: 4;

#### 指定区域
grid-column-start: header-start; 
 grid-column-end: header-end;

#### span 关键字
项目跨域几个网格
grid-column-start: span 2;

#### 简写方式
grid-column 属性
 grid-column: <start-line> / <end-line>;  
grid-row 属性
grid-row: <start-line> / <end-line>;

##### .item-1 { 
 grid-column: 1 / 3; 
 grid-row: 1 / 2;
}
/* 等同于 */
.item-1 { 
 grid-column-start: 1;
 grid-column-end: 3; 
 grid-row-start: 1; 
 grid-row-end: 2;
}

### 直接指定项目所在区域
grid-area
前提 grid-template-area 定义了区域

#### grid-area: e ;

#### 作为
grid-row-start、grid-column-start、grid-row-end、grid-column-end的简写
grid-area: <row-start> / <column-start> / <row-end> / <column-end>;
grid-area: 1 / 1 / 3 / 3;

### 项目自身内容的对齐方式
justify-self 属性，水平方向排列
align-self 属性，垂直方向排列
place-self 属性  简写 place-self: <align-self> <justify-self>;

#### 默认值 stretch 填满单元格

#### start 单元格起始

#### end 单元格结束

#### center 单元格居中
