const createStore = require('./createStore')
const combineReducers = require('./combineReducers')
const applyMiddleware = require('./applyMiddleware')
const bindActionCreators = require('./bindActionCreators')
const loggerMiddleware = require('./middlewares/loggerMiddleware')
const timeMiddleware = require('./middlewares/timeMiddleware')
const counterReducer = require('./reducers/counterReducer');
const InfoReducer = require('./reducers/infoReducer');
let initState = {
    counter: {
        count: 0,
    },
    info: {
        name: '前端九部',
        description: '我们都是前端爱好者！',
    },
}

function increment() {
    return {
        type: 'INCREMENT'
    }
}

function setName(name) {
    return {
        type: 'SET_NAME',
        name: name
    }
}
const reducer = combineReducers({
    counter: counterReducer,
    info: InfoReducer,
});
const composeMiddle = applyMiddleware(loggerMiddleware, timeMiddleware);
let store = createStore(reducer, initState, composeMiddle);
const actions = bindActionCreators({ increment, setName }, store.dispatch)
store.subscribe(() => {
    let state = store.getState();
    console.log("aaaaaa", state)
});
actions.increment();
actions.setName("qaaa");
// store.dispatch({
//     type: 'INCREMENT'
// });
// store.dispatch({
//     type: 'SET_NAME',
//     name: '前端九部222222号'
// });