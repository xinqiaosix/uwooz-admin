// 该 name 变量指的是单独的 project 的名称，需要在头部 `产品` 列表中显示使用，在左侧菜单栏的顶部也需要使用到。所以这里我们先声明该变量，并且导出，在使用左侧菜单栏引入并使用
export const name = '智慧景交'

const router = {
  name,
  path: '/wisdom',
  models: () => [
    import(/* webpackChunkName: 'wisdom_operationalStatusModel' */ 'wisdom/pages/OperationalStatus/model'),
    import(/* webpackChunkName: 'wisdom_lineManagementModel' */ 'wisdom/pages/SightseeingCar/LineManagement/model'),
    import(/* webpackChunkName: 'wisdom_lineManagementModel' */ 'wisdom/pages/SightseeingCar/TicketManagement/model'),
    import(/* webpackChunkName: 'wisdom_DriverListModel' */ 'wisdom/pages/SightseeingCar/DriverList/model'),
    import(/* webpackChunkName: 'wisdom_SightseeingBusListModel' */ 'wisdom/pages/SightseeingCar/SightseeingBusList/model'),
  ],
  component: () => import(/* webpackChunkName: 'wisdom' */ 'wisdom/layout/Prolayout'),
}

export default router
