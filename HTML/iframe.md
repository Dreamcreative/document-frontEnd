# iframe 优缺点

## 优点

- 可以跨域请求其他网站，并将网站完整展示出来
- 典型系统结构可以提高代码的复用性
- 创建一个全新的独立的宿主环境，可以隔离或者访问原生接口及对象
- 模块分离，若多个页面引用同一个 iframe,则便于修改操作
- 实现广告展示的一个解决方案
- 若需要刷新 iframe,则只需要刷新框架内，不需要刷新整个页面

## 缺点

- iframe 阻塞页面加载，影响网页加载速度，iframe 加载完毕后才会触发 `window.onload` 事件，动态设置 src 可解决这个问题
- 加载了新页面，增加了 css 与 js 文件的请求，即额外增加了 HTTP 请求，增加了服务器负担
- 有时 iframe 由于页面挤占空间的原因出现滚动条，造成布局混乱
- 不利于 SEO,搜索引擎的爬虫无法解析 iframe 的页面
- 有些小型的移动设备，如手机等无法完全显示框架，兼容性较差
- iframe 与主页面是共享连接池的，若 iframe 加载时，用光了连接池，则会造成主页面加载阻塞

## 通信方式

1. 通过 `window.postMessage`
   1. postMessage 是一种安全的跨域通信方式，允许不同源的窗口间进行通信
2. 通过 `iframe` 的 `contentWindow` 属性
   1. contentWindow 可以直接访问和操作同源的 iframe 内容
3. 通过 URL 参数
   1. 可以通过 URL 参数传递数据，但是这种方法通常用于初始加载时传递数据


```js
// 1. window.postMessage

// 父页面
iframe.contentWindow.postMessage("参数",'xxx')
// 子页面
window.addEventListener("message",(event)=>{
  console.log(event.data)
})

// 2. contentWindow 父页面可以直接获取子页面的 body 内容
// 父页面
const iframeDocument = iframe.contentWindow.document
const iframeBody = iframeDocument.body

// 3. 使用 url
// 父页面
<iframe id="myIframe" src="child.html?message=你好，iframe！" width="600" height="400"></iframe>
// 子页面
const urlParams = new URLSearchParams(window.location.search);
const message = urlParams.get('message');
```

## 总结

1. postMessage: 适用于跨域通信，安全且灵活
2. contentWindow: 适用于同源页面，直接访问子页面的 document
3. url: 适用于初始加载时传递参数，不适用动态传值
