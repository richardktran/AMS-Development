import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { Form, Row, Alert, Col } from 'antd'

import FormItemUser from './FormItemUser'
import FormButtonGroupUser from './FormButtonGroupUser'

import {
  enableLoading,
  disableLoading,
  createUser,
  updateUser,
  checkAuthentication,
} from '../../actions'
import { TextHeader } from '../../components/general'
import { exceptionConstants } from '../../constants'

import { formatNameFormUser } from '../../utils/format.helper'

import { connect } from 'react-redux'
import { Redirect, useLocation } from 'react-router-dom'

import { Error } from '../../pages'

const { BAD_REQUEST, CREATED, SUCCESS, PAGE_NOT_FOUND, SERVER_ERROR } =
  exceptionConstants

const FormHandleUser = (props) => {
  const location = useLocation()
  const type = `${location.pathname.split('/')[2]}`
  const {
    enableLoading,
    disableLoading,
    createUser,
    updateUser,
    idUser,
    checkAuthentication,
    mainTitle,
    dataUser,
    dataHandleForm,
  } = props
  const [redirect, enableRedirect] = useState(false)
  const [isShowErrorPage, enableShowError] = useState(false)
  const [exceptionStatus, setExceptionStatus] = useState(null)
  const [error, setError] = useState(null)
  const [show, disableButton] = useState(false)
  const [checkDOB, setCheckDOB] = useState(null)
  const [checkJoined, setCheckJoined] = useState(null)
  const [form] = Form.useForm()

  useEffect(() => {
    if (
      (dataUser.code === PAGE_NOT_FOUND || dataUser.code === SERVER_ERROR) &&
      type === 'edit'
    ) {
      setExceptionStatus({ code: dataUser.code, message: 'Page Not Found' })
      enableShowError(true)
    }
    if (
      dataUser.user !== null &&
      dataUser.user !== undefined &&
      type === 'edit' &&
      dataUser.code === SUCCESS
    ) {
      disableButton(true)
      const user = dataUser.user
      form.setFieldsValue({
        firstName: user.full_name.split(' ')[0],
        lastName: user.full_name.split(' ')[1],
        dateOfBirth: moment(user.birthday),
        gender: user.gender,
        joinedDate: moment(user.joined_date),
        roleId: user.role_id,
      })
    }
  }, [dataUser.user, dataUser.code])

  useEffect(() => {
    if (checkDOB && checkJoined && checkDOB <= checkJoined) {
      form.setFields([
        {
          name: 'joinedDate',
          errors: null,
        },
      ])
    }
  }, [checkDOB, checkJoined])

  const onFinish = async (data) => {
    enableLoading()
    let res
    const { firstName, lastName, dateOfBirth, joinedDate, roleId, gender } =
      data
    const credentials = {
      birthday: moment(dateOfBirth._d).format('YYYY-MM-DD'),
      joined_date: moment(joinedDate._d).format('YYYY-MM-DD'),
      role_id: roleId,
      gender: gender,
    }
    setCheckDOB(credentials.birthday)
    setCheckJoined(credentials.joined_date)
    switch (type) {
      case 'create':
        credentials.first_name = firstName
        credentials.last_name = lastName
        res = await createUser(credentials)
        break
      default:
        res = await updateUser(idUser, credentials)
        break
    }

    const { code, message } = res
    checkAuthentication(code)
    if (code === CREATED) {
      enableRedirect(true)
    } else if (code === SUCCESS) {
      enableRedirect(true)
    } else if (code === BAD_REQUEST) {
      if (typeof message === 'object') {
        form.setFields(handleError(message, dataHandleForm))
      } else if (typeof message === 'string') {
        setError(message)
      }
    } else {
      setExceptionStatus({ code: res.code, message: res.message })
      enableShowError(true)
    }
    disableLoading()
  }

  const handleError = (errors, dataHandleForm) => {
    const arrayError = []
    dataHandleForm.forEach((item) => {
      arrayError.push({
        name: formatNameFormUser(item.name),
        errors: errors[item.error],
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
    return <Redirect to="/users" />
  }

  // Error Element
  const errorElement =
    error !== null ? (
      <Form.Item
        wrapperCol={{
          offset: 4,
        }}
      >
        <Alert message={error} showIcon closable type="error" />
      </Form.Item>
    ) : (
      <></>
    )

  const FormItemDataElement = dataHandleForm.map((item, index) => {
    return (
      <FormItemUser
        label={item.name}
        type={item.type}
        error={setError}
        show={show}
        setDOB={setCheckDOB}
        setJoined={setCheckJoined}
        key={index}
      />
    )
  })

  return (
    <Row className="w-100 d-flex align-items-center justify-content-center">
      <Col span={20} sm={20} md={15} lg={20} xl={15}>
        <TextHeader content={mainTitle} />
        <Form
          className="mt-4"
          name="basic"
          form={form}
          initialValues={{ gender: 'Female' }}
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
          {errorElement}
          <FormButtonGroupUser form={form} />
        </Form>
      </Col>
    </Row>
  )
}

const mapStateToProps = (state) => ({
  dataUser: state.user,
})

const mapDispatchToProps = (dispatch) => {
  return {
    enableLoading: () => dispatch(enableLoading()),
    disableLoading: () => dispatch(disableLoading()),
    createUser: (credentials) => dispatch(createUser(credentials)),
    updateUser: (id, credentials) => dispatch(updateUser(id, credentials)),
    checkAuthentication: (code) => dispatch(checkAuthentication(code)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FormHandleUser)
