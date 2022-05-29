import React, { useState, useEffect } from 'react'
import { Dropdown, Typography, Menu, Checkbox, Button, Divider } from 'antd'
import { connect } from 'react-redux'
import { FilterFilled } from '@ant-design/icons'
import { formatCapitalizeFirst } from '../../../utils'
import { enableLoading, disableLoading } from '../../../actions'

const { Text } = Typography

function DropdownFilter(props) {
  const {
    loading,
    title,
    placement,
    handleSetFilter,
    data,
    enableLoading,
    disableLoading,
    style,
  } = props
  const [visibleDropdown, toggleVisibleDropdown] = useState(false)

  const [allFilter, setAllFilter] = useState(
    data !== null
      ? [{ value: 'all', id: 'all', checked: true }, ...data]
      : [{ value: 'all', id: 'all', checked: true }]
  )

  useEffect(() => {
    if (data !== null) {
      setAllFilter([{ value: 'all', id: 'all', checked: true }, ...data])
    }
  }, [data])

  const handleMenuClick = (e) => {
    enableLoading()
    e.stopPropagation()
    const name = e.target.name
    const data = []
    if (name === 'all') {
      allFilter.map((item) =>
        item.id === name
          ? data.push({ ...item, checked: e.target.checked })
          : data.push({ ...item, checked: false })
      )
    } else {
      allFilter.map((item) =>
        item.id === name
          ? data.push({ ...item, checked: e.target.checked })
          : item.id === 'all'
          ? data.push({ ...item, checked: false })
          : data.push(item)
      )
    }
    setAllFilter(data)
    const temp = []
    for (const item of data) {
      if (item.checked && item.id !== 'all') {
        temp.push(item.id)
      }
    }
    handleSetFilter(temp)
    disableLoading()
  }

  const menu = (
    <Menu>
      {allFilter && allFilter !== null
        ? allFilter.map((item) => (
            <Menu.Item
              key={item.id}
              disabled={loading}
              className="menu-items m-0"
            >
              <Checkbox
                className="w-100"
                disabled={loading}
                checked={item.checked}
                defaultChecked={item.id === 'all'}
                onChange={handleMenuClick}
                name={item.id}
                key={item.id}
              >
                <span>{formatCapitalizeFirst(item.value)}</span>
              </Checkbox>
            </Menu.Item>
          ))
        : null}
    </Menu>
  )
  return (
    <Dropdown
      style={style}
      overlay={menu}
      trigger="click"
      onVisibleChange={(flag) => toggleVisibleDropdown(flag)}
      visible={visibleDropdown}
      disabled={loading}
      placement={placement}
    >
      <Button className="d-flex align-items-center justify-content-between py-0">
        <Text className="d-flex align-items-center justify-content-start mx-2">
          {title}
        </Text>
        <Divider
          style={{ height: '100%', borderLeft: '1px solid #d9d9d9' }}
          type="vertical"
        />
        <FilterFilled className="ml-2" style={{ color: 'black' }} />
      </Button>
    </Dropdown>
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

export default connect(mapStateToProps, mapDispatchToProps)(DropdownFilter)
