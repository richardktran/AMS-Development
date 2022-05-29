import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { Form, Row, Col } from 'antd'

import ModalSearchAssignment from '../general/modal/ModalSearchAssignment'

import {
  enableLoading,
  disableLoading,
  createAssignment,
  editAssignment,
  selectedUserAssignment,
  selectedAssetAssignment,
  checkAuthentication,
} from '../../actions'
import {
  TextHeader,
  FormButtonGroup,
  FormItemDisplayError,
  FormItem,
  showMessage,
} from '../general'
import { exceptionConstants, assignmentIds } from '../../constants'

import { connect } from 'react-redux'
import { Redirect, useLocation } from 'react-router-dom'

import { Error } from '../../pages'

const {
  BAD_REQUEST,
  CREATED,
  SUCCESS,
  PAGE_NOT_FOUND,
  SERVER_ERROR,
  UNAUTHENTICATED,
} = exceptionConstants

const { ASSIGNMENT_BUTTON_SUBMIT, ASSIGNMENT_BUTTON_CLOSE, ASSIGNMENT_FORM } =
  assignmentIds

const FormHandleAssignment = (props) => {
  const location = useLocation()
  const type = `${location.pathname.split('/')[2]}`
  const {
    enableLoading,
    disableLoading,
    dataAssignment,
    mainTitle,
    dataHandleForm,
    createAssignment,
    editAssignment,
    selectedUserAssignment,
    selectedAssetAssignment,
    idAssignment,
    checkAuthentication,
  } = props

  const { selectedUser, selectedAsset } = dataAssignment

  const [redirect, enableRedirect] = useState(false)
  const [isShowErrorPage, enableShowError] = useState(false)
  const [exceptionStatus, setExceptionStatus] = useState(null)
  const [error, setError] = useState(null)
  const [show, disableButton] = useState(false)
  const [isShowModal, enableShowModal] = useState(false)
  const [checkChangeAssignedDate, setChangeAssignedDate] = useState(null)
  const [disableDatePicker, setDisableDatePicker] = useState(false)

  const [field, setField] = useState(null)

  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({
      assigned_to: selectedUser ? selectedUser.full_name : '',
      asset_id: selectedAsset ? selectedAsset.asset_name : '',
    })

    if (selectedAsset && selectedUser) {
      const assignedDateAssign = checkChangeAssignedDate
        ? moment(checkChangeAssignedDate).format('YYYY-MM-DD')
        : moment().format('YYYY-MM-DD')
      const joinedDateUser = selectedUser.joined_date
      const installedDateAsset = selectedAsset.installed_date
      if (
        assignedDateAssign >= joinedDateUser &&
        assignedDateAssign >= installedDateAsset
      ) {
        form.setFields([
          {
            name: 'assign_date',
            errors: null,
          },
        ])
      }
    }
  }, [selectedUser, selectedAsset, checkChangeAssignedDate])

  useEffect(async () => {
    if (
      (dataAssignment.code === PAGE_NOT_FOUND ||
        dataAssignment.code === SERVER_ERROR) &&
      type === 'edit'
    ) {
      setExceptionStatus({
        code: dataAssignment.code,
        message: 'Page Not Found',
      })
      enableShowError(true)
    }
    if (
      dataAssignment.assignment !== null &&
      dataAssignment.assignment !== undefined &&
      type === 'edit' &&
      dataAssignment.code === SUCCESS
    ) {
      disableButton(true)
      setDisableDatePicker(true)
      const assignment = dataAssignment.assignment
      form.setFieldsValue({
        assign_date: moment(assignment.assign_date),
        assign_note: assignment.assign_note,
      })
      selectedUserAssignment({
        full_name: assignment.to_full_name,
        key: assignment.assigned_to,
        staff_code: assignment.to_staff_code,
      })
      selectedAssetAssignment({
        asset_code: assignment.asset_code,
        asset_name: assignment.asset_name,
        key: assignment.asset_id,
        installed_date: assignment.asset_installed_date,
      })
    }
  }, [dataAssignment.assignment])

  const showPopUpByCode = (code, msg) => {
    checkAuthentication(code)
    if (code === PAGE_NOT_FOUND) {
      showMessage(
        'error',
        'Can not find this asset',
        'This asset has been disabled or does not exist.'
      )
    } else if (code === UNAUTHENTICATED) {
      showMessage('error', 'Can not delete asset', 'You are not authenticated!')
    } else if (code === BAD_REQUEST) {
      showMessage('error', '400', msg)
    } else {
      showMessage(
        'error',
        'Service unavailable',
        'There may be a problem with the server. Please try again later.'
      )
    }
  }

  const onFinish = async (data) => {
    enableLoading()
    data.assigned_to = selectedUser ? selectedUser.key : null
    data.asset_id = selectedAsset ? selectedAsset.key : null
    data.assign_date = moment(data.assign_date._d).format('YYYY-MM-DD')

    let res

    switch (type) {
      case 'create':
        res = await createAssignment(data)
        break
      case 'edit':
        res = await editAssignment(idAssignment, data)
        break
      default:
        break
    }

    const { code, message } = res
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

  const disabledAssignedDate = (current) => {
    return current && current < moment().subtract(1, 'days').endOf('day')
  }

  const showModalSearch = (field) => {
    enableShowModal(true)
    setField(field)
  }

  const handleCancel = () => {
    enableShowModal(false)
  }

  const FormItemDataElement = dataHandleForm.map((item, index) => {
    return (
      <FormItem
        onClickAssignmentSearch={showModalSearch}
        setChangeAssignedDate={setChangeAssignedDate}
        setError={setError}
        item={item}
        key={index}
        method={type}
        isDisabled={show}
        disabledAssignedDate={disabledAssignedDate}
        disableDatePicker={disableDatePicker}
      />
    )
  })

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
    return <Redirect to="/assignments" />
  }

  return (
    <Row className="w-100 d-flex align-items-center justify-content-center">
      <Col span={20} sm={20} md={15} lg={20} xl={15}>
        <TextHeader content={mainTitle} />
        <Form
          id={ASSIGNMENT_FORM}
          className="mt-4"
          initialValues={{ assign_date: moment() }}
          name="basic"
          form={form}
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
          onFinish={onFinish}
          scrollToFirstError
          layout="horizontal"
          size="large"
        >
          {FormItemDataElement}
          <FormItemDisplayError error={error} />
          <FormButtonGroup
            form={form}
            routeCancel="/assignments"
            listFieldTouched={['assigned_to', 'asset_id', 'assign_note']}
            buttonIdSave={ASSIGNMENT_BUTTON_SUBMIT}
            buttonIdCancel={ASSIGNMENT_BUTTON_CLOSE}
          />
        </Form>
        <ModalSearchAssignment
          handleCancel={handleCancel}
          isShowModal={isShowModal}
          field={field}
          showPopUpByCode={showPopUpByCode}
        />
      </Col>
    </Row>
  )
}

const mapStateToProps = (state) => ({
  dataAssignment: state.assignment,
})

const mapDispatchToProps = (dispatch) => {
  return {
    enableLoading: () => dispatch(enableLoading()),
    disableLoading: () => dispatch(disableLoading()),
    createAssignment: (credentials) => dispatch(createAssignment(credentials)),
    editAssignment: (id, dataAssignment) =>
      dispatch(editAssignment(id, dataAssignment)),
    selectedUserAssignment: (record) =>
      dispatch(selectedUserAssignment(record)),
    selectedAssetAssignment: (record) =>
      dispatch(selectedAssetAssignment(record)),
    checkAuthentication: (code) => dispatch(checkAuthentication(code)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormHandleAssignment)
