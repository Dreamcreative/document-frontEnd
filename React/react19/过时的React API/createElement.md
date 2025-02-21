# createElement

创建一个 React 元素

## element = createElement(type, props, ...children)

```js
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    '你好',
    createElement('i', null, name),
    '，欢迎！'
  );
}

export default function App() {
  return createElement(
    Greeting,
    { name: '泰勒' }
  );
}
```
