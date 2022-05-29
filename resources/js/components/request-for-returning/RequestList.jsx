import React, { useEffect, useState } from 'react'
import { Space } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import '../../../css/app.scss'
import {
  showMessage,
  TextHighlight,
  ModalDisableAssignment,
  AppTable,
  ButtonIcon,
} from '../general'
import {
  enableLoading,
  disableLoading,
  getAllRequests,
  checkAuthentication,
  changePageInRequestList,
  setSortTypeInRequestList,
} from '../../actions'
import { exceptionConstants, requestListColumns } from '../../constants'

const { UNAUTHENTICATED, SUCCESS, PAGE_NOT_FOUND, BAD_REQUEST } =
  exceptionConstants

function RequestList(props) {
  const [isOpen, showModal] = useState(false)
  const [typeModal, setTypeModal] = useState(null)
  const [disableItemId, setSelectedId] = useState(null)
  let data = []
  const columns = []
  const {
    request,
    getAllRequests,
    setSortTypeInRequestList,
    checkAuthentication,
    changePageInRequestList,
    enableLoading,
    disableLoading,
  } = props
  const { sortAction, total, requestList, newUpdatedState } = request
  const {
    currentPage,
    sortType,
    perPage,
    sortValue,
    filterByState,
    filterByReturnedDate,
    searchKeywords,
  } = sortAction

  const showPopUpByCode = (code, msg) => {
    checkAuthentication(code)
    if (code === PAGE_NOT_FOUND) {
      showMessage(
        'error',
        'Can not find this assignment',
        'This assignment has been disabled or does not exist.'
      )
    } else if (code === UNAUTHENTICATED) {
      showMessage(
        'error',
        'Can not delete assignment',
        'You are not authenticated!'
      )
    } else if (code === BAD_REQUEST) {
      showMessage('error', '400', msg)
    } else {
      showMessage(
        'error',
        'Service unavailable',
        'There may be a problem with the server. Please try again later.'
      )
    }
  }
  const handleClickButton = (e, type, id) => {
    enableLoading()
    e.stopPropagation()
    setSelectedId(id)
    setTypeModal(type)
    disableLoading()
  }

  requestListColumns.map((item) => {
    return columns.push({
      ...item,
      render: (text) => (
        <TextHighlight
          content={text}
          isDate={item.isDate}
          searchKeywords={searchKeywords}
          isHighlight={item.isSearchField}
        />
      ),
    })
  })

  columns.push({
    title: null,
    dataIndex: 'id',
    width: '12%',
    render: (id, row) => {
      const isDisabled = row.state_name === 'Completed'
      return (
        <Space size="small">
          <ButtonIcon
            icon={<CheckOutlined />}
            disabled={isDisabled}
            onClick={(e) => handleClickButton(e, 'complete', id)}
          />
          <ButtonIcon
            icon={<CloseOutlined />}
            disabled={isDisabled}
            className={isDisabled ? null : 'text-reset'}
            onClick={(e) => handleClickButton(e, 'cancel', id)}
          />
        </Space>
      )
    },
  })

  useEffect(async () => {
    enableLoading()
    const credentials = {
      sort_type: sortType,
      sort_value: sortValue,
      date: filterByReturnedDate,
      states: filterByState,
      search: searchKeywords,
      page: currentPage,
    }
    const res = await getAllRequests(credentials)
    if (res.code === UNAUTHENTICATED) {
      showMessage('error', res.code + ' error', res.message)
      checkAuthentication(res.code)
    } else if (res.code !== SUCCESS) {
      showMessage(
        'error',
        res.code + ' error',
        'There may be a problem with the server.Please try again later.'
      )
    }
    disableLoading()
  }, [sortAction, newUpdatedState])

  if (requestList && requestList.length > 0) {
    data = []
    requestList.map((item) =>
      data.push({
        key: item.id,
        ...item,
      })
    )
  }

  return (
    <>
      <AppTable
        data={data}
        columns={columns}
        handleSorter={setSortTypeInRequestList}
        sortDefault={{ type: 'id', value: 'asc' }}
        currentPage={currentPage}
        total={total}
        perPage={perPage}
        handleChangePage={changePageInRequestList}
      />
      {/* 
      ONLY USE ONE MODAL TO HANDLE COMPLETE AND CANCEL REQUEST
      lOOK FOR COMPONENTS home/HomeList and modal/ModalHandleHomeClick to handle the same way
       */}
      <ModalDisableAssignment
        type={typeModal}
        isOpen={isOpen}
        handleCancel={() => showModal(false)}
        disableId={disableItemId}
        showPopUp={showPopUpByCode}
      />
    </>
  )
}

const mapStateToProps = (state) => ({
  loading: state.loading,
  request: state.request,
})

const mapDispatchToProps = (dispatch) => {
  return {
    disableLoading: () => dispatch(disableLoading()),
    checkAuthentication: (code) => dispatch(checkAuthentication(code)),
    enableLoading: () => dispatch(enableLoading()),
    getAllRequests: (credentials) => dispatch(getAllRequests(credentials)),
    changePageInRequestList: (page) => dispatch(changePageInRequestList(page)),
    setSortTypeInRequestList: (data) =>
      dispatch(setSortTypeInRequestList(data)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestList)
