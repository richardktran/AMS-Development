import { exceptionConstants, userConstants } from '../constants'
import { checkAuthentication } from './auth.action'
import { UserService } from '../services'
const {
  CREATE_USER,
  GET_USER_LIST,
  CHANGE_CURRENT_PAGE,
  SEARCH_USER,
  SET_SORT_TYPE,
  FILLTER_BY_ROLE,
  EDIT_USER,
  GET_USER_BY_ID,
  RESET_SORT_FILTER,
  UPDATE_TOP_USER_IN_LIST,
  DISABLE_USER,
  RESET_FORM_USER,
  RESET_SPECIAL_CASE,
} = userConstants

const { SUCCESS, CREATED } = exceptionConstants

export const disableUser = (user_id) => {
  return async function (dispatch) {
    const response = await UserService.disableUser(user_id)
    const { code } = response
    checkAuthentication(code)
    if (code === SUCCESS) {
      dispatch({
        type: DISABLE_USER,
      })
    }
    return response
  }
}

export const isAnyValidAssignment = (user_id) => {
  return async function () {
    const response = await UserService.isAnyValidAssignment(user_id)
    return response
  }
}

export const createUser = (credentials) => {
  return async function (dispatch) {
    const response = await UserService.create(credentials)
    const { code, data } = response
    checkAuthentication(code)
    if (code === CREATED) {
      dispatch({
        type: CREATE_USER,
        payload: {
          user: data.user,
        },
      })
    }
    return response
  }
}

export const updateUser = (id, credentials) => {
  return async function (dispatch) {
    const response = await UserService.edit(id, credentials)
    const { code, data } = response
    checkAuthentication(code)
    if (code === SUCCESS) {
      dispatch({
        type: EDIT_USER,
        payload: {
          user: data.user,
          special: data.notify ? data.notify : null,
        },
      })
    }
    return response
  }
}

export const getUserById = (id) => {
  return async function (dispatch) {
    const response = await UserService.getUserById(id)
    const { code, data } = response
    checkAuthentication(code)
    if (code === SUCCESS) {
      dispatch({
        type: GET_USER_BY_ID,
        payload: {
          user: data.user,
          code: code,
        },
      })
    } else {
      dispatch({
        type: GET_USER_BY_ID,
        payload: {
          user: null,
          code: code,
        },
      })
    }
    return response
  }
}

export const getAllUsers = (credentials) => {
  return async function (dispatch) {
    const response = await UserService.getAllUsers(credentials)
    const { code, data } = response
    checkAuthentication(code)
    if (code === SUCCESS) {
      dispatch({
        type: GET_USER_LIST,
        payload: {
          userList: data.data,
          total: data.meta.total,
        },
      })
    }
    return response
  }
}

export const resetFormHandleUser = () => ({
  type: RESET_FORM_USER,
})

export const changePageInUserList = (page) => ({
  type: CHANGE_CURRENT_PAGE,
  payload: {
    currentPage: page,
  },
})

export const searchUser = (search) => ({
  type: SEARCH_USER,
  payload: {
    searchKeywords: search,
  },
})

export const setSortTypeInUserList = (data) => ({
  type: SET_SORT_TYPE,
  payload: {
    sortType: data.sortType,
    sortValue: data.sortValue,
  },
})

export const setFilterInUserList = (filterType) => ({
  type: FILLTER_BY_ROLE,
  payload: {
    filterType: filterType,
  },
})

export const updateTopUserInList = (newUpdatedUser) => ({
  type: UPDATE_TOP_USER_IN_LIST,
  payload: {
    newUpdatedUser: newUpdatedUser,
  },
})

export const resetSortFilterInUserList = () => ({
  type: RESET_SORT_FILTER,
})

export const resetSpecialCase = () => ({
  type: RESET_SPECIAL_CASE,
})
