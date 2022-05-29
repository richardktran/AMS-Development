import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import {
  getStateInRequestList,
  searchRequest,
  setFilterByReturnedDateInRequestList,
  setFilterByStateInRequestList,
} from '../../actions'
import { DatePicker } from 'antd'
import { InputSearch, DropdownFilter } from '../general'
import { DATE_FORMAT } from '../../constants'
import moment from 'moment'
function RequestFilter(props) {
  const {
    getStateInRequestList,
    searchRequest,
    setFilterByReturnedDateInRequestList,
    setFilterByStateInRequestList,
    request,
  } = props

  const { dataFilter } = request
  const { states } = dataFilter

  useEffect(async () => {
    await getStateInRequestList()
  }, [])

  const handleDate = (value) => {
    setFilterByReturnedDateInRequestList(
      value === null ? null : moment(value).format('YYYY-MM-DD')
    )
  }
  return (
    <div className="w-100 d-flex align-items-center justify-content-between">
      <div className="d-flex flex-row align-items-center justify-content-center">
        <DropdownFilter
          style={{ marginRight: '30px' }}
          title="State"
          placement="bottomLeft"
          data={states}
          handleSetFilter={setFilterByStateInRequestList}
        />
        <div style={{ marginRight: '30px' }}></div>
        <DatePicker
          format={DATE_FORMAT}
          onChange={handleDate}
          placeholder="Returned Date"
        />
      </div>
      <div className=" my-4 d-flex align-items-center justify-content-center">
        <InputSearch handleSearch={searchRequest} />
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  loading: state.loading,
  request: state.request,
})

const mapDispatchToProps = (dispatch) => {
  return {
    searchRequest: (search) => dispatch(searchRequest(search)),
    setFilterByStateInRequestList: (filterType) =>
      dispatch(setFilterByStateInRequestList(filterType)),
    setFilterByReturnedDateInRequestList: (filterType) =>
      dispatch(setFilterByReturnedDateInRequestList(filterType)),
    getStateInRequestList: () => dispatch(getStateInRequestList()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestFilter)
