# React 17 合成事件实现

- `packages/react-dom/src/events`

## React 事件 优先级

```js
// 原生事件和合成事件的映射
// 离散事件
DiscreteEvent=0;
'cancel':'cancel',
'click':'click',
'close':'close',
'contextmenu':'contextMenu',
'copy':'copy',
'cut':'cut',
'auxclick':'auxClick',
'dblclick':'doubleClick',// Careful!
'dragend':'dragEnd',
'dragstart':'dragStart',
'drop':'drop',
'focusin':'focus',// Careful!
'focusout':'blur',// Careful!
'input':'input',
'invalid':'invalid',
'keydown':'keyDown',
'keypress':'keyPress',
'keyup':'keyUp',
'mousedown':'mouseDown',
'mouseup':'mouseUp',
'paste':'paste',
'pause':'pause',
'play':'play',
'pointercancel':'pointerCancel',
'pointerdown':'pointerDown',
'pointerup':'pointerUp',
'ratechange':'rateChange',
'reset':'reset',
'seeked':'seeked',
'submit':'submit',
'touchcancel':'touchCancel',
'touchend':'touchEnd',
'touchstart':'touchStart',
'volumechange':'volumeChange',
// 用户阻塞事件
UserBlockingEvent=1;
'drag': 'drag',
'dragenter': 'dragEnter',
'dragexit': 'dragExit',
'dragleave': 'dragLeave',
'dragover': 'dragOver',
'mousemove': 'mouseMove',
'mouseout': 'mouseOut',
'mouseover': 'mouseOver',
'pointermove': 'pointerMove',
'pointerout': 'pointerOut',
'pointerover': 'pointerOver',
'scroll': 'scroll',
'toggle': 'toggle',
'touchmove': 'touchMove',
'wheel': 'wheel',
// 连续事件
ContinuousEvent=2;
'abort': 'abort',
ANIMATION_END: 'animationEnd',
ANIMATION_ITERATION: 'animationIteration',
ANIMATION_START: 'animationStart',
'canplay': 'canPlay',
'canplaythrough': 'canPlayThrough',
'durationchange': 'durationChange',
'emptied': 'emptied',
'encrypted': 'encrypted',
'ended': 'ended',
'error': 'error',
'gotpointercapture': 'gotPointerCapture',
'load': 'load',
'loadeddata': 'loadedData',
'loadedmetadata': 'loadedMetadata',
'loadstart': 'loadStart',
'lostpointercapture': 'lostPointerCapture',
'playing': 'playing',
'progress': 'progress',
'seeking': 'seeking',
'stalled': 'stalled',
'suspend': 'suspend',
'timeupdate': 'timeUpdate',
TRANSITION_END: 'transitionEnd',
'waiting': 'waiting',
```

## 创建 root 实例

```js
createRootImpl(
    container,
    tag,
    options,
){
    // 获取React挂载的根节点
    const rootContainerElement =
      container.nodeType === COMMENT_NODE ? container.parentNode : container;
    // 监听所有支持的事件
    listenToAllSupportedEvents(rootContainerElement);
}

listenToAllSupportedEvents(rootContainerElement){
    // rootContainerElement 就是 React 节点挂载的根节点，由 ReactRoot 函数传入
    allNativeEvents.forEach(domEventName=>{
        // nonDelegatedEvents 存储的原生事件不需要在冒泡阶段 添加事件代理
        if(nonDelegatedEvents.has(domEventName)){
            listenToNativeEvent(
                domEventName,
                false,
                rootContainerElement,
                null,
            );
        }
        // 其他原生事件都需要在 捕获、冒泡阶段添加代理事件
        listenToNativeEvent(
            domEventName,
            true,
            rootContainerElement,
            null,
        );
    })
}

// 监听原生事件
listenToNativeEvent(
    domEventName,
    isCapturePhaseListener,
    rootContainerElement,
    targetElement,
    eventSystemFlags
){
    // 添加捕获的事件监听器
    addTrappedEventListener(
        target,
        domEventName,
        eventSystemFlags,
        isCapturePhaseListener,
    );
    listenerSet.add(listenerSetKey);
}

addTrappedEventListener(
    targetContainer,
    domEventName,
    eventSystemFlags,
    isCapturePhaseListener,
    isDeferredListenerForLegacyFBSupport,
){
// 创建带有优先级的事件监听器，
    let listener = createEventListenerWrapperWithPriority(
        targetContainer,
        domEventName,
        eventSystemFlags,
    );
    // 在原生事件上添加不同阶段的事件监听器
    if(isCapturePhaseListener){
        unsubscribeListener = addEventCaptureListener(
            targetContainer,
            domEventName,
            listener,
        );
    } else {
        // ...
        unsubscribeListener = addEventBubbleListener(
            targetContainer,
            domEventName,
            listener,
        );
    }
}

// 添加冒泡阶段事件监听
addEventBubbleListener(
    target,
    eventType,
    listener,
) {
    target.addEventListener(eventType, listener, false);
    return listener;
}

// 添加捕获阶段事件监听
addEventCaptureListener(
    target,
    eventType,
    listener,
) {
    target.addEventListener(eventType, listener, true);
    return listener;
}

```

## 创建合成事件

