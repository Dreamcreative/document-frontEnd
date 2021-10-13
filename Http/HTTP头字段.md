# HTTP 头字段

## 通用头子段 - 请求头/响应头都会使用的头字段

1. Cache-Control：指定请求和响应的缓存机制
2. Connection：逐调首部、连接的管理
3. Date：创建报文的时间日期
4. Pragma: 报文指令
5. Trailer：报文末端的首部一览
6. Transfer-Encodine：指定报文传输主体的编码方式
7. Upgrade：升级为其他协议
8. Via：代理服务器的相关信息
9. Warning：错误通知

## 请求头字段 - 客户端想服务器发送报文时使用的头字段

1. Accept：客户端可以处理的媒体类型
2. Accept-Charset：客户端支持的字符集
3. Accept-Language：客户端支持的语言
4. Authorization：web 认证信息
5. Except：期待服务器的特定行为
6. From：用户的电子优先地址
7. Host：请求资源的主机地址
8. If-Match：比较实体标记（Etag）
9. If-Modified-Since：比较资源的更新时间
10. If-None-Match：比较实体标记
11. Range：实体的字节范围请求
12. Referer：该请求的来源方
13. User-Agent：Http 客户端信息
14. Content-Length：请求的内容长度
15. Content-Type: 请求的与实体对应的 MIME 信息
16. 。。。。。。

## 响应头字段 - 服务器向客户端返回响应报文时使用的头字段

1. Accept-Range：是否接收字节的范围请求
2. Age：资源创建经过的时间
3. Etag：通过资源内容生成的字符串
4. Location：令客户端重定向至指定 UPI
5. Server：HTTP 服务器信息
6. Vary：代理服务器信息

## 实体首部字段 - 针对请求报文和响应报文的实体部分使用的头字段

1. Allow：资源可支持的 HTTP 请求方法
2. Content-Encoding：实体主体适用的编码方式
3. Content-Language：实体主体的语言
4. Content-Length：实体主体大小（单位：字节）
5. Content-Type：实体主体的媒体类型
6. Last-Modified：资源的最后修改时间

## 参考

- [HTTP 首部字段详细介绍](https://www.cnblogs.com/jycboy/p/http_head.html)
- [MDN HTTP Headers](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers)
