import React from 'react'
import ReactDOM from 'react-dom'
import 'antd/dist/antd.less'
import 'bootstrap/dist/css/bootstrap.css'
import rootReducer from './reducers'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'

import { App } from './pages'

const store = createStore(rootReducer, applyMiddleware(thunk))

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
