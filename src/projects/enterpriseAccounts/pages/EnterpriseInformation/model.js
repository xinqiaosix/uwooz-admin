import * as enterpriseOperate from 'enterpriseAccounts/api/enterprise';
export default {

  // 命名空间 对应 modal.type 字符串中能够 '/' 前的名字
  namespace: 'enterpriseAccounts_info',

  state: {
    enterpriseData: [], // 企业信息
    manage: [],
  },

  // reducers 用来接收 action 并处理数据更新 同步操作
  reducers: {
    
    saveEnterpriseInfo(state, { payload }) {
      const { enterpriseData } = payload;

      return {
        ...state,
        enterpriseData
      }
    },

  },

  // 用于处理异步操作
  effects: {

    // 企业信息 
    *loadEnterpriseInfo({payload:id}, {call, put}){
      const res = yield call( enterpriseOperate.enterprise, id );
      const { data: enterpriseData } = res;

      // 加载列表 保存数据
      yield put({
        type: 'saveEnterpriseInfo',
        payload: { enterpriseData }
      })
    },
    
    // 编辑企业信息
    *uploadEnterprise({ payload }, { call, put }){
      const { id } = payload;
      yield call( enterpriseOperate.uploadEnterprise, payload );
      yield put({
        type: 'loadEnterpriseInfo',
        payload: id,
      })
    },

  },

  // subscriptions: {
  //   setup({ dispatch }) {
  //     dispatch({ type: 'loadEnterpriseInfo' })
  //   }
  // }
}