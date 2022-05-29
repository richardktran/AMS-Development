import React, { useState, useEffect, useRef } from 'react'
import { Button, Modal, Typography, Table, Spin, Input } from 'antd'
import { connect } from 'react-redux'
import { formatCapitalizeFirst } from '../../../utils'

import { LoadingOutlined, SearchOutlined } from '@ant-design/icons'

import { TextHighlight } from '..'

import {
  disableLoading,
  enableLoading,
  updateDataSearchUserAssignment,
  resetDataUserModalAssignment,
  updateDataSearchAssetAssignment,
  resetDataAssetModalAssignment,
  selectedUserAssignment,
  selectedAssetAssignment,
} from '../../../actions'

import {
  assignmentUserColumns,
  assignmentAssetColumns,
  assignmentIds,
  exceptionConstants,
} from '../../../constants'

const { SUCCESS } = exceptionConstants

const {
  ASSIGNMENT_BUTTON_CLOSE_MODAL_SEARCH,
  ASSIGNMENT_BUTTON_SUBMIT_MODAL_SEARCH,
  ASSIGNMENT_TABLE_MODAL_SEARCH,
  ASSIGNMENT_INPUT_SEARCH_KEYWORD,
  ASSIGNMENT_MODAL_SEARCH,
} = assignmentIds

