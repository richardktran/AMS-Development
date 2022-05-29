import React from 'react'
import { Table, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { AppTablePagination } from '../pagination'

function AppTable(props) {
  const {
    loading,
    columns,
    data,
    total,
    perPage,
    currentPage,
    handleChangePage,
    handleSorter,
    sortDefault,
    handleShowDetail,
  } = props
  const { type, value } = sortDefault

  const onChange = (pagination, filters, sorter) => {
    const { field, order } = sorter
    let data = {}
    if (order !== undefined) {
      data = {
        sortType: field,
        sortValue: order === 'ascend' ? 'asc' : 'desc',
      }
    } else {
      data = {
        sortType: type,
        sortValue: value,
      }
    }
    handleSorter(data)
  }

  return (
    <>
      <Table
        className="w-100"
        style={{
          boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
          marginBottom: '30px',
        }}
        columns={columns}
        pagination={false}
        loading={{
          indicator: (
            <Spin
              indicator={
                <LoadingOutlined
                  style={{ fontSize: 30, color: '#CF2338' }}
                  spin
                />
              }
            />
          ),
          spinning: loading,
        }}
        dataSource={data}
        rowClassName="row-cursor"
        onChange={onChange}
        onRow={(record) => {
          if (handleShowDetail !== undefined) {
            return {
              onClick: () => {
                handleShowDetail(record)
              },
            }
          }
        }}
      />
      <AppTablePagination
        total={total}
        perPage={perPage}
        currentPage={currentPage}
        handleChangePage={handleChangePage}
      />
    </>
  )
}

const mapStateToProps = (state) => ({
  loading: state.loading,
})

export default connect(mapStateToProps)(AppTable)
