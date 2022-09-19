# react-window

## 主要代码

```js
import { createElement, PureComponent } from 'react';
// 虚拟列表滑动 间隔时间 毫秒
const IS_SCROLLING_DEBOUNCE_INTERVAL=150;
// 默认的项目唯一key
const defaultItemKey = (index,data)=> index;
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
    // 滑动到 某个确定的偏移量
    scrollTo(scrollOffset){
      scrollOffset = Math.max(0,scrollOffset);
      this.setState((prevState)=>{
        // 多次调用 scrollTo 如果滑动 偏移量不变，则不滑动
        if(prevState.scrollOffset ===scrollOffset){
          return null;
        }
        return{
          // 返回滑动方向
          scrollDirection:
            prevState.scrollOffset < scrollOffset ? 'forward' : 'backward',
            // 滑动偏移量
          scrollOffset: scrollOffset,
          scrollUpdateWasRequested: true,
        }
      }, this._resetIsScrollingDebounced)
    }
    scrollToItem(index, align='auto'){
      const {itemCount}=this.props;
      const {scrollOffset}=this.state;
      // 要滑动到的 项目索引
      index=Math.max(0, Math.min(index, itemCount-1));
      this.scrollTo(
        // 根据项目索引 和 项目的排列方式，获取目标项目的滑动偏移量
        getOffsetForIndexAndAlignment(
          this.props,
          index,
          align,
          scrollOffset,
          this._instanceProps
        )
      )
    }
    _resetIsScrollingDebounced(){
      if(this._restIsScrollingTimeoutId !==null){
        cancelTimeout(this._restIsScrollingTimeoutId);
      }
      this._restIsScrollingTimeoutId=requsetTimeout(
        this._resetIsScrolling,
        IS_SCROLLING_DEBOUNCE_INTERVAL
      )
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
      // 处理 props 中的回调 onItemsRendered/onScroll
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
      // 处理 props 中的回调 onItemsRendered/onScroll
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

> 处理 props 的回调 `onItemRendered()/onScroll()`

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

> 获取要渲染的区域，在滑动时，渲染区域的前后都需要渲染多余的项目

```js
// 获取要渲染的区域
_getRangeToRender(){
  const {itemCount, overscanCount}=this.props;
  const {isScrolling, scrollDirection,scrollOffset}=this.state;
  if(itemCount===0){
    return [0,0,0,0]
  }
  // 根据 偏移量 获取显示区域的 第一个项目索引
  const startIndex = getStartIndexForOffset(
    this.props,
    scrollOffset,
    this._instanceProps
  )
  // 根据显示区域第一个项目索引获取 显示区域最后一个项目索引
  const stopIndex = getStopIndexForStartIndex(
    this.props,
    startIndex,
    scrollOffset,
    this._instanceProps
  );
  // 向后渲染的多余个数
  const overscanBackward = !isScrolling || scrollDirection === 'backward'
    ? Math.max(1, overscanCount)
    :1;
  // 向前渲染的多余个数
  const overscanForward = !isScrolling || scrollDirection === 'forward'
    ? Math.max(1, overscanCount)
    :1;
  // 返回渲染区域
  return [
    Math.max(0, startIndex - overscanBackward),
    Math.max(0, Math.min(itemCount-1,stopIndex + overscanForward)),
    startIndex,
    stopIndex
  ]
}
```

- `getStartIndexForOffset({itemCount, itemSize}, offset)`

> 获取已渲染的起始项目索引

```js
getStartIndexForOffset({itemCount, itemSize}, offset){
  // 直接通过 offset 偏移量 除以 每个项目具有的 宽高
  Math.max(0, Math.min(itemCount-1, Math.floor(offset/itemSize)))
}
```

- `getStopIndexForStartIndex({direction, height, itemCount, itemSize, layout, width},startIndex, scrollOffset, offset)`

> 根据渲染区域的起始索引获取 已渲染的最后一个索引

```js
getStopIndexForStartIndex({direction, height, itemCount, itemSize, layout, width},startIndex, scrollOffset, offset){
  // 横向还是纵向滑动
  const isHorizontal= direction ==='horizontal'||layout==='horizontal';
  // 更加可视区域的起始项目索引 0->startIndex 所有项目 高度/宽度，既 滑块到容器顶部的距离
  const offset=startIndex *itemSize;
  // 更加滑动方向 获取可视区域容器的可滑动距离，例如如果是上下滑动，就是 outerRef 容器的高度
  const size = isHorizontal?width:height;
  // 可视区域可容纳的项目个数，既根据 (容器高度+滑动偏移量-偏移量)/项目大小
  const numVisibleItems=Math.cell(size+scrollOffset-offset)/itemSize;
  // 返回已渲染的最后一个 项目索引
  return Math.max(0,Math.min(itemCount-1, startIndex+numVisibleItems-1))
}
```

- `_getItemStyle(index)`

> 获取项目的样式，会将项目样式进行缓存 使用 项目索引`index`缓存在 hash 表中

```js
_getItemStyle(index){
  const {direction, itemSize, layout}=this.props;
  // 获取缓存的项目样式
  const itemStyleCache=this._getItemStyleCache(
    // 当项目变化时，重置样式缓存
    shouldResetStyleCacheOnItemSizeChange&&itemSize,
    shouldResetStyleCacheOnItemSizeChange&&layout,
    shouldResetStyleCacheOnItemSizeChange&&direction
  )
  let style;
  if(itemStyleCache.hasOwnProperty(index)){
    // 当前索引的项目 存在缓存样式 直接获取 返回
    style=itemStyleCache[index]
  }else{
    // 当前索引项目不存在缓存样式

    // 根据项目索引获取 当前项目的偏移量
    const offset=getItemOffset(this.props,index,this._instanceProps);
    // 项目大小
    const size=getItemSize(this.props,index,this._instanceProps);
    // 横向还是纵向滑动
    const isHorizontal=direction === 'horizontal' || layout === 'horizontal';
    // 是否从右向左滑动
    const isRtl=direction ==='rtl';
    const offsetHorizontal=isHorizontal? offset:0;
    // 设置项目样式，同时将样式根据 索引进行缓存
    itemStyleCache[index]=style={
      position:'absolute',
      left: isRtl?undefined: offsetHorizontal,
      right:isRtl? offsetHorizontal:undefined,
      top:!isRtl? offset:0,
      height:!isHorizontal?size:'100%',
      width:isHorizontal?size:'100%'
    }
  }
  return style;
}
```

- `getOffsetForIndexAndAlignment({direction, height, itemCount, itemSize, layout, width}, index, align, scrollOffset)`

> 根据项目的 索引、排序方式 获取项目滑动偏移量

```js
// 根据项目的 索引、排列方式 获取项目偏移量
getOffsetForIndexAndAlignment({direction, height, itemCount, itemSize, layout, width}, index, align, scrollOffset){
  // 滑动方向， 横向、纵向
   const isHorizontal = direction === 'horizontal' || layout === 'horizontal';
  //  虚拟列表的可视区域，横向为宽度，纵向为高度
   const size=isHorizontal?width: height;
  //  最后一个项目距离容器顶部的距离
   const lastItemOffset = Math.max(0, itemCount*itemSize - size);
   const maxOffset = Math.min(
      lastItemOffset,
      index * itemSize
    );
    // 默认排列方式
    if (align === 'smart') {
      if (
        scrollOffset >= minOffset - size &&
        scrollOffset <= maxOffset + size
      ) {
        align = 'auto';
      } else {
        align = 'center';
      }
    }
    // 根据不同的排列方式，获取当前索引最终的 偏移量
    switch (align) {
      case 'start':
        return maxOffset;
      case 'end':
        return minOffset;
      case 'center': {
        const middleOffset = Math.round(
          minOffset + (maxOffset - minOffset) / 2
        );
        if (middleOffset < Math.ceil(size / 2)) {
          return 0;
        } else if (middleOffset > lastItemOffset + Math.floor(size / 2)) {
          return lastItemOffset;
        } else {
          return middleOffset;
        }
      }
      case 'auto':
      default:
        if (scrollOffset >= minOffset && scrollOffset <= maxOffset) {
          return scrollOffset;
        } else if (scrollOffset < minOffset) {
          return minOffset;
        } else {
          return maxOffset;
        }
    }
}
```

- `getStartIndexForOffset({itemCount, itemSize}, offset)`

> 获取起始索引的偏移量

```js
// 根据偏移量 获取 可视区域起始索引
getStartIndexForOffset({itemCount, itemSize}, offset){
  Math.max(
      0,
      Math.min(itemCount - 1, Math.floor(offset / itemSize))
    ),
}
```

- `getStopIndexForStartIndex({ direction, height, itemCount, itemSize, layout, width }, startIndex, scrollOffset )`

> 根据可视区域起始索引，获取当前已渲染的最后一个项目的索引

```js
// 根据 可视区域起始索引，获取当前已渲染的 最后一个索引
getStopIndexForStartIndex({ direction, height, itemCount, itemSize, layout, width }, startIndex, scrollOffset ){
  // 横向还是纵向滑动
  const isHorizontal = direction === 'horizontal' || layout === 'horizontal';
  // 根据起始索引和 项目大小 获取滑块偏移量
  const offset = startIndex * itemSize;
  // 根据滑动方向获取 容器的 横向 宽度，纵向 高度
  const size =isHorizontal ? width : height;
  // 获取未显示的剩余项目个数  根据 (偏移量+容器区域 - (0->起始索引项目的整体区域 高度))/ 项目高度
  // 得到 剩余未显示项目的个数 取整
  const numVisibleItems = Math.ceil(
    (size + scrollOffset - offset) / itemSize
  );
  // 返回可视区域最后一个项目索引
  return Math.max(
    0,
    Math.min(
      itemCount - 1,
      startIndex + numVisibleItems - 1 // -1 is because stop index is inclusive
    )
  );
}
```

- `getRTLOffsetType(recalculate=false)`

> 兼容 `RTL` 从右向左滑动

```js
cachedRTLResult=null;
// 对于 RTL 元素 兼容处理
getRTLOffsetType(recalculate=false){
  if(cachedRTLResult===null ||recalculate ){
    const outerDiv = document.createElement('div');
    const outerStyle = outerDiv.style;
    outerStyle.width = '50px';
    outerStyle.height = '50px';
    outerStyle.overflow = 'scroll';
    outerStyle.direction = 'rtl';

    const innerDiv = document.createElement('div');
    const innerStyle = innerDiv.style;
    innerStyle.width = '100px';
    innerStyle.height = '100px';

    outerDiv.appendChild(innerDiv);
    document.body.appendChild(outerDiv);
    if (outerDiv.scrollLeft > 0) {
      cachedRTLResult = 'positive-descending';
    } else {
      outerDiv.scrollLeft = 1;
      if (outerDiv.scrollLeft === 0) {
        cachedRTLResult = 'negative';
      } else {
        cachedRTLResult = 'positive-ascending';
      }
    }
    document.body.remove(outerDiv);
    return cachedRTLResult;
  }
  return cachedRTLResult;
}
```

- `requestTimeout(callback, delay)`

> 滑动渲染函数，使用 `requestAnimationFrame()` 进行渲染，之前是使用 `setTimeout` 定时器渲染

```js
// 判断当前环境是否支持 performance.now()
const hasNativePerformanceNow =
  typeof performance === 'object' && typeof performance.now === 'function';
// 支持 performance.now() 则使用 performance.now()获取时间，否则使用 Date.now() 获取时间
const now = hasNativePerformanceNow? ()=> performance.now(): ()=> Date.now()
// 当滑动的数值 设置成功后，调用的回调函数
requestTimeout(callback, delay){
  const start = now();
  function tick(){
    if(now()-start>=delay){
      callback.call(null);
    }else{
      timeoutID.id = requestAnimationFrame(tick);
    }
  }
  const timeoutID={
    id: requestAnimationFrame(tick)
  }
}
```
