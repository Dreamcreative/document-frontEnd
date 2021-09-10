# AMD、CMD、commonjs、ES6

都是用于在模块化定义中使用的。
AMD/CMD、commonjs是ES5中提供的模块化编程的方案
import/exprot是ES6中定义新增的
node.js使用CommonJS规范，js使用AMD、CMD、ES6规范进行模块化开发

## AMD

异步模块定义，是RequireJS的规范化产出

### 异步模块。AMD是RequireJS在推广过程中对模块定义
的规范化产出。RequireJS是对这个概念的实现

```javascript
define(['a.js','b.js','c.js'],function(a,b,c){
  function foo(){
  	a.foo()
  }
  function bar(){
  	b.bar()
  }
  return {
  	foo:foo,
    bar:bar
  }
})
```

### RequireJS：是一个AMD框架，可以异步加载JS文件。
define([],callback)

### AMD推崇依赖前置，提前执行，在刚开始就提前执行
所有的依赖。这样会导致一开始就需要加载很多资源

## CMD

同步模块定义，是SeaJS的一个标准

### 是SeaJS在推广过程中对模块定义的规范化产出，是一个同步模块定义

### 通过define()定义，没有依赖前置，通过require加载插
件，CMD是依赖就近，即用即返

```javascript
define(function( require,exports,module){
	var $=requrie('jqury')
})
```

## commonjs

通过module.exports定义的，在前端浏览器中并不支持module.epxorts.而是通过node.js后端使用

### commonjs是node.js的规范，用同步的方式加载模
块。在服务端，模块文件存储在本地，读取非常快。

## ES6

通过export/import对模块进行导出/引入

### 旨在成为浏览器和服务器通用的模块解决方案。其模块
功能主要由两个命令构成:export、import。export用
于规定模块的对外接口，import命令主要用于引入其
他模块提供的功能

## ES6模块与Commonjs模块的差异

### commonjs模块输出的是一个值的拷贝，ES6模块输出的是值的引用

#### commonjs输出的是值的拷贝，一旦输出一个值，模块
内部的变化就影响不到这个值

#### ES6模块在js引擎静态分析的时候，遇到import命令，
会生成一个只读引用，等到脚本真正执行时，再根据这
个只读引用，到被加载模块中去取值。一旦被加载模块
的值发生了变化，引用的值也会相应的发生改变

### commonjs模块是运行时加载，ES6模块是编译时输出接口

#### 运行时加载：CommonJS模块就是对象，在引用时先
加载整个模块。然后再从对象上读取需要使用的方法

#### 编译时加载：ES6模块不是对象，而是通过export命令
显式指定输出的代码。在import时可以指定加载某个
输出值，而不是加载整个模块
