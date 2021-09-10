# web 安全

## XSS ( cross site scripting ) 跨站脚本攻击

### 非持久型 XSS (反射型 XSS )

> 一次性攻击: 打开一段带有恶意脚本代码的 URL,当 URL 被打开时，恶意代码会被 HTML **解析** **执行**

#### 防范

    1. 前端渲染的时候对任何字段都进行转义编码
    2. 不要使用eval()、new Function()、document.write()等可执行字符串的方法
    3. 不用用URL上获取数据直接渲染

### 持久型 XSS (存储型 XSS)

> 将恶意代码通过表单提交等交互功能提交到数据库进行存储
> 当用户请求到这条数据后，恶意代码在浏览器进行解析、执行，从而拿到用户的隐私数据

#### 防范

1. CSP(建立白名单)

> 设置 HTTP header 中的 Content-Security-Policy

    1. 只允许加载本站资源 Content-Security-Policy: default-src 'self'
    2. 只允许加载HTTPS 协议图片 Content-Security-Policy: img-src

3. 允许加载任何来源资源 Content-Security-Policy: child-src

> 设置 meta 标签方式 `<meta http-equiv="Content-Security-Policy">`

    1. 对用户输入的内容进行转义存储
    2. 设置cookie的http-only 属性， 只允许 服务器使用 cookie

## CSRF(cross site request forgery) 跨站请求伪造

### 完成 CSRF 攻击的前提

    1. 用户已经登录了站点 A ,并在本地存储了 cookie
    2. 用户在没有登出站点 A 的情况下， 访问了危险站点 B
    3. 站点A没有做任何 CSRF 防御

### 防范

    1. 不允许 get 请求对数据做修改
    2. 在 cookie 中添加 httpOnly ,cookie只允许服务器操作
    3. 请求时，附带验证信息，比如验证码或者 tooken
    4. 在 cookie 信息中添加 SameSite 属性，禁止其他站点使用 cookie

## 点击劫持

> 点击劫持是一种视觉欺骗的攻击手段。攻击者将需要攻击的网站通过 iframe 嵌套的方式嵌入自己的网站中，并将 iframe 设置为透明，在页面中通过一个按钮，诱导用户点击

### 防范

1. X-FRAME-OPTIONS: 是一个 HTTP 请求头，

有三个值可选

    1. DENY: 表示页面不允许通过 iframe 的方式展示
    2. SAMEORIGIN: 表示页面可以在相同域名下通过 iframe 的方式展示
    3. ALLOW-FROM: 表示页面可以在指定来源的 iframe 中展示

2. javascript 防御

> 对于某些远古浏览器来说，并不支持 X-FRAME-OPTIONS 请求头的方式。那我们只能通过 JavaScript 的方式来防范

```
// 作用: 通过 iframe 的方式加载页面时，攻击者的页面直接不显示所有内容

<head>
  <style id="click-jack">
    html {
      display: none !important;
    }
  </style>
</head>
<body>
  <script>
    if (self == top) {
      var style = document.getElementById('click-jack')
      document.body.removeChild(style)
    } else {
      top.location = self.location
    }
  </script>
</body>

```

## SQL 注入

> 服务器在查询操作时，直接使用了用户输入的内容而没有做任何处理，使得 SQL 直接执行了这段脚本

### 防范

1. 严格设置 web 应用的数据库权限
2. 后端代码检查输入的数据是否符合规范
3. 对进入数据库的特殊字符进行转义处理
4. 所有查询语句建议使用数据库提供的参数化查询接口

## OS 命令攻击

## DOS/DDOS

#### DOS **拒绝服务攻击** 攻击的服务器客户端不多

#### DDOS **分布式拒绝服务攻击** 使用大量的肉鸡客户端

> 分为资源消耗型、带宽占用型

1. 资源消耗型

> 短时间内向服务器发送大量半连接请求，消耗服务器资源，使得服务器资源无法释放，严重时可能使服务器宕机

2. 带宽占用型

> 短时间内向服务器发送大量超出其处理能力的请求，从而是服务器无法为正常用户服务

## 中间人攻击

> 简单来讲，就是黑客偷偷躲在通信双方之间，窃听或串改通信信息

### HTTPS

> HTTPS 协议之所以安全，是因为 HTTPS 协议会对数据进行加密。HTTPS 协议在内容传输上使用对称加密，在证书验证上使用非对称加密。当发起请求时，中间人服务器拿到了用户发送的信息，再通过有效的证书验证后，拿到了用户的信息，再将信息进行转发。而拿到了信息后就可以做很多事情了。

## 参考资料

- [吃透浏览器安全（同源限制/XSS/CSRF/中间人攻击）](https://juejin.cn/post/6991888178890145828#heading-9)
- [前端安全防范知识 XSS/CSRF/点击劫持/中间人攻击及防护方案](https://juejin.cn/post/6844904020562165773#heading-12)
- [中间人攻击](https://juejin.cn/post/6844904065227292685#heading-0)
