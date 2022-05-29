import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Menu, Typography } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import {
  backgroundActive,
  backgroundDefault,
  colorActive,
  colorDefault,
  routingConstants,
} from '../../../constants'

const { Text } = Typography

const MenuList = (props) => {
  const location = useLocation()
  const pathname = `/${location.pathname.split('/')[1]}`
  const [selectedKey, setSelectedKey] = useState(pathname)
  const { auth } = props
  const { user } = auth

  useEffect(() => {
    setSelectedKey(pathname)
  }, [pathname])
  return (
    <Menu
      defaultSelectedKeys={pathname}
      mode="vertical"
      theme="light"
      onClick={(e) => setSelectedKey(e.key)}
      className="w-100"
    >
      <Menu.Item
        key="/"
        style={selectedKey === '/' ? backgroundActive : backgroundDefault}
      >
        <Link to="/" className="text-decoration-none">
          <Text strong style={selectedKey === '/' ? colorActive : colorDefault}>
            Home
          </Text>
        </Link>
      </Menu.Item>
      {user && user.role_id === 1
        ? routingConstants.map((item) => {
            const { path, title } = item
            return (
              <Menu.Item
                key={path}
                style={
                  selectedKey === path ? backgroundActive : backgroundDefault
                }
              >
                <Link to={path} className="text-decoration-none">
                  <Text
                    strong
                    style={selectedKey === path ? colorActive : colorDefault}
                  >
                    {title}
                  </Text>
                </Link>
              </Menu.Item>
            )
          })
        : null}
    </Menu>
  )
}

const mapStateToProps = (state) => ({
  auth: state.auth,
})

export default connect(mapStateToProps)(MenuList)
