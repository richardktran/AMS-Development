import React from 'react'
import { Modal, Button, Typography } from 'antd'
import { connect } from 'react-redux'
import {
  disableLoading,
  enableLoading,
  disableAssignment,
} from '../../../actions'
import { exceptionConstants } from '../../../constants'
const { SUCCESS } = exceptionConstants
const { Text } = Typography

function ModalDisableAssignment(props) {
  const {
    isOpen,
    handleCancel,
    loading,
    enableLoading,
    disableLoading,
    disableId,
    disableAssignment,
    showPopUp,
  } = props

  const handleOnClickDisable = async (id) => {
    enableLoading()
    const res = await disableAssignment(id)
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
      <span>Do you want to delete this assignment?</span>
      <div className="d-flex flex-row align-items-center justify-content-end w-100 pt-4">
        <Button
          className="mx-3"
          disabled={loading}
          type="primary"
          danger
          onClick={() => handleOnClickDisable(disableId)}
        >
          Delete
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
    disableAssignment: (id) => dispatch(disableAssignment(id)),
    enableLoading: () => dispatch(enableLoading()),
    disableLoading: () => dispatch(disableLoading()),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalDisableAssignment)
