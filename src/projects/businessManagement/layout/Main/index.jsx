import React from 'react'
import { router } from 'dva'
import { Layout } from 'antd'

import SiderMenu from '@/components/SiderMenu'
import ProMenuRoutes from '@/components/ProMenuRoutes'

import BusinessList from 'businessManagement/pages/BusinessList'
import Commodity from 'businessManagement/pages/Commodity'
import CommodityNewAndEdit from 'businessManagement/pages/Commodity/NewAndEdit'
import BusinessInformation from 'businessManagement/pages/BusinessList/BusinessInformation/index'
import NewBusiness from 'businessManagement/pages/BusinessList/NewBusiness/index'
import AllOrders from 'businessManagement/pages/TradingCenter/AllOrders/index'
import OrderDetail from 'businessManagement/pages/TradingCenter/AllOrders/OrderDetail/index'
import Logistics from 'businessManagement/pages/LogisticsManagement'
import NewFreight from 'businessManagement/pages/LogisticsManagement/NewFireight/index'
import RefundManagement from 'businessManagement/pages/TradingCenter/RefundManagement/index'
import CommodityClass from 'businessManagement/pages/CommodityClass/index'
// import CardCountingStatistics from 'businessManagement/pages/CardCountingStatistics/index'

import { name as proName } from 'businessManagement/router'

const { Switch, Redirect, Route } = router
const { Content } = Layout

const siderMenus = [
  {
    name: '商家列表',
    path: '/Business',
    component: BusinessList,
  },
  {
    name: '商品列表',
    path: '/Commodity',
    component: Commodity,
  }, 
  {
    name: '交易中心',
    children: [
      {
        name: '全部订单',
        path: '/Orders',
        component: AllOrders
      },
      {
        name: '退款管理',
        path: '/refund',
        component: RefundManagement
      }
    ]
  }, 
  {
    name: '物流管理',
    path: '/Logistics',
    component: Logistics
  },
  {
    name: '商品分类',
    path: '/CommodityClass',
    component: CommodityClass
  },
  // {
  //   name: '卡券统计',
  //   path: '/CardTicket',
  //   component: CardCountingStatistics
  // },
]

const renderRoutes = (match) => {
  // proPath 表示 project 所对应的一级路由
  const { path: proPath } = match

  return (
    <Switch>
      <Redirect exact from={proPath} to={`${proPath}${siderMenus[0].path}`}></Redirect>
      <Route path = { `${proPath}/Business/info/:id` } component = { BusinessInformation }></Route>
      <Route path = { `${proPath}/Business/:type/:id` } component = { NewBusiness }></Route>
      <Route path = { `${proPath}/Business/:type/` } component = { NewBusiness }></Route>
      <Route path = { `${proPath}/Orders/detail/:id` } component = { OrderDetail }></Route>
      <Route path = { `${proPath}/Commodity/:type/:goodsNumber` } component = { CommodityNewAndEdit }></Route>
      <Route path = { `${proPath}/Commodity/:type` } component={CommodityNewAndEdit}></Route>
      <Route path = { `${proPath}/Logistics/:type/:id` } component = { NewFreight }></Route>
      <Route path = { `${proPath}/Logistics/:type` } component = { NewFreight }></Route>
      <Route path = { `${proPath}/CommodityClass/:type` } component = { CommodityClass }></Route>
      {/* <Route path = { `${proPath}/CardTicket/:type` } component = { CardCountingStatistics }></Route> */}
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
