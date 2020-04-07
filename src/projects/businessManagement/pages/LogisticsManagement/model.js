import * as logisticsOperate from 'businessManagement/api/logisticsOperate'

export default {
  // 命名空间 对应 modal.type 字符串中 '/' 前的名字
  namespace: 'businessManagement_logistics',

  state: {
    addressData: [], // 地址库列表
    addressParam: {}, // 地址库列表 页码 数量等
    moduleData: [], // 运费模板 列表
    moduleDataParams: {}, // 运费模板 列表 页码数量等
    storeData: [], // 商家列表
    oneModuleData: [], // 单个模板的具体详情 信息
    oneModuleDataParams: {}, // 单个模板的 id 名称 等信息
  },

  // reducers 用来接收 action 处理数据更新 同步操作
  reducers: {
    // 地址库列表
    saveAddress(state, { payload }) {
      const { addressData, addressParam } = payload

      return {
        ...state,
        addressData,
        addressParam,
      }
    },

    // 运费模板
    seveModuleList(state, { payload }) {
      const { moduleData, moduleDataParams } = payload

      return {
        ...state,
        moduleData,
        moduleDataParams,
      }
    },

    // 商家列表
    saveStoreList(state, { payload }) {
      const { storeData } = payload

      return {
        ...state,
        storeData,
      }
    },

    // 单个运费模板
    seveOneModuleList(state, { payload }) {
      const { oneModuleData, oneModuleDataParams } = payload

      return {
        ...state,
        oneModuleData,
        oneModuleDataParams,
      }
    },
  },

  // 处理异步操作
  effects: {
    // 加载地址库
    *loadAddressList({ payload }, { call, put, select }) {
      const { page = 1, pageSize = 20, merchantId } = payload || {}
      const accountId = yield select(state => state.app.user.accountId)
      const res = yield call(logisticsOperate.getAddressList, {
        accountId,
        page,
        pageSize,
        merchantId,
      })

      const {
        data: { data: addressData, ...addressParam },
      } = res

      // 加载列表 保存数据
      yield put({
        type: 'saveAddress',
        payload: { addressData, addressParam },
      })
    },

    // 加载 商家列表
    *loadStoreList({ payload }, { call, put }) {
      const { page = 1, pageSize = 10 } = payload || {}
      const res = yield call(logisticsOperate.getStoreList, { page, pageSize })
      const {
        data: { data: storeData },
      } = res

      // 加载列表 保持数据
      yield put({
        type: 'saveStoreList',
        payload: { storeData },
      })
    },

    // 搜索商家
    *getQueryMerchant({ payload }, { call, put }) {
      const res = yield call(logisticsOperate.getAddressList, payload)
      const {
        data: { data: addressData, ...addressParam },
      } = res

      // 加载列表 保存数据
      yield put({
        type: 'saveAddress',
        payload: { addressData, addressParam },
      })
    },

    // 加载运费模板 列表
    *loadModuleList({ payload }, { call, put, select }) {
      const accountId = yield select(state => state.app.user.accountId)
      const res = yield call(logisticsOperate.getModuleList, {
        ...payload,
        accountId,
      })
      const {
        data: { data: moduleData, ...moduleDataParams },
      } = res

      // 加载列表 保存数据
      yield put({
        type: 'seveModuleList',
        payload: { moduleData, moduleDataParams },
      })
    },

    // 单个运费模板
    *getOneMouleList({ payload: id }, { put, call }) {
      const res = yield call(logisticsOperate.oneMouleInfo, id)
      const {
        data: { distributions: oneModuleData, ...oneModuleDataParams },
      } = res
      yield put({
        type: 'seveOneModuleList',
        payload: { oneModuleData, oneModuleDataParams },
      })
    },
  },

  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'loadAddressList' })
    },
  },
}
