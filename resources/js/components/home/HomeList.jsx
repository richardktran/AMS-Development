import React, { useEffect, useState } from 'react'
import { Space } from 'antd'
import { CheckOutlined, CloseOutlined, UndoOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import '../../../css/app.scss'
import {
  showMessage,
  ModalDetailAssignment,
  TextHighlight,
  ModalHandleHomeClick,
  AppTable,
  ButtonIcon,
} from '../general'
import {
  enableLoading,
  disableLoading,
  getAllHomeList,
  checkAuthentication,
  changePageInHomeList,
  setSortTypeInHomeList,
} from '../../actions'
import { exceptionConstants, homeListColumns } from '../../constants'

const { UNAUTHENTICATED, SUCCESS, PAGE_NOT_FOUND, BAD_REQUEST, FORBIDDEN } =
  exceptionConstants

function HomeList(props) {
  const [isOpen, showModal] = useState(false)
  const [detail, setDetail] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [typeModal, setTypeModal] = useState(null)
  const [isShowModal, setShowModal] = useState(false)
  let data = []
  const columns = []
  const {
    home,
    enableLoading,
    disableLoading,
    getAllHomeList,
    checkAuthentication,
    changePageInHomeList,
    setSortTypeInHomeList,
  } = props
  const { sortAction, total, homeList, newUpdatedState } = home
  const { currentPage, sortType, perPage, sortValue } = sortAction

  const showPopUpByCode = (code, msg) => {
    checkAuthentication(code)
    if (code === PAGE_NOT_FOUND) {
      showMessage(
        'error',
        'Can not find this assignment',
        'This assignment has been disabled or does not exist.'
      )
    } else if (code === UNAUTHENTICATED) {
      showMessage('error', code + ' error', 'You are not authenticated!')
    } else if (code === FORBIDDEN) {
      showMessage('error', code + ' error', msg)
    } else if (code === BAD_REQUEST) {
      showMessage('error', code + ' error', msg)
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
    setShowModal(true)
    setSelectedId(id)
    setTypeModal(type)
    disableLoading()
  }

  homeListColumns.map((item) => {
    return columns.push({
      ...item,
      render: (text) => (
        <TextHighlight
          content={text}
          isDate={item.isDate}
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
      const isDisabledAcceptDeclined =
        row.state_name === 'Accepted' ||
        row.state_name === 'Waiting for returning'
      const isDisabledReturning =
        row.state_name === 'Waiting for acceptance' ||
        row.state_name === 'Waiting for returning'
      return (
        <Space size="small">
          <ButtonIcon
            icon={<CheckOutlined />}
            disabled={isDisabledAcceptDeclined}
            onClick={(e) => handleClickButton(e, 'accept', id)}
          />
          <ButtonIcon
            icon={<CloseOutlined />}
            disabled={isDisabledAcceptDeclined}
            className={isDisabledAcceptDeclined ? null : 'text-reset'}
            onClick={(e) => handleClickButton(e, 'decline', id)}
          />
          <ButtonIcon
            icon={
              <UndoOutlined
                style={{
                  color: isDisabledReturning ? null : '#1890ff',
                }}
              />
            }
            onClick={(e) => handleClickButton(e, 'request_return', id)}
            disabled={isDisabledReturning}
            className={isDisabledReturning ? null : 'text-reset'}
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
      page: currentPage,
    }
    const res = await getAllHomeList(credentials)
    if (res.code === UNAUTHENTICATED) {
      showMessage('error', res.code + ' error', res.message)
      checkAuthentication(res.code)
    } else if (res.code !== SUCCESS) {
      showMessage(
        'error',
        res.code + ' error',
        'There may be a problem with the server. Please try again later.'
      )
    }
    disableLoading()
  }, [sortAction, newUpdatedState])

  if (homeList && homeList.length > 0) {
    data = []
    homeList.map((item) =>
      data.push({
        key: item.id,
        ...item,
      })
    )
  }

  const handleShowDetail = (record) => {
    setDetail(record)
    showModal(true)
  }

  return (
    <>
      <AppTable
        data={data}
        columns={columns}
        handleSorter={setSortTypeInHomeList}
        sortDefault={{ type: 'id', value: 'asc' }}
        handleShowDetail={handleShowDetail}
        currentPage={currentPage}
        total={total}
        perPage={perPage}
        handleChangePage={changePageInHomeList}
      />
      <ModalDetailAssignment
        handleCancel={() => showModal(false)}
        isOpen={isOpen}
        detail={detail}
      />

      <ModalHandleHomeClick
        isOpen={isShowModal}
        type={typeModal}
        handleCancel={() => setShowModal(false)}
        selectedId={selectedId}
        showPopUp={showPopUpByCode}
      />
    </>
  )
}

const mapStateToProps = (state) => ({
  loading: state.loading,
  home: state.home,
})

const mapDispatchToProps = (dispatch) => {
  return {
    disableLoading: () => dispatch(disableLoading()),
    checkAuthentication: (code) => dispatch(checkAuthentication(code)),
    enableLoading: () => dispatch(enableLoading()),
    getAllHomeList: (credentials) => dispatch(getAllHomeList(credentials)),
    changePageInHomeList: (page) => dispatch(changePageInHomeList(page)),
    setSortTypeInHomeList: (data) => dispatch(setSortTypeInHomeList(data)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeList)
