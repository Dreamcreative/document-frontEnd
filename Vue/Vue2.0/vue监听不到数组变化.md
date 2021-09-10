# vue监听不到数组变化

## 监听不到数组

### 直接通过数组下标修改某个元素

### 直接修改数组的长度

## 监听不到对象

### 直接通过对象的属性名赋值

#### this.obj.prop = 1 增

#### delete this.obj.prop 删

#### this.obj.prop = 3 改

## 解决

### 使用 Vue.set() 或者是 this.$set( target, name , value)

## 源码

### vue.set() 、 this.$set()

### vue.delete 、this.$delete
