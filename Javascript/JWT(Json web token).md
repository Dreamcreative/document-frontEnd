# JWT(Json web token)

> JWT：JSON 网络令牌，是一种`提议的互联网标准`。用于创建具有可选`签名`或可选`加密`的数据，其`有效负载-payload`包含 JSON 声明一些声明，令牌使用私有密钥或`公有/私有密钥`进行签名

> JWT 主要用于用户登录验证，认证流程：

- 用户输入用户名/登录密码，服务器认证成功后，会返回客户端一个 JWT
- 客户端将 token 保存到本地（localStorage、cookie）
- 当用户希望访问一个受保护的路由或资源的时候，需要将 JWT 通过请求头 Authorization 字段发送给服务端，服务端如果验证通过，会允许用户的请求行为

> 当跨域请求时，可以将 JWT 放在 POST 请求的数据体中

## 结构

- 标题`<Header>`：标识用于生成签名的算法

```js
{
  // HS256 表示此令牌是使用 `HMAC-SHA256`签名的
  "alg":"HS256",
  "type":"JWT"
}
```

- 有效载荷`<Payload>`：包含一组声明，JWT 规范定义了七个注册声明名称

```js
{
  "loggedInAs" ： "admin" ，
  "iat" ： 1422779638
}
```

> 标准字段

    * iss: 标识颁发 JWT 的委托人
    * sub: 标识 JWT 的主题
    * aud: 标识 JWT 的目标接收者
    * exp: 标识 JWT 的过期时间
    * nbf: 标识开始接受 JWT 进行处理的事件
    * iat: 标识 JWT 的发布时间
    * jti: 令牌的唯一标识符（区分大小写）

- 签名`<Signature>`：安全地验证令牌。签名是通过使用 `Base64url编码`对`标头`和`有效载荷`进行编码，并将两者用`.`链接在一起计算

```js
HMAC_SHA256(secret, base64urlEncoding(header) + '.' + base64urlEncoding(payload));
```

## JWT 最终生成格式

```js
const  token  =  base64urlEncoding ( header )  +  '.'  +  base64urlEncoding （有效载荷） +  '.'  +  base64urlEncoding （签名）
console.log(token) // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dnZWJbkFzIjoiYWRtaW4iLCJpYXQiOjE0MjI3Nzk2Mzh9.gzSraSYS8EXBxLN_oWnFSRgCzyumJmCSHI
```

## 漏洞

- 如果项目要求允许 JWT 到期之前回话失效，服务就不能再信任令牌单独的令牌断言。要验证存储在令牌中的会话未被撤销，必须对照数据存储检查令牌断言。这使得令牌不再是无状态的，破坏了 JWT 的主要优势

## 参考

- [JSON 网络令牌](https://en.wikipedia.org/wiki/JSON_Web_Token)
