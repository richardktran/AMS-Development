import React from 'react'
import { Button, Modal, Row, Col, Typography } from 'antd'
import { connect } from 'react-redux'
import { formatDate, formatCapitalizeFirst } from '../../../utils'

const { Text } = Typography
function ModalDetailUser(props) {
  const { isOpen, handleCancel, detail, loading } = props
  return (
    <Modal
      title={
        <Text style={{ color: '#CF2338' }}>Detailed User Information</Text>
      }
      visible={isOpen}
      closable={false}
      onCancel={handleCancel}
      footer={null}
    >
      {detail !== null ? (
        <Row gutter={[8, 16]}>
          <Col span={6}>Staff Code</Col>
          <Col span={16}>{detail.staff_code}</Col>
          <Col span={6}>Full Name</Col>
          <Col span={16}>{detail.full_name}</Col>
          <Col span={6}>Username</Col>
          <Col span={16}>{detail.username}</Col>
          <Col span={6}>Date of Birth</Col>
          <Col span={16}>{formatDate(detail.birthday)}</Col>
          <Col span={6}>Gender</Col>
          <Col span={16}>{detail.gender}</Col>
          <Col span={6}>Joined Date</Col>
          <Col span={16}>{formatDate(detail.joined_date)}</Col>
          <Col span={6}>Type</Col>
          <Col span={16}>{formatCapitalizeFirst(detail.type)}</Col>
          <Col span={6}>Location</Col>
          <Col span={16}>{detail.location}</Col>
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

export default connect(mapStateToProps)(ModalDetailUser)
