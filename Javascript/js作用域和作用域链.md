# js作用域和作用域链

## 作用域

> 在运行时，代码中某些特定部分中变量、函数、和对象的可访问性

1. 静态作用域 -- JavaScript 就是静态作用域

```
var scope = 'global scope';
function check(){
  var scope = 'local scope';
  function f(){
    return scope;
  }
  return f();
}
check() // local scope
```

```
var scope = 'global scope';
function check(){
  var scope = 'local scope';
  function f(){
    return scope;
  }
  return f;
}
check()() // local scope
```

> f 函数处在 check 函数内部，所以打印的都是 local scope

2. 动态作用域

## 变量作用域

1. 全局作用域
2. 函数作用域
3. 块级作用域 -- ES6 新增

## 作用域链

> 当查找变量时，如果当前作用域下没有查找到，会一层一层向上查找，一直查找到全局作用域。

## 执行上下文

> javascript 属于解释型语言，JavaScript 执行分为`解释阶段`和`执行阶段`

### 解释阶段

1. 词法分析
2. 语法分析
3. 作用域规则确定

### 执行阶段

1. 创建执行上下文
2. 执行函数代码
3. 垃圾回收

> 作用域在 JavaScript 解释阶段就确定了

> 执行上下文在函数执行前创建

> 作用域和执行上下文最大的区别：作用域在定义时就确定，不会改变；执行上下文在运行时确定，可以改变

> 一个作用域可能包含若干个执行上下文

