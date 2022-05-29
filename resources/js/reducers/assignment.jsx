import { assignmentConstants } from '../constants'

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
  GET_DATA_ASSET_MODAL_ASSIGNMENT,
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

const initialState = {
  assignmentList: [],
  total: 0,
  code: null,
  assignment: null,
  newDataUser: [],
  newDataAsset: [],
  dataModalAsset: [],
  selectedUser: null,
  selectedAsset: null,
  newDisabledAssignment: false,
  newUpdatedAssignment: null,
  sortAction: {
    currentPage: 1,
    perPage: 20,
    sortType: 'id',
    sortValue: 'asc',
    filterByState: [],
    filterByAssignedDate: null,
    searchKeywords: null,
  },
  dataFilter: {
    states: null,
  },
  specialCase: null,
  newReturnedAssignment: false,
}

const assignment = (state = initialState, action) => {
  switch (action.type) {
    case FILTER_BY_STATE:
      return {
        ...state,
        newUpdatedAssignment: null,
        sortAction: {
          ...state.sortAction,
          currentPage: 1,
          filterByState: action.payload.filterByState,
        },
      }
    case FILTER_BY_ASSIGNED_DATE:
      return {
        ...state,
        newUpdatedAsset: null,
        sortAction: {
          ...state.sortAction,
          currentPage: 1,
          filterByAssignedDate: action.payload.filterByAssignedDate,
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
        newUpdatedAssignment: null,
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
        newUpdatedAssignment: null,
        sortAction: {
          ...state.sortAction,
          currentPage: action.payload.currentPage,
        },
      }
    case SEARCH_ASSIGNMENT:
      return {
        ...state,
        newUpdatedAssignment: null,
        sortAction: {
          ...state.sortAction,
          currentPage: 1,
          searchKeywords: action.payload.searchKeywords,
        },
      }
    case GET_ASSIGNMENT_LIST:
      return {
        ...state,
        assignmentList: action.payload.assignmentList,
        total: action.payload.total,
      }
    case UPDATE_TOP_ASSIGNMENT_IN_LIST:
      const { payload } = action
      const newData = []
      newData.push(payload.newUpdatedAssignment)
      return {
        ...state,
        assignmentList: newData.concat(
          state.assignmentList.filter((item) => {
            return item.id !== payload.newUpdatedAssignment.id
          })
        ),
      }
    case GET_ASSIGNMENT_BY_ID:
      return {
        ...state,
        assignment: action.payload.assignment,
        code: action.payload.code,
      }
    case RESET_SORT_FILTER:
      return {
        ...state,
        newUpdatedAssignment: null,
        sortAction: {
          ...initialState.sortAction,
        },
      }
    case RESET_FORM_CREATE_ASSIGNMENT:
      return {
        ...state,
        selectedUser: null,
        selectedAsset: null,
      }
    case RESET_FORM_EDIT_ASSIGNMENT:
      return {
        ...state,
        selectedUser: null,
        selectedAsset: null,
        assignment: null,
        code: null,
      }
    case DISABLE_ASSIGNMENT:
      return {
        ...state,
        newDisabledAssignment: !state.newDisabledAssignment,
        newUpdatedAssignment: null,
      }
    case REQUEST_RETURN_ASSIGNMENT:
      return {
        ...state,
        newReturnedAssignment: !state.newReturnedAssignment,
        newUpdatedAssignment: null,
      }
    case UPDATE_DATA_SEARCH_USER_ASSIGNMENT:
      const data = action.payload.data.map((item) => {
        return {
          key: item.id,
          staff_code: item.staff_code,
          full_name: item.full_name,
          type: item.type,
          joined_date: item.joined_date,
        }
      })
      return {
        ...state,
        newDataUser: data,
      }
    case UPDATE_DATA_SEARCH_ASSET_ASSIGNMENT:
      const assetData = action.payload.data.map((item) => {
        return {
          key: item.id,
          asset_code: item.asset_code,
          asset_name: item.asset_name,
          category_name: item.category_name,
          installed_date: item.installed_date,
        }
      })
      return {
        ...state,
        newDataAsset: [...assetData],
      }
    case GET_DATA_ASSET_MODAL_ASSIGNMENT:
      return {
        ...state,
        dataModalAsset: action.payload.data,
      }
    case SELECTED_USER_ASSIGNMENT:
      return {
        ...state,
        selectedUser: action.payload.user,
      }
    case SELECTED_ASSET_ASSIGNMENT:
      return {
        ...state,
        selectedAsset: action.payload.asset,
      }
    case RESET_DATA_USER_MODAL_ASSIGNMENT:
      return {
        ...state,
        newDataUser: [],
      }
    case RESET_DATA_ASSET_MODAL_ASSIGNMENT:
      return {
        ...state,
        newDataAsset: [],
      }
    case RESET_SPECIAL_CASE_ASSIGNMENT:
      return {
        ...state,
        specialCase: null,
      }
    case CREATE_ASSIGNMENT:
      return {
        ...state,
        newUpdatedAssignment: action.payload.assignment,
      }
    case EDIT_ASSIGNMENT:
      return {
        ...state,
        newUpdatedAssignment: action.payload.assignment,
        specialCase: action.payload.special ? action.payload.special : null,
      }
    default:
      return state
  }
}

export default assignment
