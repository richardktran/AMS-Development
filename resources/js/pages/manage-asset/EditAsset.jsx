import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Redirect, useParams } from 'react-router-dom'
import { FormHandleAsset } from '../../components/manage-asset'
import { getAssetById } from '../../actions'
import { generalLayoutCol, dataFormItemAsset } from '../../constants'

function EditAsset(props) {
  const { auth, getAssetById } = props
  const { user } = auth
  const { id } = useParams()

  useEffect(() => {
    getAssetById(id)
  }, [])

  if (user.role_id === 2) {
    return <Redirect to="/" />
  }

  return (
    <div style={generalLayoutCol}>
      <FormHandleAsset
        mainTitle="Edit Asset"
        idAsset={id}
        dataHandleForm={dataFormItemAsset}
      />
    </div>
  )
}

const mapStateToProps = (state) => ({
  auth: state.auth,
})

const mapDispatchToProps = (dispatch) => {
  return {
    getAssetById: (id) => dispatch(getAssetById(id)),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(EditAsset)
