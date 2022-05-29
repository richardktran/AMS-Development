import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import {
  getStateAndCategoryInAssetList,
  searchAsset,
  setFilterByCateInAssetList,
  setFilterByStateInAssetList,
} from '../../actions'

import { InputSearch, ButtonRouting, DropdownFilter } from '../general'

function ManageAssetFilter(props) {
  const {
    searchAsset,
    setFilterByCateInAssetList,
    setFilterByStateInAssetList,
    asset,
    getStateAndCategoryInAssetList,
  } = props

  const { dataFilter } = asset
  const { categories, states } = dataFilter

  useEffect(async () => {
    await getStateAndCategoryInAssetList()
  }, [])

  return (
    <div className="w-100 d-flex align-items-center justify-content-between">
      <div className="d-flex flex-row align-items-center justify-content-center">
        <DropdownFilter
          title="State"
          placement="bottomLeft"
          data={states}
          handleSetFilter={setFilterByStateInAssetList}
        />
        <div style={{ marginRight: '30px' }}></div>
        <DropdownFilter
          title="Category"
          placement="bottomLeft"
          data={categories}
          handleSetFilter={setFilterByCateInAssetList}
        />
      </div>
      <div className=" my-4 d-flex align-items-center justify-content-center">
        <InputSearch handleSearch={searchAsset} style={{ marginRight: 30 }} />
        <ButtonRouting title="Create new asset" route="/assets/create" />
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  loading: state.loading,
  asset: state.asset,
})

const mapDispatchToProps = (dispatch) => {
  return {
    searchAsset: (search) => dispatch(searchAsset(search)),
    setFilterByCateInAssetList: (filterType) =>
      dispatch(setFilterByCateInAssetList(filterType)),
    setFilterByStateInAssetList: (filterType) =>
      dispatch(setFilterByStateInAssetList(filterType)),
    getStateAndCategoryInAssetList: () =>
      dispatch(getStateAndCategoryInAssetList()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageAssetFilter)
