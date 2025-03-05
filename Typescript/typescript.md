# typescript

1. TypeScript 和 JavaScript 有什么区别
   1. Typescript 是 JavaScript 的超集，添加了静态类型系统
   2. Typescript 需要编译成 JavaScript 才能运行
   3. Typescript 提供了接口、枚举、泛型等 JavaScript 没有的特性
   4. Typescript 支持最新的 ECMAScript 特性，并向下兼容
   5. Typescript 提供更好的工具支持，例如代码补全、类型检查和重构工具

2. 什么是类型注解

类型注解是 Typescript 中明确指定变量、参数或返回值类型的方式

```ts
let name: string = "John";
function add(a: number, b: number): number {
    return a + b;
}
```

3. 什么是类型推断

Typescript 能够根据上下文自动推断变量的类型，无需显式注解

```ts
// TypeScript 自动推断 name 为 string 类型
let name = "John";

// TypeScript 自动推断返回类型为 number
function add(a: number, b: number) {
    return a + b;
}
```

4. 解释 Typescript 中的 interface

接口是定义对象结构的一种方式，描述对象应该具有的属性和方法

```ts
interface Person {
    name: string;
    age: number;
    greet(): void;
}

const john: Person = {
    name: "John",
    age: 30,
    greet() {
        console.log(`Hello, my name is ${this.name}`);
    }
};
```

5. type 和 interface 有什么区别
   1. interface 可以继承和实现，支持声明合并
   2. type 可以创建联合类型、交叉类型，可以使用条件类型
   3. interface 只能描述对象结构，而 type 可以为任何类型创建别名

```ts
// interface 示例
interface Animal {
    name: string;
}
interface Dog extends Animal {
    bark(): void;
}

// type 示例
type Animal = {
    name: string;
}
type Dog = Animal & {
    bark(): void;
}

// 联合类型 (只能用 type)
type ID = string | number;
```

6. 什么是泛型

泛型允许创建可重用的组件，这些组件可以处理多种类型而不失去类型安全性

```ts
// 泛型函数
function identity<T>(arg: T): T {
    return arg;
}

// 泛型接口
interface Box<T> {
    value: T;
}

// 泛型类
class Container<T> {
    private item: T;
    
    constructor(item: T) {
        this.item = item;
    }
    
    getItem(): T {
        return this.item;
    }
}
```

7. 联合类型和交叉类型
   1. 联合类型：表示一个值可以有多种类型，使用 `|` 分隔
   2. 交叉类型：将多个类型合并为一个类型，使用 `&` 分隔

```ts
// 联合类型
type ID = string | number;
let id: ID = 123; // 有效
id = "abc";       // 也有效

// 交叉类型
type Employee = {
    name: string;
    id: number;
};

type ContactInfo = {
    email: string;
    phone: string;
};

type EmployeeWithContact = Employee & ContactInfo;

const employee: EmployeeWithContact = {
    name: "John",
    id: 123,
    email: "john@example.com",
    phone: "555-1234"
};
```

8. 类型守卫

类型守卫是一种运行时检查，用于确定值的类型，帮助 Typescript 在特定代码块中缩小类型范围

```ts
// 使用 typeof 类型守卫
function process(value: string | number) {
    if (typeof value === "string") {
        // 在这个块中，TypeScript 知道 value 是 string 类型
        return value.toUpperCase();
    } else {
        // 在这个块中，TypeScript 知道 value 是 number 类型
        return value.toFixed(2);
    }
}

// 使用 instanceof 类型守卫
class Dog {
    bark() { return "Woof!"; }
}

class Cat {
    meow() { return "Meow!"; }
}

function makeSound(animal: Dog | Cat) {
    if (animal instanceof Dog) {
        // 在这个块中，TypeScript 知道 animal 是 Dog 类型
        return animal.bark();
    } else {
        // 在这个块中，TypeScript 知道 animal 是 Cat 类型
        return animal.meow();
    }
}

// 自定义类型守卫
interface Fish { swim(): void; }
interface Bird { fly(): void; }

function isFish(pet: Fish | Bird): pet is Fish {
    return (pet as Fish).swim !== undefined;
}

function move(pet: Fish | Bird) {
    if (isFish(pet)) {
        // 在这个块中，TypeScript 知道 pet 是 Fish 类型
        pet.swim();
    } else {
        // 在这个块中，TypeScript 知道 pet 是 Bird 类型
        pet.fly();
    }
}
```

9. keyof 操作符

keyof 操作符用于获取一个对象类型的所有键的联合类型

```ts
interface Person {
    name: string;
    age: number;
    location: string;
}

type PersonKeys = keyof Person; // "name" | "age" | "location"

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

const person: Person = {
    name: "John",
    age: 30,
    location: "New York"
};

const name = getProperty(person, "name"); // 类型安全，返回 string
```

10. 条件类型

条件类型是根据条件表达式选择两种可能的类型之一，`类似于三目运算`

```ts
type IsString<T> = T extends string ? true : false;

type A = IsString<string>;  // true
type B = IsString<number>;  // false

// 实用的条件类型示例
type NonNullable<T> = T extends null | undefined ? never : T;
type Extracted = NonNullable<string | null | undefined>;  // string
```

11. 在 Typescript 中处理异步操作

使用 Promise 类型和 async/await 语法

```ts
// Promise 类型
function fetchData(): Promise<User> {
    return fetch('/api/user')
        .then(response => response.json());
}

interface User {
    id: number;
    name: string;
}

// 使用 async/await
async function getUser(): Promise<User> {
    const response = await fetch('/api/user');
    const user: User = await response.json();
    return user;
}
```

12. unknown 类型与 any 有什么区别
    1. unknown 是类型安全的 any
    2. 使用 unknown 类型的值需要先进行类型检查或类型断言
    3. any 类型可以执行任何操作，绕过类型检查

```ts
// any 类型
let valueAny: any = 10;
valueAny.foo.bar;  // 不会报错，但运行时可能会失败

// unknown 类型
let valueUnknown: unknown = 10;
// valueUnknown.foo.bar;  // 错误：对象的类型为 'unknown'

// 需要先进行类型检查
if (typeof valueUnknown === "object" && valueUnknown !== null) {
    // 使用类型断言
    const obj = valueUnknown as { foo?: { bar: string } };
    if (obj.foo) {
        console.log(obj.foo.bar);
    }
}
```

13. Typescript 中的 readonly 修饰符

readonly 修饰符用于标记属性或数组为只读，防止赋值后被修改

```ts
interface Point {
    readonly x: number;
    readonly y: number;
}

const point: Point = { x: 10, y: 20 };
// point.x = 5;  // 错误：无法分配到 'x' ，因为它是只读属性

// 只读数组
const numbers: ReadonlyArray<number> = [1, 2, 3];
// numbers.push(4);  // 错误：'ReadonlyArray<number>' 上不存在属性 'push'
```

14. 装饰器

装饰器是一种特殊的类型声明，可以附加到类、方法、访问器、属性或参数上，用于修改其行为或添加元数据

```ts
// 类装饰器
function Logger(constructor: Function) {
    console.log(`Creating instance of: ${constructor.name}`);
}

@Logger
class Person {
    constructor(public name: string) {}
}

// 方法装饰器
function Log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    
    descriptor.value = function(...args: any[]) {
        console.log(`Calling ${propertyKey} with:`, args);
        return original.apply(this, args);
    };
    
    return descriptor;
}

class Calculator {
    @Log
    add(a: number, b: number) {
        return a + b;
    }
}
```
