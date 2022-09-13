// 合并reducer 方法 ，将多个reducer 合并为一个 reducer
/**
 * @param {object} reducers 需要合并的 reducer 方法
 * @returns function combination(state, action)
 */
// reducers = {
//     counte: {},
//     info: {}
// }
module.exports = function combineReducers(reducers) {
  // 获取 reducer 的 key
  const reducerKeys = Object.keys(reducers);
  // 返回一个函数，接收 state/action
  return function combination(state = {}, action) {
    let nextState = {};
    for (let key of reducerKeys) {
      const previousStateForKey = state[key];
      const prevReducerForKey = reducers[key];
      nextState[key] = prevReducerForKey(previousStateForKey, action);
    }
    // 返回修改后的 state
    return nextState;
  };
};
