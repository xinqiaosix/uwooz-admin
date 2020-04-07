export const name = '商家管理'
const router = {
  name,
  path: '/businessManagement',
  models: () =>[
    import(/* webpackChunkName: 'businessManagement_businessListModel' */ 'businessManagement/pages/BusinessList/model'),
    import(/* webpackChunkName: 'businessManagement_businessListModel' */ 'businessManagement/pages/Commodity/model'),
    import(/* webpackChunkName: 'businessManagement_refundModel' */ 'businessManagement/pages/TradingCenter/RefundManagement/model'),
    import(/* webpackChunkName: 'businessManagement_IogisticsManagement' */ 'businessManagement/pages/LogisticsManagement/model'),
    import(/* webpackChunkName: 'businessManagement_orderListModel' */ 'businessManagement/pages/TradingCenter/AllOrders/model'),
    import(/* webpackChunkName: 'businessManagement_CommodityClass' */ 'businessManagement/pages/CommodityClass/model'),
    import(/* webpackChunkName: 'businessManagement_CardCountingStatistics' */ 'businessManagement/pages/CardCountingStatistics/model'),
  ],
  component: () => import( /* webpackChunkName: 'businessManagement' */ 'businessManagement/layout/Main'),
}

export default router
