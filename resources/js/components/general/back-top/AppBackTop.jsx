import React from 'react'
import { BackTop } from 'antd'
import { CaretUpOutlined } from '@ant-design/icons'
import { backTopStyle } from '../../../constants'

export default function AppBackTop() {
  return (
    <BackTop visibilityHeight={700}>
      <div style={backTopStyle}>
        <CaretUpOutlined />
      </div>
    </BackTop>
  )
}
