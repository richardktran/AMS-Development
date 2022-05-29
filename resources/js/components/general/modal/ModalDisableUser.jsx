import React from 'react'
import { Modal, Button, Typography } from 'antd'
import { connect } from 'react-redux'
import { disableLoading, enableLoading, disableUser } from '../../../actions'
import { exceptionConstants } from '../../../constants'
const { SUCCESS } = exceptionConstants
const { Text } = Typography

function ModalDisableUser(props) {
  const {
    isOpen,
    handleCancel,
    loading,
    enableLoading,
    disableLoading,
    disableId,
    disableUser,
    showPopUp,
  } = props

  const handleOnClickDisable = async (user_id) => {
    enableLoading()
    const res = await disableUser(user_id)
    handleCancel()
    if (res.code !== SUCCESS) {
      showPopUp(res.code, res.message)
    }
    disableLoading()
  }

  return (
    <Modal
      title={<Text style={{ color: '#CF2338' }}>Are you sure?</Text>}
      visible={isOpen}
      closable={false}
      onCancel={handleCancel}
      footer={null}
    >
      <span>Do you want to disable this user?</span>
      <div className="d-flex flex-row align-items-center justify-content-end w-100 pt-4">
        <Button
          className="mx-3"
          disabled={loading}
          type="primary"
          danger
          onClick={() => handleOnClickDisable(disableId)}
        >
          Disable
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
    disableUser: (user_id) => dispatch(disableUser(user_id)),
    enableLoading: () => dispatch(enableLoading()),
    disableLoading: () => dispatch(disableLoading()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalDisableUser)
