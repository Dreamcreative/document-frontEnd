# React 17 DOM DIFF

## 

```js
// React DOM diff 的入口函数
reconcileChildren(
    // 当前 fiber 节点
    current,
    // 父 fiber 
    workInProgress,
    // 新生产的 ReactElement 内容
    nextChildren,
    // 渲染的优先级
    renderLanes,
){
    if(current === null){
        // 当前fiber 节点为空，则直接将新的 ReactElement 节点内容生成新的 fiber
        workInProgress.child = mountChildFibers(
            workInProgress,
            null,
            nextChildren,
            renderLanes
        )
    }else{
        // 当前fiber节点存在子节点，则进行 DOM diff
        workInProgress.child = reconcileChildFibers(
            workInProgress,
            current.child,
            nextChildren,
            renderLanes
        )
    }
}

reconcileChildFibers(
    // 父 fiber
    returnFiber,
    // 父fiber 下的子节点
    currentFirstChild,
    // 需要更新的 新的 ReactElement 内容
    newChild,
    // 更新的优先级
    lanes
){
    // 判断新的 ReactElement 内容最外层是不是 fragment 类型， 如果是 fragment，则比较其子节点 children
    const isUnkeyedTopLevelFragment = 
        typeof newChild === 'object' &&
        newChild !== null &&
        newChild.type === REACT_FRAGMENT_TYPE &&
        newChild.key === null;

    if(isUnkeyedTopLevelFragment){
        newChild = newChild.props.children;
    }
    // 判断新节点是不是单节点，单节点 类型是对象
    const isObject = typeof newChild === 'object' && newChild !== null;
    if(isObject){
        // 如果是单节点类型
        switch(newChild.$$typeof){
            // 常规 react 元素
            case REACT_ELEMENT_TYPE:
                return placeSingleChild(
                    reconcileSingleElement(
                        returnFiber,
                        currentFirstChild,
                        newChild,
                        lanes,
                    ),
                );
            // react.portal 类型，就是可以将节点挂在到 页面任何位置的一种节点类型
            case REACT_PORTAL_TYPE:
                return placeSingleChild(
                    reconcileSinglePortal(
                        returnFiber,
                        currentFirstChild,
                        newChild,
                        lanes,
                    ),
                );
            // react.lazy 类型
            case REACT_LAZY_TYPE:
                if (enableLazyElements) {
                    const payload = newChild._payload;
                    const init = newChild._init;
                    return reconcileChildFibers(
                        returnFiber,
                        currentFirstChild,
                        init(payload),
                        lanes,
                    );
                }
            }
        }
    }

    if(typeof newChild === 'string' || typeof newChild === 'number'){
        // 如果是文本类型， 字符串 或者是 数字
        return placeSingleChild(
            returnFiber,
            currentFirstChild,
            ''+newChild,
            lanes
        )
    }

    if(isArray(newChild)){
        // 如果是多节点类型
        return reconcileChildrenArray(
            returnFiber,
            currentFirstChild,
            newChild,
            lanes
        )
    }

    return reconcileChildFibers;
}
// 处理单节点
reconcileSingleElement(
    // 父fiber
    returnFiber,
    // 父fiber下的第一个子节点
    currentFirstChild,
    // 新的 节点
    element,
    // 更新的优先级
    lanes
){
    const key = element.key;
    let child = currentFirstChild;
    while(child!==null){
        if(child.key === key){
            // 如果新节点的 key属性 与 旧节点的 key属性相等
            switch(child.tag){
                case Fragement:{
                    // 如果是空标签 <></>
                    if(element.type === REACT_FRAGMENT_TYPE){
                        // 删除 旧节点的兄弟节点
                        deleteRemainingChildren(returnFiber,child.sibling);
                        // 根据旧的 fiber 节点和新增的节点 ，创建一个新的 fiber 节点，该 fiber 的索引 index = 0,兄弟节点 sibling =null
                        const existing = useFiber(child, element.props.children);
                        // 新的 fiber节点的 父节点指向 return 设置为旧的 fiber节点的父节点
                        existing.return = returnFiber;
                        return existing;
                    }
                    break;
                }
                case Block:
                    // 如果是 Block 类型节点
                    if(enableBlocksAPI){
                        let type = element.type;
                        if(type.$$typeof === REACT_LAZY_TYPE){
                            // 如果是 react.lazy 类型
                            type = resolveLazyType(type);
                        }
                        if(type.$$typeof === REACT_BLOCK_TYPE){
                            // 如果是 react block 类型
                            if(type === child.type){
                                // 如果新增的节点类型与旧节点类型相等
                                // 删除旧节点的兄弟节点
                                deleteRemainingChildren(returnFiber, child.sibling);
                                // 根据旧节点和新增节点的子节点 克隆一份新的 fiber 节点
                                const existing = useFiber(child, element.props.children);
                                // 将新生成的 fiber 节点的 type 设置为 旧节点的 type,
                                // 为新生成的 fiber 节点设置 父节点为 旧的 fiber 节点的父节点
                                existing.type = type;
                                existing.return = returnFiber;
                                return existing;
                            }
                        }
                    }
                default:
                    if(child.elementType === element.type){
                        deleteRemainingChildren(returnFiber, child.sibling);
                        const existing = useFiber(child, element.props);
                        existing.ref = coerceRef(returnFiber, child, element);
                        existing.return = returnFiber;
                        return existing;
                    }
                    break;
            }
        }
    }
}

```

### DOM diff 用到的其他方法

```js
useFiber(fiber, pendingProps){
    const clone = createWorkInProgress(fiber, pendingProps);
    clone.index = 0;
    clone.sibling = null;
    return clone;
}
```

## 参考 

* [React17源码解析(5) —— 全面理解diff算法](https://juejin.cn/post/7020595059095666724)
* [浅析React17 diff 算法源码|8月更文挑战](https://juejin.cn/post/6991656792639930382)