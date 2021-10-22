# webpack5 优化方案

## 优化构建速度

1. 更新的版本

   1. 使用最新的 webpack 版本。通过 webpack 自身的版本迭代优化，来加快构建速度
   2. 将 nodejs/npm/yarn 更新到最新版本，也有助于提高性能

2. 缓存

   1. cache

   > 通过配置 `webpack 持久化缓存 cache:filesystem`，来缓存生成的 webpack 模块和 chunk，改善构建速度

   ```
   module.exports = {
    cache: {
      type: 'filesystem', // 使用文件缓存
    },
   }

   ```

3. 减少 loader、plugin

> 每个 loader、plugin 都有其启动时间。

    1. 为loader 指定 include，减少loader应用范围，仅应用于最少数量的必要模块
    2. 使用 webpack资源模块 `asset module`代替就的 asset loader（url-loader、file-loader等）

      ```
        module.exports={
          rules:[
            {
              test:/\.(png|svg|jpg|jpeg|gif)$/i,
              include:[paths.appSrc],
              <!-- 项目静态资源地址 -->
              type:'asset/resource'
            }
          ]
        }
      ```

4.  优化 resolve 配置

    ```
      const path= require("path");
      module.exports={
        resolve:{
          symlinks:false,
          extensions:['.jsx','.js'],
          alias:{
            "@": path.resolve(\_\_dirname, 'src')
          },
          modules:['main'],
        }
      }
    ```

    1. alias：创建 import 或 require 的别名，用来简化模块引入
    2. extensions：解析文件的后缀名列表。设置 extensions 可以减少 webpack 查找模块的解析速度
    3. modules: 表示 webpack 解析模块时需要解析的目录。指定目录可以缩小 webpack 的解析范围，加快构建速度

       > webpack 查找第三方模块时，会先从 当前目录的 `./node_modules` 查找，没有找到时，会向上级目录查找 `../node_modules`，最后一直查找到顶级的 `node_modules`，如果没有查找到，会报错

    4. symlinks: 如果项目不适用 symlinks（例如 npm link/ yarn link）。设置 `symlinks:false`可以减少解析工作量

5.  多进程

    1. thread-loader

    > 将耗时的 loader 放在一个独立的 worker 池中运行，加快 loader 的构建速度

    > 注意：

         1. 对于一般的 loader 不需要使用 thread-loader，因为这样会开启一个新的 node 进程，反而会增加项目的构建时间
         2. 对于比较耗时的 loader 可以使用 thread-loader，虽然开启新的 node 进程会耗时，但是相对于 loader 执行的耗时来说，还是能够接受的

6.  其他

    1.  devtool

        > 不同的 devtool 设置会导致性能差异。大多数情况下，最佳选择是 `eval-cheap-module-source-map`.

    2.  输出结果不携带路径信息

        > 默认 webpack 会在输出的 bundle 中生成路径信息，将路径信息删除可小幅度提升构建速度

## 减少打包体积

1.  代码压缩

    1. 使用 terser-webpack-plugin 插件来压缩 JavaScript 代码
    2. 使用 css-minimizer-webpack-plugin 插件来压缩 css 代码

2.  代码分离

    > 代码分离能够吧代码分离到不同的 bundle 中，然后可以按需加载或并行加载这些文件。代码分离可以用于获取更小的 bundle，以及控制资源加载优先级，可以缩短页面加载时间

    1. 抽离重复代码

       > splitChunksPlugin 插件开箱即用。将公共的依赖模块提取到已有的入口 chunk 中，或者提取到一个新生成的 chunk 中

    ```
      module.exports={
        splitChunks:{
          chunks:"all",
          cacheGroups:{
            vendors:{
              // node_modules里的代码
              test: /[\\/]node_modules[\\/]/,
              chunks: "all",
              // name: 'vendors', 一定不要定义固定的name
              priority: 10, // 优先级
              enforce: true
            }
          }
        }
      }
    ```

    2. css 文件分离

    > 使用 mini-css-extract-plugin 插件，将 css 提取到单独的文件中。为每个包含 css 的 js 文件创建一个 css 文件，并且支持 css 和 SourceMap 的按需加载

    3. tree shaking 摇树优化

    1. js

       > js tree shaking: 将 JavaScript 中未使用的代码移除
       > 通过 package.json 中的 "sideEffects"属性，来想 webpack 提供提示，表明项目中的那些文件可以安全地删除掉文件中的未使用部分

       ```
       <!-- package.json -->
         {
           <!-- sideEffects:false, -->
           当代码有副作用时，需要将 sideEffects 改为提供一个数组，添加有副作用代码的文件路径
           sideEffects: ["./src/some-side-effectful-file.js"]
         }
       ```

    1. css

       > css tree shaking :将 代码中没有用到的 css 代码移除，可以大幅度减少打包后的 css 文件大小。
       > mini-css-extract-plugin 对 css 代码进行分离 ，先将 css 进行分离，再将 css tree shaking
       > purgecee-webpack-plugin 对 css tree shaking

       ```
        const glob = require('glob')
        const MiniCssExtractPlugin = require('mini-css-extract-plugin')
        const PurgeCSSPlugin = require('purgecss-webpack-plugin')
        const paths = require('paths')

        module.exports={
          plugins:[
            // 打包体积分析
            new BundleAnalyzerPlugin(),
            // 提取 CSS
            new MiniCssExtractPlugin({
              filename: "[name].css",
            }),
            // CSS Tree Shaking
            new PurgeCSSPlugin({
              paths: glob.sync(`${paths.appSrc}/**/*`,  { nodir: true }),
            }),
          ]
        }
       ```

3.  浏览器缓存

> 使用 webpack hash，为 webpack 打包后的输出文件名，设置 hash 值。当文件名不变时，http 请求会使用 浏览器缓存

```
module.exports={
  <!-- 配置 js bundle hash -->
  <!-- 输出 -->
  output:{
    // 仅在生产环境添加 hash
    filename: ctx.isEnvProduction ? '[name].[contenthash].bundle.js' : '[name].bundle.js',
  },
  <!-- 配置 css bundle时 -->
  plugins: [
    // 提取 CSS
    new MiniCssExtractPlugin({
      filename: "[hash].[name].css",
    }),
  ],
}
```

4. CDN

> 将所有静态文件上传至 CDN，通过 CDN 加速来提升加载速度

## 总结

1. 减少 webpack 构建时的文件查找范围。通过配置 resolve:modules/extensions/alias/noParse/mainFields 等属性来减少 webpack 在构建时，文件查找范围
2. 减少 loader 的文件处理范围 includes/excludes 属性，设置 loader 处理文件的范围
3. 减少打包体积：js tree shaking ,css 代码分离，css tree shaking，js 代码压缩，css 代码压缩
4. 加载速速方面：使用 CDN 缓存、浏览器缓存、按需加载等方式

## 参考

- [学习 Webpack5 之路（优化篇）](https://jelly.jd.com/article/61179aa26bea510187770aa3)
