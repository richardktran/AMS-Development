import React from 'react'

import { Form, Alert } from 'antd'

const FormItemDisplayError = (props) => {
  const { error } = props

  if (error !== null) {
    return (
      <Form.Item
        wrapperCol={{
          offset: 4,
        }}
      >
        <Alert message={error} showIcon closable type="error" />
      </Form.Item>
    )
  }
  return null
}

export default FormItemDisplayError
