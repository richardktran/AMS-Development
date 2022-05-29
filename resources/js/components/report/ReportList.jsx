import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import '../../../css/app.scss'
import { showMessage, TextHighlight, AppTable } from '../general'
import {
  enableLoading,
  disableLoading,
  getAllReportList,
  checkAuthentication,
  changePageInReportList,
  setSortTypeInReportList,
} from '../../actions'
import { exceptionConstants, reportListColumns } from '../../constants'

const { UNAUTHENTICATED, SUCCESS } = exceptionConstants

function ReportList(props) {
  let data = []
  const columns = []
  const {
    report,
    enableLoading,
    disableLoading,
    getAllReportList,
    checkAuthentication,
    changePageInReportList,
    setSortTypeInReportList,
  } = props
  const { sortAction, total, reportList } = report
  const { currentPage, sortType, perPage, sortValue } = sortAction

  reportListColumns.map((item) => {
    return columns.push({
      ...item,
      render: (text) => (
        <TextHighlight
          content={text}
          isDate={item.isDate}
          isHighlight={item.isSearchField}
        />
      ),
    })
  })

  useEffect(async () => {
    enableLoading()
    const credentials = {
      sort_type: sortType,
      sort_value: sortValue,
      page: currentPage,
    }
    const res = await getAllReportList(credentials)
    if (res.code === UNAUTHENTICATED) {
      showMessage('error', res.code + ' error', res.message)
      checkAuthentication(res.code)
    } else if (res.code !== SUCCESS) {
      showMessage('error', res.code + ' error', res.message)
    }
    disableLoading()
  }, [sortAction])

  if (reportList && reportList.length > 0) {
    data = []
    reportList.map((item) =>
      data.push({
        key: item.id,
        ...item,
      })
    )
  }

  return (
    <>
      <AppTable
        data={data}
        columns={columns}
        handleSorter={setSortTypeInReportList}
        sortDefault={{ type: 'category_name', value: 'asc' }}
        currentPage={currentPage}
        total={total}
        perPage={perPage}
        handleChangePage={changePageInReportList}
      />
    </>
  )
}

const mapStateToProps = (state) => ({
  loading: state.loading,
  report: state.report,
})

const mapDispatchToProps = (dispatch) => {
  return {
    disableLoading: () => dispatch(disableLoading()),
    checkAuthentication: (code) => dispatch(checkAuthentication(code)),
    enableLoading: () => dispatch(enableLoading()),
    getAllReportList: (credentials) => dispatch(getAllReportList(credentials)),
    changePageInReportList: (page) => dispatch(changePageInReportList(page)),
    setSortTypeInReportList: (data) => dispatch(setSortTypeInReportList(data)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportList)
