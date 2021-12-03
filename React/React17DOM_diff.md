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
            reconcileSingleTextNode(
                returnFiber,
                currentFirstChild,
                ''+newChild,
                lanes
            )
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
/**
    新节点是单节点
    对新节点会做节点类型判断，Fragment/Block/default 等不同节点类型的判断
    新旧节点的 key 属性相同，并且新旧节点的节点类型相同，则进行节点复用，删除旧节点的 兄弟节点；
*/
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
                        // 给旧节点的兄弟节点打上 Deletion effectTag 删除标记
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
                                // 给旧节点的兄弟节点打上 Deletion effectTag 删除标记
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

// 处理文本节点，包括字符串和数字类型
placeSingleChild(
    // 新的 fiber 节点
    newFiber
){
    if(shouldTrackSideEffects && newFiber.alternate === null){
        // 为 fiber 节点打上 Placement 更新标记
        newFiber.flags = Placement;
    }
    return newFiber;
}

// 处理多节点
reconcileChildrenArray(
    // 父 fiber 节点
    returnFiber,
    // 父 fiber 下的第一个子节点，需要进行对比更新的 旧节点
    currentFirstChild,
    // 新的节点
    newChildren,
    // 更新优先级
    lanes
){
    let resultingFirstChild = null;
    let previousNewFiber = null;
    // 旧的 fiber 节点
    let oldFiber = currentFirstChild;
    let lastPlacedIndex = 0;
    // 新增节点遍历索引
    let newIdx = 0;
    // 下一个旧的 fiber 节点
    let nextOldFiber = null;
    // 遍历新增节点
    for(; oldFiber !== null && newIdx < newChildren.length; newIdx++){
        // 如果当前旧节点的下标大于 新节点的下标
        if(oldFiber.index > newIdx){
            // 将当前旧节点 赋值给nextOldFiber，同时置为 null
            nextOldFiber = oldFiber;
            oldFiber = null;
        }else{
            // 如果当前旧节点的下标 小于或者等于 新节点的下标
            // 将 旧节点的兄弟节点 赋值给 nextOldFiber
            nextOldFiber = oldFiber.sibling;
        }
        /**
            分多种情况
            新节点为 文本节点，空标签，多节点，单节点，
            单节点时，
            文本节点时，
            多节点时，
            如果新旧节点 key和 节点类型相同，则进行复用，否则创建一个新的 fiber 节点，
            如果新旧节点不可复用 则返回 null
        */ 
        const newFiber = updateSlot(
            returnFiber,
            oldFiber,
            newChildren[newIdx],
            lanes
        );
        // 如果旧节点不可复用
        if(newFiber === null){
            // 当前旧节点不存在
            if(oldFiber === null){
                // 继续下一个旧节点
                oldFiber = nextOldFiber;
            }
            break;
        }
        if(shouldTrackSideEffects){
            if(oldFiber && newFiber.alternate === null){
                // 为旧节点打上 Deletion 删除标记
                deleteChild(returnFiber, oldFiber);
            }
        }
        // 根据新旧节点索引和 newFiber 是否存在缓存 altenate 来判断新节点是移动旧节点位置，还是新插入节点
        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIndex);

        if(previousNewFiber === null){
            // 如果上一个 newFiber 为 null ,说明这是第一个生成的 newFiber，设置 resultingFirstChild
            resultingFirstChild = newFiber;
        }else{
            // 否则构建链式关系
            previousNewFiber.sibling = newFiber;
        }
        previousNewFiber = newFiber;
        oldFiber = nextOldFiber;
    }
    // 如果新节点已经遍历完，
    if(newIdx === newChildren.length){
        // 给旧节点中 未遍历完的节点打上 Deletion 删除标记
        deleteRemainingChildren(returnFiber, oldFiber);
    }

    if(oldFiber === null){
        // oldFiber 遍历完了，newChildren 剩余的节点都是需要新插入的节点
        for(;newIdx < newChildren.length; newIdx++){
            // 新节点剩余的节点，通过 createChild 创建为新的 fiber 节点
            const newFiber = createChild(returnFiber, newChildren[newIdx],lanes);
            if(newFiber === null){
                continue;
            }
            // 处理节点移动，记录index 同时给新的 fiber 打上 Placement 更新标记
            lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
            // 将创建的 fiber 加到 fiber 链表树中
            if(previousNewFiber === null){
                resultingFirstChild = newFiber;
            }else{
                previousNewFiber.sibling = newFiber;
            }
            previousNewFiber = newFiber;
        }
        return resultingFirstChild;
    }

    // 新旧节点都没有遍历完
    // 将剩下的 旧节点添加到 Map 中，如果 key属性存在，则以 key 为 map 的键值, 旧节点为 map 的 value，如果 key 不存在，则以 节点的 index 索引为键值
    const existingChildren = mapRemainingChildren(returnFiber, oldFiber);

    for(;newIdx < newChildren.length; newIdx++){
        // 根据旧节点的 key 或 index 索引，生成 Map
        // 根据新节点的 key 或者 index 索引去 Map 中查找可复用旧节点
        // 新节点为 文本节点、单节点或多节点
        // 如果旧节点能不复用，就复用就节点，不能复用就新生成 fiber 节点 
        const newFiber = updateFromMap(
            existingChildren,
            returnFiber,
            newIdx,
            newChildren[newIdx],
            lanes
        );
        if(newFiber !== null){
            if(shouldTrackSideEffects){
                // 如果得到的新节点是通过旧节点复用的，就从 Map 中删除，以免最后被添加了 Deletion 标记
                if(newFiber.alternate !== null){
                    existingChildren.delete(newFiber.key === null? newFiber.index: newFiber.key)
                }
            }
        }
        // 处理节点移动，记录 index 同时给节点打上 Placement 标记
        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
        // 将新创建的 fiber 添加到 fiber 链表树种
        if (previousNewFiber === null) {
            resultingFirstChild = newFiber;
        } else {
            previousNewFiber.sibling = newFiber;
        }
        previousNewFiber = newFiber;
    }
    if(shouldTrackSideEffects){
        // 给剩余的旧节点打上 Deletion 标记
        existingChildren.forEach(child=> deleteChild(returnFiber, child))
    }
    return resultingFirstChild;
}
```

### DOM diff 用到的其他方法

```js
// 克隆出一个新的 fiber 节点
useFiber(fiber, pendingProps){
    // 通过当前的 fiber 节点和更新后的节点 props 生成一个新的 fiber 节点
    const clone = createWorkInProgress(fiber, pendingProps);
    clone.index = 0;
    clone.sibling = null;
    return clone;
}
// 遍历旧的 fiber 节点
deleteRemainingChildren(
    // 父 fiber 节点
    returnFiber,
    // 需要打上 Deletion effectTag 的节点 ，需要被删除
    currentFirstChild
){
    let childToDelete = currentFirstChild;
    // 遍历需要被删除的 fiber 节点
    while(childToDelete !== null){
        // 为当前节点打上 Deletion 标记
        deleteChild(returnFiber, childToDelete);
        // 继续下一个兄弟节点
        childToDelete = childToDelete.sibling;
    }
    return null;
}
// 为旧的 fiber 节点打上 Deletion 删除标记
deleteChild(
    // 父 fiber 节点
    returnFiber,
    // 需要打上 Deletion 标记的节点
    childToDelete,
){
    // 获取父 fiber 节点需要被删除的节点队列
    const deletions = returnFiber.deletions;
    if(deletions === null){
        // 如果为 null 进行赋值，同时给父 fiber 节点打上 删除标记
        returnFiber.deletions = [deletions];
        returnFiber.flags |= Deletion;
    }else{
        // 如果父 fiber 上 deletions 已存在，则向其添加其他需要删除的节点
        returnFiber.deletions.push(deletions);
    }
}

