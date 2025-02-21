# forwardRef(render)

forwardRef 允许组件使用 `ref` 将 DOM 节点暴露给父组件

## useImperativeHandle(ref, ()=>({}))

将收到的 `ref` 传递给 `useImperativeHandle` 并指定你想要暴露给 `ref` 的值

```js
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});
```
