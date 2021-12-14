# React-Router 6.0.2

## history 库 v6.0.2 -- 专注于记录路由 history 状态

  > `React-Router` 离不开 `history 库`

  > `history 库` 分为 三种路由模式

1. history 模式：在`页面的 url` 上存储 location 信息，通过 `popstate` 监听路由变化 -- 对应 `MemoryRouter`
  ```js
  createBrowserHistory(){
    window.addEventListener('popstate', handlePop);
  }
  ```
2. hash 模式： 在 `window.history.hash` 中存储 location 信息，通过 `popstate` 监听路由变化，在 `IE11 和 低版本不支持 popstate 的浏览器中`使用 `hashchange` 监听路由变化 -- 对应 `HashRouter`
  ```js
  createHashHistory(){
    <!-- 对于那些支持 popstate 的环境，监听 popstate  -->
    window.addEventListener('popstate', handlePop);
    <!-- 对于那些 IE11 和 低版本浏览器 的环境，监听 hashchange -->
    window.addEventListener('hashchange', () => {
      let [, nextLocation] = getIndexAndLocation();
      // Ignore extraneous hashchange events.
      if (createPath(nextLocation) !== createPath(location)) {
        handlePop();
      }
    });
  }
  ```
3. memory 模式：在内存中存储了 location 信息，为了`无浏览器环境，和 React Native` 设计 -- 对应 `MemoryRouter`

```js
// 三种路由返回值，基本相同 history ,memory, hash 模式
history = {
  get action(){
    return action;
  },
  get location(){
    return location
  },
  createHref:(to)=>{
    return typeof to === 'string'? to: createPath(to)
  },
  push:(to, state)=>{
    let nextAction = "PUSH";
    // 获取 to 和 state 生成下一个路由信息
    let nextLocation = getNextLocation(to, state);
    function retry(){
      push(to, state);
    }
    if(allowTx(nextAction, nextLocation, retry)){
      index+=1;
      // entries 存储路由信息的 一个栈
      entries.splice(index, entries.length, nextLocation);
      applyTx(nextAction, nextLocation);
    }
  },
  replace:(to, state)=>{
    let nextAction = 'REPLACE';
    let nextLocation = getNextLocation(to, state);
    function retry(){
      replace(to, state);
    }
    if(allowTx(nextAction, nextLocation, retry)){
      entries[index] = nextLocation;
      applyTx(nextAction, nextLocation);
    }
  },
  go:(delta)=>{
    let nextIndex = clamp(index+ delta, 0 ,entries.length -1);
    let nextAction = "POP";
    let nextLocation = entries[nextIndex];
    function retry(){
      go(delta);
    }
    if(allowTx(nextAction, nextLocation, retry)){
      index = nextIndex;
      applyTx(nextAction, nextLocation);
    }
  },
  back(){
    go(-1);
  },
  forward(){
    go(1);
  },
  listen(listener){
    return listeners.push(listener);
  },
  block(blocker){
    return blockers.push(blocker);
  }
}
```