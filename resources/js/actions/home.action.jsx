import { exceptionConstants, homeConstants } from '../constants'
import { checkAuthentication } from './auth.action'
import { HomeService } from '../services'
const {
  RESET_SORT_FILTER,
  SET_SORT_TYPE,
  CHANGE_CURRENT_PAGE,
  GET_HOME_LIST,
  USER_ACCEPT_ASSIGNMENT,
  USER_DECLINE_ASSIGNMENT,
  USER_REQUEST_RETURN,
} = homeConstants

const { SUCCESS, CREATED } = exceptionConstants

export const getAllHomeList = (credentials) => {
  return async function (dispatch) {
    const response = await HomeService.getAllHomeList(credentials)
    const { code, data } = response
    checkAuthentication(code)
    if (code === SUCCESS) {
      dispatch({
        type: GET_HOME_LIST,
        payload: {
          homeList: data.data,
          total: data.meta.total,
        },
      })
    }
    return response
  }
}

export const changePageInHomeList = (page) => ({
  type: CHANGE_CURRENT_PAGE,
  payload: {
    currentPage: page,
  },
})

export const setSortTypeInHomeList = (data) => ({
  type: SET_SORT_TYPE,
  payload: {
    sortType: data.sortType,
    sortValue: data.sortValue,
  },
})

export const resetSortFilterInHomeList = () => ({
  type: RESET_SORT_FILTER,
})

export const acceptAssignment = (id) => {
  return async function (dispatch) {
    const response = await HomeService.acceptAssignment(id)
    const { code } = response
    checkAuthentication(code)
    if (code === SUCCESS) {
      dispatch({
        type: USER_ACCEPT_ASSIGNMENT,
      })
    }
    return response
  }
}

export const declineAssignment = (id) => {
  return async function (dispatch) {
    const response = await HomeService.declineAssignment(id)
    const { code } = response
    checkAuthentication(code)
    if (code === SUCCESS) {
      dispatch({
        type: USER_DECLINE_ASSIGNMENT,
      })
    }
    return response
  }
}

export const requestForReturning = (id) => {
  return async function (dispatch) {
    const response = await HomeService.requestForReturning(id)
    const { code } = response
    checkAuthentication(code)
    if (code === CREATED) {
      dispatch({
        type: USER_REQUEST_RETURN,
      })
    }
    return response
  }
}
