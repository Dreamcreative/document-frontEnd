# AMD、CMD、CommonJS、ES6

1. 都是用于在模块化定义中使用
2. AMD/CMD、CommonJS 是 ES5 中提供的模块化编程方案
3. import/exports 是 ES6 中定义的
4. nodejs 使用 CommonJS 规范，js 使用 AMD、CMD、ES6 规范进行模块化开发

## AMD - 异步模块，依赖前置，提前执行，用户体验好

> 异步模块规范，是 RequireJS 的规范化产出

> AMD 是 RequireJS 在推广过程中对模块定义的规范化产出。RequireJS 是对这个概念的实现

> AMD 推崇依赖前置，提前执行，在刚开始就提前执行所有依赖。会导致一开始就会加载很多资源

```
	define(["a.js","b.js","c.js"],function(a,b,c){
		function foo(){
			a.foo();
		}
		function bar(){
			b.bar();
		}
		return {
			foo:foo,
			bar:bar,
		}
	})
```

## CMD - 同步模块，依赖后置，使用时执行，性能好

> 同步模块规范，是 SeaJS 的一个标准

> CMD 是 SeaJS 在推广过程中对模块定义的规范化产出，是一个同步模块定义

> 通过 define()定义，没有依赖前置，通过 require 加载插件。CMD 是就近依赖，即用即返

```
define(function(require, exports, module){
	var $ = require('jqury')
})
```

## CommonJS - nodejs 模块化规范，require/module.exports，输出的是值的拷贝

> CommonJS 是 nodejs 的模块化规范，是同步的方式加载模块。在服务器中，模块文件存储在本地，读取非常快

> 通过 `module.exports` 定义的，在前端浏览器中不支持使用 `module.exports`。需要在 nodejs 中使用

## ES6 - import/export ，输出的是值的引用

> 通过 import/export 对模块进行 导入/导出

> 旨在成为浏览器和服务器通用的模块化解决方案

## ES6 和 CommonJS 的差异

1. ES6 模块输出的是`值的引用`。CommonJS 模块输出的是一个`值的拷贝`
2. ES6 模块在 JS 引擎静态分析时，遇到 `import`命令，会生成一个只读引用，等到脚本真正执行的时候，在根据这个只读引用，到被加载模块中去取值。一旦被加载模块的值发生变化，引用的值也会跟随这改变
3. CommonJS 输出的是值的拷贝，一旦输出一个值，模块内部的变化就影响不到这个值。
4. ES6 模块是编译时加载，CommonJS 是运行时加载

   1. 编译时加载：ES6 模块不是对象，而是通过 `export`命令，显式指定输出的代码。在 import 时可以指定加载某个输出值，而不是加载整个模块
   2. 运行时加载：CommonJS 模块就是对象，在引用时先加载整个模块。然后再从对象上读取需要使用的方法
