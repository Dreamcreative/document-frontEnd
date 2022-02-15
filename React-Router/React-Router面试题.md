# React-Router 面试题

1. `React-Router` 怎么获取 URL 参数

```js
// 使用 useParams
useParams(){
  // 通过 上下文获取 匹配路由
  let {matches} = React.useContext(RouteContext);
  // 获取匹配到的最后一个路由信息
  let routeMatch = matches[matches.length -1 ];
  // 返回当前路由的 params
  return matches? routeMatch.params: {};
}
```

2. `React-Router` 在 history 模式中 push 和 replace 有什么区别

    > [push、replace](./README.md)

    > push: 是添加一个记录到历史堆栈的最后

    > replace: 是替换历史堆栈中的某一条记录

3. `React-Router` `<Router>` 组件有几种类型

    1. BrowserRouter 使用 `history 库`的 `createBrowserHistory()`,监听 `popstate` 变化
    2. HashRouter 使用 `history 库`的 `createHashHistory()`，对于支持 `popstate` 的环境，监听 `popstate`，对于不支持 `popstate` 的环境，监听 `hashchange`
    3. MemoryRouter 使用 `history 库`的 `createMemoryHistory()`,监听 `popstate`，在 `无浏览器环境`或者 `React Native` 中使用

4. `React-Router` 怎么设置重定向

    1. 通过 `<Redirect> 组件`
    2. history.replace(to, state)

5. `React-Router` 怎么获取历史对象

    1. React-Router v5 使用 useHistory(),获取历史对象
    2. React-Router v6 使用 useNavigate()，获取历史对象

```js
useNavigate(){
  let {basename, navigator} = React.useContext(NavigationContext);
  let {matches} = React.useContext(RouteContext);
  let {pathname: locationPathname} = useLocation();
  let navigate: NavigateFunction = React.useCallback(
    (to: , options: { replace, state} = {}) => {
      if (!activeRef.current) return;

      if (typeof to === "number") {
        navigator.go(to);
        return;
      }

      let path = resolveTo(
        to,
        JSON.parse(routePathnamesJson),
        locationPathname
      );

      if (basename !== "/") {
        path.pathname = joinPaths([basename, path.pathname]);
      }

      (!!options.replace ? navigator.replace : navigator.push)(
        path,
        options.state
      );
    },
    [basename, navigator, routePathnamesJson, locationPathname]
  );
  return navigate;
}
```

6. `React-Router` switch 有什么用 - v5

> `<Switch>` 用来包裹 `<Route>`和 `<Redirect>`，使用 `<Switch>`只渲染第一个匹配到的路由，如果不使用`<Switch>`,就会将所有匹配到的路由都展示出来

> 在 `React-Router` v6 中删除了 `<Swich>`

```js
// v5  packages/react-router/modules/Switch.js
// 使用 React.children.forEach 遍历子组件，获取第一个匹配到的 子组件，返回

class Switch extends React.Component {
  render(){
    return (
      <RouterContext.Consumer>
      {
        (context)=>{
          const location = this.props.children || context.location;
          let element, match;
          React.children.forEach(this.props.children,(child)=>{
            if(match ==null && React.isValidElement(child)){
              element = child;
              const path = child.props.path||child.props.from;
              match=path
              ? matchPath(location.pathname, { ...child.props, path })
                : context.match;
            }
          })
          return match
            ? React.cloneElement(element, {location, computedMatch:match})
            : null;
        }
      }
      </RouterContext.Consumer>
    )
  }
```

7. `React-Router` 实现原理

    > 通过 `history 库` 实现 `BrowerRouter`、`HashRouter`、`MemoryRouter`

8. `React-Router` 路由有几种模式

    1. history 模式
    2. hash 模式
    3. memory 模式

9. `React-Router` react 路由和普通路由有什么区别

    > React 路由是前端路由，普通路由是后端路由

    > React 路由不管是 history 还是 hash 模式，都是监听事件（`popstate/hashchange`）变化，实现组件切换。页面的文件始终没有变化，

10. `React-Router` react 路由的优缺点

11. `React-Router` react 路由是什么

> 纯前端路由，根据 url `地址上的 hash` 或 `path 路径`的变化，切换页面组件展示。使页面不用刷新，提升用户体验

12. `React-Router` `<Link>`和`<a>` 有什么区别

    1. Link 组件拦截了浏览器的默认行为
    2. Link 组件最终渲染为 `<a>`标签

```js
Link = React.forwardRef(
  function LinkWithRef(
    { onClick, reloadDocument, replace = false, state, target, to, ...rest },
    ref
){
  let href = useHref(to);
  let internalOnclick = useLinkClickHandle(to, {replace, state, target});
  function handleClick(e){
    if(onClick) onClick(e);
    if(!e.defaultPrevented && !e.reloadDocument){
      internalOnClick(e);
    }
  }
  return (
    <a
    {...rest}
    href={href}
    onClick={handleClick}
    ref={ref}
    target={target}
    />
  )
}
```

13. withRouter 的作用

> withRouter 是一个高阶组件，可以包装任意自定义组件，将`react-router`的 history、location、 match 三个对象传入。

14. `<Redirect>` 重定向组件 v6 中被删除

> 重定向组件

```js
function Redirect({computedMatch, to, push = false}){
  return (
    <RouterContext.Consumer>
      {
        context=>{
          const { history, staticContext } = context;
          const method = push? history.push: history.replace;
          const location = createLocation(
            computedMatch
              ? typeof to === "string"
                ? generatePath(to, computedMatch.params)
                : {
                    ...to,
                    pathname: generatePath(to.pathname, computedMatch.params)
                  }
              : to
          );
          // When rendering in a static context,
          // set the new location immediately.
          if (staticContext) {
            method(location);
            return null;
          }
          return (
            <Lifecycle
              onMount={() => {
                method(location);
              }}
              onUpdate={(self, prevProps) => {
                const prevLocation = createLocation(prevProps.to);
                if (
                  !locationsAreEqual(prevLocation, {
                    ...location,
                    key: prevLocation.key
                  })
                ) {
                  method(location);
                }
              }}
              to={to}
            >
            </Lifecycle>
          )
        }
      }
    </RouterContext.Consumer>
  )
}
```
