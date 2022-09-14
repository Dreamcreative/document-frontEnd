// React 17 新增的 JSX 转换方式

/**
 * 就是将 React.createElement() 相关代码单独进行了提取
 */

/**
 * 生成 react 元素
 * @param {*} type 元素类型
 * @param {*} key key
 * @param {*} ref ref
 * @param {*} self DEV 环境使用 自身
 * @param {*} source DEV 环境使用 注释对象(指示文件名、行号、其他信息)
 * @param {*} owner 父级节点信息
 * @param {*} props 当前节点的属性
 */
function ReactElement(type, key, ref, self, source, owner, props) {
  var element = {
    $$typeof: REACT_ELEMENT_TYPE,
    type: type,
    key: key,
    ref: ref,
    props: props,
    _owner: owner
  };

  element._store = {};
  // 给 元素 设置属性
  Object.defineProperties(element._store, 'validated', {
    configurable: false,
    enumerable: false,
    writable: true,
    value: false
  });
  Object.defineProperties(element, '_self', {
    configurable: false,
    enumerable: false,
    writable: false,
    value: self
  });
  Object.defineProperties(element, '_source', {
    configurable: false,
    enumerable: false,
    writable: false,
    value: source
  });

  if (Object.freeze) {
    // 将 element element.props 冻结，不允许修改
    Object.freeze(element.props);
    Object.freeze(element);
  }
  // 返回 react 元素
  return element;
}
/**
 * 处理 tpye config key 等属性，最终传入 ReactElement() 生成 React 元素
 * @param {*} type 节点类型
 * @param {object} config 节点配置
 * @param {*} maybeKey 节点的 key
 */
function jsxDEV(type, config, maybeKey, source, self) {
  var propName;
  var props = {};
  var key = null;
  var ref = null;
  if (maybeKey !== undefined) {
    // 将 key 转为 字符串
    checkKeyStringCoercion(maybeKey);
    key = '' + maybeKey;
  }
  // config 用于 key 属性
  if (hasValidKey(config)) {
    // 将 key 转为 字符串
    checkKeyStringCoercion(config.key);
    key = '' + config.key;
  }
  if (hasValidRef(config)) {
    // 存在 ref 属性
    ref = config.ref;
    // 当 ref 为 string 类型时，给出警告，因为 string 类型的 ref 会在将来删除
    warnIfStringRefCannotBeAutoConverted(config, self);
  }
  // 将传入的 config，添加到 element 元素
  for (propName in config) {
    if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
      props[propName] = config[propName];
    }
  }
  // 组件用于 defaultProps 默认属性
  if (type && type.defaultProps) {
    // 如果存在 defaultProps 默认属性时，将默认属性赋值给 props
    var defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }

  if (key || ref) {
    // key ref 属性存在
    var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;
    if (key) {
      // 设置 获取 key 的方法
      defineKeyPropWarningGetter(props, displayName);
    }
    if (ref) {
      // 设置 获取 ref 的方法
      defineRefPropWarningGetter(props, displayName);
    }
  }
  // 返回一个 react 元素
  return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
}
/**
 *
 * @param {ReactNode} node react 元素节点
 * @param {*} parentType 父节点类型
 */
function validateChildKeys(node, parentType) {
  // node 类型不为 object 表示为基本类型 ，直接返回
  if (typeof node !== 'object') {
    return;
  }
  if (isArray(node)) {
    // 多节点
    for (var i = 0; i < node.length; i++) {
      // 遍历节点，验证每个节点是否存在唯一key
      var child = node[i];
      if (isValidElement) {
        // 验证节点是否存在 key 属性
        validateExplicitKey(child, parentType);
      }
    }
  } else if (isValidElement(node)) {
    // 是 react 元素节点
    // 类型为 object 且不为 null,并且 $$typeof ===REACT_ELEMENT_TYPE
    if (node._store) {
      node._store.validated = true;
    }
  } else if (node) {
    // 如果是一个 迭代器
    var iteratorFn = getIteratorFn(node);
    if (typeof iteratorFn === 'function') {
      if (iteratorFn !== node.entries) {
        var iterator = iteratorFn.call(node);
        var step;
        while (!(step = iterator.next()).node) {
          if (isValidElement(step.value)) {
            // 验证节点是否存在 key 属性
            validateExplicitKey(step.value, parentType);
          }
        }
      }
    }
  }
}
// 验证JSX
function jsxWithValidation(type, props, key, isStaticChildren, source, self) {
  // 判断是否是一个 有效的 react 类型，返回 true/false
  var validType = isValidElementType(type); // true or false
  if (!validType) {
    // 如果不是 react 类型，给出 错误提示
    // error info
  }
  // 返回一个 React 元素
  var element = jsxDEV(type, props, key, source, self);
  if (element == null) {
    // 元素为空
    return element;
  }
  if (validType) {
    // 如果是 react 元素
    // 获取 props 中的 children 子节点
    var children = props.children;
    if (children !== undefined) {
      // 子节点存在
      if (isStaticChildren) {
        // 如果是静态子节点 多节点情况
        if (Array.isArray(children)) {
          // 子节点为多节点
          // 遍历子节点
          for (var i = 0; i < children.length; i++) {
            // 验证节点
            // 多节点 每个节点都拥有 key 属性
            // 单节点 节点拥有 key 属性
            validateChildKeys(children[i], type);
          }
          if (Object.freeze) {
            // 冻结 子节点
            Object.freeze(children);
          }
        } else {
          error(
            'React.jsx: Static children should always be an array. ' +
              'You are likely explicitly calling React.jsxs or React.jsxDEV. ' +
              'Use the Babel transform instead.'
          );
        }
      } else {
        // 当节点情况 该节点如果的子节点是 多节点/单节点 验证节点的 key 属性是否存在且唯一
        validateChildKeys(children, type);
      }
    }
  }
  if (type === REACT_FRAGMENT_TYPE) {
    // 如果为 空标签，验证 fragment 只能拥有 children、key、ref 这几种属性
    validateFragmentProps(element);
  } else {
    // 验证节点的其他属性
    validatePropTypes(element);
  }
  return element;
}
function jsxWithValidationStatic(type, props, key) {
  return jsxWithValidation(type, props, key, true);
}
function jsxWithValidationDynamic(type, props, key) {
  return jsxWithValidation(type, props, key, false);
}
// 单节点使用
var jsx = jsxWithValidationDynamic;
// 多节点使用
var jsxs = jsxWithValidationStatic;
exports.jsx = jsx;
exports.jsxs = jsxs;
