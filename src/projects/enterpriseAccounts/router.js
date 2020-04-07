export const name = '企业账户'

const router = {
  name,
  path: '/enterpriseAccounts',
  models: () => [
    import(/* webpackChunkName: 'enterpriseAccounts_EnterpriseInformationModel' */ 'enterpriseAccounts/pages/EnterpriseInformation/model'),
    import(/* webpackChunkName: 'enterpriseAccounts_ScenicSpotProjectModel' */ 'enterpriseAccounts/pages/ScenicSpotProject/model'),
  ],
  component: () => import( /* webpackChunkName: 'enterpriseAccounts' */ 'enterpriseAccounts/layout/Main'),
}

export default router