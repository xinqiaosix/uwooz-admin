import * as refund from 'businessManagement/api/refund'

export default {
  namespace: 'businessManagement_refund',

  state : {
    refundList: [],      // 退款记录列表
    refundListParam: {},
    refundReson: []      // 拒绝退款理由列表
  },

  reducers: {
    saveRefundList(state, { payload }) {
      const { refundList, refundListParam } = payload
      return {
        ...state,
        refundList,
        refundListParam
      }
    },

    saveRefundReson(state, { payload }) {
      const { refundReson } = payload
      return {
        ...state,
        refundReson
      }
    }
  },
  effects: {
    *loadRefundList({ payload }, { call, put }) {
      // const { page = 1, pageSize = 10 } = payload || {}
      const res = yield call(
        refund.getRefunList,
        payload
      )
      const { data: { data: refundList, ...refundListParam } } = res
      yield put({
        type: 'saveRefundList',
        payload: { refundList, refundListParam }
      })
    },

    // 获取拒绝退款理由
    *loadRefunReson({ payload }, { call, put }) {
      const res = yield call (refund.refundReson)
      const { data: refundReson } = res
      yield put ({
        type: 'saveRefundReson',
        payload: { refundReson }
      })
    }
  },

  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'loadRefunReson' })
    }
  }
}