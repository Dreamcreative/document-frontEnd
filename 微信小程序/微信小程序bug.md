1. 微信小程序使用 canvas 的 bug

  > 微信小程序使用canvas，canvas 的层级太高，当出现modal框时，canvas 会出现在modal框之上。同时 canvas 的 `z-index`属性不生效。

    - 解决

      1. 当 modal 出现时，隐藏 canvas
      2. 当 canvas 渲染完成后，通过`wx.canvasToTempFilePath()`方法，将 canvas 转换为图片
      3. 通过 `covaer-view`、`cover-image` 等原生组件，可以在一定程度上解决 canvas 层级太高的问题

2. 微信小程序中 canvas 转图片的 bug

  > canvas 转换图片需要调用 `wx.canvasToTempFilePath(config, this)`方法。

    * config：是对 canvas 生成图片的一些配置项，
    * this：是当前组件，如果不传 this，会导致报错`canvasToTempFilePath: fail canvas is empty`。但是在 Taro 框架中实际处理时，传入 this，仍然无法解决该报错，这时，就需要将 this 改为 `this.$scope`。`wx.canvasToTempFilePath(config, this.$scope)`

  > `wx.canvasToTempFilePath()`需要在 `ctx.draw(boolean, callback)`方法中调用。

  > 以下是在处理一个在微信小程序中添加`水印`时遇到的一个问题：真机上的 bug，通过`wx.canvasToTempFilePath(config, this)`，转换成功后返回的图片地址是一个`http://tmp/xxx.png`格式的本机地址。如果将该地址设置为 `view 标签`的背景时，Android 手机可以渲染成功，但是在 `IOS`手机中，该地址无法被正常渲染。但是可以通过使用`image 标签`来渲染。

* [Taro 水印组件](./WaterMark/index.tsx)

## 参考

* [wx.canvasToTempFilePath](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/wx.canvasToTempFilePath.html)