const { Title } = Typography
function ModalSearchAssignment(props) {
  const {
    enableLoading,
    disableLoading,
    loading,
    handleCancel,
    field,
    isShowModal,
    assignment,
    updateDataSearchUserAssignment,
    updateDataSearchAssetAssignment,
    resetDataUserModalAssignment,
    resetDataAssetModalAssignment,
    selectedUserAssignment,
    selectedAssetAssignment,
    showPopUpByCode,
  } = props

  const columns = []
  let assignmentSelectColumns = []
  let newData = []
  const perPage = 10

  const { newDataUser, selectedUser, newDataAsset, selectedAsset } = assignment
  const inputRef = useRef(null)

  const [keys, setKeys] = useState([])
  const [searchKeywords, setSearchKeyWords] = useState('')
  const [getRecord, setRecord] = useState(null)
  const [disabledSaveButton, setDisabledSaveButton] = useState(true)
  const [titleSelected, setTitleSelected] = useState('')

  const onRowKeysChange = (event) => {
    setKeys(event)
  }

  const updateDataSearchAssignment = async (data) => {
    let res
    if (field === 'user') {
      res = await updateDataSearchUserAssignment(data)
    } else {
      res = await updateDataSearchAssetAssignment(data)
    }
    const { code, message } = res
    if (code !== SUCCESS) {
      showPopUpByCode(code, message)
    }
  }

  const resetDataModalAssignment = async () => {
    if (field === 'user') {
      await resetDataUserModalAssignment()
    } else {
      await resetDataAssetModalAssignment()
    }
  }

  useEffect(() => {
    if (field === 'user') {
      if (selectedUser) {
        setTitleSelected(
          `${selectedUser.staff_code} - ${selectedUser.full_name}`
        )
        onRowKeysChange([selectedUser.key])
      } else {
        setTitleSelected(null)
        onRowKeysChange(null)
        setDisabledSaveButton(true)
      }
    } else {
      if (selectedAsset) {
        setTitleSelected(
          `${selectedAsset.asset_code} - ${selectedAsset.asset_name}`
        )
        onRowKeysChange([selectedAsset.key])
      } else {
        setTitleSelected(null)
        onRowKeysChange(null)
        setDisabledSaveButton(true)
      }
    }
  }, [isShowModal])

  if (field === 'user') {
    assignmentSelectColumns = [...assignmentUserColumns]
    newData = [...newDataUser]
  } else {
    assignmentSelectColumns = [...assignmentAssetColumns]
    newData = [...newDataAsset]
  }

  assignmentSelectColumns.map((item) => {
    return columns.push({
      ...item,
      render: (text) => (
        <TextHighlight
          content={text}
          isDate={item.isDate}
          capitalizeFirst={
            item.dataIndex === 'type' || item.dataIndex === 'category_name'
          }
          searchKeywords={searchKeywords}
          isHighlight={item.isSearchField}
        />
      ),
    })
  })

  const onChange = async (pagination, filters, sorter) => {
    enableLoading()
    const { field, order } = sorter
    let data = {}
    if (order !== undefined) {
      data = {
        sort_type: field,
        sort_value: order === 'ascend' ? 'asc' : 'desc',
      }
    } else {
      data = {
        sort_type: '',
        sort_value: '',
      }
    }
    const filterData = {
      ...data,
      per_page: perPage,
      search: searchKeywords,
    }
    await updateDataSearchAssignment(filterData)
    if (searchKeywords === '') {
      await resetDataModalAssignment()
    }
    disableLoading()
  }

  const onChangeSearch = async (event) => {
    const searchValue = event.target.value
    setSearchKeyWords(searchValue)
    if (searchValue.length < 3) {
      await resetDataModalAssignment()
    } else {
      enableLoading()
      const filterData = {
        sort_type: '',
        sort_value: '',
        per_page: perPage,
        search: searchValue,
      }
      await updateDataSearchAssignment(filterData)

      disableLoading()
      inputRef.current.focus({
        cursor: 'end',
      })
    }
  }

  const checkTitleSelected = (record) => {
    if (field === 'user') {
      setTitleSelected(`${record.staff_code} - ${record.full_name}`)
    } else {
      setTitleSelected(`${record.asset_code} - ${record.asset_name}`)
    }
  }

  const handleSave = () => {
    if (field === 'user') {
      selectedUserAssignment(getRecord)
    } else {
      selectedAssetAssignment(getRecord)
    }
    handleCancel()
    setSearchKeyWords('')
    resetDataModalAssignment()
  }
  const handleCancelSelect = () => {
    handleCancel()
    setSearchKeyWords('')
    resetDataModalAssignment()
  }

  return (
    <Modal
      id={ASSIGNMENT_MODAL_SEARCH}
      visible={isShowModal}
      closable={false}
      footer={null}
      width={1000}
    >
      <div className="d-flex flex-row align-items-center justify-content-between w-100 pb-3">
        <Title level={5} style={{ color: '#CF2338' }}>
          Select {formatCapitalizeFirst(field || '')}
        </Title>
        <Input.Search
          id={ASSIGNMENT_INPUT_SEARCH_KEYWORD}
          style={{
            width: 360,
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
          value={searchKeywords}
          onChange={onChangeSearch}
          ref={inputRef}
          placeholder={`Start your searching to find the targeted ${field}`}
        />
      </div>
      <div>
        <Table
          id={ASSIGNMENT_TABLE_MODAL_SEARCH}
          rowSelection={{
            type: 'radio',
            selectedRowKeys: keys,
            onChange: onRowKeysChange.bind(this),
            onSelect: (record) => {
              setRecord(record)
              setDisabledSaveButton(false)
              checkTitleSelected(record)
            },
          }}
          columns={columns}
          dataSource={newData}
          pagination={false}
          onChange={onChange}
          rowClassName="row-cursor"
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
          onRow={(record) => {
            return {
              onClick: () => {
                onRowKeysChange([record.key])
                setRecord(record)
                setDisabledSaveButton(false)
                checkTitleSelected(record)
              },
            }
          }}
        />
      </div>
      <div className="d-flex flex-row align-items-center justify-content-between w-100 pt-4">
        <div>
          <Title style={{ color: '#CF2338' }} level={5}>
            {titleSelected}
          </Title>
        </div>
        <div className="d-flex flex-row align-items-center justify-content-between">
          <Button
            className="mx-3"
            disabled={loading || disabledSaveButton}
            type="primary"
            danger
            onClick={handleSave}
            id={ASSIGNMENT_BUTTON_SUBMIT_MODAL_SEARCH}
          >
            Save
          </Button>
          <Button
            disabled={loading}
            onClick={handleCancelSelect}
            id={ASSIGNMENT_BUTTON_CLOSE_MODAL_SEARCH}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  )
}

const mapStateToProps = (state) => ({
  loading: state.loading,
  assignment: state.assignment,
})

const mapDispatchToProps = (dispatch) => {
  return {
    enableLoading: () => dispatch(enableLoading()),
    disableLoading: () => dispatch(disableLoading()),
    updateDataSearchUserAssignment: (search) =>
      dispatch(updateDataSearchUserAssignment(search)),
    updateDataSearchAssetAssignment: (search) =>
      dispatch(updateDataSearchAssetAssignment(search)),
    resetDataUserModalAssignment: () =>
      dispatch(resetDataUserModalAssignment()),
    resetDataAssetModalAssignment: () =>
      dispatch(resetDataAssetModalAssignment()),
    selectedUserAssignment: (record) =>
      dispatch(selectedUserAssignment(record)),
    selectedAssetAssignment: (record) =>
      dispatch(selectedAssetAssignment(record)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalSearchAssignment)
