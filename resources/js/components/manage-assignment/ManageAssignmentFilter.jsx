import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import {
  getStateInAssignmentList,
  searchAssignment,
  setFilterByAssignedDateInAssignmentList,
  setFilterByStateInAssignmentList,
} from '../../actions'
import { DatePicker } from 'antd'
import { InputSearch, ButtonRouting, DropdownFilter } from '../general'
import { DATE_FORMAT } from '../../constants'
import moment from 'moment'
function ManageAssignmentFilter(props) {
  const {
    searchAssignment,
    setFilterByAssignedDateInAssignmentList,
    setFilterByStateInAssignmentList,
    assignment,
    getStateInAssignmentList,
  } = props

  const { dataFilter } = assignment
  const { states } = dataFilter

  useEffect(async () => {
    await getStateInAssignmentList()
  }, [])

  const handleDate = (value) => {
    setFilterByAssignedDateInAssignmentList(
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
          handleSetFilter={setFilterByStateInAssignmentList}
        />
        <div style={{ marginRight: '30px' }}></div>
        <DatePicker
          format={DATE_FORMAT}
          onChange={handleDate}
          placeholder="Assigned Date"
        />
      </div>
      <div className=" my-4 d-flex align-items-center justify-content-center">
        <InputSearch
          handleSearch={searchAssignment}
          style={{ marginRight: 30 }}
        />
        <ButtonRouting
          title="Create new assignment"
          route="/assignments/create"
        />
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  loading: state.loading,
  assignment: state.assignment,
})

const mapDispatchToProps = (dispatch) => {
  return {
    searchAssignment: (search) => dispatch(searchAssignment(search)),
    setFilterByStateInAssignmentList: (filterType) =>
      dispatch(setFilterByStateInAssignmentList(filterType)),
    setFilterByAssignedDateInAssignmentList: (filterType) =>
      dispatch(setFilterByAssignedDateInAssignmentList(filterType)),
    getStateInAssignmentList: () => dispatch(getStateInAssignmentList()),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageAssignmentFilter)
