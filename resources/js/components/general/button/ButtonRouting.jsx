import React from 'react'
import { Button } from 'antd'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

function ButtonRouting(props) {
  const { loading, title, route } = props
  return (
    <Button
      type="primary"
      disabled={loading}
      style={{ color: 'white', backgroundColor: '#CF2338', border: '0px' }}
    >
      <Link to={route} className="text-decoration-none">
        {title}
      </Link>
    </Button>
  )
}

const mapStateToProps = (state) => ({
  loading: state.loading,
})

export default connect(mapStateToProps)(ButtonRouting)
