import { assetConstants } from '../constants'

const {
  SET_SORT_TYPE,
  CHANGE_CURRENT_PAGE,
  SEARCH_ASSET,
  GET_ASSET_LIST,
  CREATE_ASSET,
  UPDATE_TOP_ASSET_IN_LIST,
  DELETE_ASSET,
  FILTER_BY_STATE,
  FILTER_BY_CATE,
  UPDATE_DATA_FILTER,
  GET_ASSET_BY_ID,
  EDIT_ASSET,
  RESET_FORM_ASSET,
  RESET_SORT_FILTER,
} = assetConstants

const initialState = {
  assetList: [],
  total: 0,
  newDisabledAsset: false,
  code: null,
  newUpdatedAsset: null,
  asset: null,
  sortAction: {
    currentPage: 1,
    perPage: 20,
    sortType: 'asset_code',
    sortValue: 'desc',
    filterByState: [],
    filterByCate: [],
    searchKeywords: null,
  },
  dataFilter: {
    categories: null,
    states: null,
  },
}

const asset = (state = initialState, action) => {
  switch (action.type) {
    case FILTER_BY_STATE:
      return {
        ...state,
        newUpdatedAsset: null,
        sortAction: {
          ...state.sortAction,
          currentPage: 1,
          filterByState: action.payload.filterByState,
        },
      }
    case FILTER_BY_CATE:
      return {
        ...state,
        newUpdatedAsset: null,
        sortAction: {
          ...state.sortAction,
          currentPage: 1,
          filterByCate: action.payload.filterByCate,
        },
      }
    case UPDATE_DATA_FILTER:
      return {
        ...state,
        dataFilter: {
          states: action.payload.dataFilter.states.map((item) => {
            return {
              id: item.state_key,
              value: item.state_name,
              checked: false,
            }
          }),
          categories: action.payload.dataFilter.categories.map((item) => {
            return {
              id: item.id,
              value: item.category_name,
              checked: false,
            }
          }),
        },
      }
    case SET_SORT_TYPE:
      return {
        ...state,
        newUpdatedAsset: null,
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
        newUpdatedAsset: null,
        sortAction: {
          ...state.sortAction,
          currentPage: action.payload.currentPage,
        },
      }
    case SEARCH_ASSET:
      return {
        ...state,
        newUpdatedAsset: null,
        sortAction: {
          ...state.sortAction,
          currentPage: 1,
          searchKeywords: action.payload.searchKeywords,
        },
      }
    case GET_ASSET_LIST:
      return {
        ...state,
        assetList: action.payload.assetList,
        total: action.payload.total,
      }
    case UPDATE_TOP_ASSET_IN_LIST:
      const { payload } = action
      const newData = []
      newData.push(payload.newUpdatedAsset)
      return {
        ...state,
        assetList: newData.concat(
          state.assetList.filter((item) => {
            return item.id !== payload.newUpdatedAsset.id
          })
        ),
      }
    case CREATE_ASSET:
      return {
        ...state,
        newUpdatedAsset: action.payload.asset,
        sortAction: {
          ...initialState.sortAction,
        },
      }
    case DELETE_ASSET:
      return {
        ...state,
        newDisabledAsset: !state.newDisabledAsset,
        newUpdatedAsset: null,
      }
    case GET_ASSET_BY_ID:
      return {
        ...state,
        asset: action.payload.asset,
        code: action.payload.code,
      }
    case EDIT_ASSET:
      return {
        ...state,
        newUpdatedAsset: action.payload.asset,
        sortAction: {
          ...initialState.sortAction,
        },
      }
    case RESET_FORM_ASSET:
      return {
        ...state,
        asset: null,
        code: null,
      }
    case RESET_SORT_FILTER:
      return {
        ...state,
        newUpdatedAsset: null,
        sortAction: {
          ...initialState.sortAction,
        },
      }
    default:
      return state
  }
}

export default asset
