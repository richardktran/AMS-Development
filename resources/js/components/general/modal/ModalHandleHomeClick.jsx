import React, { useState, useEffect } from 'react'
import { Modal, Button, Typography } from 'antd'
import { connect } from 'react-redux'
import {
  disableLoading,
  enableLoading,
  acceptAssignment,
  declineAssignment,
  requestForReturning,
} from '../../../actions'
import { exceptionConstants } from '../../../constants'
const { SUCCESS, SERVER_ERROR, CREATED } = exceptionConstants
const { Text } = Typography

function ModalHandleHomeClick(props) {
  const {
    isOpen,
    handleCancel,
    loading,
    enableLoading,
    disableLoading,
    selectedId,
    showPopUp,
    type,
    acceptAssignment,
    declineAssignment,
    requestForReturning,
  } = props

  const [modalMessage, setModalMessage] = useState(null)
  const [buttonYes, setButtonYes] = useState('Yes')
  const [buttonCancel, setButtonCancel] = useState('No')

  useEffect(() => {
    enableLoading()
    if (type === 'accept') {
      setModalMessage('Do you want to accept this assignment?')
      setButtonYes('Accept')
      setButtonCancel('Cancel')
    } else if (type === 'decline') {
      setModalMessage('Do you want to decline this assignment?')
      setButtonYes('Decline')
      setButtonCancel('Cancel')
    } else if (type === 'request_return') {
      setModalMessage(
        'Do you want to create a returning request for this asset?'
      )
      setButtonYes('Yes')
      setButtonCancel('No')
    }
    disableLoading()
  }, [type])

  const handleOnClick = async (id) => {
    enableLoading()
    let res = { code: SERVER_ERROR, message: 'Undefined action!', data: null }
    if (type === 'accept') {
      res = await acceptAssignment(id)
    } else if (type === 'decline') {
      res = await declineAssignment(id)
    } else if (type === 'request_return') {
      res = await requestForReturning(id)
    }
    handleCancel()
    if (res.code !== SUCCESS && res.code !== CREATED) {
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
      <span>{modalMessage}</span>
      <div className="d-flex flex-row align-items-center justify-content-end w-100 pt-4">
        <Button
          className="mx-3"
          disabled={loading}
          type="primary"
          danger
          onClick={() => handleOnClick(selectedId)}
        >
          {buttonYes}
        </Button>
        <Button disabled={loading} onClick={handleCancel}>
          {buttonCancel}
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
    acceptAssignment: (id) => dispatch(acceptAssignment(id)),
    declineAssignment: (id) => dispatch(declineAssignment(id)),
    requestForReturning: (id) => dispatch(requestForReturning(id)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalHandleHomeClick)
