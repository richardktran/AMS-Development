import { requestConstants } from '../constants'

const {
  RESET_SORT_FILTER,
  SET_SORT_TYPE,
  FILTER_BY_STATE,
  FILTER_BY_RETURNED_DATE,
  CHANGE_CURRENT_PAGE,
  SEARCH_REQUEST,
  GET_REQUEST_LIST,
  UPDATE_DATA_FILTER,
  ADMIN_COMPLETE_REQUEST,
  ADMIN_CANCEL_REQUEST,
} = requestConstants

const initialState = {
  requestList: [],
  total: 0,
  newUpdatedState: false,
  sortAction: {
    currentPage: 1,
    perPage: 20,
    sortType: 'id',
    sortValue: 'asc',
    filterByState: [],
    filterByReturnedDate: null,
    searchKeywords: null,
  },
  dataFilter: {
    states: null,
  },
}

const request = (state = initialState, action) => {
  switch (action.type) {
    case FILTER_BY_STATE:
      return {
        ...state,
        sortAction: {
          ...state.sortAction,
          currentPage: 1,
          filterByState: action.payload.filterByState,
        },
      }
    case FILTER_BY_RETURNED_DATE:
      return {
        ...state,
        sortAction: {
          ...state.sortAction,
          currentPage: 1,
          filterByReturnedDate: action.payload.filterByReturnedDate,
        },
      }
    case UPDATE_DATA_FILTER:
      return {
        ...state,
        dataFilter: {
          states: action.payload.dataFilter.map((item) => {
            return {
              id: item.state_key,
              value: item.state_name,
              checked: false,
            }
          }),
        },
      }
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
    case SEARCH_REQUEST:
      return {
        ...state,
        sortAction: {
          ...state.sortAction,
          currentPage: 1,
          searchKeywords: action.payload.searchKeywords,
        },
      }
    case GET_REQUEST_LIST:
      return {
        ...state,
        requestList: action.payload.requestList,
        total: action.payload.total,
      }
    case RESET_SORT_FILTER:
      return {
        ...state,
        sortAction: {
          ...initialState.sortAction,
        },
      }
    case ADMIN_COMPLETE_REQUEST:
    case ADMIN_CANCEL_REQUEST:
      return {
        ...state,
        newUpdatedState: !state.newUpdatedState,
      }
    default:
      return state
  }
}

export default request
