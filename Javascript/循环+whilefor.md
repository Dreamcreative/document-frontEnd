# 循环 while/for

## while 循环

### while(){} 先判断条件,再执行函数体

### do{}while()先执行函数体，再判断条件

### while() 内的条件会被计算，隐式转换为 Boolean

## for 循环

### for( begin ; condition ; step ){} 每一个条件都可以省略

## 跳出循环

### break 跳出整个循环

### continue 跳出本次循环，进入下一个循环条件(如果存在)

### 从多层循环中跳出来

#### 使用标签

labelName: for(){} ;

outer:for(){
  // 第一层循环
  for(){
   // 第二次循环  
//寻找名为 outer 的循环，并跳出当前循环
break outer;
// 寻找名为 outer 的循环，进入下一个循环条件
continue outer; 
  }
}
