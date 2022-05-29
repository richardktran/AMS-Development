import React from 'react'
import { connect } from 'react-redux'
import { searchUser, setFilterInUserList } from '../../actions'
import { roleConstants } from '../../constants'
import { InputSearch, ButtonRouting, DropdownFilter } from '../general'

function ManageUserFilter(props) {
  const { searchUser, setFilterInUserList } = props

  return (
    <div className="w-100 d-flex align-items-center justify-content-between">
      <DropdownFilter
        title="Type"
        placement="bottomRight"
        data={roleConstants}
        handleSetFilter={setFilterInUserList}
      />
      <div className=" my-4 d-flex align-items-center justify-content-center">
        <InputSearch handleSearch={searchUser} style={{ marginRight: 30 }} />
        <ButtonRouting title="Create new user" route="/users/create" />
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  loading: state.loading,
})

const mapDispatchToProps = (dispatch) => {
  return {
    searchUser: (search) => dispatch(searchUser(search)),
    setFilterInUserList: (filterType) =>
      dispatch(setFilterInUserList(filterType)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageUserFilter)
