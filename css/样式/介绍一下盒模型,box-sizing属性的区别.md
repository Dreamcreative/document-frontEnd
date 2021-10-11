# 介绍一下盒模型,box-sizing 属性的区别

## 标准盒模型

> 标准盒模型包括 margin 、border、padding、content

> content 部分不包含其他部分

![标准盒模型](/images/标准盒模型.png)

## IE 盒模型

> IE 盒模型包括 margin、border、padding、content

> content 部分包含 border+padding+content

![IE盒模型](/images/IE盒模型.png)

## box-sizing

1. content-box：默认值，表示使用标准盒模型，内容区域为 content

2. border-box：表示使用 IE 盒模型，内容区域为 border+padding+content

## 参考

- [谈谈你对 CSS 盒模型的认识](https://segmentfault.com/a/1190000015235886)
