# eventloop(事件轮询)

## 浏览器

### 宏任务

#### script/setTimeout/setInterval/ IO /UI rending

### 微任务

#### Promise/ MutationObserver

### 浏览器是单线程执行，只有一个主线程，先执行script,
执行过程中，将宏任务放到宏任务队列，微任务放到微
任务队列中，当同步任务执行完毕之后，会查看微任务
队列中是否还有任务需要执行。执行完微任务之后，就
开始执行下一个宏任务。反复执行宏任务->微任务

### 浏览器是单线程的，任务分为同步任务与异步任务，而
异步任务又分为宏任务与微任务。在代码执行过程中，
将同步任务放入执行栈中执行，
遇到异步任务，会分别将宏任务放入宏任务队列中，微
任务放入微任务队列中。当一个宏任务中的同步代码执
行完毕之后，会接着调用微任务队列，当微任务调用完
成之后，继续执行下一个宏任务，这样循环执行，称为
事件循环

## Nodejs

```javascript
   ┌───────────────────────┐
┌─>│        timers         │<————— 执行 setTimeout()、setInterval() 的回调
│  └──────────┬────────────┘
|             |<-- 执行所有 Next Tick Queue 以及 MicroTask Queue 的回调
│  ┌──────────┴────────────┐
│  │     pending callbacks │<————— 执行由上一个 Tick 延迟下来的 I/O 回调（待完善，可忽略）
│  └──────────┬────────────┘
|             |<-- 执行所有 Next Tick Queue 以及 MicroTask Queue 的回调
│  ┌──────────┴────────────┐
│  │     idle, prepare     │<————— 内部调用（可忽略）
│  └──────────┬────────────┘     
|             |<-- 执行所有 Next Tick Queue 以及 MicroTask Queue 的回调
|             |                   ┌───────────────┐
│  ┌──────────┴────────────┐      │   incoming:   │ - (执行几乎所有的回调，除了 close callbacks 以及 timers 调度的回调和 setImmediate() 调度的回调，在恰当的时机将会阻塞在此阶段)
│  │         poll          │<─────┤  connections, │ 
│  └──────────┬────────────┘      │   data, etc.  │ 
│             |                   |               | 
|             |                   └───────────────┘
|             |<-- 执行所有 Next Tick Queue 以及 MicroTask Queue 的回调
|  ┌──────────┴────────────┐      
│  │        check          │<————— setImmediate() 的回调将会在这个阶段执行
│  └──────────┬────────────┘
|             |<-- 执行所有 Next Tick Queue 以及 MicroTask Queue 的回调
│  ┌──────────┴────────────┐
└──┤    close callbacks    │<————— socket.on('close', ...)
   └───────────────────────┘
```

### 宏任务

#### setTimeout/setInterval/setImmediate/IO

### 微任务

#### process.nextTick/Promise/MutationObserver

### Nodejs >=11

#### Nodejs>11时，eventloop与浏览器的eventloop表现
形式相同。它会在同步任务执行完成后，执行微任务，
然后再执行下一个阶段的任务

### Nodejs<11

#### nodejs<11时，eventloop的表现与浏览器的eventloop
不同。它总是先将定时任务执行完成之后才会执行微任
务

### 详解

#### 每一个阶段完成后 ，会执行process.nextTick，以及微
任务，并且process.nextTick是优先级最高的微任务

#### 1. timer

##### 执行 setTimeout、setInterval中到期的callback

#### 2 .I/O callbacks

##### 上一循环中少数I/O callbacks会在推迟到这一轮的这一阶段执行

#### 3 . idle、prepare

##### node内部的生命周期函数的执行

#### 4. poll（最重要的阶段）

##### 执行I/Ocallback，在适当的条件下会阻塞

#### 5. check

##### 执行setImmediate的callback

#### 6. close callback

##### 执行close的callback, 例如 process.on("close",callback)
