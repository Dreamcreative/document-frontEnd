# webpack.HotModuleReplacementPlugin

## 作用

- webpack 打包出来的 `bundle.js` 不具备热更新的能力，HotModuleReplacementPlugin 将 HMR runtime 注入到 `bundle.js` 中，，使 `bundle.js` 可以和 HMR runtime 建立 WebSocket 连接通信

```js
class HotModuleReplacementPlugin {
  constructor(options) {
    this.options = options || {};
  }
  apply(compiler) {
    // 暴露 module.hot module.accept module.decline 等方法
    const applyModuleHot = parser => {
      parser.hooks.evaluateIdentifier.for('module.hot').tap(
        {
          name: 'HotModuleReplacementPlugin',
          before: 'NodeStuffPlugin'
        },
        expr => {
          return evaluateToIdentifier('module.hot', 'module', () => ['hot'], true)(expr);
        }
      );
      parser.hooks.call.for('module.hot.accept').tap('HotModuleReplacementPlugin', createAcceptHandler(parser, ModuleHotAcceptDependency));
      parser.hooks.call.for('module.hot.decline').tap('HotModuleReplacementPlugin', createDeclineHandler(parser, ModuleHotDeclineDependency));
      parser.hooks.expression.for('module.hot').tap('HotModuleReplacementPlugin', createHMRExpressionHandler(parser));
    };
    // 暴露 import.meta.webpackHot.accept import.meta.webpackHot.decline 等方法
    const applyImportMetaHot = parser => {
      parser.hooks.evaluateIdentifier.for('import.meta.webpackHot').tap('HotModuleReplacementPlugin', expr => {
        return evaluateToIdentifier('import.meta.webpackHot', 'import.meta', () => ['webpackHot'], true)(expr);
      });
      parser.hooks.call
        .for('import.meta.webpackHot.accept')
        .tap('HotModuleReplacementPlugin', createAcceptHandler(parser, ImportMetaHotAcceptDependency));
      parser.hooks.call
        .for('import.meta.webpackHot.decline')
        .tap('HotModuleReplacementPlugin', createDeclineHandler(parser, ImportMetaHotDeclineDependency));
      parser.hooks.expression.for('import.meta.webpackHot').tap('HotModuleReplacementPlugin', createHMRExpressionHandler(parser));
    };
  }
}
```

- 由于 HotModuleReplacementPlugin 向打包后的 `bundle.js` 注入了代码，所以我们能够在代码中使用`module.hot.accept`、`import.meta.webpackHot` 等方法来处理热更新模块

## HotModuleReplacementPlugin 拥有的 API

1. `module.hot`

- accept(module, callback,errHandle): 接受一个模块，并触发 callback 回调，来响应更新，还附带一个错误处理函数

```ts
module.hot.accept(module:string | string[], callback:()=>void, (errHandle = (err, { moduleId, dependencyId }) => {}));

// accept(self) 接收自身更新
module.hot.accept(
  errorHandler // 在计算新版本时处理错误的函数
);
```

- decline(dependencies): 拒绝给定模块更新

```ts
module.hot.decline(
  dependencies // 可以是一个字符串或字符串数组
);

// decline(self) 拒绝自身更新
module.hot.decline();
```

- dispose(callback): 在当前模块代码被替换时执行，用于移除你声明或创建的持久模块

```js
module.hot.dispose(data => {
  // 清理并将 data 传递到更新后的模块...
});
```

- removeDisposeHandler(callback): 删除由 dispose 添加的回调函数

```js
module.hot.removeDisposeHandler(callback);
```

1. `import.meta.webpackHot`

- accept:accept(module, callback,errHandle): 接受一个模块，并触发 callback 回调，来响应更新，还附带一个错误处理函数

```js
import.meta.webpackHot.accept(module:string | string[], callback:()=>void, (errHandle = (err, { moduleId, dependencyId }) => {});

// accept(self) 接收自身更新
import.meta.webpackHot.accept(
  errorHandler // Function to handle errors when evaluating the new version
);
```

- decline(dependencies): 拒绝给定模块更新

```ts
import.meta.webpackHot.decline(
  dependencies // 可以是一个字符串或字符串数组
);
// decline(self) 拒绝自身更新
import.meta.webpackHot.decline();
```

- dispose(callback): 在当前模块代码被替换时执行，用于移除你声明或创建的持久模块

```js
import.meta.webpackHot.dispose(data => {
  // 清理并将 data 传递到更新后的模块...
});
```

- removeDisposeHandler(callback): 删除由 dispose 添加的回调函数

```js
import.meta.webpackHot.removeDisposeHandler(callback);
```

## 其他 API

1. status: 获取当前模块替换的状态
2. check: 测试所有加载模块以进行更新，如果有更新，则 apply()
3. apply: 继续更新进程（module.hot.status()==='ready'）
4. addStatusHandle: 注册一个函数来监听 status 变化
5. removeStatusHandle: 移除一个注册的状态处理函数

## 参考

- [Hot Module Replacement](https://webpack.docschina.org/api/hot-module-replacement/#accept)
