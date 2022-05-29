import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { FormHandleAssignment } from '../../components/manage-assignment'
import { generalLayoutCol, dataFormItemAssignment } from '../../constants'

function CreateAssignment({ auth }) {
  const { user } = auth

  if (user.role_id === 2) {
    return <Redirect to="/" />
  }
  return (
    <div style={generalLayoutCol}>
      <FormHandleAssignment
        mainTitle="Create New Assignment"
        dataHandleForm={dataFormItemAssignment}
      />
    </div>
  )
}

const mapStateToProps = (state) => ({
  auth: state.auth,
})

export default connect(mapStateToProps)(CreateAssignment)
