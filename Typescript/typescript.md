# typescript（结构性的类型系统）

## 基础类型

### 布尔值 boolean

### 数字 number

### 字符串 string

### 数组 Array

#### let list : number[] = [1, 2, 3]
或者
let list : Array<number> = [1, 2, 3]

### 元祖 表示一个已知元素数量和类型的数组，各元素类型不必相同

#### let x:[string, number] = ['hello', 1]

### 枚举 enum

#### 默认情况下，从0开始为元素编号。
也可以手动指定成员的数值
enum  Color { red=1 , green, yellow }
enum Color { red =1 , green=3, yellow=4}

### unknown

#### typescript顶部类型，
是any类型的安全版本

使用unknown执行任何操作之前，必须先通过以下方法限定其类型
1. 类型断言
  (value as number).toFixed(2)
2. 类型保护
  if(typeof value === 'string'){ // TODO }
  if(value instanceof string) { // TODO }
3. 断言函数
function assertionFunction(arg: unknown): asserts arg is RegExp {
  if (! (arg instanceof RegExp)) {
	   throw new TypeError('Not a RegExp: ' + arg);
  }
}
 

### any

#### typescript顶部类型，
失去typescript的静态类型系统给予的所有保护。

使用any时，最好先考虑使用 unknown

### void/undefined/null

### never

#### 表示永不存在的值的类型

## 类型断言

### 没有运行时的影响，只在编译阶段起作用
形式
1. 尖括号语法
	let value: any = 'hello';
	let valueLength :number = (<string>value).length
2 . as 语法
  let value: any = 'hello';
  let valueLength:number = (value as string).length

## type/interface区别

### 相同点

#### 1. 都可以描述一个对象或函数

##### interface User{
 name:string;
 age:number;
 (name:string, age:number): void
}

##### type User {
 name:string,
 age:number,
}
type setProps = (name:string,age:number)=> void

#### 2. 都可以进行拓展

##### interface Name{
 name:string;
}
interface User extends Name{
 age:number;
}

##### type Name = {
 name:string,
}
type User = Name & {age:number}

### 不同点

#### 1. type可以而interface不行

##### 1. 基本类型别名
 type Name = string;
2. 联合类型
 interface Dog{
 wong();
}
 interface Cat{
 miao();
}
type Pet = Dog|Cat

##### type语句还可以使用typeof获取实例的类型进行赋值
let div = document.getElement('div');
type B=typeof div

#### 2. interface可以而type不行

##### 声明合并
interface User{
 name:string
}
interface User{
 age:number
}
/*
 User {
 name :string,
age:number
}
*/

## 高级类型

### 交叉类型 &

#### 多种类型的集合，能够访问类型集合的所有成员 （并集） & 

##### interface People{
 age:number;
}
interface Man {
 sex:string;
}

const lilei = (man: People & Man)=>{
 console.log(man.age);
console.log(man.sex);
}

### 联合类型 |

#### 多种类型的联合，只能访问联合中所共有的成员 （交集） |

##### interface Woman{
 age: number;
 sex: string;
}
interface Man {
 age: number;
}

declare function People () : Woman | Man;
let people = People();
people.age = 18; // ok
people.sex = '男'; // false 非共有成员

## 泛型

### 在定义 函数/接口/类 时，不预先指定具体的类型，
而是在使用的时候再指定类型的一种特性

#### 泛型函数

##### function identity<T>(arg: T): T {
	return arg;
}

#### 泛型接口

##### interface GenericIdentityFn {
	<T>(arg: T): T;
}

#### 泛型类

##### class GenericNumber<T> {
	zeroValue: T;
	add: (x: T, y: T) => T;
}

## typeof

### 用来获取一个 变量/对象/函数 的类型

#### interface Person {
	name: string;
	age: number;
}

const sem: Person = { name: "semlinker", age: 30}
type Sem = typeof sem; // type Sem = Person

#### const kakuqo = {
	name: "kakuqo",
	age: 30,
	address: {
	    province: '福建',
	    city: '厦门'
	}
}

type Kakuqo = typeof kakuqo;
/**
 * type Kakuqo = {
 *  name: string;
 *  age: number;
 *  address: {
 *   province: string;
 *   city: string;
 *  }
 * }
 */

## 类型操作符

### keyof 索引类型查询操作符

#### 索引类型

### in

#### 约束对象key的值

type TName = "zhangsan" | "lisi" | "wangwu";
type TUser = {
// TUser 的key 只会在 TName中选择
  [key in TName]: number;
};
const obj: TUser = { zhangsan: 1, lisi: 2, wangwu: 3 };

### T[K] 索引访问操作符

## typescript自带的 泛型类型

### Required<T> 转成非空属性

#### interface IPerson {
  name?: string;
  age?: number;
}
type IPersonRequired = Required<IPerson>;
/*
interface IPersonRequired {
  name: string;
  age: number;
} 
*/
const person: IPersonRequired = { name: "zhangsan", age: 18 };

// 内部实现
type Required<T> = {
  [P in keyof T]-?: T[P];
};

### Partial<T> 转成可空属性

#### interface IPerson {
  name: string;
  age: number;
}
type IPersonPartial = Partial<IPerson>;
/*
interface IPersonPartial {
  name?: string;
  age?: number;
} 
*/
const person: IPersonPartial = {};

// 内部实现
type Partial<T> = {
  [P in keyof T]?: T[P];
};

### Pick<T> 取出某些属性，提高interface的复用率

#### /*
  Pick<T>，反之Omit<T>
*/
interface TState {
  name: string;
  age: number;
  like: string[];
}
interface ISingleState {
  name: string;
  age: number;
}
interface ISingleState extends Pick<TState, "name" | "age"> {}

### 。。。。
