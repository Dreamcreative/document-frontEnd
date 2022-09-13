# HTML5 有哪些更新

1. 语义化标签

- header:定义文档的头部
- nav:定义导航链接部分
- footer:定义文档或节的页脚（底部）
- article:定义文章的内容
- section:定义文档中的节（section、区段）
- aside:定义其所处内容之外的内容（侧边）

2. 媒体标签

- 音频：<audio src="" controls autoplay loop="true"></audio>
- 视频：<vidio src="" poster="imgs/aa.jpg" controls></vidio>

3. 表单

> 表单类型

- email: 能够验证当前输入的邮箱地址是否合法
- url：验证 URL
- number:只能输入数字，其他文本无法输入，而且自带上下增大减小箭头，max 可以设置最大值，min 可以设置最小值，value 为默认值
- search:输入框后面会提供一个小叉，可以删除输入的内容，更人性化
- range:可以提供一个范围，其中可以设置 max 、min、value，其中 value 可以设置为默认值
- color:提供一个颜色拾取器
- time: 时分秒
- date:日期选择年月日
- datetime:日期和事件
- datetime-local:日期事件空间
- week:周控件
- month：月控件

> 表单属性

- placeholder ：提示信息
- autofocus ：自动获取焦点
- autocomplete=“on” 或者 autocomplete=“off” 使用这个属性需要有两个前提：
  1. 表单必须提交过
  2. 必须有 name 属性。
- required：要求输入框不能为空，必须有值才能够提交。
- pattern=" " 里面写入想要的正则模式，例如手机号 patte="^(+86)?\d{10}$"
- multiple：可以选择多个文件或者多个邮箱
- form=" form 表单的 ID"

4. 进度条、度量器

- progress 标签：用来表示任务的进度（IE、Safari 不支持），max 用来表示任务的进度，value 表示已完成多少
- meter 属性：用来显示剩余容量或剩余库存（IE、Safari 不支持）

5. DOM 查询操作

- document.querySelector()
- document.querySelectorAll()

6. web 存储

> HTML5 提供了两种客户端存储方式

- localStorage: 没有时间限制的数据存储，除非手动删除
- sessionStorage: 也能够存储数据，但是当标签页关闭之后，数据会被删除

7. 其他

- 拖放：`<img draggable="true">`
- canvas: `<canvas id="myCanvas" width="200" height="100"></canvas>`
- svg:可伸缩矢量图形

> 总结

1. 新增语义化标签 `<header>`、`<footer>`、`<asider>`、`<nav>`、`<artical>`、`<section>`
2. 音频`<audio>`、视频`<video>`
3. 新增客户端存储 localStorage、sessionStorage
4. canvas、svg(矢量图)、websocket(持久连接)
5. input 标签新增属性 placeholder、autocomplete、autofocus、required
