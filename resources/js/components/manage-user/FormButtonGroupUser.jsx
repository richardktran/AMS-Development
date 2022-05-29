import React from 'react'

import { Form, Button } from 'antd'

import { connect } from 'react-redux'

import { Link } from 'react-router-dom'

const FormButtonGroupUser = (props) => {
  const { form, loading } = props

  return (
    <Form.Item wrapperCol={{ span: 24 }} shouldUpdate>
      {() => (
        <div className="d-flex flex-row justify-content-end">
          <Button
            type="primary"
            danger
            htmlType="submit"
            className="me-4"
            disabled={
              !form.isFieldsTouched(
                [
                  'firstName',
                  'lastName',
                  'dateOfBirth',
                  'joinedDate',
                  'roleId',
                ],
                true
              ) ||
              !!form.getFieldsError().filter(({ errors }) => errors.length)
                .length > 0 ||
              loading
            }
          >
            Save
          </Button>
          <Button disabled={loading}>
            <Link to="/users" className="text-decoration-none">
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
})

export default connect(mapStateToProps, null)(FormButtonGroupUser)
