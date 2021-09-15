# position 定位

1. static 默认定位

> 指元素使用正常的布局行为，元素属于正常的文档流
> 设置 top/left/right/bottom 无效

2. relative 相对定位

> 相对于自身定位
> 元素先被放置在原位，

3. absolute 绝对定位

> 相对于最近的非 `position: static;` 的祖先元素定位
> 元素脱离文档流，并不为元素预留空间。相对于元素最近的非 static 的祖先元素的偏移，来确定位置

4. fixed 固定定位

> 相对于屏幕视口的位置
> 元素脱离文档流，并不为元素预留空间。页面滚动时，指定元素不会发生滚动

5. sticky 粘性定位 (**兼容性不好**) ([demo](https://github.com/Dreamcreative/document-frontEnd/blob/master/css/%E6%A0%B7%E5%BC%8F/position.html))

> 被认为是 relative 相对定位和 fixed 绝对定位的混合。元素在跨越特定阈值时为相对定位，之后是固定定位

> > 规则

    1. 当页面滚动时，父元素部分离开视口时，只要 sticky 元素的距离达到，relative 定位切换为 fixed 定位
    2. 当父元素完全离开视口时，fixed 定位切换为 relative定位

> > 兼容性：IE 6-11 不兼容，低版本 Edge/Firfox/Chrome/Safari/Opera 不兼容

## 参考

- [position MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/position)
- [position 阮一峰](http://www.ruanyifeng.com/blog/2019/11/css-position.html)
