import React, { useState } from 'react'
import { Form, Input, DatePicker, Radio, Select, Divider, Space } from 'antd'
import { DATE_FORMAT } from '../../../constants'
import { ButtonAddNewCategory, FormAddCategory } from '..'
import { formatToLowerCase } from '../../../utils/format.helper'
import { SearchOutlined } from '@ant-design/icons'

const FormItem = (props) => {
  const {
    categoryList,
    setError,
    isDisabled,
    method,
    item,
    onClickAssignmentSearch,
    disabledAssignedDate,
    setChangeAssignedDate,
    disableDatePicker,
  } = props
  const { name, type, label, id, placeholder, radioList } = item
  const [showCategoryForm, setShowCategoryForm] = useState(false)

  const getRequireField = (text) => {
    return [
      {
        required: true,
        message: `Please ${text}`,
      },
    ]
  }

  const handleDataChildElement = (type) => {
    switch (type) {
      case 'asset_select':
        return (
          <Select
            id={id}
            onChange={() => setError(null)}
            optionFilterProp="children"
            disabled={isDisabled}
            placeholder={placeholder}
            dropdownRender={(menu) => (
              <div>
                {menu}
                <Divider style={{ margin: '4px 0', color: 'black' }} />
                {!showCategoryForm ? (
                  <ButtonAddNewCategory
                    handleShowCategoryForm={() => setShowCategoryForm(true)}
                  />
                ) : (
                  <FormAddCategory
                    setError={setError}
                    getRequireField={getRequireField}
                    handleCancel={() => setShowCategoryForm(false)}
                  />
                )}
              </div>
            )}
          >
            {categoryList.map((item, index) => {
              return (
                <Select.Option
                  id={`asset_selectoption_asset_category_${item.id}`}
                  value={item.id}
                  key={index}
                >
                  {item.category_name}
                </Select.Option>
              )
            })}
          </Select>
        )
      case 'radio':
        return (
          <Radio.Group id={id} onChange={() => setError(null)}>
            <Space direction="vertical">
              {radioList.map((item) => (
                <Radio
                  key={item.value}
                  value={item.value}
                  style={{
                    display:
                      method === 'edit' || item.isShowInCreate
                        ? 'block'
                        : 'none',
                  }}
                >
                  {item.label}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        )
      case 'textarea':
        return (
          <Input.TextArea
            id={id}
            rows={4}
            onChange={() => setError(null)}
            placeholder={placeholder}
          />
        )
      case 'date':
        return (
          <DatePicker
            id={id}
            disabledDate={disabledAssignedDate}
            disabled={disableDatePicker}
            style={{ width: '100%' }}
            format={DATE_FORMAT}
            onChange={(value) => {
              if (setChangeAssignedDate) {
                setChangeAssignedDate(value._d)
              }
              setError(null)
            }}
            placeholder={placeholder}
          />
        )
      case 'assignment_input_search':
        return (
          <Input
            id={id}
            readOnly={true}
            style={{ width: '100%' }}
            onClick={() => onClickAssignmentSearch(formatToLowerCase(label))}
            onChange={() => setError(null)}
            suffix={<SearchOutlined />}
            placeholder={placeholder}
          />
        )
      default:
        return (
          <Input
            id={id}
            onChange={() => setError(null)}
            placeholder={placeholder}
          />
        )
    }
  }

  return (
    <Form.Item
      label={label}
      name={name}
      rules={getRequireField(`input ${formatToLowerCase(label)}`)}
    >
      {handleDataChildElement(type)}
    </Form.Item>
  )
}

export default FormItem
