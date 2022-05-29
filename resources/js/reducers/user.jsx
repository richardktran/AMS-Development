import { userConstants } from '../constants'

const {
  CREATE_USER,
  FILLTER_BY_ROLE,
  RESET_SORT_FILTER,
  SET_SORT_TYPE,
  CHANGE_CURRENT_PAGE,
  SEARCH_USER,
  EDIT_USER,
  GET_USER_BY_ID,
  UPDATE_TOP_USER_IN_LIST,
  GET_USER_LIST,
  DISABLE_USER,
  RESET_FORM_USER,
  RESET_SPECIAL_CASE,
} = userConstants

const initialState = {
  userList: [],
  total: 0,
  newDisabledUser: false,
  code: null,
  newUpdatedUser: null,
  user: null,
  sortAction: {
    currentPage: 1,
    perPage: 20,
    sortType: 'staff_code',
    sortValue: 'desc',
    filterType: [],
    searchKeywords: null,
  },
  specialCase: null,
}

const user = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_USER:
      return {
        ...state,
        newUpdatedUser: action.payload.user,
        sortAction: {
          ...initialState.sortAction,
        },
      }
    case EDIT_USER:
      return {
        ...state,
        newUpdatedUser: action.payload.user,
        specialCase: action.payload.special ? action.payload.special : null,
        sortAction: {
          ...initialState.sortAction,
        },
      }
    case GET_USER_BY_ID:
      return {
        ...state,
        user: action.payload.user,
        code: action.payload.code,
      }
    case RESET_FORM_USER:
      return {
        ...state,
        user: null,
        code: null,
      }
    case RESET_SORT_FILTER:
      return {
        ...state,
        newUpdatedUser: null,
        sortAction: {
          ...initialState.sortAction,
        },
      }
    case RESET_SPECIAL_CASE:
      return {
        ...state,
        specialCase: null,
      }
    case FILLTER_BY_ROLE:
      return {
        ...state,
        newUpdatedUser: null,
        sortAction: {
          ...state.sortAction,
          currentPage: 1,
          filterType: action.payload.filterType,
        },
      }
    case SET_SORT_TYPE:
      return {
        ...state,
        newUpdatedUser: null,
        sortAction: {
          ...state.sortAction,
          currentPage: 1,
          sortType: action.payload.sortType,
          sortValue: action.payload.sortValue,
        },
      }
    case CHANGE_CURRENT_PAGE:
      return {
        ...state,
        newUpdatedUser: null,
        sortAction: {
          ...state.sortAction,
          currentPage: action.payload.currentPage,
        },
      }
    case SEARCH_USER:
      return {
        ...state,
        newUpdatedUser: null,
        sortAction: {
          ...state.sortAction,
          currentPage: 1,
          searchKeywords: action.payload.searchKeywords,
        },
      }
    case GET_USER_LIST:
      return {
        ...state,
        userList: action.payload.userList,
        total: action.payload.total,
      }
    case UPDATE_TOP_USER_IN_LIST:
      const { payload } = action
      const newData = []
      newData.push(payload.newUpdatedUser)
      return {
        ...state,
        userList: newData.concat(
          state.userList.filter((item) => {
            return item.id !== payload.newUpdatedUser.id
          })
        ),
      }
    case DISABLE_USER:
      return {
        ...state,
        newDisabledUser: !state.newDisabledUser,
        newUpdatedUser: null,
      }
    default:
      return state
  }
}

export default user
