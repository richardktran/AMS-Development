import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Redirect, useParams } from 'react-router-dom'
import { getAssignmentById } from '../../actions'
import { FormHandleAssignment } from '../../components/manage-assignment'

import { dataFormItemAssignment } from '../../constants'

function EditAssignment(props) {
  const { auth, getAssignmentById } = props
  const { id } = useParams()
  const { user } = auth

  useEffect(() => {
    getAssignmentById(id)
  }, [])

  if (user.role_id === 2) {
    return <Redirect to="/" />
  }
  return (
    <>
      <FormHandleAssignment
        idAssignment={id}
        mainTitle="Edit Assignment"
        dataHandleForm={dataFormItemAssignment}
      />
    </>
  )
}

const mapStateToProps = (state) => ({
  auth: state.auth,
})

const mapDispatchToProps = (dispatch) => {
  return {
    getAssignmentById: (id) => dispatch(getAssignmentById(id)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditAssignment)
