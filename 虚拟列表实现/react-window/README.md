# react-window

## 主要代码

```js
import { createElement, PureComponent } from 'react';

export default function createListComponent({
  // 获取项目偏移量
  getItemOffset,
  // 获取
  getEstimatedTotalSize,
  getItemSize,
  getOffsetForIndexAndAlignment,
  getStartIndexForOffset,
  getStopIndexForStartIndex,
  initInstanceProps,
  shouldResetStyleCacheOnItemSizeChange,
  validateProps
}) {
  return class List extends PureComponent {
    _intanceProps = initInstanceProps(this.props, this);
    // 包裹虚拟列表的容器实例 HTMLDivElement
    _outerRef;
    // requestAnimationFrame react-window 使用 requestAnimationFrame() 来进行渲染操作
    // 最初用的是 setTimeout()定时器进行更新
    _resetIsScrollingTimeoutId = null;
    static defaultProps = {
      // 滑动方向
      direction: 'ltr',
      // 渲染的长列表数据
      itemData: undefined,
      // 布局方式
      layout: 'vertical',
      // 渲染多余的项目数量
      overscanCount: 2,
      useIsScrolling: false
    };
    state = {
      // 虚拟列表实例
      instance: this,
      // 是否正在滑动
      isScrolling: false,
      // 滑动方向
      scrollDirection: 'forward',
      // 滑动偏移量
      scrollOffset: typeof this.props.initialScrollOffset === 'number' ? this.props.initialScrollOffset : 0,
      scrollUpdateWasRequested: false
    };
    /**
     * react 生命周期 在 render 之前调用 返回 object 表示修改 state 为 object
     * 返回 null 表示不修改 state
     *
     * @param {object} nextProps 更新后的 props
     * @param {object} prevState 旧的 state
     * @return {object | null}
     */
    static getDerivedStateFromProps(nextProps, prevState) {
      // 验证 props
    }
    // 组件挂载后
    componentDidMount() {
      const { direction, initialScrollOffset, layout } = this.props;
      // 初始偏移量为 数字，并且 _outerRef 存在
      // 设置 outerRef 的滑动偏移量
      if (typeof initialScrollOffset === 'number' && this._outerRef !== null) {
        const outerRef = this._outerRef;
        // 如果是横向滑动 设置 scrollLeft
        if (direction === 'horizontal' || layout === 'horizontal') {
          outerRef.scrollLeft = initialScrollOffset;
        } else {
          // 纵向滑动 ，设置 scrollTop
          outerRef.scrollTop = initialScrollOffset;
        }
      }
      this._callPropsCallbacks();
    }
    // 组件更新
    componentDidUpdate() {
      const { direction, layout } = this.props;
      const { scrollOffset, scrollUpdateWasRequested } = this.state;
      // 组件滑动需要更新
      if (scrollUpdateWasRequested && this._outerRef != null) {
        const outerRef = this._outerRef;
        // 横向滑动
        if (direction === 'horizontal' || layout === 'horizontal') {
          // 从右向左滑动
          if (direction === 'rtl') {
            // 获取 从右向左滑的 类型
            switch (getRTLOffsetType()) {
              // 滑动等于 0
              case 'negative':
                outerRef.scrollLeft = -scrollOffset;
                break;
              // 滑动大于 0
              case 'positive-ascending':
                outerRef.scrollLeft = scrollOffset;
                break;
              default:
                // 滑动小于 0
                const { clientWidth, scrollWidth } = outerRef;
                outerRef.scrollLeft = scrollWidth - clientWidth - scrollOffset;
                break;
            }
          } else {
            outerRef.scrollLeft = scrollOffset;
          }
        } else {
          outerRef.scrollTop = scrollOffset;
        }
      }
      this._callPropsCallbacks();
    },
    // 组件卸载
    componentWillUnmount(){
      // 清理 requestAnimationFrame
      if(this._resetIsScrollingTimeoutId!=null){
        cancelTimeout(this._resetIsScrollingTimeoutId);
      }
    },
    render(){
      const {children, className, direction,height,innerRef,innerElementType, innerTagName, itemCount, itemData, itemKey=defaultItemKey,layout, outerElementType, outerTagName, style,useIsScrolling, width}=this.props;
      const {isScrolling}=this.state;
      // 滑动方向 横向、纵向
      const isHorizontal= direction==='horizontal'||layout==='horizontal';
      // 滑动函数
      const onScroll = isHorizontal?this._onScrollHorizontal: this._onScrollVertical;
      // 显示区域内 开始项目索引、结束项目索引
      const [startIndex, stopIndex]=this._getRangeToRender();
      const items=[]
      if(itemCount>0){
        for(let index = startIndex;index<=stopIndex;index++){
          items.push(
            createElement(children,{
              data:itemData,
              key:itemKey(index,itemData),
              index,
              isScrolling:useIsScrolling?isScrolling:undefined,
              style: this._getItemStyle(index)
            })
          )
        }
      }
      // 预估项目总大小 横向：虚拟列表容器总宽度，纵向：虚拟列表容器总高度
      const estimatedTotalSize=getEstimatedTotalSize(this.props,this._instanceProps)
      // 返回内容
      // 使用两层 容器结构
      // 外层：虚拟列表展示区域
      // 内存：虚拟列表滑动区域
      return createElement(
        outerElementType||outerTagName||'div',
        {
          className,
          onScroll,
          ref:this._outerRefSetter,
          style:{
            positive:'relative',
            height,
            width,
            overflow:'hidden',
            WebkitOverflowScrolling:'touch',
            willChange:"transform",
            direction,
            ...style
          }
        },
        createElement(
          innerElementType||innerTagName||'div',
          {
            children:items,
            ref:innerRef,
            style:{
              height:isHorizontal?'100%':estimatedTotalSize,
              pointerEvents:isScrolling?'none':undefined,
              width: isHorizontal? estimatedTotalSize:'100%'
            }
          }
        )
      )
    }
  };
}
```

