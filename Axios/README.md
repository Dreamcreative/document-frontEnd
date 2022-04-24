# Axios 

## 默认配置 defaultConfig

```js
const defaults = {
  // 可以在较新版本中删除的向后兼容性过度选项
  transitional:{
    // 默认 JSON 解析 true | false
    // true:  如果解析 JSON 出现错误，忽略 JSON 解析错误，设置 response.data = null
    // false: 如果解析 JSON 错误，会进行 SyntaxError 语法报错，并且 responseType 必须为 'json'
    silentJSONParsing: true,
    // 将 response 转换为 JSON ,即使 responseType 不为 'json'
    forcedJSONParsing: true,
    // 当请求超时时，报超时错误，而不是 ECONNABORTED 错误
    clarifyTimeoutError: false
  },
  // 适配器，根据当前开发环境，决定是使用 xhr(浏览器环境) 还是 HTTP(node 环境)
  adapter: getDefaultAdapter(),
  // 在将请求数据发送给客户端之前，将数据转换成需要的数据格式，但是只使用于 PUT、POST、PATCH、DELETE 这几种请求方法
  // transformRequest 传入的是一个 function[] ,要求数组最后一个函数必须返回 string / Buffer / ArrayBuffer / FormDate / Stream 这几种数据类型之一
  transformRequest: [function (data, headers){
    // 将data 转换成 String/Buffer/ArrayBuffer/FormData/Stream 格式的数据
    return data
  }],
  // 接收到服务器返回的数据后，转换成需要的数据格式
  transformResponse: [function (data){
    return data;
  }],
  // 请求超时时间，默认没有超时时间
  timeout: 0,
  // 向服务器发送 cookie 时，使用的 key
  xsrfCookieName: 'XSRF-TOKEN',
  // 服务器发送 cookie 给客户端时，使用的 key
  xsrfHeaderName: 'X-XSRF-TOKEN',
  // 服务器返回的最大的内容长度 ，node 环境 byte
  maxContentLength: -1,
  // 发送请求时，最大的请求内容长度 byte
  maxBodyLength: -1,
  // 转换 FormData 数据格式时，使用的 FormData 类
  env: {
    FormData: window?.FormData || global?.FormData
    // FormData: require('./env/FormData')
  },
  // 验证请求状态码
  validateStatus: function (status){
    return status>=200 && status<300;
  }
  // 默认发送的请求头
  headers: {
    common: {
      "Accept": "application/json, text/plain, */*"
    }
  }
}
// 这样使得 我们可以直接调用 axios.get()/axios.delete()/axios.head()
// 将 delete/get/head 挂载到 headers 中，这几种方法不需要额外的添加请求头字段
utils.forEach(['delete', 'get', 'head'], function (method){
  defaults.headers[method]= {}
})
// 可以直接调用 axios.post()/axios.put()/axios.patch
// 将 post /put/patch 挂载到 headers 中，这几种方法需要额外的添加请求头字段 Content-Type
utiles.forEach(['post', 'put', 'patch'], function (method){
  defaults.headers[method] = {'Content-Type': 'application/x-www-form-urlencoded'}
})
```
