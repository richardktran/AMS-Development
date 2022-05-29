import React from 'react'
import { Button } from 'antd'
import { connect } from 'react-redux'
import {
  enableLoading,
  disableLoading,
  downloadReport,
  checkAuthentication,
} from '../../../actions'
import { showMessage } from '..'
import { exceptionConstants } from '../../../constants'
const { UNAUTHENTICATED, SUCCESS, PAGE_NOT_FOUND, BAD_REQUEST, FORBIDDEN } =
  exceptionConstants

function ButtonExportReport(props) {
  const {
    enableLoading,
    disableLoading,
    downloadReport,
    loading,
    report,
    checkAuthentication,
  } = props

  const { sortAction } = report
  const { currentPage, sortType, sortValue } = sortAction

  const showPopUpByCode = (code, msg) => {
    checkAuthentication(code)
    if (code === PAGE_NOT_FOUND) {
      showMessage(
        'error',
        'Can not find this assignment',
        'This assignment has been disabled or does not exist.'
      )
    } else if (code === UNAUTHENTICATED) {
      showMessage('error', code + ' error', 'You are not authenticated!')
    } else if (code === FORBIDDEN) {
      showMessage('error', code + ' error', msg)
    } else if (code === BAD_REQUEST) {
      showMessage('error', code + ' error', msg)
    } else {
      showMessage(
        'error',
        'Service unavailable',
        'There may be a problem with the server. Please try again later.'
      )
    }
  }

  const handleDownloadExport = async () => {
    enableLoading()
    const credentials = {
      sort_type: sortType,
      sort_value: sortValue,
      page: currentPage,
    }
    const res = await downloadReport(credentials)
    if (res.code !== SUCCESS) {
      showPopUpByCode(res.code, res.message)
    }
    disableLoading()
  }

  return (
    <Button
      type="primary"
      style={{ color: 'white', backgroundColor: '#CF2338', border: '0px' }}
      onClick={handleDownloadExport}
      disabled={loading}
    >
      Export
    </Button>
  )
}

const mapStateToProps = (state) => ({
  loading: state.loading,
  report: state.report,
})

const mapDispatchToProps = (dispatch) => {
  return {
    disableLoading: () => dispatch(disableLoading()),
    enableLoading: () => dispatch(enableLoading()),
    downloadReport: (credentials) => dispatch(downloadReport(credentials)),
    checkAuthentication: (code) => dispatch(checkAuthentication(code)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ButtonExportReport)
