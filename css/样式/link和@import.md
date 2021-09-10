# link和@import

## 区别

### 祖先不同
link是HTML标签，@import是css提供的方法

### 加载顺序不同。
 link引用的css会同时被加载，
而@import引入的css,会在页面全部下载之后再加载，
所以在使用@import加载css时，会出现样式不加载的问题

### 兼容性的区别。
@import是css2.1提出的，所以对于低版本的浏览器会不兼容。

### 使用DOM来控制样式的区别。
@import引入的css不能被DOM控制
