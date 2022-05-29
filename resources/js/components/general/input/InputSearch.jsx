import React from 'react'
import { Input, Button } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { enableLoading, disableLoading } from '../../../actions'

function InputSearch(props) {
  const { loading, handleSearch, style, disableLoading, enableLoading } = props

  const onSearch = (value) => {
    enableLoading()
    handleSearch(value)
    disableLoading()
  }

  return (
    <Input.Search
      style={{
        ...style,
        width: 300,
      }}
      allowClear
      enterButton={
        <Button
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          disabled={loading}
          icon={<SearchOutlined />}
        />
      }
      disabled={loading}
      onSearch={onSearch}
    />
  )
}

const mapStateToProps = (state) => ({
  loading: state.loading,
})

const mapDispatchToProps = (dispatch) => {
  return {
    enableLoading: () => dispatch(enableLoading()),
    disableLoading: () => dispatch(disableLoading()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InputSearch)
