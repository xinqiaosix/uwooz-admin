import React from 'react'
import { router } from 'dva'
import { Layout } from 'antd'

import SiderMenu from '@/components/SiderMenu'
import ProMenuRoutes from '@/components/ProMenuRoutes'

import MembershipList from 'memberCenter/pages/MembershipList'

import { name as proName } from 'memberCenter/router'

const { Switch, Redirect } = router
const { Content } = Layout

const siderMenus = [
  {
    name: '会员列表',
    path: '/Membership',
    component: MembershipList,
  }
]

const renderRoutes = (match) => {
 // proPath 表示 project 所对应的一级路由
 const { path: proPath } = match

  return (
    <Switch>
      <Redirect exact from={proPath} to={`${proPath}${siderMenus[0].path}`}></Redirect>
      <ProMenuRoutes siderMenus={siderMenus} proPath={proPath}></ProMenuRoutes>
    </Switch>
  )
}

const Main = ({ match }) => {
  return (
    <Layout>
      <SiderMenu name={proName} menus={siderMenus}></SiderMenu>
      <Content style={{ padding: '24px' }}>
        {renderRoutes(match)}
      </Content>
    </Layout>
  )
}

export default Main
