# webbpack 热更新

## react 项目配置 hmr

```js
// 1. webpack.config.json
const webpack = require('webpack');
module.exports = {
  devServer: {
    host: 'localhost',
    hot: true,
    port: 8080
  },
  plugins: [new webpack.HotModuleReplacementPlugin()]
};

// 2. app.tsx
// react 18
import ReactDOM from 'react-dom/client'
const root = document.getElementById('root')
let _module = module as any //如果是js，这一行不需要
if (_module.hot) {
  _module.hot.accept(() => {
    ReactDOM.createRoot(root).render(<App />)
  })
}
ReactDOM.createRoot(root).render(<App />)
```

## webpack hmr 实现原理

> 主要使用的包

- webpack-dev-server:

  1. 使用 express 开启一个 webserver 服务器
  2. 使用 socket.js 建立一个 websocket 长连接

- webpack-dev-middleware

  1. 本地文件的监听，启动 webpack 编译，使用监听模式开始 webpack `watch`模式。文件系统中某一个文件发生修改，webpack 监听到文件变化，根据配置对模块重新编译打包
  2. 设置文件系统为`内存文件系统`,编译输出到内存中
  3. 实现了一个 express 中间件，将编译文件返回

- watchpack

  1. 监听文件，文件夹变化，

- HotModuleReplacement
  1. HMR 的中枢，接收传递给他的 hash 值，通过`JsonpMainTemplate.runtime`向服务器发送 ajax、jsonp 请求，分别请求更新的文件列表、最新的代码模块，返回给 HMR runtime,进行模块热更新

1. `webpack-dev-middleware`中间件，通过 `webpack` 暴露的 api 来监听文件的变化，当文件变化时，`webpack` 重新打包，并告知 webpack 将打包后的文件放到内存中使用`memory-fs`

   - 问题

   1. 为什么要将打包后的文件存放在内存中：访问内存中的文件比访问文件目录下的文件更快，减少文件写入的开销，便于开发

2. `webpack-dev-server`会监听 `webpack`的`compiler.hooks.done.tab("webpack-dev-server",()=>{})`，当编译完成后，把变化文件、最新打包的 hash 值传递给浏览器端，浏览器根据这些来做出相应的操作
3. clent(客户端)根据服务端发送过来的信息，包括`hash值`、`ok消息`，先将保存`hash值`，当收到`ok值`后，根据 hot 的配置，来觉得是否进行下一步更新。webpack 根据是否配置 `热更新`进行更新，1. 配置了热更新 则进行局部刷新，2.没配置热更新则直接调用`location.reload`刷新页面
4. 通过 HotModuleReplacement 获取需要更新的内容

   - 问题

   1. 为什么更新模块不通过 websocket 直接发送给浏览器，而是通过 webpack 获取：`功能解耦，各司其职，`

5. 最后一步就是 HMR runtime 进行热更新。主要分为三步
   1. 找到变化的模块和依赖
   2. 删除过期的模块和依赖
   3. 将新的模块添加到 modules 中
   - 问题
   1. 当模块热更新失败后，如果替换模块失败，回退机制是什么：`当替换失败，直接调用 location.reload 刷新页面`

## 参考

- [webpack-dev-server 和 HMR 原理](https://codeantenna.com/a/30Lyrr1nV5)
