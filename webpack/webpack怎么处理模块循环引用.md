# webpack 怎么处理模块循环引用

## 处理分析

> webpack 与 node 的循环引用处理原理相同。利用 installedModules 缓存已加载的模块的 export。通过读取缓存的 export 避免再次执行

## 以 webpack 打包进行分析

> 理论上循环引用会导致栈溢出，但并非所有循环引用都会导致栈溢出

### 案例一 不会溢出

```
<!-- a.js -->

export.done = false;
var b = require('./b.js');
console.log("在 a.js 之中，b.done = %j", b.done);
export.done =true;
console.log('a.js 执行完毕');
```

```
<!-- b.js -->
export.done = false;
var a = require('./a.js');
console.log("在 b.js 之中，a.done = %j", a.done);
exports.done = true;
console.log("b.js 执行完毕");
```

```
<!-- main.js -->
var a = require('./a.js');
var b = require('./b.js');
console.log("main.js 执行完毕");
```

```
<!-- webpack 编译结果 -->
(function (modules) {
  var installedModules = {};
  function __webpack_require__(moduleId) {
     <!-- 检查 installedModules 中是否存在对应的 module
     如果存在就返回 module.exports -->
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
     <!-- 创建一个新的 module 对象，用于下面函数的调用 -->
    var module = (installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {},
    });
     <!-- 从 modules 中找到对应的模块初始化函数并执行 -->
    modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    );
     <!-- 标识 module 已被加载过 -->
    module.l = true;
    return module.exports;
  }
  return __webpack_require__((__webpack_require__.s = "./src/index1.js"));
})({
  "./a.js": function (module, exports, __webpack_require__) {
    exports.done = false;
    var b = __webpack_require__("./b.js");
    console.log("在 a.js 之中，b.done = %j", b.done);
    exports.done = true;
    console.log("a.js 执行完毕");
  },
  "./b.js": function (module, exports, __webpack_require__) {
    exports.done = false;
    var a = __webpack_require__("./a.js");
    console.log("在 b.js 之中，a.done = %j", a.done);
    exports.done = true;
    console.log("b.js 执行完毕");
  },
  "./index1.js": function (module, exports, __webpack_require__) {
    debugger;
    var a = __webpack_require__("./a.js");
    var b = __webpack_require__("./b.js");
    console.log("在 main.js 之中, a.done=%j, b.done=%j", a.done, b.done);
  },
});
```

### 具体代码逻辑

1. a.js 脚本先输出一个 done 变量，然后加载 b.js 脚本
2. b.js 执行到第二行，就去加载 a.js 脚本。这时，就发生了 "循环引用"。系统会去 a.js 模块对应对象的 exports 属性取值，可是 a.js 还没有执行完，从 exports 属性取回已执行的部分，而不是最后的值。
3. b.js 继续向下执行，等到全部执行完毕，再回到 a.js 中继续执行
4. a.js 继续向下执行，直到执行完毕

### 执行结果

```
console.log("在 b.js 之中，a.done = %j", false);
console.log("b.js 执行完毕");

console.log("在 a.js 之中，b.done = %j", true);
console.log('a.js 执行完毕');

console.log("在 main.js 之中, a.done=%j, b.done=%j",true,true);
```

## 案例二 栈溢出

> 如果模块导出是函数，这种循环引用时会栈溢出的

```
<!-- a.js  -->
import f from "./b.js";
export default (val)=>{
  f("a");
  console.log(val)
}
```

```
<!-- b.js  -->
import f from "./a.js";
export default (val)=>{
  f("a");
  console.log(val)
}
```

```
<!-- main.js -->
import a from './a.js';
a(1);
```

## 解决方案

不管那种情况，在 webpack 打包时，都是不会报错的。所以可以借助插件 `circle-dependency-plugin` 来进行提示

## 总结

1. webpack 遇到模块的循环引用时，返回的是当前`已经执行完毕的部分`,而不是代码全部执行后的值
2. webpack 的模块模式是基于 `CommonJS 模式`的，输出的是`值的拷贝`，而不是`值的引用`
3. webpack 会将已加载的模块使用 `installedModules` 变量缓存，当引入模块时，webpack 会先去 installedModules 变量中进行查找，如果已存在，直接返回 exports，如果不存在，才会取执行模块

## 参考

- [webpack 是怎么处理模块循环引用的情况的?](http://8.129.231.174/vuepress-reco-blog/blogs/question/webpack%E7%9A%84%E6%A8%A1%E5%9D%97%E5%BC%95%E7%94%A8.html)
