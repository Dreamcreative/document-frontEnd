# Vuex

## 属性

### state 数据源 相当于 vue 中的 data

#### stroe 挂载时机

通过 vue.mixin() 在 beforeCreated 周期将$stroe 挂载上去

#### store 是响应式的

借助 vue.的 date 属性

##### this.\_s = new Vue({

            data: {
                // 只有data中的数据才是响应式
                state: options.state
            }
        })

### getters 计算属性，相当于 vue 中的 computed

#### getters 是响应式的，

借助了 vue 的 computed 实现数据的实时监听

### mutations 方法， 只能执行同步方法 ，只能通过 commit 方法进行调用

### actions 方法 可以执行异步方法

### module 模块，

#### vuex 允许将大的模块分割为多个小的模块

#### modules 模块内部的 action 、getter、mutation 是注册在全局命名空间的，

可以只用 namespace:true 使其成为带命名空间的模块

##### 需要在带命名空间的模块中访问全局内容（state, getter），

会在 getters、actions、mutations 的方法中分别使用第三第四参数 rootState、rootGetters 来访问

###### actions  ::: someAction ({ dispatch, commit, getters, rootGetters })

###### getters :: somegetter(state. getters,rootState, rootGetters)

##### 希望使用全局 action 时，

###### {

actions: { someOtherAction ({dispatch}) { dispatch('someAction') } },
modules: {
foo: {
namespaced: true,

      actions: {
        someAction: {
          root: true,          handler (namespacedContext, payload) { ... } // -> 'someAction'        }      }    }  }}

## 问题

### vuex.install

### store 内部是如何实现支持模块配置和模块嵌套的

### dispatch(type, payload) ,而在 action 中执行函数中第一个参数 store 是从哪里获取的

### 如何区分 state 是外部直接修改的还是通过 mutation 方法修改的

### vuex 的 store 时如何注入到组件中的

```javascript
Vue.mixin({
	beforeCreated(){
    	if(this.$options && this.$options.store){
// 找到根组件 上面挂一个$store
          this.$store=this.$options.store
    }esle{
// 非跟组件指向其父组件的$store
    	this.$store=this.$parent && this.$parent.4store
    }
})
```

#### 通过 vue.mixin() 在 beforeCreated 周期将$stroe 挂载上去

## 必须了解

### vuex 中规定所有数据必须通过 action->mustation-> state 这个流程进行更新

### vuex 时 MVC 模式中的 Model 成 处理数据的
