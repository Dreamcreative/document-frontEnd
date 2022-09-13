module.exports = timeMiddleware = store => dispatch => action => {
  console.log(new Date());
  dispatch(action);
};
