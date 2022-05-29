import { exceptionConstants, reportConstants } from '../constants'
import { checkAuthentication } from './auth.action'
import { ReportService } from '../services'
import moment from 'moment'

const fileDownload = require('js-file-download')
const {
  RESET_SORT_FILTER,
  SET_SORT_TYPE,
  CHANGE_CURRENT_PAGE,
  GET_REPORT_LIST,
} = reportConstants

const { SUCCESS } = exceptionConstants

export const getAllReportList = (credentials) => {
  return async function (dispatch) {
    const response = await ReportService.getAllReportList(credentials)
    const { code, data } = response
    checkAuthentication(code)
    if (code === SUCCESS) {
      dispatch({
        type: GET_REPORT_LIST,
        payload: {
          reportList: data.data,
          total: data.total,
        },
      })
    }
    return response
  }
}

export const downloadReport = (credentials) => {
  return async function () {
    const response = await ReportService.downloadReport(credentials)
    const { code, data } = response
    checkAuthentication(code)
    if (code === SUCCESS) {
      const today = moment().format('DD_MM_YYYY')
      fileDownload(data, `Report_AssetManagement_${today}.xlsx`)
    }
    return response
  }
}

export const changePageInReportList = (page) => ({
  type: CHANGE_CURRENT_PAGE,
  payload: {
    currentPage: page,
  },
})

export const setSortTypeInReportList = (data) => ({
  type: SET_SORT_TYPE,
  payload: {
    sortType: data.sortType,
    sortValue: data.sortValue,
  },
})

export const resetSortFilterInReportList = () => ({
  type: RESET_SORT_FILTER,
})
