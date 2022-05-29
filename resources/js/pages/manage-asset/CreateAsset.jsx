import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { FormHandleAsset } from '../../components/manage-asset'
import { generalLayoutCol, dataFormItemAsset } from '../../constants'

function CreateAsset({ auth }) {
  const { user } = auth

  if (user.role_id === 2) {
    return <Redirect to="/" />
  }
  return (
    <div style={generalLayoutCol}>
      <FormHandleAsset
        mainTitle="Create New Asset"
        dataHandleForm={dataFormItemAsset}
      />
    </div>
  )
}

const mapStateToProps = (state) => ({
  auth: state.auth,
})

export default connect(mapStateToProps)(CreateAsset)
