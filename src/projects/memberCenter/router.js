export const name = '会员中心'

const router = {
  name,
  path: '/memberCentre',
  models: () => [
    import(/* webpackChunkName: 'membercenter_membershipListModel' */ 'memberCenter/pages/MembershipList/model'),
  ],
  component: () => import( /* webpackChunkName: 'memberCentre' */ 'memberCenter/layout/Main'),
}

export default router