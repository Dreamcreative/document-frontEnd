# 装饰器  Decorator ES7 的标准特性之一

## 简介

### 是一种结构型设计模式，旨在促进代码的复用。

当希望为对象添加额外的功能，同时不希望大量修改原有代码

### 装饰器 实际上就是一个函数

### 类型

#### 普通装饰器（无法传参）

##### function logClz(params:any) {

console.log(params) // class HttpClient
}
@logClz
class HttpClient { constructor() { }}

#### 装饰器工厂（可以传参）,闭包，返回的函数才是真正的装饰器

##### function logClz(params:string) {

console.log('params:', params); //params: hello
 return function(target:any) {
  console.log('target:', target); //target: class HttpClient
 target.prototype.url = params; //扩展一个 url 属性 }
}

@logClz('hello')
class HttpClient { constructor() { }}
var http:any = new HttpClient();
console.log(http.url); //hello

## 类装饰器

### 使用

#### 类装饰器声明在类的声明之前

### 参数

#### 类装饰器接受一个参数 ，就是 类本身

### 例子

#### 普通装饰器

function logClz( params ){
  // params 就是 这个类 Test
}
装饰器工厂
function logClzFac( value ){
  // value 就是传入的 值
 return function (target){
  // params 就是 这个类 Test
 }
}
// 使用
@logClz
@logClzFac('test')
class Test {}

## 方法装饰器

### 使用

#### 方法装饰器声明在一个方法的声明之前

### 方法装饰器被应用到方法的属性描述符上，用来监听、修改、替换方法的定义

### 方法装饰器会在运行时传入 3 个参数  

Object. defineProperty(target, name, desc)

#### 1. 对于静态成员来说是类的构造函数，对于实例成员来说是类的原型对象

#### 2. 方法的名称

#### 3. 方法的属性描述符

### 例子

#### function enumerable(value: boolean) {

    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.enumerable = value;
    };

}

class Greeter {
greeting: string;
constructor(message: string) {
this.greeting = message;
}

    @enumerable(false)
    greet() {
        return "Hello, " + this.greeting;
    }

}

## 访问器装饰器

### 使用

#### 声明在一个访问器的声明之前

### 参数

Object.defineProperty()

#### 1. 对于静态成员来说是类的构造函数，对于实例成员来说，是类的原型对象

#### 2. 成员的名称

#### 3. 成员的属性描述符

### 例子

#### function configurable(value: boolean) {

    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.configurable = value;
    };

}

class Point {
private \_x: number;
private \_y: number;
constructor(x: number, y: number) {
this.\_x = x;
this.\_y = y;
}

    @configurable(false)
    get x() { return this._x; }

    @configurable(false)
    get y() { return this._y; }

}

## 属性装饰器

### 使用

#### 声明在一个属性之前

### 参数

#### 1. 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象

#### 2. 成员的名称

## 函数参数装饰器

### 使用

#### 声明在一个参数声明之前

### 参数

#### 1. 对于静态成员来说是类的构造函数，对于实例成员来说是类的原型对象

#### 2. 成员的名称

#### 3. 参数在函数参数列表的索引

## 装饰器的执行顺序

### 不同类型的装饰器，按照装饰器的调用顺序执行

### 类装饰器， 多个类装饰器会按照洋葱模型的方式进行执行

#### 例子

@classFac('2222')
@classFac2('2222')
class TestComponent extends React.Component {}

function classFac(value) {
console.log('classFac')
return function (target) {
console.log('classFac inner')
target.prototype.name = value;
}
}
function classFac2(value) {
console.log('classFac2')
return function (target) {
console.log('classFac2 inner')
target.prototype.name = value;
}
}

// 结果 ，classFac ->classFac2->classFac2 inner->classFac1 inner
