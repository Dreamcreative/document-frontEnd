# Axios取消请求

官方文档指出有两种方法可以取消请求，分别是 cancelToken ​和 AbortController​

1. cancelToken
2. AbortController​

## 代码

* cancelToken：方式一

```ts
const CancelToken = axios.CancelToken
const source = CancelToken.source()
axios.post("/user/12345", { name: "new name" }, { cancelToken: source.token });
source.cancel("Operation canceled by the user.");
```

* cancelToken：方式二

```ts
const CancelToken = axios.CancelToken;
let cancel;
axios.get("/user/12345", {
  cancelToken: new CancelToken(function executor(c) {
    cancel = c;
  }),
});
cancel();
```

* AbortController

```ts
const controller = new AbortController();
axios.get("/foo/bar", { signal: controller.signal }).then(function (response) {
  //...
});
controller.abort();
```
