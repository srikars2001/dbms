import {createStore,combineReducers,applyMiddleware,compose} from 'redux'
import thunk from 'redux-thunk';
import authReducer from './auth/authReducer';

const rootReducer = combineReducers({
    
    auth:authReducer,
   
})

const store = createStore(rootReducer,compose(
    applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
));

export default store;