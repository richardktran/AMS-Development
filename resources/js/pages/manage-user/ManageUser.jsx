import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { TextHeader } from '../../components/general'
import { ManageUserList, ManageUserFilter } from '../../components/manage-user'
import { generalLayoutCol } from '../../constants'

function ListUser({ auth }) {
  const { user } = auth

  if (user.role_id === 2) {
    return <Redirect to="/" />
  }
  return (
    <div style={generalLayoutCol}>
      <TextHeader content="User List" />
      <ManageUserFilter />
      <ManageUserList />
    </div>
  )
}

const mapStateToProps = (state) => ({
  auth: state.auth,
})

export default connect(mapStateToProps)(ListUser)
