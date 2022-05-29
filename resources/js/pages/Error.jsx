import React from 'react'
import { Result, Button } from 'antd'
import { Link } from 'react-router-dom'
import { exceptionConstants } from '../constants'
import { connect } from 'react-redux'

const { SERVER_ERROR, UNAUTHENTICATED, PAGE_NOT_FOUND } = exceptionConstants

function Error(props) {
  const { message, status, auth } = props
  const { loggedIn } = auth
  const s = [UNAUTHENTICATED, PAGE_NOT_FOUND, SERVER_ERROR].includes(status)
    ? status
    : SERVER_ERROR
  const m = s === SERVER_ERROR ? 'Server error' : message
  return (
    <Result
      status={s}
      title={s}
      subTitle={m}
      extra={
        <Button type="primary" danger>
          <Link to="/" className="text-decoration-none">
            {loggedIn ? 'Back Home' : 'Back Login'}
          </Link>
        </Button>
      }
    />
  )
}

const mapStateToProps = (state) => ({
  auth: state.auth,
})

export default connect(mapStateToProps)(Error)
