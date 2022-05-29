import React from 'react'
import { Button } from 'antd'
import { connect } from 'react-redux'

function ButtonIcon(props) {
  const { loading, onClick, icon, className, disabled } = props
  return (
    <Button
      onClick={onClick}
      icon={icon}
      disabled={loading || disabled}
      type="link"
      className={className}
      size="large"
    />
  )
}

const mapStateToProps = (state) => ({
  loading: state.loading,
})

export default connect(mapStateToProps)(ButtonIcon)
