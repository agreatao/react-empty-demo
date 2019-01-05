import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import reducers from './reducers';

function createCustomStore(preloadedState = {}) {
    return createStore(
        combineReducers({
            ...reducers
        })
        , preloadedState
        , applyMiddleware(thunk)
    );
}

export default createCustomStore();