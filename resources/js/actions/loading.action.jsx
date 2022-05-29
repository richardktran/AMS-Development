import { loadingConstants } from '../constants'

const { ENABLE_LOADING, DISABLE_LOADING } = loadingConstants

export const enableLoading = () => ({
  type: ENABLE_LOADING,
})

export const disableLoading = () => ({
  type: DISABLE_LOADING,
})
