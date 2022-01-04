# JSONP

> 利用 `<script>` 标签没有跨域限制的`漏洞`,来达到与第三方通信的目的。并提供一个回调函数来接收数据

  * 通过手动创建一个 `<script>`标签，设置需要通信的第三方地址，添加参数和接收数据的方法

```js
function callback(data) {
// 接收到的数据
  console.log(data)
}
const script = document.createElement('script');
script.src= "www.example.com?params=1&callback=callback";
document.body.appendChild(script);
```

## 优点

  * 对于老的浏览器兼容性好，针对新版本浏览器，建议使用 `CORS` 方法

## 缺点

  * 没有处理错误的方法，一旦回调函数调用失败，浏览器会进行静默处理
  * 只能接受`GET`的请求方式
  * JSONP 不支持用`async: false`的方法设置同步
