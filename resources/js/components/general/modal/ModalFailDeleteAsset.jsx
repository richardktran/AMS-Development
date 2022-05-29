import React from 'react'
import { Modal, Button, Typography } from 'antd'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
const { Text } = Typography

function ModalFailDeleteAsset(props) {
  const { disableItemId, isOpen, loading, handleCancel } = props

  return (
    <Modal
      title={<Text style={{ color: '#CF2338' }}>Cannot Delete Asset</Text>}
      visible={isOpen}
      closable={false}
      footer={null}
    >
      <>
        <span>
          Cannot delete the asset because it belongs to one or more historical
          assignments.
        </span>
        <br />
        <span>
          If the asset is not able to be used anymore, please update its state
          in &nbsp;
        </span>
        <Link
          className="text-decoration-underline"
          to={`/assets/edit/${disableItemId}`}
        >
          Edit Asset page
        </Link>
      </>
      <div className="d-flex flex-row align-items-center justify-content-end w-100 pt-4">
        <Button disabled={loading} onClick={handleCancel}>
          Close
        </Button>
      </div>
    </Modal>
  )
}
const mapStateToProps = (state) => ({
  loading: state.loading,
})

export default connect(mapStateToProps)(ModalFailDeleteAsset)
