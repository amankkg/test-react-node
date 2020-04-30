import {createStore, combineReducers, applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk'

import {cart, productList} from './reducers'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const rootReducer = combineReducers({cart, productList})

export const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk)),
)