```js
// react-dom/src/events/SyntheticEvent.js

createSyntheticEven(Interface){
// 合成事件由事件插件分发，通常是响应顶级事件委派处理程序

// 合成事件（和子类）通过规范化浏览器怪癖来实现 DOM 级别3 事件 API，子类不一定要实现 DOM 接口，自定义特定于应用程序的事件也可以将其子类化
    SyntheticBaseEvent(
        // react 事件名称 onClick
        reactName,
        // react 事件类型
        reactEventType,
        // 目标节点实例
        targetInst,
        // 对应的原生事件
        nativeEvent,
        nativeEventTarget,
    ){
        // 初始化
        this._reactName = reactName;
        this._targetInst = targetInst;
        this.type = reactEventType;
        this.nativeEvent = nativeEvent;
        this.target = nativeEventTarget;
        this.currentTarget = null;

        for(const propName in Interface){
            // 只有自身拥有的属性才继续
            if(!Interface.hasOwnProperty(propName)){
                continue;
            }
            const normalize = Interface[propName];
            if(normalize){
                this[propName] = normalize(nativeEvent);
            }else{
                this[propName] = nativeEvent[propName];
            }
        }
        // 兼容 IE 浏览器
        const defaultPrevented = nativeEvent.defaultPrevented!== null
        ? nativeEvent.defaultPrevented : nativeEvent.returnValue === false;
        if(defaultPrevented){
            this.isDefaultPrevented = true;
        }else{
            this.isDefaultPrevented = false;
        }
        // 事件是否冒泡
        this.isPropagationStopped = false;
        return this;
    }

    // 重写 preventDefault、stoppropagation、 persist、isPersistent
    Object.assign(SyntheticBaseEvent.prototype,{
        preventDefault:function(){
            this.defaultPrevented = true;
            const evnet = this.nativeEvent;
            if(!event){
                return ;
            }
            if(event.preventDefault){
                event.preventDefault();
            }else if(typeof event.returnValue !== 'unknown'){
                event.returnValue = false;
            }
            this.isDefaultPrevented = true;
        },
        stoppropagation:function(){
            const event = this.nativeEvent;
            if(!event){
                return;
            }
            if(event.stopPropagation){
                event.stopPropagation();
            }else if(typeof event.cancelBubble !=='unknown'){
                event.cancelBubble = true;
            }
            this.isPropagationStopped = true;
        },
        persist:function(){
            // React 17 之前，由于事件调用完毕之后，就会被清除，所以为了持久的缓存 event,所以需要调用 `e.persist()`
            // 从 v17 开始，e.persist() 不会做任何事情，因为 SyntheticEvent 不再使用事件池
        },
        // 判断当前事件是否可以被事件池释放
        isPersistent:function(){
            return true;
        }
    })
    return SyntheticBaseEvent;
}
```

## 创建具有优先级的事件侦听器包装器

```js
// 根据优先级 创建事件监听器包装器
createEventListenerWrapperWithPriority(targetContainer, domEventName, eventSystemFlags){
    // 根据事件名称获取 事件的优先级
    const eventPriority = getEventPriorityForPluginSystem(domEventName);
    let listenerWrapper ;
    // 无论是 dispatchDiscreteEvent 还是 dispatchUserBlockingUpdate 最后都是通过 dispatchEvent 来执行事件分发
    switch (eventPriority) {
        case DiscreteEvent:
        listenerWrapper = dispatchDiscreteEvent;
        break;
        case UserBlockingEvent:
        listenerWrapper = dispatchUserBlockingUpdate;
        break;
        case ContinuousEvent:
        default:
        listenerWrapper = dispatchEvent;
        break;
    }
    return listenerWrapper.bind(
        null,
        domEventName,
        eventSystemFlags,
        targetContainer,
    );
}

// dispatchDiscreteEvent dispatchUserBlockingUpdate dispatchEvent 三个监听器的目的是相同的，都是进行 `事件收集、事件调用`
// 但不同的是，在调用 dispatchEvent 之前发生的事情不一样 ContinuousEvent（持续事件）优先级最高，直接同步调用，

dispatchEvent(
    domEventName,
    eventSystemFlags,
    targetContainer,
    nativeEvent,
){
    let allowReplay = true;
    const blockedOn = attemptToDispatchEvent(
        domEventName,
        eventSystemFlags,
        targetContainer,
        nativeEvent,
    )
    if (blockedOn === null) {
        // We successfully dispatched this event.
        if (allowReplay) {
            // 清理 离散事件队列
            clearIfContinuousEvent(domEventName, nativeEvent);
        }
        return;
    }
    if (allowReplay) {
        if (isReplayableDiscreteEvent(domEventName)) {
            queueDiscreteEvent(
                blockedOn,
                domEventName,
                eventSystemFlags,
                targetContainer,
                nativeEvent,
            );
            return;
        }
        if (
            queueIfContinuousEvent(
                blockedOn,
                domEventName,
                eventSystemFlags,
                targetContainer,
                nativeEvent,
            )
        ) {
            return;
        }
        // We need to clear only if we didn't queue because
        // queueing is accummulative.
        // 根据事件名称 将对应的事件队列置为 null
        clearIfContinuousEvent(domEventName, nativeEvent);
    }
}
```

## 参考

- [React v17.0.0 合成事件系统源码解析](https://zhuanlan.zhihu.com/p/384192871)
- [React17 源码解读—— 事件系统](https://juejin.cn/post/6967738672279994382)
