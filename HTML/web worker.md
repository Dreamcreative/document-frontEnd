# web worker

> JavaScript 是单线程的，如果在执行脚本时，页面的状态是不可响应的，直到脚本执行完成后，页面才变得可响应

> `web worker` 是运行在后台的 js ,独立于其他脚本，不会影响页面的性能。并且通过 `postMessage`将结果回传到主线程。这样在执行复杂的耗时的脚本时就不会阻塞主线程了

## 注意点

  1. 同源限制

    * 分配给 Worker 线程运行的脚本文件，必须与主线程的脚本文件同源
  
  2. DOM 限制

    * Worker 线程所在的全局对象，与主线程不一样，无法读取主线程所在页面的 DOM 对象，也无法使用 document、window、parent 这些对象。但是 Worker 线程可以读取 navigator和 location 对象

  3. 通信联系

    * Worker 线程和主线程不在同一个上下文环境，它们不能直接通信，必须通过消息完成

  4. 脚本限制

    * Worker 线程不能执行 `alert()`、`confirm()`方法，但可以 XMLHttpRequest 对象发起 AJAX 请求

  5. 文件限制

    * Worker 线程无法读取本地文件，即不能打开本机的文件系统，它所加载的脚本必须来自网络
