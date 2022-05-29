import React from 'react'
import { Redirect } from 'react-router-dom'
import { LoginForm } from '../components/login'
import logo from '../../assets/nashtech_logo.svg'
import { connect } from 'react-redux'
import { Avatar } from 'antd'

const Login = (props) => {
  const { auth } = props

  if (auth.loggedIn) {
    return <Redirect to="/" />
  }

  return (
    <div className="d-flex flex-column align-items-center justify-content-center w-100 h-100">
      <Avatar
        style={{ marginBottom: '30px' }}
        src={logo}
        alt="logo"
        shape="square"
        size={{ xs: 80, sm: 80, md: 80, lg: 80, xl: 100, xxl: 100 }}
      />
      <LoginForm />
    </div>
  )
}

const mapStateToProps = (state) => ({
  auth: state.auth,
})

export default connect(mapStateToProps)(Login)
