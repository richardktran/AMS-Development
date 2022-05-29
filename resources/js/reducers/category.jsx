import { categoryConstants } from '../constants'

const { CREATE_CATEGORY, GET_CATEGORY_LIST } = categoryConstants

const initialState = {
  categoryList: [],
  newUpdatedCategory: null,
}

const category = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_CATEGORY:
      return {
        ...state,
        newUpdatedCategory: action.payload.category,
      }
    case GET_CATEGORY_LIST:
      return {
        ...state,
        categoryList: action.payload.categoryList,
      }
    default:
      return state
  }
}

export default category
