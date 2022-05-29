/* eslint-disable no-unused-vars */
import React from 'react'
import { Modal, Button, Typography } from 'antd'
import { connect } from 'react-redux'
import { exceptionConstants } from '../../../constants'
import {
  disableLoading,
  enableLoading,
  createRequestForReturnAssignment,
} from '../../../actions'
const { CREATED } = exceptionConstants
const { Text } = Typography

function ModalReturnAssignment(props) {
  const {
    isOpen,
    returnId,
    handleCancel,
    loading,
    enableLoading,
    disableLoading,
    showPopUp,
    createRequestForReturnAssignment,
  } = props

  const handleClickReturn = async () => {
    enableLoading()
    const res = await createRequestForReturnAssignment(returnId)
    handleCancel()
    if (res.code !== CREATED) {
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
      <span>Do you want to create a returning request for this asset?</span>
      <div className="d-flex flex-row align-items-center justify-content-end w-100 pt-4">
        <Button
          className="mx-3"
          disabled={loading}
          type="primary"
          danger
          onClick={handleClickReturn}
        >
          Yes
        </Button>
        <Button disabled={loading} onClick={handleCancel}>
          No
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
    enableLoading: () => dispatch(enableLoading()),
    disableLoading: () => dispatch(disableLoading()),
    createRequestForReturnAssignment: (id) =>
      dispatch(createRequestForReturnAssignment(id)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalReturnAssignment)
