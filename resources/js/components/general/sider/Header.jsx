import React from 'react'
import { Image, Typography } from 'antd'
import logo from '../../../../assets/nashtech_logo.svg'

const { Text } = Typography

const headerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  justifyContent: 'center',
  margin: '30px 0px',
}

export default function Header() {
  return (
    <div style={headerStyle}>
      <Image preview={false} width="50%" src={logo} />
      <Text style={{ color: '#CF2338' }} strong>
        Online Asset Management
      </Text>
    </div>
  )
}