reconcileSingleTextNode(
    // 父 fiber 节点
    returnFiber,
    // 旧的 fiber 节点
    currentFirstChild,
    // 新的节点内容
    textContent,
    // 更新优先级
    lanes,
){
    // 如果旧的 fiber 节点存在，并且旧 fiber 节点也是文本节点
    if(currentFirstChild !== null && currentFirstChild.tag === HostText){
        // 给旧 fiber 节点的兄弟节点打上 Deletion 删除标记
        deleteRemainingChildren(returnFiber, currentFirstChild.sibling);
        // 根据当前旧的 fiber 节点和新的文本内容，生成新的 fiber 节点
        const existing = useFiber(currentFirstChild, textContent);
        // 为新的 fiber 节点添加父 fiber 节点
        existing.return = returnFiber;
        return existing;
    }
    // 否则 删除旧的 fiber 节点
    deleteRemainingChildren(returnFiber, currentFirstChild);
    // 创建新的 文本 fiber 节点
    const created = createFiberFromText(textContent, returnFiber.mode, lanes);
    // 为新的 fiber 节点添加父 fiber 节点
    create.return = returnFiber;
    return create;
}

createFiberFromText(
    // 新的文本内容
    content,
    // 模式
    mode,
    // 更新优先级
    lanes
){
    // 创建新的 文本 fiber 节点
    const fiber = createFiber(HostText, content, null, mode);
    fiber.lanes = lanes;
    return fiber;
}

