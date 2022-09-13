# CORS

- `跨源资源共享`：允许浏览器向跨源服务器，发送`XMLHttpRequest`请求，从而克服了 AJAX 只能同源使用的限制

## 简单请求

- 请求方法为以下三种方法

  - GET
  - POST
  - HEAD

- HTTP 的头信息不超出以下几种字段

  - Accept
  - Accept-Language
  - Content-Language
  - Last-Event-ID
  - Content-Type:只限于三个值`application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain`

- 这样划分的原因是，表单在历史上一直可以跨域发出请求。简单请求就是表单请求，浏览器沿袭了传统的处理方式，不把行为复杂化

## 非简单请求

> 除了`简单请求`的其他请求都是`非简单请求`，`非简单请求`会在发起真正的请求前，先发送一个`预检请求 OPTIONS`,向服务器询问，当前网页所在的域名是否在服务器的许可名单中

### 预检请求

> 头字段

- Origin:请求来自那个源
- Access-Control-Request-Method:浏览器的`CORS`支持那些请求方法
- Access-Control-Request-Headers: 浏览器 `CORS`请求会额外发送的头信息字段

### 预检请求的回应

> 包含头字段

- Access-Control-Allow-Origin：允许那些域名进行跨域请求
- Access-Control-Allow-Methods：表明服务器支持的所有跨域请求方法
- Access-Control-Allow-Headers：表明服务器支持的所有头信息字段
- Access-Control-Allow-Credentials：是否需要发送 cookie
- Access-Control-Max-Age: 预检请求的有效期，单位秒。当下一次非简单请求时，如果还在有效期内，不用再次发送预检请求

## CORS 与 JSONP 比较

- CORS 与 JSONP 作用相同，都是用来进行跨域请求，但是 CORS 功能更强大
- JSONP 只支持`GET`请求，CORS 支持所有类型的 HTTP 请求。
- JSONP 的优势在与支持老的浏览器

## 参考

- [跨域资源共享 CORS 详解](https://www.ruanyifeng.com/blog/2016/04/cors.html)
