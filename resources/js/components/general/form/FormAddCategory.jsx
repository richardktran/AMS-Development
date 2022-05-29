import React from 'react'
import { Form, Input, Button } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import {
  enableLoading,
  disableLoading,
  createCategory,
  checkAuthentication,
} from '../../../actions'
import { exceptionConstants, assetIds } from '../../../constants'
import { showMessage } from '..'

const { BAD_REQUEST, CREATED, SUCCESS } = exceptionConstants
const {
  ASSET_INPUT_CATEGORY_NAME,
  ASSET_INPUT_CATEGORY_PREFIX,
  ASSET_CATEGORY_FORM,
  ASSET_BUTTON_CLOSE_CATEGORY,
  ASSET_BUTTON_SUBMIT_CATEGORY,
} = assetIds

function FormAddCategory(props) {
  const {
    handleCancel,
    loading,
    enableLoading,
    getRequireField,
    disableLoading,
    createCategory,
    setError,
    checkAuthentication,
  } = props

  const onCategoryFormFinish = async (data) => {
    enableLoading()
    const { categoryName, categoryPrefix } = data
    const categoryData = {
      category_name: categoryName,
      category_prefix: categoryPrefix,
    }
    const res = await createCategory(categoryData)

    const { code, message } = res
    checkAuthentication(code)
    if (code === BAD_REQUEST) {
      if (typeof message === 'object') {
        setError(handleCategoryError(message))
      } else if (typeof message === 'string') {
        setError(message)
      }
    } else if (code === SUCCESS || code === CREATED) {
      categoryForm.resetFields()
      handleCancel()
    } else {
      showMessage('error', res.code + ' error', res.message)
    }
    disableLoading()
  }

  const handleCategoryError = (errors) => {
    if (errors.category_name) {
      return errors.category_name
    } else {
      return errors.category_prefix
    }
  }

  const [categoryForm] = Form.useForm()
  return (
    <>
      <Form
        layout="inline"
        wrapperCol={{ span: 24 }}
        className="w-100"
        form={categoryForm}
        onFinish={onCategoryFormFinish}
        id={ASSET_CATEGORY_FORM}
      >
        <Form.Item
          wrapperCol={{ offset: 1 }}
          style={{ width: '60%' }}
          name="categoryName"
          rules={getRequireField('input category name')}
          className="m-0"
        >
          <Input
            id={ASSET_INPUT_CATEGORY_NAME}
            size="small"
            placeholder="input category name"
            onChange={() => setError(null)}
          />
        </Form.Item>
        <Form.Item
          className="m-0"
          style={{ width: '20%' }}
          rules={getRequireField('input category prefix')}
          name="categoryPrefix"
        >
          <Input
            size="small"
            id={ASSET_INPUT_CATEGORY_PREFIX}
            placeholder="prefix"
            onChange={() => setError(null)}
          />
        </Form.Item>

        <Form.Item shouldUpdate style={{ width: '10%' }}>
          {() => (
            <div className="d-flex align-items-center justify-content-center">
              <Button
                id={ASSET_BUTTON_SUBMIT_CATEGORY}
                htmlType="submit"
                disabled={
                  !categoryForm.isFieldsTouched(true) ||
                  !!categoryForm
                    .getFieldsError()
                    .filter(({ errors }) => errors.length).length > 0 ||
                  loading
                }
                type="link"
                className="d-flex align-items-center justify-content-center flex-column"
                icon={<CheckOutlined />}
              />
              <Button
                id={ASSET_BUTTON_CLOSE_CATEGORY}
                type="link"
                className="d-flex align-items-center justify-content-center flex-column"
                disabled={loading}
                onClick={handleCancel}
                icon={<CloseOutlined />}
              />
            </div>
          )}
        </Form.Item>
      </Form>
    </>
  )
}

const mapStateToProps = (state) => ({
  loading: state.loading,
})

const mapDispatchToProps = (dispatch) => {
  return {
    enableLoading: () => dispatch(enableLoading()),
    disableLoading: () => dispatch(disableLoading()),
    createCategory: (data) => dispatch(createCategory(data)),
    checkAuthentication: (code) => dispatch(checkAuthentication(code)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FormAddCategory)