/**
    如果新节点是 文本节点 
        如果旧节点是文本节点，克隆一个新的节点 节点复用
        如果旧节点不是文本节点，创建一个新的文本节点
    如果新节点是 单节点
        如果旧节点和新节点的 key 属性和节点类型都相等，则克隆一个新的节点  节点复用
        如果旧节点和新节点的 key 属性相同，但是节点类型不同， 则创建一个新的节点
    如果新节点是 多节点
        如果旧节点存在，则克隆出一个新节点 ，进行节点复用
        如果旧节点不存在，则创建一个新节点
*/
updateSlot(
    // 父 fiber
    returnFiber,
    // 旧 节点
    oldFiber,
    // 新节点
    newChild,
    // 更新优先级
    lanes
){
    const key = oldFiber !== null?oldFiber.key:null;
    // 如果新节点是文本节点
    if(typeof newChild === 'string' || typeof newChild === 'number'){
        if(key !== null){
            return null;
        }
        // 旧节点是文本节点，克隆一个新的 fiber节点
        // 旧节点不是文本节点，创建一个新的 fiber 节点
        return updateTextNode(returnFiber, oldFiber, ''+newChild, lanes)
    }
    // 如果新节点是单节点
    if(typeof newChild ==='object' && newChild!==null){
        switch(newChild.$$typeof){
            // 如果是 react 普通节点
            case REACT_ELEMENT_TYPE: 
            // 如果新节点的key 与旧节点的key 相等，表示节点可以复用
                if(newChild.key === key){
                    // 如果新节点的类型是 空标签 <></>
                    if(newChild.type === REACT_FRAGMENT_TYPE){
                        // 如果旧节点 oldFiber 是null 或者 是空标签，则创建一个新的 fiber节点
                        // 如果旧节点是正常节点，则对旧节点进行复用，克隆一个新的 fiber 节点
                        return updateFragment(
                            returnFiber,
                            oldFiber,
                            newChild.props.children,
                            lanes,
                            key
                        )
                    }
                    // 如果旧节点和新节点的 key 属性，节点类型都相同，则进行旧节点的复用，
                    // 否则为新节点创建一个新的 fiber 节点
                    return updateElement(returnFiber, oldFiber, newChild, lanes)
                }else{
                    return null;
                }
            case REACT_PORTAL_TYPE: 
                // 节点类型 为 portal
                if (newChild.key === key) {
                    return updatePortal(returnFiber, oldFiber, newChild, lanes);
                } else {
                    return null;
                }
            case REACT_LAZY_TYPE: {
                // 节点类型为 lazy
                if (enableLazyElements) {
                    const payload = newChild._payload;
                    const init = newChild._init;
                    return updateSlot(returnFiber, oldFiber, init(payload), lanes);
                }
            }
        }
        // 如果新节点是数组
        if(isArray(newChild) || getIteratorFn(newChild)){
            if(key!==null){
                return null;
            }
            // 如果旧节点存在，则克隆一个新节点 ，节点复用
            // 否则，创建一个新的节点
            return updateFragment(returnFiber, oldFiber, newChild, lanes, null);
        }
    }
    return null;
}

