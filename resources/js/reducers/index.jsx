import { combineReducers } from 'redux'
import auth from './auth'
import loading from './loading'
import user from './user'
import category from './category'
import asset from './asset'
import assignment from './assignment'
import request from './request'
import home from './home'
import { authConstants } from '../constants'
import report from './report'

const { LOGOUT } = authConstants

const appReducer = combineReducers({
  auth,
  loading,
  user,
  category,
  asset,
  assignment,
  request,
  home,
  report,
})

const rootReducer = (state, action) => {
  switch (action.type) {
    case LOGOUT:
      return appReducer(undefined, action)
    default:
      return appReducer(state, action)
  }
}

export default rootReducer
