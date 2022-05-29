import React, { useState } from 'react'
import { Form, Input, Button, Typography, Row, Col, Alert } from 'antd'

import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { enableLoading, disableLoading, login } from '../../actions'
import { exceptionConstants } from '../../constants'
import { Error } from '../../pages'

const { Text, Title } = Typography
const { UNAUTHENTICATED, SUCCESS } = exceptionConstants

const formStyle = {
  borderRadius: '10px',
  boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
  padding: '20px',
  background: '#fff',
}

function LoginForm(props) {
  const { loading, login, enableLoading, disableLoading } = props
  const [redirect, enableRedirect] = useState(false)
  const [isShowErrorPage, enableShowError] = useState(false)
  const [exceptionStatus, setExceptionStatus] = useState(null)
  const [form] = Form.useForm()
  const [error, setError] = useState(null)

  const onFinish = async (data) => {
    enableLoading()
    const credentials = {
      username: data.username,
      password: data.password,
    }
    const res = await login(credentials)
    if (res.code === SUCCESS) {
      enableRedirect(true)
    } else if (res.code === UNAUTHENTICATED) {
      setError('Username or password is incorrect. Please try again')
    } else {
      setExceptionStatus({ code: res.code, message: res.message })
      enableShowError(true)
    }
    disableLoading()
  }

  if (isShowErrorPage) {
    return (
      <Error status={exceptionStatus.code} message={exceptionStatus.message} />
    )
  }

  if (redirect) {
    return <Redirect to="/" />
  }

  return (
    <Row className="w-100 d-flex align-items-center justify-content-center">
      <Col style={formStyle} span={20} sm={20} md={15} lg={15} xl={10}>
        <div className="d-flex flex-column align-items-center justify-content-center pb-4 pt-3">
          <Title level={3}>Login Form</Title>
          <Text type="secondary">
            Enter your credentials to access your account
          </Text>
          {error === null ? null : (
            <Alert
              message={error}
              className="mt-2"
              showIcon
              closable
              type="error"
            />
          )}
        </div>
        <Form
          name="basic"
          form={form}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 12,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          >
            <Input
              onChange={() => setError(null)}
              placeholder="input your username"
            />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
              {
                min: 8,
                message:
                  'Please input your password has at least 8 characters!',
              },
            ]}
          >
            <Input.Password
              onChange={() => setError(null)}
              placeholder="input your password"
              autoComplete="on"
            />
          </Form.Item>
          <Form.Item
            shouldUpdate
            wrapperCol={{
              offset: 8,
              span: 12,
            }}
          >
            {() => (
              <Button
                type="primary"
                danger
                htmlType="submit"
                disabled={
                  !form.isFieldsTouched(true) ||
                  !!form.getFieldsError().filter(({ errors }) => errors.length)
                    .length ||
                  loading
                }
              >
                Login
              </Button>
            )}
          </Form.Item>
        </Form>
      </Col>
    </Row>
  )
}

const mapStateToProps = (state) => ({
  loading: state.loading,
})

const mapDispatchToProps = (dispatch) => {
  return {
    login: (credentials) => dispatch(login(credentials)),
    disableLoading: () => dispatch(disableLoading()),
    enableLoading: () => dispatch(enableLoading()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm)
