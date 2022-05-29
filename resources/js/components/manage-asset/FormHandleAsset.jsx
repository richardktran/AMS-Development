import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { Form, Row, Col } from 'antd'
import {
  enableLoading,
  disableLoading,
  getAllCategories,
  createCategory,
  checkAuthentication,
  createAsset,
  editAsset,
} from '../../actions'
import {
  showMessage,
  TextHeader,
  FormButtonGroup,
  FormItemDisplayError,
  FormItem,
} from '../general'
import { exceptionConstants, assetIds } from '../../constants'
import { connect } from 'react-redux'
import { Redirect, useLocation } from 'react-router-dom'
import { Error } from '../../pages'

const { BAD_REQUEST, CREATED, SUCCESS, PAGE_NOT_FOUND, SERVER_ERROR } =
  exceptionConstants
const { ASSET_BUTTON_CLOSE, ASSET_BUTTON_SUBMIT, ASSET_FORM } = assetIds

const FormHandleAsset = (props) => {
  const location = useLocation()
  const type = `${location.pathname.split('/')[2]}`
  const {
    enableLoading,
    disableLoading,
    getAllCategories,
    createAsset,
    checkAuthentication,
    editAsset,
    mainTitle,
    dataCategory,
    dataAsset,
    idAsset,
    dataHandleForm,
  } = props
  const { categoryList, newUpdatedCategory } = dataCategory
  const [redirect, enableRedirect] = useState(false)
  const [isShowErrorPage, enableShowError] = useState(false)
  const [exceptionStatus, setExceptionStatus] = useState(null)
  const [error, setError] = useState(null)
  const [show, disableButton] = useState(false)
  const [form] = Form.useForm()
  useEffect(async () => {
    if (
      (dataAsset.code === PAGE_NOT_FOUND || dataAsset.code === SERVER_ERROR) &&
      type === 'edit'
    ) {
      setExceptionStatus({ code: dataAsset.code, message: 'Page Not Found' })
      enableShowError(true)
    }
    if (
      dataAsset.asset !== null &&
      dataAsset.asset !== undefined &&
      type === 'edit' &&
      dataAsset.code === SUCCESS
    ) {
      disableButton(true)
      const asset = dataAsset.asset
      form.setFieldsValue({
        asset_name: asset.asset_name,
        category: asset.category_name,
        specific: asset.specific,
        installed_date: moment(asset.installed_date),
        state: asset.state_key,
      })
    }

    const categoriesResponse = await getAllCategories()
    if (categoriesResponse.code !== SUCCESS) {
      showMessage(
        'error',
        categoriesResponse.code + ' error',
        categoriesResponse.message
      )
    }
  }, [dataAsset.asset, dataAsset.code, newUpdatedCategory])

  const onAssetFormFinish = async (data) => {
    enableLoading()
    let res
    const { asset_name, category, specific, installed_date, state } = data
    const assetData = {
      asset_name: asset_name,
      specific: specific,
      installed_date: moment(installed_date._d).format('YYYY-MM-DD'),
      state_key: state,
    }
    switch (type) {
      case 'create':
        if (state === 'RECYCLED' || state === 'WAITING_FOR_RECYCLING') {
          setExceptionStatus({ code: SERVER_ERROR, message: 'Server error' })
          enableShowError(true)
          break
        }
        assetData.category_id = category
        res = await createAsset(assetData)
        break
      case 'edit':
        res = await editAsset(idAsset, assetData)
        break
      default:
        break
    }

    const { code, message } = res
    checkAuthentication(code)
    if (code === CREATED || code === SUCCESS) {
      enableRedirect(true)
    } else if (code === BAD_REQUEST) {
      if (typeof message === 'object') {
        form.setFields(handleError(message))
      } else if (typeof message === 'string') {
        setError(message)
      }
    } else {
      setExceptionStatus({ code: res.code, message: res.message })
      enableShowError(true)
    }
    disableLoading()
  }

  const handleError = (errors) => {
    const arrayError = []
    dataHandleForm.forEach((item) => {
      arrayError.push({
        name: item.name,
        errors: errors[item.name],
      })
    })
    return arrayError
  }

  if (isShowErrorPage) {
    return (
      <div className="d-flex align-items-center justify-content-center w-100">
        <Error
          status={exceptionStatus.code}
          message={exceptionStatus.message}
        />
      </div>
    )
  }

  if (redirect) {
    return <Redirect to="/assets" />
  }

  const FormItemDataElement = dataHandleForm.map((item, index) => {
    return (
      <FormItem
        setError={setError}
        item={item}
        key={index}
        method={type}
        isDisabled={show}
        categoryList={categoryList}
      />
    )
  })
  return (
    <Row className="w-100 d-flex align-items-center justify-content-center">
      <Col span={20} sm={20} md={15} lg={20} xl={15}>
        <TextHeader content={mainTitle} />
        <Form
          id={ASSET_FORM}
          className="mt-4"
          name="basic"
          form={form}
          initialValues={{ state: 'AVAILABLE' }}
          labelCol={{
            xl: { span: 4 },
            lg: { span: 4 },
            md: { span: 11 },
            sm: { span: 12 },
          }}
          wrapperCol={{
            xl: { span: 20 },
            lg: { span: 20 },
            md: { span: 13 },
            sm: { span: 12 },
          }}
          labelAlign="left"
          onFinish={onAssetFormFinish}
          scrollToFirstError
          layout="horizontal"
          size="large"
        >
          {FormItemDataElement}
          <FormItemDisplayError error={error} />
          <FormButtonGroup
            form={form}
            routeCancel="/assets"
            listFieldTouched={[
              'asset_name',
              'category',
              'specific',
              'installed_date',
            ]}
            buttonIdSave={ASSET_BUTTON_SUBMIT}
            buttonIdCancel={ASSET_BUTTON_CLOSE}
          />
        </Form>
      </Col>
    </Row>
  )
}

const mapStateToProps = (state) => ({
  dataCategory: state.category,
  dataAsset: state.asset,
})

const mapDispatchToProps = (dispatch) => {
  return {
    enableLoading: () => dispatch(enableLoading()),
    disableLoading: () => dispatch(disableLoading()),
    getAllCategories: () => dispatch(getAllCategories()),
    createCategory: (data) => dispatch(createCategory(data)),
    createAsset: (data) => dispatch(createAsset(data)),
    editAsset: (id, dataAsset) => dispatch(editAsset(id, dataAsset)),
    checkAuthentication: (code) => dispatch(checkAuthentication(code)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FormHandleAsset)
