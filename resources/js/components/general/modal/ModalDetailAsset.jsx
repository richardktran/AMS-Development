/* eslint-disable no-unused-vars */
import React from 'react'
import { Button, Modal, Row, Col, Typography } from 'antd'
import { connect } from 'react-redux'
import { formatDate, formatCapitalizeFirst } from '../../../utils'

const { Text } = Typography
function ModalDetailAsset(props) {
  const { isOpen, handleCancel, detail, loading } = props
  return (
    <Modal
      title={
        <Text style={{ color: '#CF2338' }}>Detailed Asset Information</Text>
      }
      visible={isOpen}
      closable={false}
      onCancel={handleCancel}
      footer={null}
    >
      {detail !== null ? (
        <Row gutter={[8, 16]}>
          <Col span={6}>Asset Code</Col>
          <Col span={16}>{detail.asset_code}</Col>
          <Col span={6}>Asset Name</Col>
          <Col span={16}>{detail.asset_name}</Col>
          <Col span={6}>Category</Col>
          <Col span={16}>{formatCapitalizeFirst(detail.category_name)}</Col>
          <Col span={6}>Installed Date</Col>
          <Col span={16}>{formatDate(detail.installed_date)}</Col>
          <Col span={6}>State</Col>
          <Col span={16}>{detail.state_name}</Col>
          <Col span={6}>Location</Col>
          <Col span={16}>{detail.location}</Col>
          <Col span={6}>Specification</Col>
          <Col span={16}>{detail.specific}</Col>
        </Row>
      ) : null}
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

export default connect(mapStateToProps)(ModalDetailAsset)
