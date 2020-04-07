import * as itemOperate from 'enterpriseAccounts/api/scenicSpot'

export default {
  // 命名空间 对应 modal.type 字符串中能够 '/' 前的名字
  namespace: 'enterpriseAccounts_item',

  state: {
    scenicSpotList: [], // 景区列表
    scenicSpotParam: {}, // 景区列表 页码 数量等
    searchScenicSpotData: [], // 搜索景区数据
  },

  // reducers 用来接收 action 并处理数据更新 同步操作
  reducers: {
    saveScenicSpotList(state, { payload }) {
      const { scenicSpotList, scenicSpotParam } = payload

      return {
        ...state,
        scenicSpotList,
        scenicSpotParam,
      }
    },

    // 搜索景区数据
    saveScenicSpot(state, { payload }) {
      const { searchScenicSpotData } = payload
      return {
        ...state,
        searchScenicSpotData,
      }
    },
  },

  // 用于处理异步操作
  effects: {
    // 景区项目列表
    *loadScenicSpotList({ payload }, { call, put, select }) {
      const accountId = yield select(state => state.app.user.accountId)

      const res = yield call(itemOperate.scenicSpotListMock, {
        ...payload,
        accountId,
      })

      const { data: scenicSpotList, ...scenicSpotParam } = res

      // 加载列表 保存数据
      yield put({
        type: 'saveScenicSpotList',
        payload: { scenicSpotList, scenicSpotParam },
      })
    },

    // 新增景区
    *newScenicSpotList({ payload }, { call, put }) {
      const { accountId } = payload

      yield call(itemOperate.newScenicSpotList, payload)
      yield put({
        type: 'loadScenicSpotList',
        payload: accountId,
      })
    },

    // 启用景区
    *openScenicSpotList({ payload }, { call, put }) {
      const { accountId } = payload
      yield call(itemOperate.openScenicSpotList, payload)
      yield put({
        type: 'loadScenicSpotList',
        payload: accountId,
      })
    },

    // 编辑景区
    *uploadScenicSpot({ payload }, { call, put }) {
      const { accountId } = payload
      yield call(itemOperate.editScenicSpot, payload)
      yield put({
        type: 'loadScenicSpotList',
        payload: accountId,
      })
    },

    // 搜索景区
    *getScenicSpotList({ payload }, { call, put }) {
      const res = yield call(itemOperate.scenicSpotListMock, payload)

      const { data: searchScenicSpotData } = res

      // 加载列表 保存数据
      yield put({
        type: 'saveScenicSpot',
        payload: { searchScenicSpotData },
      })
    },
  },

  // subscriptions: {
  //   setup({ dispatch }) {
  //     dispatch({ type: 'loadScenicSpotList' })
  //   }
  // }
}
