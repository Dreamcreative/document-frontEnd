# webpack优化

## 使用多线程/多实例构建： happyPack（不维护了）、thread-loader

## 缩小打包作用域：

### exclude/include（loader的解析范围）

### resolve.modules：指明第三方模块的绝对路径，减少路径查找

### resolve.extensions：减少引入模块时，模块的后缀名查找

### noParse：对完全不需要解析的库进行忽略，但是忽略的文件中不能存证import、requie、define等模块语句

### IgnorPlugin：完全排除模块

### 合理使用别名 alias

## 充分利用缓存提升二次构建速度

### babel-loader开启缓存

### cache-loader或者hard-source-webpack-plugin

## 使用Dll

### 使用DllPlugin进行分包，使用DllReferencePlugin对manifest.json引用，使一些基本不会改动的代码打包成静态资源，避免反复编译

## 合理的代码拆分、公共代码提取、css资源分离
