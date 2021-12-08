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
        listeners.push(listener)
    }
    return {
        getState,
        subscribe,
        dispatch
    }
};