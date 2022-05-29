import { loadingConstants } from '../constants'

const { ENABLE_LOADING, DISABLE_LOADING } = loadingConstants

const loading = (state = false, action) => {
  switch (action.type) {
    case ENABLE_LOADING:
      return true
    case DISABLE_LOADING:
      return false
    default:
      return state
  }
}

export default loading
