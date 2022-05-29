import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Redirect, useParams } from 'react-router-dom'
import { getUserById } from '../../actions'
import { FormHandleUser } from '../../components/manage-user'

import { dataFormItemUser } from '../../constants'

function EditUser(props) {
  const { auth, getUserById } = props
  const { id } = useParams()
  const { user } = auth

  useEffect(() => {
    getUserById(id)
  }, [])

  if (user.role_id === 2) {
    return <Redirect to="/" />
  }
  return (
    <>
      <FormHandleUser
        idUser={id}
        mainTitle="Edit User"
        dataHandleForm={dataFormItemUser}
      />
    </>
  )
}

const mapStateToProps = (state) => ({
  auth: state.auth,
})

const mapDispatchToProps = (dispatch) => {
  return {
    getUserById: (id) => dispatch(getUserById(id)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditUser)
