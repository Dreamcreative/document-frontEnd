/**
 * 
 * @param {function} reducer 修改状态的方法
 * @param {object} initState 初始状态
 * @param {middlewares} enhancer 中间件组合
 * @returns 
 */
module.exports = function createStore(reducer, initState, enhancer) {
    // 唯一的全局状态
    let state = initState;
    // 需要监听的方法
    const listeners = [];
    if (enhancer) {
        return enhancer(createStore)(reducer, state);
    }
    // state 的触发方式
    function dispatch(action) {
        // 通过dispatch 触发修改后，使用 reducer 修改修改 state
        state = reducer(state, action);
        // 遍历调用监听函数
        for (let i = 0; i < listeners.length; i++) {
            const listener = listeners[i];
            listener();
        }
    }
    // 获取当前 state
    function getState() {
        return state;
    }
    // 添加监听函数
    function subscribe(listener) {
        listeners.push(listener);

        return function unsubscribe() {
            const index = listeners.indexOf(listener);
            listeners.splice(index, 1);
        }
    }
    // 替换 reducer
    function replaceReducer(nextReducer) {
        reducer = nextReducer;
        // 调用一次 dispatch 将 state 进行替换
        dispatch({ type: Symbol() })
    }
    // 当 initState 没有传入时，调用 getState() 没有值，这里手动调用一次 dispatch 可以初始化 reducer
    dispatch({ type: Symbol() })
    return {
        getState,
        subscribe,
        dispatch,
        replaceReducer
    }
};