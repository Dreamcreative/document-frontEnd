# webpack 的几种 hash 策略

## webpack hash 分类

> hash：计算与整个项目的构建相关，hash 值都相同

> chunkhash：模块 hash，计算与同一模块内容相关

> contenthash：内容 hash，计算与文件内容本身相关

## hash - 默认 hash 方式，跟整个项目文件相关 （粒度是整个项目）

1. 每个文件都具有相同的 hash，因为 hash 值时基于整个项目计算生成的
2. 如果`不修改任何内容重新构建，hash 值不变`
3. 当`任意文件内容发生改变重新构建，hash 值改变`

## chunkhash - 模块 hash 方式，跟入口文件相关（粒度是每个入口文件）

1. 根据不同的入口生成不同的 hash 值
2. 在使用上来说：我们可以吧一些公共库和程序入口文件区分开来，单独打包构建，接着采用 chunkhash 方式生成 hash，那么只要我们不改动公共库的代码，就可以保证其 hash 不变，起到缓存的作用

## contenthash - 内容 hash 方式，跟内容相关（粒度是每个文件）

1. 每个生成的文件的名称都有一个唯一的 hash 值，该 hash 值根据文件内容生成
2. 当要构建的文件内容发生改变时，就会生成新的 hash 值，并且不影响其他内容无变化的文件的 hash 值

## 参考

- [webpack 中，hash、chunkhash、contenthash 的区别是什么？](https://www.cnblogs.com/skychx/p/webpack-hash-chunkhash-contenthash.html)
