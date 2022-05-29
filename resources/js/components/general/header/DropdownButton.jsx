import React, { useState } from 'react'
import { Dropdown, Menu, Typography } from 'antd'
import {
  CaretDownOutlined,
  LogoutOutlined,
  EditOutlined,
} from '@ant-design/icons'

import { connect } from 'react-redux'
import { changePassword, enableLoading, disableLoading } from '../../../actions'
import { dropDownBtnStyle, dropDownFixStyle } from '../../../constants'
import ModalLogout from './ModalLogout'
import ModalChangePassword from './ModalChangePassword'
const { Link } = Typography

const DropdownButon = (props) => {
  const [isShowModal, showModalChangePassword] = useState(false)
  const [isShowModalLogout, showModalLogout] = useState(false)
  const { auth } = props
  const { username } = auth.user

  const handleMenuClick = (e) => {
    switch (e.key) {
      case 'change-password':
        showModalChangePassword(true)
        break
      case 'logout':
        showModalLogout(true)
        break
      default:
        break
    }
  }

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="change-password" icon={<EditOutlined />}>
        <span>Change password</span>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        <span>Log out</span>
      </Menu.Item>
    </Menu>
  )

  return (
    <>
      <Dropdown
        trigger="click"
        overlay={menu}
        placement="bottomRight"
        overlayStyle={dropDownFixStyle}
      >
        <div style={dropDownBtnStyle}>
          <Link
            type="link"
            className="text-white d-flex align-items-center justify-content-center flex-row"
          >
            <span className="text-decoration-none mx-2">{username}</span>
            <CaretDownOutlined />
          </Link>
        </div>
      </Dropdown>
      <ModalChangePassword
        type="default"
        isOpen={isShowModal}
        handleCancel={() => showModalChangePassword(false)}
      />
      <ModalLogout
        isOpen={isShowModalLogout}
        handleCancel={() => showModalLogout(false)}
      />
    </>
  )
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  loading: state.loading,
})

const mapDispatchToProps = (dispatch) => {
  return {
    changePassword: (credentials) => dispatch(changePassword(credentials)),
    enableLoading: () => dispatch(enableLoading()),
    disableLoading: () => dispatch(disableLoading()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DropdownButon)
