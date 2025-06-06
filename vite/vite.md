# vite

1. 开发环境为什么快
   1. 使用 esbuild: 使用`esbuild`进行构建，来提供快速的热重载和模块编译。
      1. esbuild 是一个基于 `Go 语言`编写的工具，它的编译速度非常快，可以显著提高开发体验
   2. 原生 ES 模块: vite 利用现代浏览器原生支持 `ES Modules`特性，在开发阶段跳过传统打包工具的预打包流程。浏览器通过 `import` 语句按需请求模块，`Vite`实时编译返回，避免了全量打包的开销
   3. 按需编译: Vite 仅编译浏览器实际请求的模块，编译结果缓存在内存中，后续请求直接复用缓存，大大减少了等待时间
   4. 热模块替换`HMR`: Vite 通过 `WebSocket` 链接通知客户端更新模块，而不是全量替换，进一步提升了热更新的速度
   5. 依赖与构建优化: 对于第三方依赖，vite 使用 `esbuild` 进行预构建，将多个内部模块打包为单一文件，减少浏览器请求次数，并确保浏览器兼容性。`预构建结果存储在 node_module/.vite` 目录中，并使用`Cache-Control`设置长期缓存，仅当依赖变化后重新构建
   6. 智能资源内联: vite 将小文件`图片、字体`,自动转为 `Base64 Data URL`,减少 HTTP 请求

2. 开发环境和生产环境打包工具的区别
   1. 开发环境：使用 `esbuild` 进行打包，打包速度快`esbuild的优点`
      1. 极快的构建速度：主要使用 `Go` 语言,使得在执行任务时非常快
      2. 原生 Typescript 支持，无需额外配置
      3. ESM 和 CommonJS 支持：支持 ESM 和 CommonJS
      4. `Tree Shaking`: 支持 `Tree Shaking`,删除无用代码
      5. 压缩和优化：可以对 JavaScript 代码进行压缩和优化，包括去空格、注释、内联函数等
      6. 插件系统：提供了插件系统，支持用户自定义构建
      7. 兼容性：支持最新的 JavaScript 特性
      8. 易于使用：esbuild 的 API 非常简单，易于上手
      9. 轻量级：esbuild 是一个轻量级的工具，安装和运行都非常快手
   2. 生成环境：使用 `rollup` 进行最终的打包和优化,`rollup的优点`
      1. `Tree Shaking`: rollup 支持 `Tree Shaking`,可以删减未使用代码，减少打包体积
      2. 代码拆分：rollup 支持代码拆分，可以将代码分割成多个 chunks, 然后按需加载
      3. 模块化打包：rollup 支持 ESM 格式，可以将模块化的代码打包成格子格式，如 CommonJS、UMD等
      4. 插件系统：rollup 拥有一个丰富的插件生态系统，允许用户自定义构建过程
      5. 优化和压缩：rollup 支持多种优化和压缩选项，如`代码压缩`、`内联函数`、`去除空格和注释`
      6. 兼容性：rollup 支持 ES6+ 的最新特性，包括类、箭头函数、模板字符串等
      7. 易于使用：rollup 的API 非常简单，易于上手
      8. 社区和文档：rollup 拥有一个活跃的社区和丰富的文档资源
