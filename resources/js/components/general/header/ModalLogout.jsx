import React, { useState } from 'react'
import { Modal, Button, Typography } from 'antd'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { disableLoading, enableLoading, logout } from '../../../actions'
import { exceptionConstants } from '../../../constants'

const { SUCCESS } = exceptionConstants
const { Text } = Typography

function ModalLogout(props) {
  const {
    isOpen,
    handleCancel,
    loading,
    enableLoading,
    disableLoading,
    logout,
  } = props
  const [redirect, enableRedirect] = useState(false)

  const handleLogout = async () => {
    enableLoading()
    const res = await logout()
    if (res.code === SUCCESS) {
      enableRedirect(true)
    }
    disableLoading()
  }

  if (redirect) {
    return <Redirect to="/login" />
  }

  return (
    <Modal
      title={<Text style={{ color: '#CF2338' }}>Are you sure?</Text>}
      visible={isOpen}
      closable={false}
      onCancel={handleCancel}
      footer={null}
    >
      <span>Do you want to log out?</span>
      <div className="d-flex flex-row align-items-center justify-content-end w-100 pt-4">
        <Button
          className="mx-3"
          disabled={loading}
          type="primary"
          danger
          onClick={handleLogout}
        >
          Log out
        </Button>
        <Button disabled={loading} onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    </Modal>
  )
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  loading: state.loading,
})

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout()),
    enableLoading: () => dispatch(enableLoading()),
    disableLoading: () => dispatch(disableLoading()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalLogout)
