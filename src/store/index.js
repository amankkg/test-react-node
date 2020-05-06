import {createStore, combineReducers, applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk'

import {cart} from './cart'
import {products} from './products'
import {account} from './account'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const rootReducer = combineReducers({account, cart, products})

export const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk)),
)
