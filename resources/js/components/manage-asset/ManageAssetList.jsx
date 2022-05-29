import React, { useEffect, useState } from 'react'
import { Space } from 'antd'
import { EditFilled, CloseCircleFilled } from '@ant-design/icons'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import '../../../css/app.scss'
import {
  showMessage,
  ModalDetailAsset,
  ModalDisableAsset,
  ModalFailDeleteAsset,
  TextHighlight,
  AppTable,
  ButtonIcon,
} from '../general'
import {
  enableLoading,
  disableLoading,
  getAllAssets,
  checkAuthentication,
  changePageInAssetList,
  setSortTypeInAssetList,
  updateTopAssetInList,
  isAssetAssigned,
  isAnyValidAssignment,
} from '../../actions'
import { exceptionConstants, assetListColumns } from '../../constants'

const { UNAUTHENTICATED, SUCCESS, PAGE_NOT_FOUND, BAD_REQUEST } =
  exceptionConstants

function ManageAssetList(props) {
  const [isOpen, showModal] = useState(false)
  const [detail, setDetail] = useState(null)
  const [editItemId, setEditItemId] = useState(null)
  const [redirect, enableRedirect] = useState(false)
  const [disableItemId, setDisableItemId] = useState(null)
  const [isShowModalDisableAsset, setShowModalDisableAsset] = useState(false)
  const [isShowModalFailDisabled, setShowModalFailDisabled] = useState(false)

  let data = []
  const columns = []
  const {
    asset,
    getAllAssets,
    setSortTypeInAssetList,
    checkAuthentication,
    changePageInAssetList,
    updateTopAssetInList,
    enableLoading,
    disableLoading,
    isAssetAssigned,
  } = props
  const { sortAction, total, assetList, newUpdatedAsset, newDisabledAsset } =
    asset
  const {
    currentPage,
    sortType,
    perPage,
    sortValue,
    filterByState,
    filterByCate,
    searchKeywords,
  } = sortAction

  const handleEditAsset = (e, id) => {
    e.stopPropagation()
    setEditItemId(id)
    enableRedirect(true)
  }

  const showPopUpByCode = (code, msg) => {
    checkAuthentication(code)
    if (code === PAGE_NOT_FOUND) {
      showMessage(
        'error',
        'Can not find this asset',
        'This asset has been disabled or does not exist.'
      )
    } else if (code === UNAUTHENTICATED) {
      showMessage('error', 'Can not delete asset', 'You are not authenticated!')
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

  const handleDisableAsset = async (e, asset_id) => {
    enableLoading()
    e.stopPropagation()
    const res = await isAssetAssigned(asset_id)
    setDisableItemId(asset_id)
    if (res.code === SUCCESS) {
      setShowModalDisableAsset(true)
    } else if (res.code === BAD_REQUEST) {
      setShowModalFailDisabled(true)
    } else {
      showPopUpByCode(res.code, res.message)
    }
    disableLoading()
  }

  assetListColumns.map((item) => {
    return columns.push({
      ...item,
      render: (text) => (
        <TextHighlight
          content={text}
          capitalizeFirst={item.dataIndex === 'category_name'}
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
    render: (id, row) => (
      <Space size="small">
        <ButtonIcon
          icon={<EditFilled />}
          disabled={row.state_name === 'Assigned'}
          className={row.state_name === 'Assigned' ? null : 'text-reset'}
          onClick={(e) => handleEditAsset(e, id)}
        />
        <ButtonIcon
          icon={<CloseCircleFilled />}
          disabled={row.state_name === 'Assigned'}
          onClick={(e) => handleDisableAsset(e, id)}
        />
      </Space>
    ),
  })

  useEffect(async () => {
    enableLoading()
    const credentials = {
      sort_type: sortType,
      sort_value: sortValue,
      categories: filterByCate,
      states: filterByState,
      search: searchKeywords,
      page: currentPage,
    }
    const res = await getAllAssets(credentials)
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
    if (assetList && assetList.length > 0) {
      if (newUpdatedAsset !== null) {
        updateTopAssetInList(newUpdatedAsset)
      }
    }
    disableLoading()
  }, [sortAction, newUpdatedAsset, newDisabledAsset])

  if (assetList && assetList.length > 0) {
    data = []
    assetList.map((item) =>
      data.push({
        key: item.asset_code,
        ...item,
      })
    )
  }

  const handleShowDetail = (record) => {
    setDetail(record)
    showModal(true)
  }

  if (redirect) {
    return <Redirect to={`/assets/edit/${editItemId}`} />
  }

  return (
    <>
      <AppTable
        data={data}
        columns={columns}
        handleSorter={setSortTypeInAssetList}
        sortDefault={{ type: 'asset_code', value: 'desc' }}
        handleShowDetail={handleShowDetail}
        currentPage={currentPage}
        total={total}
        perPage={perPage}
        handleChangePage={changePageInAssetList}
      />
      <ModalDetailAsset
        handleCancel={() => showModal(false)}
        isOpen={isOpen}
        detail={detail}
      />
      <ModalDisableAsset
        isOpen={isShowModalDisableAsset}
        handleCancel={() => setShowModalDisableAsset(false)}
        disableId={disableItemId}
        showPopUp={showPopUpByCode}
      />
      <ModalFailDeleteAsset
        isOpen={isShowModalFailDisabled}
        handleCancel={() => setShowModalFailDisabled(false)}
        disableItemId={disableItemId}
      />
    </>
  )
}

const mapStateToProps = (state) => ({
  loading: state.loading,
  asset: state.asset,
})

const mapDispatchToProps = (dispatch) => {
  return {
    isAnyValidAssignment: (user_id) => dispatch(isAnyValidAssignment(user_id)),
    disableLoading: () => dispatch(disableLoading()),
    checkAuthentication: (code) => dispatch(checkAuthentication(code)),
    enableLoading: () => dispatch(enableLoading()),
    getAllAssets: (credentials) => dispatch(getAllAssets(credentials)),
    changePageInAssetList: (page) => dispatch(changePageInAssetList(page)),
    setSortTypeInAssetList: (data) => dispatch(setSortTypeInAssetList(data)),
    updateTopAssetInList: (data) => dispatch(updateTopAssetInList(data)),
    isAssetAssigned: (user_id) => dispatch(isAssetAssigned(user_id)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageAssetList)
