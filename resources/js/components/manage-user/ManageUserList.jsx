import React, { useEffect, useState } from 'react'
import { Space } from 'antd'
import { EditFilled, CloseCircleFilled } from '@ant-design/icons'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import '../../../css/app.scss'
import {
  showMessage,
  ModalDetailUser,
  TextHighlight,
  ModalDisableUser,
  AppTable,
  ButtonIcon,
} from '../general'
import {
  enableLoading,
  disableLoading,
  getAllUsers,
  checkAuthentication,
  changePageInUserList,
  setSortTypeInUserList,
  updateTopUserInList,
  isAnyValidAssignment,
  resetSpecialCase,
} from '../../actions'
import { exceptionConstants, userListColumns } from '../../constants'

const { UNAUTHENTICATED, SUCCESS, PAGE_NOT_FOUND, BAD_REQUEST } =
  exceptionConstants

function ManageUserList(props) {
  const [isOpen, showModal] = useState(false)
  const [detail, setDetail] = useState(null)
  const [editItemId, setEditItemId] = useState(null)
  const [disableItemId, setDisableItemId] = useState(null)
  const [redirect, enableRedirect] = useState(false)
  const [isShowModalDisableUser, setShowModalDisableUser] = useState(false)

  let data = []
  const columns = []
  const {
    user,
    getAllUsers,
    setSortTypeInUserList,
    checkAuthentication,
    changePageInUserList,
    updateTopUserInList,
    enableLoading,
    disableLoading,
    isAnyValidAssignment,
    resetSpecialCase,
  } = props
  const {
    sortAction,
    total,
    userList,
    newUpdatedUser,
    newDisabledUser,
    specialCase,
  } = user
  const {
    currentPage,
    sortType,
    perPage,
    sortValue,
    filterType,
    searchKeywords,
  } = sortAction

  const handleEditUser = (e, id) => {
    e.stopPropagation()
    setEditItemId(id)
    enableRedirect(true)
  }

  const showPopUpByCode = (code, msg) => {
    checkAuthentication(code)
    if (code === PAGE_NOT_FOUND) {
      showMessage(
        'error',
        'Can not find this user',
        'This user has been disabled or does not exist.'
      )
    } else if (code === BAD_REQUEST) {
      showMessage('error', 'Can not disable user', msg)
    } else if (code === UNAUTHENTICATED) {
      showMessage('error', 'Can not disable user', 'You are not authenticated!')
    } else {
      showMessage(
        'error',
        'Service unavailable',
        'There may be a problem with the server. Please try again later.'
      )
    }
  }
  const handleDisableUser = async (e, user_id) => {
    enableLoading()
    e.stopPropagation()
    const res = await isAnyValidAssignment(user_id)
    if (res.code === SUCCESS) {
      setShowModalDisableUser(true)
      setDisableItemId(user_id)
    } else {
      showPopUpByCode(res.code, res.message)
    }
    disableLoading()
  }

  userListColumns.map((item) => {
    return columns.push({
      ...item,
      render: (text) => (
        <TextHighlight
          content={text}
          isDate={item.isDate}
          capitalizeFirst={item.dataIndex === 'type'}
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
    render: (id) => (
      <Space size="small">
        <ButtonIcon
          tooltip="edit user"
          className="text-reset"
          icon={<EditFilled />}
          onClick={(e) => handleEditUser(e, id)}
        />
        <ButtonIcon
          tooltip="disable user"
          icon={<CloseCircleFilled />}
          onClick={(e) => handleDisableUser(e, id)}
        />
      </Space>
    ),
  })

  useEffect(async () => {
    enableLoading()
    const credentials = {
      sort_type: sortType,
      sort_value: sortValue,
      filter: filterType,
      search: searchKeywords,
      page: currentPage,
    }
    const res = await getAllUsers(credentials)
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
    if (userList && userList.length > 0) {
      if (newUpdatedUser !== null) {
        if (specialCase !== null) {
          showMessage('success', 'Notification', specialCase)
        }
        updateTopUserInList(newUpdatedUser)
        resetSpecialCase()
      }
    }
    disableLoading()
  }, [sortAction, newUpdatedUser, newDisabledUser])

  if (userList && userList.length > 0) {
    data = []
    userList.map((item) =>
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
    return <Redirect to={`/users/edit/${editItemId}`} />
  }

  return (
    <>
      <AppTable
        data={data}
        columns={columns}
        handleSorter={setSortTypeInUserList}
        sortDefault={{ type: 'staff_code', value: 'desc' }}
        handleShowDetail={handleShowDetail}
        currentPage={currentPage}
        total={total}
        perPage={perPage}
        handleChangePage={changePageInUserList}
      />
      <ModalDetailUser
        handleCancel={() => showModal(false)}
        isOpen={isOpen}
        detail={detail}
      />
      <ModalDisableUser
        isOpen={isShowModalDisableUser}
        handleCancel={() => setShowModalDisableUser(false)}
        disableId={disableItemId}
        showPopUp={showPopUpByCode}
      />
    </>
  )
}

const mapStateToProps = (state) => ({
  loading: state.loading,
  user: state.user,
})

const mapDispatchToProps = (dispatch) => {
  return {
    isAnyValidAssignment: (user_id) => dispatch(isAnyValidAssignment(user_id)),
    disableLoading: () => dispatch(disableLoading()),
    checkAuthentication: (code) => dispatch(checkAuthentication(code)),
    enableLoading: () => dispatch(enableLoading()),
    getAllUsers: (credentials) => dispatch(getAllUsers(credentials)),
    changePageInUserList: (page) => dispatch(changePageInUserList(page)),
    setSortTypeInUserList: (data) => dispatch(setSortTypeInUserList(data)),
    updateTopUserInList: (data) => dispatch(updateTopUserInList(data)),
    resetSpecialCase: () => dispatch(resetSpecialCase()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageUserList)
