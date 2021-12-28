# 解决移动端1px边框问题

> 原因：在一些 `Retina 屏幕` 的机型上，移动端页面的 1px 会变得很粗，呈现出不止 1px 的效果。

1. 直接写 `0.5px`

> 可以先拿到 `window.devicePixelRatio`的值，然后把这个值通过 jsx 或者模板语法给到 css 的data中，达到这样的效果

```html
<div id="container" data-device={{window.devicePixelRatio}}></div>
```

> 然后就可以在 css 中用属性选择器来命中 devicePixelRadio 为某一个值的情况

```css
#container[data-device="2"] {
  border:0.5px solid #333
}
```

> 缺陷

  * 兼容性不行， IOS 系统需要 IOS8及以上版本，安卓系统则直接不兼容。0.5px 直接会显示 0px

2. 伪元素先放大后缩小

```css
#container[data-device ='2']{
  position: relative;
}
#container[data-device='2']::after{
  position: absolute;
  top:0;
  left:0;
  width: 200%;
  height:200%;
  content:'';
  transform: scale(0.5);
  transform-origin: left top;
  box-sizing: border-box;
  border: 1px solid #333;
}
```

3. viewport 缩放

> 这个思路就是对 meta 标签里几个关键属性处理

```js
<meta name="viewport" content="initial-scale=0.5, maximum-scale=0.5, minimum-scale=0.5, user-scalable=no">
```

> 这样针对像素比为 2 的页面，把整个页面缩放为原来的一半大小。这样，本来占用2个物理像素的 1px 样式，现在占用的就是标准的一个物理像素。

> 针对其他 DPR 值的实现

```js
const scale = 1/window.devicePixelRatio;
metaEl.setAttribute("content":`width=device-width,user-scalable=no,initial-scale=${scale},maximum-scale=${scale},minimum-scale=${scale}`)
```
> 这样虽然解决了 `1px`的问题，但是由于页面的整体缩小，导致页面的其他内容也被缩小了

4. `border-image`实现

> 准备一张符合要求的 图片

```css
.border-bottom-1px {
  border-width: 0 0 1px 0;
  -webkit-border-image: url(linenew.png) 0 0 2 0 stretch;
  border-image: url(linenew.png) 0 0 2 0 stretch;
}
```

> 优点

  * 可以设置单条、多条线框

> 缺点

  * 更换颜色和样式比较麻烦，需要替换原先的图片
  * 某些设备上会模糊

5. `background-image`实现

> 与`border-image`实现方法一样，实现准备一张图片

```css
.background-image-1px {
  background: url(../img/line.png) repeat-x left bottom;
  -webkit-background-size: 100% 1px;
  background-size: 100% 1px;
}
```

## 参考

* [解决移动端1px边框问题的几种方法](https://www.cnblogs.com/AhuntSun-blog/p/13581877.html)
* [如何解决1px问题](https://juejin.cn/post/6905539198107942919#heading-58)
