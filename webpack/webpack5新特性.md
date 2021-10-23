# webpack5 新特性

1. 通过持久化硬盘缓存能力来提升构建性能
2. 通过更好的算法来改进长期缓存（降低产物资源的缓存失败率）
3. 通过更好的 `tree shaking`能力呵代码的生成逻辑来优化产物的大小
4. 改善 web 平台的兼容性能力
5. 清除了内部结构中，在 webpack4 没有重大更新而引入一些新特性时，所遗留下来的一些奇怪的 state
6. 通过引入一些重大的变更为未来的一些特性做准备，使得能够长期的稳定在 webpack5 版本上

## 构建时新特性

1. 内置静态资源构建能力 - asset modules

   > webpack 只会打包 JS 文件，如果要打包其他文件时，就需要加上响应的 loader

   > webpack5 之前，在处理静态资源时，比如（png、svg 等等）。我们需要使用以下的 loader 来进行对应的资源处理

   1. raw-loader：允许将文件处理成一个字符串导入
   2. file-loader：当文件打包到输出目录，并在 import 的时候返回一个文件的 URI
   3. url-loader：当文件大小达到设置的值时，可以将其处理成 base64 格式

   > webpack5 提供了内置的静态资源构建能力，我们不再需要按照额外的 loader，只需要简单的配置就能实现静态资源的打包和分目录存储

   ```
    module.exports={
      module:{
        rules:[
          {
            test: /\.(png|jpg|svg|gif)$/,
            type: "asset/resource",
            generator:{
              filename: "assets/[hash:8].[name].[ext]"
            }
          }
        ]
      }
    }
   ```

## 参考

- [Webpack5 新特性业务落地实战](https://cloud.tencent.com/developer/article/1803509)
