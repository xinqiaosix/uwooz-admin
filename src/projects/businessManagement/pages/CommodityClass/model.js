import * as commodityClass from 'businessManagement/api/commodityClass'

export default {
  // 命名空间 对应 modal.type 字符串中 '/' 前的名字
  namespace: 'businessManagement_commodityClass',

  state: {
    classification: [], // 商品分类数据
    classificationParams: {}, // 商品分类 页码等数据
  },

  // 用来接收 action 处理数据更新
  reducers: {
    saveCommodityClass(state, { payload }) {
      const { classification, classificationParams } = payload

      return {
        ...state,
        classification,
        classificationParams,
      }
    },
  },

  // 处理异步操作
  effects: {
    // 商品分类
    *getCommodityClass({ payload }, { call, put, select }) {
      const accountId = yield select(state => state.app.user.accountId)

      const { page = 1, pageSize = 5, classificationName } = payload || {}

      const res = yield call(commodityClass.commodityClass, {
        page,
        pageSize,
        classificationName,
        accountId,
      })

      const {
        data: { data: classification, ...classificationParams },
      } = res

      yield put({
        type: 'saveCommodityClass',
        payload: { classification, classificationParams },
      })
    },
  },

  subscripttions: {},
}
