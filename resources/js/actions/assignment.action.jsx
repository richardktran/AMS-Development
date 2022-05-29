import { exceptionConstants, assignmentConstants } from '../constants'
import { checkAuthentication } from './auth.action'
import { AssignmentService } from '../services'
const {
  RESET_SORT_FILTER,
  SET_SORT_TYPE,
  FILTER_BY_STATE,
  FILTER_BY_ASSIGNED_DATE,
  CHANGE_CURRENT_PAGE,
  SEARCH_ASSIGNMENT,
  GET_ASSIGNMENT_LIST,
  UPDATE_TOP_ASSIGNMENT_IN_LIST,
  UPDATE_DATA_FILTER,
  GET_ASSIGNMENT_BY_ID,
  DISABLE_ASSIGNMENT,
  RESET_DATA_USER_MODAL_ASSIGNMENT,
  UPDATE_DATA_SEARCH_USER_ASSIGNMENT,
  UPDATE_DATA_SEARCH_ASSET_ASSIGNMENT,
  RESET_DATA_ASSET_MODAL_ASSIGNMENT,
  SELECTED_USER_ASSIGNMENT,
  SELECTED_ASSET_ASSIGNMENT,
  CREATE_ASSIGNMENT,
  EDIT_ASSIGNMENT,
  RESET_FORM_CREATE_ASSIGNMENT,
  RESET_FORM_EDIT_ASSIGNMENT,
  RESET_SPECIAL_CASE_ASSIGNMENT,
  REQUEST_RETURN_ASSIGNMENT,
} = assignmentConstants

const { SUCCESS, CREATED } = exceptionConstants

export const disableAssignment = (id) => {
  return async function (dispatch) {
    const response = await AssignmentService.disableAssignment(id)
    const { code } = response
    checkAuthentication(code)
    if (code === SUCCESS) {
      dispatch({
        type: DISABLE_ASSIGNMENT,
      })
    }
    return response
  }
}

export const createRequestForReturnAssignment = (id) => {
  return async function (dispatch) {
    const response = await AssignmentService.createRequestForReturnAssignment(
      id
    )
    const { code } = response
    checkAuthentication(code)
    if (code === CREATED) {
      dispatch({
        type: REQUEST_RETURN_ASSIGNMENT,
      })
    }
    return response
  }
}

export const createAssignment = (credentials) => {
  return async function (dispatch) {
    const response = await AssignmentService.createAssignment(credentials)
    const { code, data } = response
    checkAuthentication(code)
    if (code === CREATED) {
      dispatch({
        type: CREATE_ASSIGNMENT,
        payload: {
          assignment: data.assignment,
        },
      })
    }
    return response
  }
}

export const editAssignment = (id, dataAssignment) => {
  return async function (dispatch) {
    const response = await AssignmentService.updateAssignment(
      id,
      dataAssignment
    )
    const { code, data } = response
    checkAuthentication(code)
    if (code === SUCCESS) {
      dispatch({
        type: EDIT_ASSIGNMENT,
        payload: {
          assignment: data.assignment,
          special: data.notify ? data.notify : null,
        },
      })
    }
    return response
  }
}

export const getAllAssignments = (credentials) => {
  return async function (dispatch) {
    const response = await AssignmentService.getAllAssignments(credentials)
    const { code, data } = response
    checkAuthentication(code)
    if (code === SUCCESS) {
      dispatch({
        type: GET_ASSIGNMENT_LIST,
        payload: {
          assignmentList: data.data,
          total: data.meta.total,
        },
      })
    }
    return response
  }
}

export const updateDataSearchUserAssignment = (credentials) => {
  return async function (dispatch) {
    const response = await AssignmentService.getUserSameLocation(credentials)
    const { code, data } = response
    checkAuthentication(code)
    if (code === SUCCESS) {
      dispatch({
        type: UPDATE_DATA_SEARCH_USER_ASSIGNMENT,
        payload: {
          data: data.data,
        },
      })
    }
    return response
  }
}

export const getStateInAssignmentList = () => {
  return async function (dispatch) {
    const response = await AssignmentService.getStateInAssignmentList()
    const { code, data } = response
    checkAuthentication(code)
    if (code === SUCCESS) {
      dispatch({
        type: UPDATE_DATA_FILTER,
        payload: {
          dataFilter: data.states,
        },
      })
    }
    return response
  }
}

export const updateDataSearchAssetAssignment = (credentials) => {
  return async function (dispatch) {
    const response = await AssignmentService.getAssetSameLocation(credentials)
    const { code, data } = response

    checkAuthentication(code)
    if (code === SUCCESS) {
      dispatch({
        type: UPDATE_DATA_SEARCH_ASSET_ASSIGNMENT,
        payload: {
          data: data.data,
        },
      })
    }
    return response
  }
}

export const changePageInAssignmentList = (page) => ({
  type: CHANGE_CURRENT_PAGE,
  payload: {
    currentPage: page,
  },
})

export const searchAssignment = (search) => ({
  type: SEARCH_ASSIGNMENT,
  payload: {
    searchKeywords: search,
  },
})

export const setSortTypeInAssignmentList = (data) => ({
  type: SET_SORT_TYPE,
  payload: {
    sortType: data.sortType,
    sortValue: data.sortValue,
  },
})

export const setFilterByStateInAssignmentList = (filterType) => ({
  type: FILTER_BY_STATE,
  payload: {
    filterByState: filterType,
  },
})

export const setFilterByAssignedDateInAssignmentList = (filterType) => ({
  type: FILTER_BY_ASSIGNED_DATE,
  payload: {
    filterByAssignedDate: filterType,
  },
})

export const updateTopAssignmentInList = (newUpdatedAssignment) => ({
  type: UPDATE_TOP_ASSIGNMENT_IN_LIST,
  payload: {
    newUpdatedAssignment: newUpdatedAssignment,
  },
})

export const resetSortFilterInAssignmentList = () => ({
  type: RESET_SORT_FILTER,
})

export const resetFormCreateAssignment = () => ({
  type: RESET_FORM_CREATE_ASSIGNMENT,
})

export const resetFormEditAssignment = () => ({
  type: RESET_FORM_EDIT_ASSIGNMENT,
})

export const getAssignmentById = (id) => {
  return async function (dispatch) {
    const response = await AssignmentService.getAssignmentById(id)
    const { code, data } = response
    checkAuthentication(code)
    if (code === SUCCESS) {
      dispatch({
        type: GET_ASSIGNMENT_BY_ID,
        payload: {
          assignment: data.assignment,
          code: code,
        },
      })
    } else {
      dispatch({
        type: GET_ASSIGNMENT_BY_ID,
        payload: {
          assignment: null,
          code: code,
        },
      })
    }
    return response
  }
}
export const selectedUserAssignment = (user) => ({
  type: SELECTED_USER_ASSIGNMENT,
  payload: {
    user: user,
  },
})
export const selectedAssetAssignment = (asset) => ({
  type: SELECTED_ASSET_ASSIGNMENT,
  payload: {
    asset: asset,
  },
})

export const resetDataUserModalAssignment = () => ({
  type: RESET_DATA_USER_MODAL_ASSIGNMENT,
})
export const resetDataAssetModalAssignment = () => ({
  type: RESET_DATA_ASSET_MODAL_ASSIGNMENT,
})
export const resetSpecialCaseAssignment = () => ({
  type: RESET_SPECIAL_CASE_ASSIGNMENT,
})
