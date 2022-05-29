import { reportConstants } from '../constants'

const {
  RESET_SORT_FILTER,
  SET_SORT_TYPE,
  CHANGE_CURRENT_PAGE,
  GET_REPORT_LIST,
} = reportConstants

const initialState = {
  reportList: [],
  total: 0,
  sortAction: {
    currentPage: 1,
    perPage: 20,
    sortType: 'category_name',
    sortValue: 'asc',
  },
}

const report = (state = initialState, action) => {
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
    case GET_REPORT_LIST:
      return {
        ...state,
        reportList: action.payload.reportList,
        total: action.payload.total,
      }
    case RESET_SORT_FILTER:
      return {
        ...state,
        sortAction: {
          ...initialState.sortAction,
        },
      }
    default:
      return state
  }
}

export default report