- `_callPropsCallbacks()`

```js
// 处理props的回调 onItemsRendered/onScroll
_callPropsCallbacks(){
  if(typeof this.props.onItemsRendered ==='function'){
    const {itemCount}=this.props;
    if(itemCount>0){
      // 获取 要渲染的区域
      // [多余渲染项目的起始索引, 多余渲染项目的终止结束索引, 可视区域项目起始索引, 可视区域项目结束索引]
      const [overscanStartIndex, overscanStopIndex, visibleStartIndex, visibleStopIndex]=this._getRangeToRender();
      // 虚拟列表已渲染的项目 索引
      // 将[多余渲染项目的起始索引, 多余渲染项目的终止结束索引, 可视区域项目起始索引, 可视区域项目结束索引] 传入到this.props.onItemsRendered()
      this._callOnItemsRendered(overscanStartIndex, overscanStopIndex, visibleStartIndex, visibleStopIndex);
    }

    if(typeof this.props.onScroll ==='function'){
      // 如果 onScroll 是函数 将 滑动方向，当前偏移量，是否滑动作为参数 传递给 this.props.onScroll()
      const {scrollDirection, scrollOffset,scrollUpdateWasRequested}=this.state;
      this._callOnScroll(scrollDirection, scrollOffset,scrollUpdateWasRequested)
    }
  }
}
```

- `_getRangeToRender()`

```js
// 获取要渲染的区域
_getRangeToRender(){
  const {itemCount, overscanCount}=this.props;
  const {isScrolling, scrollDirection,scrollOffset}=this.state;
  if(itemCount===0){
    return [0,0,0,0]
  }

}
```

- `_getItemStyle()`

```js
_getItemStyle(){}
```

- `getOffsetForIndexAndAlignment()`

```js
getOffsetForIndexAndAlignment(){}
```

- `getStartIndexForOffset()`

```js
getStartIndexForOffset(){}
```

- `getStopIndexForStartIndex()`

```js
getStopIndexForStartIndex(){}
```

- `getRTLOffsetType()`

```js
getRTLOffsetType(){}
```

- `requestTimeout()`

```js
requestTimeout(){}
```