// 如果旧节点为 null 或者不是文本节点，根据传入的新节点创建新的 文本节点
// 如果旧节点是文本节点，根据旧节点和新节点克隆出一个新的 fiber 节点，
updateTextNode(
    // 父 fiber
    returnFiber,
    // 当前旧节点
    current,
    // 当前新节点
    textContent,
    // 更新优先级
    lanes
){
    // 如果旧节点为空，或者不是 文本节点
    if(current === null || current.tag !== HostText){
        // 创建一个新的 fiber 文本节点
        const created = createFiberFromText(textContent, returnFiber.mode, lanes);
        // 设置新 fiber 节点的父节点为 returnFiber
        created.return = returnFiber;
        return created;
    }else{
        // 否则，根据旧fiber 节点和新节点创建一个新的 fiber节点
        const existing = useFiber(current,textContent);
        // 设置新 fiber 节点的父节点为 returnFiber
        existing.return = returnFiber;
        return existing;
    }
}

// 如果旧节点是 null 或者空标签，创建一个新的fiber 节点
// 如果旧节点是正常节点，根据旧节点克隆出一个新的 fiber 节点 节点复用
updateFragment(
    // 父 节点
    returnFiber,
    // 旧节点
    current,
    // 新节点
    fragment,
    lanes,
    key
){
    // 如果旧节点为 null 或者 旧节点是空标签 <></>
    if(current ===null || current.tag !== Fragment){
        // 创建一个新的 fiber 节点
        const created = createFiberFromFragment(
            fragment,
            returnFiber.mode,
            lanes,
            key,
        )
        // 设置父节点
        created.return = returnFiber;
        return created;
    }else{
        // 克隆一个新的 fiber 节点
        const existing = useFiber(current, fragment);
        // 设置父节点
        existing.return = returnFiber;
        return existing;
    }
}

// 如果旧节点存在，且旧节点和新节点的 节点类型相同，则进行节点复用
// 否则，根据新节点内容创建一个新的fiber 节点
updateElement(
    // 父 节点
    returnFiber,
    // 当前旧节点
    current,
    // 新节点
    element,
    // 更新优先级
    lanes
){
    // 如果当前旧节点存在
    if(current!==null){
        // 如果旧节点和新节点 的节点类型相同
        if(current.elementType === element.tag){
            // 克隆一个新的 fiber节点
            const existing = useFiber(current, element.props);
            existing.ref = coerceRef(returnFiber, current, element);
            // 设置父节点
            existing.return = returnFiber;
            return existing;
        }
    }else if(enableBlocksAPI && current.tag === Block){
        // 如果旧节点是 Block 类型
        ...
    }
    // 如果旧节点不存在，给新节点创建一个新的 fiber 节点
    const created = createdFiberFromElement(element, returnFiber.mode, lanes);
    created.ref = coerceRef(returnFiber, current, element);
    // 设置父节点
    created.return = returnFiber;
    return created;
}

// 根据新旧节点的 索引和新生成的fiber 节点是否存在缓存来判断当前节点是移动节点位置还是插入节点，打上 Placement 标记
// 返回末位索引
placeChild(
    // 新旧节点复用后产生的 fiber，如果新旧节点可复用，则复用，不可复用，则是根据新节点新生成的 fiber
    newFiber,
    // 旧节点索引
    lastPlacedIndex,
    // 当前新节点的索引
    newIndex,
){
    newFiber.index = newIndex;
    const current = newFiber.alternate;
    // 当前节点存在缓存，表示新节点是由旧节点复用而来
    if(current !==null){
        // 获取当前节点的索引
        const oldIndex = current.index;
        // 如果当前节点的索引小于 旧节点的索引
        if(oldIndex < lastPlacedIndex){
            // 这里是移动节点位置  复用旧节点
            // 为新节点打上 更新标记
            newFiber.flags = Placement;
            // 返回旧节点的索引
            return lastPlacedIndex;
        }else{
            // 当前节点不存在缓存，表示为新增节点
            // 返回当前节点的 索引
            return oldIndex;
        }
    }else{
        // 如果不存在缓存，表示新节点是新生成的 ，表示插入节点
        newFiber.flags = Placement;
        return lastPlacedIndex;
    }
}
// 将剩余节点 添加到 map中，如果存在 key 就以 key 为 map 的键值，如果 key 不存在，则以fiber 节点的 索引为键值
mapRemainingChildren(
    // 父 fiber 节点
    returnFiber,
    // 旧节点
    currentFirstChild,
){
    const existingChildren = new Map();
    let existingChild = currentFirstChild;
    while(existingChild!==null){
        if(existingChild.key !== null){
            existingChildren.set(existingChild.key, existingChild);
        }else{
            existingChildren.set(existingChild.index, existingChild);
        }
        existingChild = existingChild.sibling;
    }
    return existingChildren;
}


