import React, { useEffect, useState } from 'react'

import { Form, Button } from 'antd'

import { connect } from 'react-redux'

import { Link } from 'react-router-dom'

const FormButtonGroup = (props) => {
  const {
    form,
    loading,
    routeCancel,
    listFieldTouched,
    buttonIdSave,
    buttonIdCancel,
    assignment,
  } = props

  const { selectedUser, selectedAsset } = assignment
  const [disabledSaveAssignment, setDisabledSaveAssignment] = useState(false)

  useEffect(() => {
    if (routeCancel === '/assignments') {
      if (!selectedUser || !selectedAsset) {
        setDisabledSaveAssignment(true)
      } else {
        setDisabledSaveAssignment(false)
      }
    }
  }, [selectedUser, selectedAsset])

  return (
    <Form.Item wrapperCol={{ span: 24 }} shouldUpdate>
      {() => (
        <div className="d-flex flex-row justify-content-end">
          <Button
            id={buttonIdSave}
            type="primary"
            danger
            htmlType="submit"
            className="me-4"
            disabled={
              !form.isFieldsTouched(listFieldTouched, true) ||
              !!form.getFieldsError().filter(({ errors }) => errors.length)
                .length > 0 ||
              loading ||
              disabledSaveAssignment
            }
          >
            Save
          </Button>
          <Button id={buttonIdCancel} disabled={loading}>
            <Link to={routeCancel} className="text-decoration-none">
              Cancel
            </Link>
          </Button>
        </div>
      )}
    </Form.Item>
  )
}

const mapStateToProps = (state) => ({
  loading: state.loading,
  assignment: state.assignment,
})

export default connect(mapStateToProps, null)(FormButtonGroup)
