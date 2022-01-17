# JavaScript 原型和原型链


## prototype `显式原型属性`

> `每个函数`都有 prototype 属性，指向一个原型对象

```
function Person(){

}
var p = new Person();
console.log(p.__proto__ === Person.prototype) // true
```

## `__proto__` `隐式原型属性`

> 对象通过 `__proto__` 可以向它的父级查找属性，而 `__proto__` 形成的关系链，就是 `原型链`

> `每个对象`(除了 null)都具有 `__proto__` 属性，指向该对象的原型

## constructor

> `每个 prototype 原型`都有一个 constructor 属性，指向关联的构造函数

![原型和原型链](/images/JavaScript/原型和原型链.png)

```
function Person(){

}
var p = new Person();

p.__proto__===Person.prototype;
Person.prototype.constructor === function Person;
p.__proto__.__proto__=== Object.prototype;
p.__proto__.__proto__.__proto__ ===  Object.prototype.__proto__ === null;

var obj = new Object()
obj.__proto__===Object.prototype;
Object.prototype.constructor === function Object()
obj.__proto__.__proto__===Object.prototype.__proto__ === null;

var foo = new Function()
foo.__proto__ === Function.prototype;
Function.prototype.constructor === function Function();
Function.prototype.__proto__ === Object.prototype;
foo.__proto__.__proto__ === Object.prototype;
Object.prototype.__proto__ === null;
```

## 疑问

1. `Function.__proto__ === Function.prototype`

> 原因 Function对象，是一个内置对象。-- 规定

## 怪异现象

1. Function.prototype.bind 生成的函数没有 prototype 属性
