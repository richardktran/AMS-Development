import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import {
  resetSortFilterInUserList,
  resetFormHandleUser,
  resetFormHandleAsset,
  resetSortFilterInAssetList,
  resetSortFilterInAssignmentList,
  resetSortFilterInHomeList,
  resetFormCreateAssignment,
  resetSortFilterInRequestList,
  resetFormEditAssignment,
  resetSortFilterInReportList,
} from '../actions'

class App extends Component {
  componentDidMount() {
    this.unlisten = this.props.history.listen((location) => {
      const { pathname } = location
      const arrayPath = pathname.split('/')
      if (arrayPath[1] !== 'users') {
        this.props.resetSortFilterInUserList()
      }
      if (!(arrayPath[1] === 'users' && arrayPath[2] === 'edit')) {
        this.props.resetFormHandleUser()
      }
      if (!(arrayPath[1] === 'assets' && arrayPath[2] === 'edit')) {
        this.props.resetFormHandleAsset()
      }
      if (arrayPath[1] !== 'assets') {
        this.props.resetSortFilterInAssetList()
      }
      if (arrayPath[1] !== 'assignments') {
        this.props.resetSortFilterInAssignmentList()
      }
      if (!(arrayPath[1] === 'assignments' && arrayPath[2] === 'create')) {
        this.props.resetFormCreateAssignment()
      }
      if (arrayPath[1] !== 'request-returnings') {
        this.props.resetSortFilterInRequestList()
      }
      if (!(arrayPath[1] === 'assignments' && arrayPath[2] === 'edit')) {
        this.props.resetFormEditAssignment()
      }
      if (pathname !== '/') {
        this.props.resetSortFilterInHomeList()
      }
      if (arrayPath[1] !== 'reports') {
        this.props.resetSortFilterInReportList()
      }
    })
  }

  componentWillUnmount() {
    this.unlisten()
  }

  render() {
    return <>{this.props.children}</>
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    resetSortFilterInUserList: () => dispatch(resetSortFilterInUserList()),
    resetFormHandleUser: () => dispatch(resetFormHandleUser()),
    resetFormHandleAsset: () => dispatch(resetFormHandleAsset()),
    resetSortFilterInAssetList: () => dispatch(resetSortFilterInAssetList()),
    resetSortFilterInAssignmentList: () =>
      dispatch(resetSortFilterInAssignmentList()),
    resetFormCreateAssignment: () => dispatch(resetFormCreateAssignment()),
    resetSortFilterInRequestList: () =>
      dispatch(resetSortFilterInRequestList()),
    resetFormEditAssignment: () => dispatch(resetFormEditAssignment()),
    resetSortFilterInHomeList: () => dispatch(resetSortFilterInHomeList()),
    resetSortFilterInReportList: () => dispatch(resetSortFilterInReportList()),
  }
}
export default withRouter(connect(null, mapDispatchToProps)(App))
