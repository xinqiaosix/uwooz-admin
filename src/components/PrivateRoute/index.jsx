import React from 'react'
import { router, connect } from 'dva'
import { Spin } from 'antd'

import styles from './index.module.scss'

const { Route, Redirect } = router

const PrivateRoute = ({
  hasLogged,
  isLogining,
  component: Component,
  ...rest
}) => {
  if (isLogining) {
    return (
      <div className={styles['logining']}>
        <Spin tip="登录中..."></Spin>
      </div>
    )
  }
  
  return (
    <Route {...rest} render={(props) => {
      return (
        hasLogged ? (
          <Component {...props}></Component>
        ) : (
          <Redirect to={{
            pathname: '/Login',
            state: { from: props.location },
          }}></Redirect>
        )
      )
    }}></Route>
  )
}

const mapStateToProps = ({ app }) => {
  const { isLogining, hasLogged } = app
  return {
    isLogining,
    hasLogged,
  }
}

export default connect(mapStateToProps)(PrivateRoute)
