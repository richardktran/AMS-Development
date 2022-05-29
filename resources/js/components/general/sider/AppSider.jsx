import React from 'react'
import { Layout } from 'antd'
import Header from './Header'
import MenuList from './MenuList'

const { Sider } = Layout

const siderStyle = {
  minHeight: '100vh',
  marginTop: 64,
  padding: '0px 20px',
}

export default function AppSider() {
  return (
    <Sider width={250} theme="light" style={siderStyle}>
      <Header />
      <MenuList />
    </Sider>
  )
}
