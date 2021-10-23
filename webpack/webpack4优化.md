# webpack 优化

## 优化 webpack 构建速度

1. 使用高版本的 webpack。
2. 多线程/多实例构建：thread-loader
3. 缩小打包作用域

   1. exclude/include（确定 loader 规则范围）
   2. resolve.modules 指明第三方模块的绝对路径（减少不必要的查找）
   3. resolve.noParse 对完全不需要解析的库进行忽略（不去解析但仍会打包到 bundle 中，`注意：被忽略掉的文件里不应该包含 import/require/define等模块化语句`）
   4. resolve.extensions 减少 webpack 查找文件的后缀列表。当导入文件没有后缀名时，webpack 会自动带上后缀列表中的值一一的去查找文件
   5. resolve.mainFields 第三方模块的入口，如果明确使用第三方模块的入口文件字段时，手动配置`resolve.mainFields` 的值，减少第三方模块入口文件的查找
   6. 合理使用 alias（别名），减少文件的查找
   7. IgnorePlugin（完全排除模块）

4. 充分利用缓存提升二次构建速度

   1. babel-loader 开启缓存
   2. terser-webpack-plugin 开启缓存
   3. 使用 cache-loader 或者 hard-source-webpack-plugin

5. DLL

   1. 使用 DllPlugin 进行分包，使用 DllReferencePlugin (索引连接)对 manifest.json 引用，让一些基本不会改动的代码先打包成静态资源，避免反复编译，浪费时间

## 优化 webpack 的打包体积

1. 压缩代码

   1. webpack-paralle-uglify-plugin
   2. terser-webpack-plugin
   3. 多进程并行压缩
   4. 通过 mini-css-extract-plugin 提取模块中的 css 到单独文件，通过 optimize-css-assets-webpack-plugin 插件开启 cssnano 压缩 css

2. 提取页面公共资源

   1. 使用 html-webpack-externals-plugin 将基础包通过 CDN 引入，不打入 bundle 中
   2. 使用 SplitChunksPlugin 进行（公共脚本、基础包、页面公共文件）分离（webpack4 内置），替代了 CommonsChunkPlugin 插件
   3. 基础包分离：将一些基础库放到 CDN，比如 vue、react

3. tree shaking ：将无用的 js 脚本和 无用的 css 移除

4. scope hoisting （作用域提升）

   1. webpack 构建后的代码会存在大量闭包，造成体积增大，运行代码是创建的函数作用域变多，内存开销变大。scope hoisting 将所有模块的代码按照引用顺序放在一个函数作用域里，然后适当的重命名一些变量以防止变量名冲突
   2. 必须是 ES6 的语法，因为有很多第三方库仍采用 CommonJS 语法，为了充分发挥 scope hoisting 的作用，需要配置 mainFields 对第三方模块优先采用 jsnext:main 中指向的 ES6 模块化语法

5. 图片压缩

   1. 使用基于 Node 的 imagemin
   2. 配置 image-webpack-loader
