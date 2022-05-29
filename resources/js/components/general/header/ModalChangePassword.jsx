import React, { useState } from 'react'
import { Modal, Form, Button, Input, Typography } from 'antd'
import { connect } from 'react-redux'
import {
  changePasswordFirstTime,
  enableLoading,
  disableLoading,
  changePassword,
} from '../../../actions'
import { cardModalLayout, exceptionConstants } from '../../../constants'
import { showMessage } from '../modal'

const { Text } = Typography
const { SUCCESS, BAD_REQUEST } = exceptionConstants

function ModalChangePassword(props) {
  const {
    type,
    isOpen,
    handleCancel,
    changePasswordFirstTime,
    changePassword,
    enableLoading,
    disableLoading,
    loading,
  } = props
  const [error, setError] = useState(null)
  const [form] = Form.useForm()

  const onResetForm = () => {
    setError(null)
    form.resetFields()
  }

  const onFinish = async (data) => {
    enableLoading()
    let credentials, res
    switch (type) {
      case 'first-time':
        credentials = {
          new_password: data.new_password,
        }
        res = await changePasswordFirstTime(credentials)
        break
      default:
        credentials = {
          new_password: data.new_password,
          old_password: data.old_password,
        }
        res = await changePassword(credentials)
        break
    }
    if (res.code === SUCCESS) {
      onResetForm()
      handleCancel()
      showMessage(
        'success',
        'Change password',
        'Your password has been changed successfully'
      )
    } else if (res.code === BAD_REQUEST) {
      setError(res.message)
    } else {
      showMessage('error', res.code + ' error', res.message)
    }
    disableLoading()
  }

  return (
    <Modal
      title={<Text style={{ color: '#CF2338' }}>Change Password</Text>}
      width={500}
      bodyStyle={cardModalLayout}
      visible={isOpen}
      closable={false}
      handleCancel={handleCancel}
      footer={null}
    >
      <Form
        form={form}
        onFinish={onFinish}
        scrollToFirstError
        className="w-100"
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 18,
        }}
      >
        {type === 'first-time' ? (
          <Form.Item>
            <span className="ant-form-text">
              This is a first time you logged in.
            </span>
            <span className="ant-form-text">
              You have to change your password to continue.
            </span>
          </Form.Item>
        ) : null}
        {type !== 'first-time' ? (
          <Form.Item
            name="old_password"
            label="Old password"
            className={error === null ? null : 'm-0'}
            rules={[
              {
                required: true,
                message: 'Please input your old password',
              },
              { min: 8, message: 'Password must be at least 8 characters' },
            ]}
          >
            <Input.Password onChange={() => setError(null)} />
          </Form.Item>
        ) : null}
        {type !== 'first-time' ? (
          error === null ? null : (
            <Form.Item wrapperCol={{ offset: 6 }} className="mb-0">
              <Text type="danger">{error}</Text>
            </Form.Item>
          )
        ) : null}
        <Form.Item
          className={error == null ? null : 'm-0'}
          name="new_password"
          label="New password"
          rules={[
            {
              required: true,
              message: 'Please input new password',
            },
            { min: 8, message: 'Password must be at least 8 characters' },
          ]}
        >
          <Input.Password onChange={() => setError(null)} />
        </Form.Item>
        {type === 'first-time' ? (
          error === null ? null : (
            <Form.Item wrapperCol={{ offset: 6 }} className="mb-0">
              <Text type="danger">{error}</Text>
            </Form.Item>
          )
        ) : null}

        <Form.Item wrapperCol={{ span: 24 }} shouldUpdate>
          {() => (
            <div className="d-flex flex-row align-items-center justify-content-end w-100 pt-2">
              <Button
                type="primary"
                danger
                className={type !== 'first-time' ? 'mx-4' : null}
                htmlType="submit"
                disabled={
                  !form.isFieldsTouched(true) ||
                  form.getFieldsError().filter(({ errors }) => errors.length)
                    .length > 0 ||
                  loading
                }
              >
                Save
              </Button>
              {type === 'first-time' ? null : (
                <Button disabled={loading} onClick={handleCancel}>
                  Cancel
                </Button>
              )}
            </div>
          )}
        </Form.Item>
      </Form>
    </Modal>
  )
}

const mapStateToProps = (state) => ({
  loading: state.loading,
})

const mapDispatchToProps = (dispatch) => {
  return {
    changePasswordFirstTime: (credentials) =>
      dispatch(changePasswordFirstTime(credentials)),
    enableLoading: () => dispatch(enableLoading()),
    disableLoading: () => dispatch(disableLoading()),
    changePassword: (credentials) => dispatch(changePassword(credentials)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalChangePassword)
