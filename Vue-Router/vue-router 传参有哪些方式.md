# vue-router 传参有哪些方式

1. query 传参
2. params 传参

## query

query 参数会拼接到 url 后面，刷新页面参数不会消失

```ts
// 传入
this.$router.push({
  path:"/home",
  query:{
    a:1
  }
})
// 接收参数
this.$route.query.a
```

## params

params 参数不会在 url 上，页面刷新参数会消失

```ts
// 传入
this.$router.push({
  name:"/home",
  params: {
    a:1
  }
})

// 接收
this.$route.params.a
```
