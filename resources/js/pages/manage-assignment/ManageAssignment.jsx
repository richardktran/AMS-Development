import React from 'react'
import { connect } from 'react-redux'
import { generalLayoutCol } from '../../constants'
import { Redirect } from 'react-router-dom'
import { TextHeader } from '../../components/general'
import {
  ManageAssignmentList,
  ManageAssignmentFilter,
} from '../../components/manage-assignment'

function ManageAssignment({ auth }) {
  const { user } = auth

  if (user.role_id === 2) {
    return <Redirect to="/" />
  }
  return (
    <div style={generalLayoutCol}>
      <TextHeader content="Assignment List" />
      <ManageAssignmentFilter />
      <ManageAssignmentList />
    </div>
  )
}

const mapStateToProps = (state) => ({
  auth: state.auth,
})

export default connect(mapStateToProps)(ManageAssignment)
