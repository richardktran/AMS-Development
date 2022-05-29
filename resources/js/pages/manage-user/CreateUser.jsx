import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { FormHandleUser } from '../../components/manage-user'
import { generalLayoutCol, dataFormItemUser } from '../../constants'

function CreateUser({ auth }) {
  const { user } = auth

  if (user.role_id === 2) {
    return <Redirect to="/" />
  }
  return (
    <div style={generalLayoutCol}>
      <FormHandleUser
        mainTitle="Create New User"
        dataHandleForm={dataFormItemUser}
      />
    </div>
  )
}

const mapStateToProps = (state) => ({
  auth: state.auth,
})

export default connect(mapStateToProps)(CreateUser)
