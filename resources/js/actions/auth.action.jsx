import { authConstants, exceptionConstants, userConstants } from '../constants'
import { AuthService } from '../services'

const { LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } = authConstants

const { CHANGE_PASSWORD_FIRST_TIME, VERIFY_USER_TOKEN } = userConstants
const { UNAUTHENTICATED, SUCCESS } = exceptionConstants

export const login = (credentials) => {
  return async function (dispatch) {
    const response = await AuthService.login(credentials)
    const { code, data } = response
    await dispatch(checkAuthentication(code))
    if (code === SUCCESS && data.user && data.access_token) {
      localStorage.setItem('token', data.access_token)
      localStorage.setItem('user', JSON.stringify(data.user))
      dispatch({
        type: LOGIN_SUCCESS,
        payload: {
          user: response.data.user,
        },
      })
    } else if (code === UNAUTHENTICATED) {
      dispatch({
        type: LOGIN_FAILURE,
      })
    }
    return response
  }
}

export const logout = () => {
  return async function (dispatch) {
    const response = await AuthService.logout()
    const { code } = response
    await dispatch(checkAuthentication(code))
    if (code === SUCCESS) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      dispatch({
        type: LOGOUT,
      })
    }
    return response
  }
}

export const changePasswordFirstTime = (credentials) => {
  return async function (dispatch) {
    const response = await AuthService.changePassFirstTime(credentials)
    const { code, data } = response
    await dispatch(checkAuthentication(code))
    if (code === SUCCESS && data && data !== undefined) {
      const user = JSON.parse(localStorage.getItem('user'))
      user.must_change_password = false
      localStorage.setItem('user', JSON.stringify(user))
      dispatch({
        type: CHANGE_PASSWORD_FIRST_TIME,
        payload: {
          user: response.data.user,
        },
      })
    }
    return response
  }
}

export const changePassword = (credentials) => {
  return async function () {
    const response = await AuthService.changePass(credentials)
    return response
  }
}

export const verifyUserByToken = () => {
  return async function (dispatch) {
    const response = await AuthService.verifyUserByToken()
    const { code, data } = response
    await dispatch(checkAuthentication(code))
    if (code === SUCCESS && data.data) {
      localStorage.setItem('user', JSON.stringify(data.data))
      dispatch({
        type: VERIFY_USER_TOKEN,
        payload: {
          loggedIn: true,
          user: data.data,
        },
      })
    }
    return response
  }
}

export const checkAuthentication = (code) => {
  return function (dispatch) {
    if (code === UNAUTHENTICATED) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      dispatch({
        type: VERIFY_USER_TOKEN,
        payload: {
          loggedIn: false,
          user: null,
        },
      })
    }
  }
}
