import React, { useState, useEffect } from 'react'
import { Layout } from 'antd'
import DropdownButton from './DropdownButton'
import { useLocation } from 'react-router-dom'
import ModalChangePassword from './ModalChangePassword'
import { headerLayoutStyle } from '../../../constants'
import { connect } from 'react-redux'
import { changePasswordFirstTime } from '../../../actions'

const { Header } = Layout

function AppHeader(props) {
  const { auth } = props
  const [isShowModal, showModal] = useState(false)
  const location = useLocation()
  const arrayPath = location.pathname.split('/')
  const pathName = arrayPath[1]
  let currentPage = null

  useEffect(() => {
    const { user } = auth
    if (user && user.must_change_password) {
      showModal(true)
    }
  }, [auth])

  switch (pathName) {
    case 'users':
      currentPage = 'Manage User'
      break
    case 'assets':
      currentPage = 'Manage Asset'
      break
    case 'assignments':
      currentPage = 'Manage Assignment'
      break
    case 'request-returnings':
      currentPage = 'Request For Returning'
      break
    case 'reports':
      currentPage = 'Report'
      break
    default:
      currentPage = 'Home'
      break
  }

  switch (arrayPath[2]) {
    case 'create':
      currentPage += ` > Create New ${arrayPath[1].slice(
        0,
        arrayPath[1].length - 1
      )}`
      break
    case 'edit':
      currentPage += ` > Edit ${arrayPath[1].slice(0, arrayPath[1].length - 1)}`
      break
  }
  return (
    <Header style={headerLayoutStyle}>
      <span className="text-white" style={{ textTransform: 'capitalize' }}>
        {currentPage}
      </span>
      <DropdownButton />
      <ModalChangePassword
        type="first-time"
        isOpen={isShowModal}
        handleCancel={() => showModal(false)}
      />
    </Header>
  )
}

const mapStateToProps = (state) => ({
  auth: state.auth,
})

const mapDispatchToProps = (dispatch) => {
  return {
    changePasswordFirstTime: (credentials) =>
      dispatch(changePasswordFirstTime(credentials)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppHeader)
