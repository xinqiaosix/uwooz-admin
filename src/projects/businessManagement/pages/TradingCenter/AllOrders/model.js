import * as allOrders from 'businessManagement/api/orderList'

export default {
  namespace: 'businessManagement_allorders',

  state: {
    orderList: [],
    orderListParam: {},
    orderType: [], // 订单类型
    deliveryType: [], // 配送方式
    orderSources: [], // 订单来源
    orderDetail: {}, // 订单详情
    orderState: [], // 订单状态
    merchantInfo: {}, // 商户信息
  },

  reducers: {
    saveOrderList(state, { payload }) {
      const { orderList, orderListParam } = payload
      return {
        ...state,
        orderList,
        orderListParam,
      }
    },

    saveOrderType(state, { payload }) {
      const { orderType } = payload
      return {
        ...state,
        orderType,
      }
    },

    saveDeliveryType(state, { payload }) {
      const { deliveryType } = payload
      return {
        ...state,
        deliveryType,
      }
    },

    saveOrderSources(state, { payload }) {
      const { orderSources } = payload
      return {
        ...state,
        orderSources,
      }
    },

    saveOrderState(state, { payload }) {
      const { orderState } = payload
      return {
        ...state,
        orderState,
      }
    },

    saveOrderDetail(state, { payload }) {
      const { orderDetail } = payload
      return {
        ...state,
        orderDetail,
      }
    },

    saveMerchantInfo(state, { payload }) {
      const { merchantInfo } = payload
      return {
        ...state,
        merchantInfo,
      }
    },
  },

  effects: {
    // 订单列表
    *loadOrder({ payload }, { call, put, select }) {
      const accountId = yield select(state => state.app.user.accountId)

      //const { page = 1, pageSize = 10, dStart, dEnd } = payload || {}
      const res = yield call(allOrders.getOrderList, { ...payload, accountId })

      const {
        data: { data: orderList, ...orderListParam },
      } = res
      yield put({
        type: 'saveOrderList',
        payload: { orderList, orderListParam },
      })
    },

    // 订单类型
    *loadOrderType({ payload }, { call, put }) {
      const { data: orderType } = yield call(allOrders.getOrderTypes)
      yield put({
        type: 'saveOrderType',
        payload: { orderType },
      })
    },

    // 配送方式
    *loadDeliveryType(state, { call, put }) {
      const { data: deliveryType } = yield call(allOrders.getOrderDistribution)
      yield put({
        type: 'saveDeliveryType',
        payload: { deliveryType },
      })
    },

    // 订单来源
    *loadOrderSources({ payload }, { call, put }) {
      const { data: orderSources } = yield call(allOrders.getOrderSources)
      yield put({
        type: 'saveOrderSources',
        payload: { orderSources },
      })
    },

    // 订单状态
    *loadOrderState({ payload }, { call, put }) {
      const { data: orderState } = yield call(allOrders.getOrderState)
      yield put({
        type: 'saveOrderState',
        payload: { orderState },
      })
    },

    // 获取订单详情
    *getOrderDetails({ payload: id }, { call, put }) {
      const res = yield call(allOrders.getOrderDetail, id)
      const { data: orderDetail } = res
      yield put({
        type: 'saveOrderDetail',
        payload: { orderDetail },
      })
    },

    // 修改价格
    *modifyPrice({ payload }, { call, put }) {
      yield call(allOrders.modifyPrice, payload)
      const { id } = payload
      yield put({
        type: 'getOrderDetails',
        payload: id,
      })
    },

    // 修改卖家备注
    *ModifySellerNotes({ payload }, { call, put }) {
      yield call(allOrders.ModifySellerNotes, payload)
      const { id } = payload
      yield put({
        type: 'getOrderDetails',
        payload: id,
      })
    },

    // 发货
    *Delivergoods({ payload }, { call, put }) {
      yield call(allOrders.Delivergoods, payload)
      // const { orderCoreId  } = payload
      // const id = orderCoreId
      // yield put({
      //   type:'getOrderDetails',
      //   payload: id
      // })
    },

    // 申请退款
    *applyRefund({ payload }, { call }) {
      const res = yield call(allOrders.applyRefund, payload)
      const { errorCode } = res
      return { errorCode }
    },

    // 获取商户信息
    *getMerchantInfo({ payload: merchantId }, { call, put }) {
      const res = yield call(allOrders.getMerchant, merchantId)
      const { data: merchantInfo } = res
      yield put({
        type: 'saveMerchantInfo',
        payload: { merchantInfo },
      })
    },
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'loadOrderType' })
      dispatch({ type: 'loadDeliveryType' })
      dispatch({ type: 'loadOrderSources' })
      dispatch({ type: 'loadOrderState' })
    },
  },
}
