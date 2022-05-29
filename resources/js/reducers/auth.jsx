import { authConstants, userConstants } from '../constants'

const { LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } = authConstants

const { CHANGE_PASSWORD, CHANGE_PASSWORD_FIRST_TIME, VERIFY_USER_TOKEN } =
  userConstants

const user = JSON.parse(localStorage.getItem('user'))

const initialState = user
  ? { loggedIn: true, user }
  : { loggedIn: false, user: null }

const auth = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        loggedIn: true,
        user: action.payload.user,
      }
    case LOGIN_FAILURE:
      return {
        ...state,
        loggedIn: false,
        user: null,
      }
    case LOGOUT:
      return {
        loggedIn: false,
        user: null,
      }
    case CHANGE_PASSWORD_FIRST_TIME:
      return {
        ...state,
        user: action.payload.user,
      }
    case CHANGE_PASSWORD:
      return {
        ...state,
        user: action.payload.user,
      }
    case VERIFY_USER_TOKEN:
      return {
        ...state,
        loggedIn: action.payload.loggedIn,
        user: action.payload.user,
      }
    default:
      return state
  }
}

export default auth
