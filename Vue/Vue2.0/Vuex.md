# Vuex

## 属性

### state 数据源 相当于 vue中的 data

#### stroe挂载时机
通过vue.mixin() 在beforeCreated周期将$stroe挂载上去

#### store是响应式的
借助vue.的date属性

##### this._s = new Vue({ 
	        data: {
	            // 只有data中的数据才是响应式
	            state: options.state
	        }
	    })

### getters 计算属性，相当于vue中的computed

#### getters是响应式的，
借助了vue的computed实现数据的实时监听

### mutations 方法， 只能执行同步方法 ，只能通过commit方法进行调用

### actions 方法 可以执行异步方法

### module 模块，

#### vuex允许将大的模块分割为多个小的模块

#### modules模块内部的action 、getter、mutation 是注册在全局命名空间的，
可以只用namespace:true使其成为带命名空间的模块

##### 需要在带命名空间的模块中访问全局内容（state, getter）， 
会在getters、actions、mutations的方法中分别使用第三第四参数 rootState、rootGetters 来访问

###### actions  ::: someAction ({ dispatch, commit, getters, rootGetters }) 

###### getters :: somegetter(state. getters,rootState, rootGetters)

##### 希望使用全局action时，

###### {
  actions: {    someOtherAction ({dispatch}) {      dispatch('someAction')    }  },
  modules: {
	foo: {
	  namespaced: true,

	  actions: {
	    someAction: {
	      root: true,          handler (namespacedContext, payload) { ... } // -> 'someAction'        }      }    }  }}

## 问题

### vuex.install

### store内部是如何实现支持模块配置和模块嵌套的

### dispatch(type, payload) ,而在action中执行函数中第一个参数store是从哪里获取的

### 如何区分state是外部直接修改的还是通过mutation方法修改的

### vuex的store时如何注入到组件中的

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

#### 通过vue.mixin() 在beforeCreated周期将$stroe挂载上去

## 必须了解

### vuex中规定所有数据必须通过 action->mustation-> state这个流程进行更新

### vuex时 MVC模式中的Model成 处理数据的
