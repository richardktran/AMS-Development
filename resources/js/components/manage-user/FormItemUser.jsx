import React from 'react'

import { Form, Input, DatePicker, Radio, Select } from 'antd'

import { DATE_FORMAT } from '../../constants'

import moment from 'moment'

import {
  formatNameFormUser,
  formatToLowerCase,
} from '../../utils/format.helper'

const FormItemUser = (props) => {
  const { label, error, show, type, setDOB, setJoined } = props
  const getRequireField = (text) => {
    return [
      {
        required: true,
        message: `Please ${text}`,
      },
    ]
  }

  const checkValidDate = (value) => {
    if (formatNameFormUser(label) === 'dateOfBirth') {
      setDOB(moment(value._d).format('YYYY-MM-DD'))
    } else if (formatNameFormUser(label) === 'joinedDate') {
      setJoined(moment(value._d).format('YYYY-MM-DD'))
    }
  }

  const handleDataChildElement = (type) => {
    switch (type) {
      case 'select':
        return (
          <Select
            id="type"
            placeholder="choose account type"
            onChange={() => error(null)}
          >
            <Select.Option value={2}>Staff</Select.Option>
            <Select.Option value={1}>Admin</Select.Option>
          </Select>
        )
      case 'radio':
        return (
          <Radio.Group id="gender" onChange={() => error(null)}>
            <Radio value="Female">Female</Radio>
            <Radio value="Male">Male</Radio>
          </Radio.Group>
        )
      case 'date':
        return (
          <DatePicker
            style={{ width: '100%' }}
            format={DATE_FORMAT}
            onChange={(value) => {
              checkValidDate(value)
              error(null)
            }}
            placeholder={`choose ${formatToLowerCase(label)}`}
          />
        )
      default:
        return (
          <Input
            onChange={() => error(null)}
            placeholder={`input ${formatToLowerCase(label)}`}
            disabled={show}
          />
        )
    }
  }

  const getFormNameItem = () => {
    let title = label
    if (formatNameFormUser(title) === 'roleId') {
      title = 'Type'
    }
    return title
  }

  return (
    <Form.Item
      label={getFormNameItem()}
      name={formatNameFormUser(label)}
      rules={getRequireField(`input ${formatToLowerCase(label)}`)}
    >
      {handleDataChildElement(type)}
    </Form.Item>
  )
}

export default FormItemUser
