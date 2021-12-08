// 嵌套调用 middleware 中间件
// applyMiddleware(a, b) :先调用 a ,再调用 b

const compose = require("./compose");
/**
 * @param {object} middlewares 需要组合调用的中间件 middleware
 * @returns 
 */
module.exports = applyMiddleware = (...middlewares) => (createStore) => (reducer, state) => {
    // createStore： 旧的 createStore 函数
    const store = createStore(reducer, state);
    // 遍历 middleware 返回一个传入了 store 对象的参数
    const chain = middlewares.map((middleware) => middleware({ getState: store.getState }));
    // compose: 嵌套调用 middleware，like : a(b(c()))(store.dispatch)
    const dispatch = compose(...chain)(store.dispatch);
    return {
        ...store,
        dispatch
    }
}