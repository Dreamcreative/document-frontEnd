# webbpack 热更新

## react 项目配置 hmr

```js
// 1. webpack.config.json
const webpack = require('webpack');
module.exports = {
  devServer: {
    host: 'localhost',
    hot: true,
    port: 8080
  },
  plugins: [new webpack.HotModuleReplacementPlugin()]
};

// 2. app.tsx
// react 18
import ReactDOM from 'react-dom/client'
const root = document.getElementById('root')
let _module = module as any //如果是js，这一行不需要
if (_module.hot) {
  _module.hot.accept(() => {
    ReactDOM.createRoot(root).render(<App />)
  })
}
ReactDOM.createRoot(root).render(<App />)
```

## webpack hmr 实现原理
