# display: none 和 visibility: hidden的区别

> 这两个属性都是让元素隐藏，不可见

> 区别

  1. 渲染树中

    * `display: none`: 会让元素完全从渲染树中消失，渲染时不占据任何空间
    * `visibility: hidden`: 不会让元素从渲染树中消失，元素还是会占据空间，只是内容不可见

  2. 是否是继承属性

    * `display: none`: 非继承属性，子孙节点会随父节点从渲染树消失，通过修改子孙节点的属性也无法显示
    * `visibility: hidden`: 继承属性，子孙节点消失是由于继承了 `hidden`,通过设置 `visibility: visible`可以让子孙节点显示
  
  3. 重绘重排

    * `display: none`: 修改常规文档流中元素的 display 通常会造成文档的重排
    * `visibility: hidden`: 修改常规文档里中元素的 visibility 会造成文档的重绘

  4. 使用读屏器

    * `display: none`的内容不会被读取
    * `visibility: hidden`的内容会被读取
