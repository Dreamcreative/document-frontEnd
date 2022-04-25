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

## Axios 其他属性

```js
const otherConfig={
  // 必填 发送请求的目标地址 url
  url: "",
  // 请求方法 默认 get
  method: 'get',
  // 发送请求时，同时发送的数据
  data: {},
  // 请求目标的主机名 如果 url 不是一个完整的 http 地址，baseURL 会拼接到 url 的前面
  baseURL: 'https://xxxx.com',
  // 将请求参数 序列化
  paramsSerializer: function(params){
    return QS.stringify(params, {arrayFormat: 'brackets'})
  },
  // 请求超时报错信息
  timeoutMessage: '请求超时报错信息',
  // 请求时 是否需要携带 cookie
  withCredentials: false,
  // 设置响应信息的数据格式
  responseType: 'json',
  // 上传进度
  onUploadProgress: function(progressEvent){ },
  // 下载进度
  onDownloadProgress: function (progressEvent){ },
  // 是否对响应体进行解压缩
  decompress: true,
  // 在重定向之前调用，处理重定向请求
  beforeRedirect: function (options, responseDetails:{headers}){},
  // transport: 
  // 执行 http 请求时添加选项
  httpAgent: new http.Agent({keepAlive: true}),
  // 执行 https 请求时添加选项
  httpsAgent: new https.Agent({keepAlive: true}),
  // 处理取消请求
  cancelToken: new CancelToken(function(cancel){}),
  // 定义要在 nodejs 中使用 UNIX 套接字
  socketPath: null,
  // 定义解码响应的编码，只在 nodejs 中生效
  responseEncoding: "utf-8",
}
```

## Axios 处理错误

> Axios 的 AxiosError 继承自 Error 类，兼容了其他平台的一些错误属性，同时还拥有自定义的属性（`config、code、status`）和方法（`ToJSON`）

```js
/**
 * @param message 错误信息
 * @param code: 错误码
 * @param config: 配置
 * @param request: 请求信息
 * @param response: 响应信息
 * @returns Error 错误
*/
function AxiosError(message, code, config, request, response){
  Error.call(this);
  this.message = message;
  this.name = "AxiosError";
  code && this.code = code;
  config && this.config = config;
  request && this.request = request;
  response && this.response = response;
}
// 继承
function inherits(constructor, superConstructor, props, descriptors){
  constructor.prototype = Object.create(superConstructor.prototype, descriptors);
  constructor.prototype.constructor = constructor;
  props && Object.assign(construtor.prototype, props)
}
// AxiosError 继承了 Error 的属性，同时自定义了 ToJSON 方法
inherits(AxiosError, Error, {
  ToJSON:function (){
    return {
      // 标准属性
      // 错误信息
      message: this.message,
      // 错误名称
      name: this.name,
      // 微软
      // 错误描述
      description: this.description,
      number: this.number,
      // Mozilla
      // 错误出现的文件
      fileName: this.fileName,
      // 错误出现在第几行
      lineNumber: this.lineNumber,
      // 错误出现在第几列
      columnNumber: this.columnNumber,
      // 错误信息栈
      stack: this.stack,
      // Axios 拥有的属性
      // 配置
      config: this.config,
      // 错误状态码
      code: this.code,
      // 响应状态
      status: this.response && this.response.status ? this.response.status : null
    }
  }
})
```

## Axios 拦截器 Interceptor

> Axios 的拦截器包括了 拦截器注册 `use(fulfilled, rejected, options)`、拦截器取消`eject(id)`、拦截器遍历`forEach(callback)`等方法

```js
function InterceptorManager(){
  // 存储拦截器
  this.handles= [];
}
/**
 * @param fulfilled 处理成功回调
 * @param rejected 处理失败回调
 * @returns id number 返回当前拦截器的 ID ,就是当前 拦截器的 索引
*/
InterceptorManager.prototype.use = function (fulfilled, rejected, options){
  this.handles,push({
    // 成功处理函数
    fulfilled: fulfilled,
    // 失败处理函数
    rejected: rejected,
    // 是否同步
    synchronous: options? options.synchronous: false,
    runWhen: options? options.runWhen : null
  })
  return this.handles.length - 1;
}

// 删除拦截器
/**
 * @param id use 返回的 拦截器 ID 
*/
InterceptorManager.prototype.eject = function (id){
  if(this.handles[id]){
    this.handles[id] = null;
  }
}

// 使用传入的 callback 回调，遍历调用 注册的 interceptor 拦截器
InterceptorManager.prototype.forEach = function (fn){
  this.handles.forEach((interceptor)=>{
    if(interceptor !== null){
      fn(interceptor)
    }
  })
}
```
