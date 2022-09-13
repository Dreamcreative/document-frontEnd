# requestAnimationFrame

> `window.requestAnimationFrame()`告诉浏览器，你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。

## 优势

1. CPU 节能：如果使用 `setInterval`实现动画，当页面被隐藏或最小化时，`setInterval`仍然在后台执行动画任务，由于此时页面是不可见状态，刷新动画没有意义，完全是浪费 CPU 资源。而 requestAnimtionFrame 则完全不同，当页面处于未激活状态时，该页面的屏幕刷新任务会被系统暂停，因此 requestAnimationFrame 的渲染也会被停止，当页面重新被激活时，动画会从上次停留的地方继续执行，有效的节省了 CPU 开销。

2. 函数节流：在高频率事件（resize, scroll 等）中，为了防止在一个刷新间隔内发生多次函数执行，requestAnimationFrame 可保证每个刷新间隔内，函数只被执行一次，这样既能保证流畅性，又能更好的节省函数执行的开销。

3. 减少 DOM 操作：requestAnimationFrame 会把每一帧中所有的 DOM 操作集中起来，在一次重绘回流中完成，并且重绘回流的时间间隔紧紧跟随浏览器的刷新频率

## setTimeout 执行动画的缺点

> 通过设置间隔时间来不断改变图像位置，达到动画效果。但是容易出现卡顿、抖动现象

1. setTimeout 任务被放入异步队列，只有当主线程任务执行完毕后才会执行队列中的任务，因此实际的执行时间不确定
2. setTimeout 的固定时间间隔不一定与屏幕刷新的间隔事件相同
