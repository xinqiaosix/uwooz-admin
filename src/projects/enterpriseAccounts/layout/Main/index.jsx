import React from 'react'
import { router } from 'dva'
import { Layout } from 'antd'

import SiderMenu from '@/components/SiderMenu'

import Enterprise from 'enterpriseAccounts/pages/EnterpriseInformation'
import ScenicSpot from 'enterpriseAccounts/pages/ScenicSpotProject'


const { Switch, Route, Redirect } = router
const { Content } = Layout

const siderMenus = [
  {
    name: '企业信息',
    path: '/Enterprise',
    component: Enterprise,
  },
  {
    name: '景区项目',
    path: '/ScenicSpot',
    component: ScenicSpot,
  },
]

const renderRoutes = (match) => {
  const { path: projPath } = match

  return (
    <Switch>
      <Redirect exact from="/enterpriseAccounts" to={`${projPath}${siderMenus[0].path}`}></Redirect>
      {siderMenus.map(({ path, component }, index) => {
        return (
          <Route key={index} path={`${projPath}${path}`} component={component}></Route>
        )
      })}
    </Switch>
  )
}

const Main = ({ match }) => {
  return (
    <Layout>
      <SiderMenu menus={siderMenus}></SiderMenu>
      <Content>
        {renderRoutes(match)}
      </Content>
    </Layout>
  )
}

export default Main
