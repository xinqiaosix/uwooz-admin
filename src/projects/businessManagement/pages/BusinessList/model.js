import * as businessList from 'businessManagement/api/businessList'

export default {
  namespace: 'businessManagement_businessList',

  state: {
    businessLists: [], // 商家列表
    businessListParam: {},
    businessType: [], // 商家经营类型
    businessInfo: {}, // 商家信息
  },

  reducers: {
    saveBusinessList(state, { payload }) {
      const { businessLists, businessListParam } = payload
      return {
        ...state,
        businessLists,
        businessListParam,
      }
    },

    savebusinessType(state, { payload: businessType }) {
      return { ...state, businessType }
    },

    // 商家信息
    saveBusinessInfo(state, { payload }) {
      const { businessInfo } = payload
      return {
        ...state,
        businessInfo,
      }
    },
  },

  effects: {
    // 商家类型
    *loadBusinessType(action, { call, put }) {
      const { data: businessType } = yield call(businessList.getBusinessType)
      yield put({ type: 'savebusinessType', payload: businessType })
    },

    // 商家列表
    *loadBusinessList({ payload }, { call, put, select }) {
      const accountId = yield select(state => state.app.user.accountId)
      // const { page = 1, pageSize = 10, merchantName, id } = payload || {}
      const res = yield call(businessList.getBusinessist, {
        ...payload,
        accountId,
      })
      const {
        data: { data: businessLists, ...businessListParam },
      } = res
      yield put({
        type: 'saveBusinessList',
        payload: { businessLists, businessListParam },
      })
    },

    // 新建商家
    *newBusiness({ payload }, { call, put, select }) {
      const accountId = yield select(state => state.app.user.accountId)
      const res = yield call(businessList.newBusiness, {
        ...payload,
        accountId,
      })
      const { errorCode, message: errMsg } = res
      if (errorCode === 200) {
        yield put({ type: 'loadBusinessList' })
      }
      return { errorCode, errMsg }
    },

    // 搜索商家
    *searchBusiness({ payload }, { call, put }) {
      const res = yield call(businessList.getBusinessist, payload)
      const {
        data: { data: businessLists, ...businessListParam },
      } = res
      yield put({
        type: 'saveBusinessList',
        payload: { businessLists, businessListParam },
      })
    },

    // 获取单个商家信息
    *getOneBusinessInfo({ payload: id }, { call, put }) {
      const res = yield call(businessList.getOneBusinessInfo, id)
      const { data: businessInfo } = res
      yield put({
        type: 'saveBusinessInfo',
        payload: { businessInfo },
      })
    },

    // 修改单个商家信息
    *editBusiness({ payload }, { call, put }) {
      const res = yield call(businessList.editBusiness, payload)
      const { errorCode, message: errMsg } = res
      if (errorCode === 200) {
        const { id } = payload
        yield put({ type: 'getOneBusinessInfo', payload: id })
      }
      return { errorCode, errMsg }
    },

    // 修改单个商家的位置坐标
    *modifyLocation({ payload }, { call, put }) {
      yield call(businessList.modifyLocation, payload)
      const { id } = payload
      yield put({ type: 'getOneBusinessInfo', payload: id })
    },

    // 修改单个商家的账号密码
    *changePassword({ payload }, { call, put }) {
      yield call(businessList.changePassword, payload)
      const { id } = payload
      yield put({
        type: 'getOneBusinessInfo',
        payload: id,
      })
    },

    // 删除商家
    *deleteBusiness({ payload: id }, { call, put, select }) {
      yield call(businessList.deleteBusiness, id)
      const { page, pageSize } = yield select(state => {
        const {
          businessManagement_businessList: { businessListParam },
        } = state
        const { page, pageSize, total } = businessListParam
        if ((page - 1) * pageSize === total - 1) {
          return { page: page - 1, pageSize }
        }
        return { page, pageSize }
      })

      yield put({ type: 'loadBusinessList', payload: { page, pageSize } })
    },
  },

  // subscriptions: {
  //   setup({ dispatch }) {
  //     dispatch({ type: 'loadBusinessType' })
  //   }
  // }
}
