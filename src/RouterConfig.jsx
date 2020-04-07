import React from 'react'
import { router } from 'dva'

import Login from '@/pages/Login'
import Test from '@/pages/Test'
import MainLayout from '@/layout/MainLayout'
// import proA from 'proA/router'
// import memberCenter from 'memberCenter/router'
import enterpriseAccounts from 'enterpriseAccounts/router'
import businessManagement from 'businessManagement/router'
// import wisdom from 'wisdom/router'

const { Router, Switch, Route } = router

const productMenus = [
  // {
  //   name: '智慧管理',
  //   projects: [
  //     // proA,
  //   ],
  // },
  // {
  //   name: '智慧服务',
  //   projects: [
  //     wisdom,
  //   ],
  // },
  {
    name: '智慧营销',
    projects: [
      // memberCenter,
      businessManagement,
    ],
  },
  // {
  //   name: '大数据',
  //   projects: [],
  // },
]

const businessMenu = [
  {
    name: '企业账户',
    projects: [enterpriseAccounts]
  } 
]

const RouterConfig = ({ history, app }) => {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/Test" component={Test}></Route>
        <Route path="/Login" component={Login}></Route>
        <Route path="/" render={() => {
          return <MainLayout app={app} productMenus={productMenus} businessMenu={businessMenu} ></MainLayout>
        }}></Route>
      </Switch>
    </Router>
  )
}

export default RouterConfig