// 如果匹配到了，就进行节点复用，如果没匹配到就新生成一个 fiber 节点、
/**
    根据旧节点生成 的 Map结构
    通过新节点 的 key或index 索引进行匹配
    文本节点时，如果匹配到旧节点，且旧节点也是文本节点 ，则进行节点复用，
        如果旧节点不是文本节点，则新生成 fiber 节点
    单节点时，如果匹配到旧节点，且新旧节点的 key 和节点类型相等，则进行节点复用，
        如果新旧节点的 key 或 节点类型不同，则新生成 fiber 节点
    多节点时，如果匹配到的旧节点存在，则复用
        如果匹配到的旧节点不存在，则新生成 fiber 节点
*/
updateFromMap(
    // 以 key 或者 节点索引形成的 旧节点 Map
    existingChildren,
    // 父节点
    returnFiber,
    // 新节点索引
    newIdx,
    // 新节点
    newChild,
    // 更新优先级
    lanes,
){
    // 如果新节点是 文本节点
    if(typeof newChild === 'string'|| typeof newChild === 'number'){
        // 从 旧节点 Map中匹配节点
        const matchedFiber = existingChildren.get(newIdx) || null;
        // 匹配到的节点是文本节点，则 进行节点复用，
        // 如果不是文本节点，则生成一个新的 fiber 文本节点
        return updateTextNode(returnFiber, matchedFiber, ''+newChild,lanes)
    }
    if(typeof newChild === 'object' && typeof newChild !==null){
        switch(newChild.$$typeof){
            // React 普通节点
            case REACT_ELEMENT_TYPE:
                // 从旧节点 Map 中匹配节点
                const matchedFiber = existingChildren.get(newChild.key ===null?newIdx: newChild.key ) || null;
                // 新节点类型为 空标签 <></>
                if(newChild.type === REACT_FRAGMENT_TYPE){
                    // 如果旧节点是存在 则进行节点复用，
                    // 如果旧节点不存在 或者旧节点是 空标签 ，则新生成一个 fiber 节点
                    return updateFragment(
                        returnFiber,
                        matchedFiber,
                        newChild.props.children,
                        lanes,
                        newChild.key,
                    )
                }
                // 如果旧节点存在且 key 和 节点类型与新节点都相同，则进行节点复用，
                // 如果旧节点不存在，则新生成一个 fiber 节点
                return updateElement(returnFiber, matchedFiber,newChild, lanes);
            // portal 节点
            case REACT_PORTAL_TYPE:
            // lazy 节点
            case REACT_LAZY_TYPE:
        }
        // 新节点是多节点
        if(isArray(newChild) || getIteratorFn(newChild)){
            // 匹配旧节点 Map
            const matchedChild = existingChildren.get(newIdx)||null;
            // 如果匹配到的旧节点存在就进行复用
            // 如果匹配到的旧节点不存在就新增节点
            return updateFragment(returnFiber, matchedFiber, newChild, lanes,null);
        }
    }
    return null;
}
```

## 参考 

* [React17源码解析(5) —— 全面理解diff算法](https://juejin.cn/post/7020595059095666724)
* [浅析React17 diff 算法源码|8月更文挑战](https://juejin.cn/post/6991656792639930382)