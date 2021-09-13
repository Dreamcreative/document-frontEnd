# inherit+initial+unset+三者的区别

> css 所有属性都可以设置这三个值

1. initial 最初，ie6-11 不兼容，opera 大部分不兼容

> 用于设置 css 的默认值。IE 不支持

2. unset 不设置，ie6-11 不兼容，其他浏览器低版本不兼容

> 是关键字 initial 和 inherit 的组合

    1. 该属性为默认继承属性，等同于 inherit
    2. 该属性为非继承属性，等同于 initial

3. inherit 继承，ie6-7 不兼容，opera12 不兼容，其他浏览器兼容

> 继承父级元素的值

## 参考

- [css inherit、initial、unset](https://www.zhangxinxu.com/wordpress/2020/01/css-initial-unset/)
