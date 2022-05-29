import React from 'react'
import { Pagination, Typography } from 'antd'
import { connect } from 'react-redux'

const { Text } = Typography

function AppTablePagination(props) {
  const { currentPage, total, loading, perPage, handleChangePage } = props
  const PrevNextPagination = (current, type, originalElement) => {
    if (type === 'prev') {
      return (
        <Text style={currentPage === 1 ? null : { color: '#CF2338' }}>
          Previous
        </Text>
      )
    }
    if (type === 'next') {
      return (
        <Text
          style={
            currentPage === Math.ceil(total / perPage) || total === 0
              ? null
              : { color: '#CF2338' }
          }
        >
          Next
        </Text>
      )
    }
    return originalElement
  }
  return (
    <Pagination
      current={currentPage}
      disabled={total <= 0}
      onChange={(page) => handleChangePage(page)}
      className="d-flex align-self-end mb-5"
      defaultCurrent={1}
      pageSize={perPage}
      disable={loading}
      total={total}
      itemRender={PrevNextPagination}
      showSizeChanger={false}
    />
  )
}

const mapStateToProps = (state) => ({
  loading: state.loading,
})

export default connect(mapStateToProps)(AppTablePagination)
