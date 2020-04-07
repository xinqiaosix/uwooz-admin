import * as membershipList from 'memberCenter/api/membershipList'

export default {
  namespace: 'memberCenter_membershipList',

  state: {
    membershipLists: [],      // 会员列表
    membershipListParam: {},
    tagList: []             // 标签列表
  },

  reducers: {
    savleTagList(state, { payload: tagList }) {
      return {
        ...state,
        tagList
      }
    },

    savemembershipList(state, { payload }) {
      const { membershipLists, membershipListParam } = payload
      return {
        ...state,
        membershipLists,
        membershipListParam
      }
     },
  },

  effects: {
    // 标签列表
    *loadTagList(action, { call, put }) {
      const { data: tagList } = yield call(membershipList.tagListMock)
      yield put({
        type: 'savleTagList',
        payload: tagList
      })
    },

    // 会员列表
    *loadMembershipList({ payload }, { call, put }) {
      const { page = 1, pageSize = 10 } = payload || {}
      const res = yield call( membershipList.membershipListMock, { page, pageSize } )
      const { data: { data: membershipLists, ...membershipListParam } } = res
      yield put({
        type: 'savemembershipList',
        payload: { membershipLists, membershipListParam }
      })
    }
  }
}