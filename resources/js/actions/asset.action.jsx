import { exceptionConstants, assetConstants } from '../constants'
import { checkAuthentication } from './auth.action'
import { AssetService } from '../services'
const {
  RESET_SORT_FILTER,
  SET_SORT_TYPE,
  FILTER_BY_STATE,
  FILTER_BY_CATE,
  CHANGE_CURRENT_PAGE,
  SEARCH_ASSET,
  CREATE_ASSET,
  GET_ASSET_LIST,
  UPDATE_TOP_ASSET_IN_LIST,
  DELETE_ASSET,
  UPDATE_DATA_FILTER,
  GET_ASSET_BY_ID,
  EDIT_ASSET,
  RESET_FORM_ASSET,
} = assetConstants

const { SUCCESS, CREATED } = exceptionConstants

export const getAllAssets = (credentials) => {
  return async function (dispatch) {
    const response = await AssetService.getAllAssets(credentials)
    const { code, data } = response
    checkAuthentication(code)
    if (code === SUCCESS) {
      dispatch({
        type: GET_ASSET_LIST,
        payload: {
          assetList: data.data,
          total: data.meta.total,
        },
      })
    }
    return response
  }
}

export const createAsset = (assetData) => {
  return async function (dispatch) {
    const response = await AssetService.createAsset(assetData)
    const { code, data } = response
    checkAuthentication(code)
    if (code === CREATED) {
      dispatch({
        type: CREATE_ASSET,
        payload: {
          asset: data.asset,
        },
      })
    }
    return response
  }
}

export const deleteAsset = (asset_id) => {
  return async function (dispatch) {
    const response = await AssetService.deleteAsset(asset_id)
    const { code } = response
    checkAuthentication(code)
    if (code === SUCCESS) {
      dispatch({
        type: DELETE_ASSET,
      })
    }
    return response
  }
}

export const getStateAndCategoryInAssetList = () => {
  return async function (dispatch) {
    const response = await AssetService.getStateAndCategoryInAssetList()
    const { code, data } = response
    checkAuthentication(code)
    if (code === SUCCESS) {
      dispatch({
        type: UPDATE_DATA_FILTER,
        payload: {
          dataFilter: data,
        },
      })
    }
    return response
  }
}

export const editAsset = (id, dataAsset) => {
  return async function (dispatch) {
    const response = await AssetService.editAsset(id, dataAsset)
    const { code, data } = response
    checkAuthentication(code)
    if (code === SUCCESS) {
      dispatch({
        type: EDIT_ASSET,
        payload: {
          asset: data.asset,
        },
      })
    }
    return response
  }
}

export const isAssetAssigned = (asset_id) => {
  return async function () {
    const response = await AssetService.isAssetAssigned(asset_id)
    const { code } = response
    checkAuthentication(code)
    return response
  }
}

export const changePageInAssetList = (page) => ({
  type: CHANGE_CURRENT_PAGE,
  payload: {
    currentPage: page,
  },
})

export const searchAsset = (search) => ({
  type: SEARCH_ASSET,
  payload: {
    searchKeywords: search,
  },
})

export const setSortTypeInAssetList = (data) => ({
  type: SET_SORT_TYPE,
  payload: {
    sortType: data.sortType,
    sortValue: data.sortValue,
  },
})

export const setFilterByStateInAssetList = (filterType) => ({
  type: FILTER_BY_STATE,
  payload: {
    filterByState: filterType,
  },
})

export const setFilterByCateInAssetList = (filterType) => ({
  type: FILTER_BY_CATE,
  payload: {
    filterByCate: filterType,
  },
})

export const updateTopAssetInList = (newUpdatedAsset) => ({
  type: UPDATE_TOP_ASSET_IN_LIST,
  payload: {
    newUpdatedAsset: newUpdatedAsset,
  },
})

export const resetSortFilterInAssetList = () => ({
  type: RESET_SORT_FILTER,
})

export const getAssetById = (id) => {
  return async function (dispatch) {
    const response = await AssetService.getAssetById(id)
    const { code, data } = response
    checkAuthentication(code)
    if (code === SUCCESS) {
      dispatch({
        type: GET_ASSET_BY_ID,
        payload: {
          asset: data.asset,
          code: code,
        },
      })
    } else {
      dispatch({
        type: GET_ASSET_BY_ID,
        payload: {
          asset: null,
          code: code,
        },
      })
    }
    return response
  }
}

export const resetFormHandleAsset = () => ({
  type: RESET_FORM_ASSET,
})
