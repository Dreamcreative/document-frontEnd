/**
 * 
 * @param {function} actionFn 
 * () => {
    return {
        type: 'INCREMENT'
    }
  }
 * @param {function} dispatch store.dispatch
 * @returns 
 */
// 通过闭包， 隐藏 dispatch 和 action

function bindAction(actionFn, dispatch) {
    return function() {
        return dispatch(actionFn.apply(this, arguments));
    }
}
/**
 * 
 * @param {object} actions 
 * {
 *  increment: function(){
 *    return {type:"INCREMENT"}
 *  }, 
 *  setName:function(name){
 *    return {type: 'SET_NAME',name: name}
 *  }
 * }
 * @param {function} dispatch 
 * @returns 
 */
module.exports = function bindActionCreators(actions, dispatch) {
    const boundAction = {};
    const actionKeys = Object.keys(actions);
    // 将传入的 actions 生成一个  function () { return dispatch( action.apply(this, arguments)) }的方法
    for (let actionKey of actionKeys) {
        const actionFn = actions[actionKey];
        if (typeof actionFn === 'function') {
            boundAction[actionKey] = bindAction(actionFn, dispatch)
        }
    }
    /**
      boundAction={
        increment:function(){
          return dispatch(increment.apply(this, arguments))
        },
        setName: function(){
          return dispatch(setName.apply(this, arguments))
        }
      }
     */
    return boundAction;
}