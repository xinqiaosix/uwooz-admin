import * as cardTicket from 'businessManagement/api/cardTicket';

export default {
  // 命名空间 对应 modal.type 字符串中 '/' 前的名字
  namespace: 'businessManagement_cardTicket',

  state: {
    creadData: [], // 卡券数据
    creadParams: {} // 卡券 页码数据
  },

  // reducers 用来接收 action 处理数据更新 同步操作
  reducers: {

    saveCreadList(sate, { payload }) {
      const { creadData, creadParams } = payload;

      return {
        ...sate,
        creadData, 
        creadParams
      }
    }
  },

  // 处理异步操作
  effects: {
    *getCreadList({payload}, { call, put }) {
      const { page = 1, pageSize = 5 } = payload || {};
      const res = yield call( 
        cardTicket.getCreadList, 
        { page, pageSize } 
      );
      const { data: {data: creadData, ...creadParams  }} = res;

      yield put({
        type: 'saveCreadList',
        payload: { creadData, creadParams }
      })
    },
  },

  subscriptions: {

  }
}
// saleTask.html saleTask_list.html saleTask_byStatus.html