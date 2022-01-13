// 发布订阅模式
// 发布/订阅模式 是一种对象一对多的依赖关系，当对象发生改变时，所有依赖它的对象都将得到状态改变的通知
class PubSub {
  constructor() {
    this.handles = {}
  }
  // 添加事件订阅
  on(type, fn) {
    if (!(type in this.handles)) this.handles[type] = [];
    this.handles[type].push(fn)
  }
  // 消息发布
  emit(type, ...args) {
    if (!(type in this.handles)) return false;
    this.handles[type].forEach(item => {
      item(...args);
    });
  }
  // 取消订阅
  remove(type, fn) {
    if (!(type in this.handles)) return false;
    // 如果 fn 不存在，则删除 type 所有的绑定函数
    // 如果存在，则删除当前的 fn
    if (!fn) return this.handles[type] = null;
    const handles = this.handles[type];
    const index = handles.indexof(fn);
    handles.splice(index, 1)
  }
}
