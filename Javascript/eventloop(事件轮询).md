# eventloop(事件轮询)

## 浏览器

### 宏任务

1. script
2. setTimeout
3. setInterval
4. UI rending
5. IO

### 微任务

1. Promise
2. MutationObserver
3. ......

> 浏览器是单线程执行，只有一个主线程，先执行 script - `最大的一个宏任务`。任务分为`同步任务`和`异步任务`，执行过程中，先执行同步任务，当遇到异步任务时，如果是宏任务就放入宏任务队列中，如果是微任务就放到微任务队列中，当同步任务执行完毕之后，会去查找微任务队列是否有任务需要执行，当情况微任务队列后；就开始执行下一个宏任务。就这样 `宏任务->微任务` 反复执行就形成了 `eventloop` 事件循环

## nodejs

nodejs >= 11 表现

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

## 宏任务

1. setTimeout
2. setInterval
3. setImmediate
4. IO

## 微任务

1. process.nextTick
2. Promise
3. MutationObserver

### Nodejs >= 11

> 当 nodejs 版本大于等于 11 时， nodejs 的事件循环与浏览器的事件循环`表现一致`。都是在`同一个阶段的同步任务执行完成之后，执行微任务，然后再执行下一个阶段的任务`

### Nodejs < 11

> 当 nodejs 版本小于 11 时，nodejs 的事件循环与浏览器的事件循环`表现不一致`。nodejs `总是先将定时任务执行完毕之后，再去执行微任务`
