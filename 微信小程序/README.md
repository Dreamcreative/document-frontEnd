# 微信小程序面试题

1. bindtap 和 catchtap 的区别

> bind 事件不会阻止冒泡事件向上冒泡。catch 事件会阻止冒泡事件向上冒泡

2. 微信小程序主要目录和文件

  * project.config.json 项目配置文件，
  * App.js 设置一些全局的基础数据
  * App.json 底部tab,标题栏和路由配置
  * App.wxss 公共样式，引入 iconfont 等
  * pages 存放页面的文件夹
  * index.json 配置当前页面标题和引入组件等
  * index.wxml 页面结构
  * index.wxss 页面样式表
  * index.js 页面的逻辑，请求和数据处理等

3. 页面生命周期

  * onload：首次进入页面时加载
  * onshow：页面加载完成或者重新进入页面时触发
  * onReady：页面首次渲染完成时触发
  * onHide：从前台切换到后台或者切换到其他页面时触发
  * onUnload：页面卸载时触发

4. 应用生命周期

  * onLaunch：初始化小程序时触发，全局只触发一次
  * onShow：小程序初始化完成，或者用户从后台切换到前台显示时触发
  * onHide：用户从前台切换到后台隐藏是触发
  * onError：小程序发生脚本错误，或者 api 调用失败

5. 事件详解

  * 冒泡事件：当组件上事件被触发后，事件会向父节点传递

    * touchstart
    * touchmove
    * touchcancel
    * touchend
    * tap
    * ....

  * 非冒泡事件：当组件上事件被触发后，事件不会向父节点传递

6. wx.navigateTo 和 wx.redirectTo 区别

  * `wx.navigateTo` 类似于 `history.push`,会向路由栈中添加一个新的路由
  * `wx.redirectTo` 类似于`history.redirect`，会关闭当前页面，打开一个新的页面，路由栈不变

## 参考

* [微信官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/route.html)
