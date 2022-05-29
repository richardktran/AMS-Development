import { homeConstants } from '../constants'

const {
  RESET_SORT_FILTER,
  SET_SORT_TYPE,
  CHANGE_CURRENT_PAGE,
  GET_HOME_LIST,
  USER_ACCEPT_ASSIGNMENT,
  USER_DECLINE_ASSIGNMENT,
  USER_REQUEST_RETURN,
} = homeConstants

const initialState = {
  homeList: [],
  total: 0,
  newUpdatedState: false,
  sortAction: {
    currentPage: 1,
    perPage: 20,
    sortType: 'id',
    sortValue: 'asc',
  },
}

const home = (state = initialState, action) => {
  switch (action.type) {
    case SET_SORT_TYPE:
      return {
        ...state,
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
        sortAction: {
          ...state.sortAction,
          currentPage: action.payload.currentPage,
        },
      }
    case GET_HOME_LIST:
      return {
        ...state,
        homeList: action.payload.homeList,
        total: action.payload.total,
      }
    case RESET_SORT_FILTER:
      return {
        ...state,
        sortAction: {
          ...initialState.sortAction,
        },
      }
    case USER_ACCEPT_ASSIGNMENT:
    case USER_DECLINE_ASSIGNMENT:
    case USER_REQUEST_RETURN:
      return {
        ...state,
        newUpdatedState: !state.newUpdatedState,
      }
    default:
      return state
  }
}

export default home
