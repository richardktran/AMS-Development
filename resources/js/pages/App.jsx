/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Layout } from 'antd'
import {
  AppHeader,
  AppFooter,
  AppSider,
  AppBackTop,
} from '../components/general'
import { connect } from 'react-redux'
import PrivateRoute from '../components/routes/PrivateRoute'
import {
  styleLoginLayout,
  styleHomeLayout,
  exceptionConstants,
  styleLoginContent,
} from '../constants'
import { verifyUserByToken } from '../actions'

import Login from './Login'
import Home from './Home'
import { CreateUser, EditUser, ManageUser } from './manage-user'
import {
  CreateAssignment,
  ManageAssignment,
  EditAssignment,
} from './manage-assignment'
import { CreateAsset, EditAsset, ManageAsset } from './manage-asset'

import RequestForReturning from './RequestForReturning'
import AppContainer from './AppContainer'
import Report from './Report'
import Error from './Error'

const { Content } = Layout
const { PAGE_NOT_FOUND } = exceptionConstants
function App(props) {
  const { auth, verifyToken } = props
  const { loggedIn } = auth
  console.warn = () => {}
  console.error = () => {}

  useEffect(() => {
    if (loggedIn) {
      verifyToken()
    }
  }, [loggedIn])

  return (
    <Router>
      <Layout style={loggedIn ? null : styleLoginLayout}>
        {loggedIn ? <AppHeader /> : null}
        <Layout>
          {loggedIn ? <AppSider /> : null}
          <Content style={loggedIn ? styleHomeLayout : styleLoginContent}>
            <AppContainer>
              <Switch>
                <PrivateRoute exact path="/" component={Home} />
                <PrivateRoute exact path="/users" component={ManageUser} />
                <PrivateRoute
                  exact
                  path="/users/create"
                  component={CreateUser}
                />
                <PrivateRoute
                  exact
                  path="/users/edit/:id"
                  component={EditUser}
                />
                <PrivateRoute exact path="/assets" component={ManageAsset} />
                <PrivateRoute
                  exact
                  path="/assets/create"
                  component={CreateAsset}
                />
                <PrivateRoute
                  exact
                  path="/assets/edit/:id"
                  component={EditAsset}
                />
                <PrivateRoute
                  exact
                  path="/assignments"
                  component={ManageAssignment}
                />
                <PrivateRoute
                  exact
                  path="/assignments/create"
                  component={CreateAssignment}
                />
                <PrivateRoute
                  exact
                  path="/assignments/edit/:id"
                  component={EditAssignment}
                />
                <PrivateRoute
                  exact
                  path="/request-returnings"
                  component={RequestForReturning}
                />
                <PrivateRoute exact path="/reports" component={Report} />
                <Route exact path="/login" component={Login} />
                <Route
                  path="*"
                  render={() => {
                    return (
                      <Error
                        status={PAGE_NOT_FOUND}
                        message="Sorry, the page you visited does not exist."
                      />
                    )
                  }}
                />
              </Switch>
            </AppContainer>
          </Content>
          <AppBackTop />
        </Layout>
        {loggedIn ? <AppFooter /> : null}
      </Layout>
    </Router>
  )
}

const mapStateToProps = (state) => ({
  auth: state.auth,
})

const mapDispatchToProps = (dispatch) => {
  return {
    verifyToken: () => dispatch(verifyUserByToken()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
