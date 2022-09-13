# 常见的 meta 标签

> `meta` 标签由 `name`、`content` 属性定义，用来描述网页文档的属性

## 常用的 meta 标签

1. charset: 用来描述 HTML 文档的编码类型

   - <meta charset='utf-8'/>

2. keywords：页面关键词

   - <meta name="keywords" content="关键词"/>

3. description:页面描述

   - <meta name="description" content="页面描述"/>

4. refresh:页面重定向和刷新

   - <meta http-equiv="refresh" content="0;"/>

5. viewport:适配移动端，可以控制视口的大小和比例

   - <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1"/>

6. 搜索引擎索引方式

   - <meta name="robots" content="index,follow"/>

   > content 的参数

   1. all:文件将被检索，且页面上的链接可以被查询
   2. none:文件将不被检索，且页面上的链接不可以被查询
   3. index:文件将被检索
   4. follow:页面上的链接可以被检索
   5. noindex:文件不被检索
   6. nofollow:页面上的链接不被检索
