# webpack5 新特性

1. 通过持久化硬盘缓存能力来提升构建性能
2. 通过更好的算法来改进长期缓存（降低产物资源的缓存失败率）
3. 通过更好的 `tree shaking`能力和代码的生成逻辑来优化产物的大小
4. 改善 web 平台的兼容性能力
5. 清除了内部结构中，在 webpack4 没有重大更新而引入一些新特性时，所遗留下来的一些奇怪的 state
6. 通过引入一些重大的变更为未来的一些特性做准备，使得能够长期的稳定在 webpack5 版本上

## 构建时新特性

1.  内置静态资源构建能力 - asset modules

    > webpack 只会打包 JS 文件，如果要打包其他文件时，就需要加上相应的 loader

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
               filename: "assets/[hash:8].[name][ext]"
             }
           }
         ]
       }
     }
    ```

    > type 的取值有下面几种

    1. asset/source：功能相当于 raw-loader
    2. asset/inline：功能相当于 url-loader
    3. asset/resource：功能相当于 file-loader
    4. asset：默认会根据文件大小来选择使用那种类型，当文件小于 8kb 时，使用 asset/inline,否则使用 asset/resource。也可以手动进行阈值设定

2.  内置 FileSystem Cache 能力加速二次构建

> webpack5 之前我们会通过使用 loader 的形式进行设置缓存，比如 cache-loader，或者使用 hard-source-webpack-plugin 插件为模块提供一些中间缓存。

> webpack5 之后，默认就为我们继承了一种自带的缓存能力（对 module 和 chunks 进行缓存）

```
module.exports={
  cache:{
    type:"filesystem",
    buildDependencies:{
      config:[__filename],
    },
    name:"",
  }
}
```

3. 内置 WebAssembly 编译及异步加载能力（sync/async）

> webpack4 本身就已经集成了 WebAssembly 的加载能力

> webpack5 中拓展了 WebAssembly 的异步加载能力，使得我们可以更灵活地借助 WebAssembly 做更多有意思的事情

4. 内置 web worker 构建能力

## 运行时新特性

1. 移除了 nodejs Polyfills，Polyfills 交由开发者自由控制
2. 资源打包策略更优，构建产物更"轻量"

   > Prepack 是 Facebook 开源的一个 JavaScript 代码优化工具，运行在"编译"阶段，生成优化后的代码

3. 深度 Tree Shaking 能力支持
4. 更友好的 Long Term Cache 支持性，chunkId 不变

   > webpack5 之前，文件打包后的名称是通过 ID 顺序排列的，一旦后续有一个文件进行了改动，那么必将造成后面的文件打包出来的文件名产生变化，即使文件内容没有产生变化。因此会造成资源的缓存失效。

   > webpack5 有着更友好的长期缓存能力支持，其通过 hash 生成算法，为打包后的 modules 和 chunks 计算出一个短的数字 ID，这样即使中间删除了某一个文件，也不会造成大量的文件缓存失败

   > webpack5 还使用了真实的 contenthash 来支持更友好的 Long Term Cache。就是如果你只是删除了注释或者改了个变量名，那么本质上你的代码逻辑并没有发生改变，所以对于压缩后的文件这些内容的变更不会导致 contenthash 改变

5. 支持 Top Level Await，从此告别 async

> webpack5 还支持 Top Level Await。即允许开发者在 async 函数的外部使用 await。它就像巨大的 async 函数，原因是 import 它们的模块会等待它们开始执行它的代码。因此，这种省略 async 的方式只有在顶层才能使用

```
module.exports={
  experiments:{
    topLevelAwait:true,
  }
}
```

## 参考

- [Webpack5 新特性业务落地实战](https://cloud.tencent.com/developer/article/1803509)
