import React, { useEffect, useState } from 'react'
import { Space } from 'antd'
import { EditFilled, CloseCircleFilled, UndoOutlined } from '@ant-design/icons'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import '../../../css/app.scss'
import {
  showMessage,
  ModalDetailAssignment,
  TextHighlight,
  ModalDisableAssignment,
  ModalReturnAssignment,
  AppTable,
  ButtonIcon,
} from '../general'
import {
  enableLoading,
  disableLoading,
  getAllAssignments,
  checkAuthentication,
  changePageInAssignmentList,
  setSortTypeInAssignmentList,
  updateTopAssignmentInList,
  resetSpecialCaseAssignment,
} from '../../actions'
import { exceptionConstants, assignmentListColumns } from '../../constants'

const { UNAUTHENTICATED, SUCCESS, PAGE_NOT_FOUND, BAD_REQUEST } =
  exceptionConstants

function ManageAssignmentList(props) {
  const [isOpen, showModal] = useState(false)
  const [detail, setDetail] = useState(null)
  const [editItemId, setEditItemId] = useState(null)
  const [redirect, enableRedirect] = useState(false)
  const [disableItemId, setDisableItemId] = useState(null)
  const [returnItemId, setReturnItemId] = useState(null)
  const [isShowModalDisableAssignment, setShowModalDisableAssignment] =
    useState(false)
  const [isShowModalReturnAssignment, setShowModalReturnAssignment] =
    useState(false)
  let data = []
  const columns = []
  const {
    assignment,
    getAllAssignments,
    setSortTypeInAssignmentList,
    checkAuthentication,
    changePageInAssignmentList,
    updateTopAssignmentInList,
    enableLoading,
    disableLoading,
    resetSpecialCaseAssignment,
  } = props
  const {
    sortAction,
    total,
    assignmentList,
    newUpdatedAssignment,
    newDisabledAssignment,
    newReturnedAssignment,
    specialCase,
  } = assignment
  const {
    currentPage,
    sortType,
    perPage,
    sortValue,
    filterByState,
    filterByAssignedDate,
    searchKeywords,
  } = sortAction

  const handleEditAssignment = (e, id) => {
    e.stopPropagation()
    setEditItemId(id)
    enableRedirect(true)
  }
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
  const handleDisableAssignment = async (e, id) => {
    enableLoading()
    e.stopPropagation()
    setShowModalDisableAssignment(true)
    setDisableItemId(id)
    disableLoading()
  }

  const handleReturnedAssignment = async (e, id) => {
    enableLoading()
    e.stopPropagation()
    setShowModalReturnAssignment(true)
    setReturnItemId(id)
    disableLoading()
  }

  assignmentListColumns.map((item) => {
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
      const isDisabledEdit =
        row.state_name === 'Accepted' ||
        row.state_name === 'Declined' ||
        row.state_name === 'Waiting for returning'
      const isDisabledAcceptDeclined =
        row.state_name === 'Accepted' ||
        row.state_name === 'Waiting for returning'
      const isDisabledReturning =
        row.state_name === 'Declined' ||
        row.state_name === 'Waiting for acceptance' ||
        row.state_name === 'Waiting for returning'
      return (
        <Space size="small">
          <ButtonIcon
            tooltip="edit"
            icon={<EditFilled />}
            disabled={isDisabledEdit}
            className={isDisabledEdit ? null : 'text-reset'}
            onClick={(e) => handleEditAssignment(e, id)}
          />
          <ButtonIcon
            tooltip="delete"
            icon={<CloseCircleFilled />}
            disabled={isDisabledAcceptDeclined}
            onClick={(e) => handleDisableAssignment(e, id)}
          />
          {/* style={{ color: '#1890ff' }} */}
          <ButtonIcon
            tooltip="return"
            icon={
              <UndoOutlined
                style={{
                  color: isDisabledReturning ? null : '#1890ff',
                }}
              />
            }
            disabled={isDisabledReturning}
            className={isDisabledReturning ? null : 'text-reset'}
            onClick={(e) => {
              handleReturnedAssignment(e, id)
            }}
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
      date: filterByAssignedDate,
      states: filterByState,
      search: searchKeywords,
      page: currentPage,
    }
    const res = await getAllAssignments(credentials)
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
    if (assignmentList && assignmentList.length > 0) {
      if (newUpdatedAssignment !== null) {
        if (specialCase !== null) {
          showMessage('success', 'Notification', specialCase)
        }
        updateTopAssignmentInList(newUpdatedAssignment)
        resetSpecialCaseAssignment()
      }
    }
    disableLoading()
  }, [
    sortAction,
    newUpdatedAssignment,
    newDisabledAssignment,
    newReturnedAssignment,
  ])

  if (assignmentList && assignmentList.length > 0) {
    data = []
    assignmentList.map((item) =>
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

  if (redirect) {
    return <Redirect to={`/assignments/edit/${editItemId}`} />
  }

  return (
    <>
      <AppTable
        data={data}
        columns={columns}
        handleSorter={setSortTypeInAssignmentList}
        sortDefault={{ type: 'id', value: 'asc' }}
        handleShowDetail={handleShowDetail}
        currentPage={currentPage}
        total={total}
        perPage={perPage}
        handleChangePage={changePageInAssignmentList}
      />
      <ModalDetailAssignment
        handleCancel={() => showModal(false)}
        isOpen={isOpen}
        detail={detail}
      />
      <ModalDisableAssignment
        isOpen={isShowModalDisableAssignment}
        handleCancel={() => setShowModalDisableAssignment(false)}
        disableId={disableItemId}
        showPopUp={showPopUpByCode}
      />
      <ModalReturnAssignment
        isOpen={isShowModalReturnAssignment}
        returnId={returnItemId}
        handleCancel={() => setShowModalReturnAssignment(false)}
        showPopUp={showPopUpByCode}
      />
    </>
  )
}

const mapStateToProps = (state) => ({
  loading: state.loading,
  assignment: state.assignment,
})

const mapDispatchToProps = (dispatch) => {
  return {
    disableLoading: () => dispatch(disableLoading()),
    checkAuthentication: (code) => dispatch(checkAuthentication(code)),
    enableLoading: () => dispatch(enableLoading()),
    getAllAssignments: (credentials) =>
      dispatch(getAllAssignments(credentials)),
    changePageInAssignmentList: (page) =>
      dispatch(changePageInAssignmentList(page)),
    setSortTypeInAssignmentList: (data) =>
      dispatch(setSortTypeInAssignmentList(data)),
    updateTopAssignmentInList: (data) =>
      dispatch(updateTopAssignmentInList(data)),
    resetSpecialCaseAssignment: () => dispatch(resetSpecialCaseAssignment()),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageAssignmentList)
