import { exceptionConstants, categoryConstants } from '../constants'
import { checkAuthentication } from './auth.action'
import { CategoryService } from '../services'

const { CREATE_CATEGORY, GET_CATEGORY_LIST } = categoryConstants
const { CREATED, SUCCESS } = exceptionConstants

export const createCategory = (assetData) => {
  return async function (dispatch) {
    const response = await CategoryService.createCategory(assetData)
    const { code, data } = response
    checkAuthentication(code)
    if (code === CREATED) {
      dispatch({
        type: CREATE_CATEGORY,
        payload: {
          category: data.category,
        },
      })
    }
    return response
  }
}

export const getAllCategories = () => {
  return async function (dispatch) {
    const response = await CategoryService.getAllCategories()
    const { code, data } = response
    checkAuthentication(code)
    if (code === SUCCESS) {
      dispatch({
        type: GET_CATEGORY_LIST,
        payload: {
          categoryList: data.data,
        },
      })
    }
    return response
  }
}
