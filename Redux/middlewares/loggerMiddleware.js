/**
 * 中间件 
 * 三层函数
 * 第一层 (store)=>   | store。传入的 store = {getState, dispatch}
 * 第二层 (dispatch)=>  | compose() 调用时，传入的 store.dispatch。compose(...chain)(store.dispatch)
 * 第三层 (action)=> | store.dispatch 传入的 action，去调用 reducer
 */
module.exports = loggerMiddleware = (store) => (dispatch) => (action) => {
    console.log('this state', store.getState());
    console.log('action', action);
    dispatch(action);
    console.log('dispatch state', store.getState());
}