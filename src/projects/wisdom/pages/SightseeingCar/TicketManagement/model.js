import * as ticketManagementApi from 'wisdom/api/ticketManagement'

export default {
  namespace: 'wisdom_ticketManagement',
  state : {
    lineLists: [],             // 线路列表
    ticketList: [],            // 票务列表 
    ticketListParam: {},
    routeId: '',               // 线路id
    startStationId: '',        // 起始站点id
    endStationId: '',          // 终点站点id
  },

  reducers: {
    saveTickets(state, { payload }) {
      const { ticketList, ticketListParam } = payload
      return {
        ...state,
        ticketList,
        ticketListParam,
        addTicket: true
      }
    },

    saveLine(state, { payload }) {
      const { lineLists } = payload
      return {
        ...state,
        lineLists
      }
    },

    saveLineId(state, { payload }) {
      const { routeId, startStationId, endStationId } = payload
      return{
        ...state,
        routeId,
        startStationId,
        endStationId
      }
    }
  },

  effects: {
    // 获取线路
    *loadLine({ payload }, { call, put }) {
      const { scenicId = 1, page = 1, pageSize = 10 } = payload || {}
      const res = yield call(
        ticketManagementApi.getLineList,
        { scenicId, page, pageSize }
      )
      const { data: { data: lineLists } } = res
      yield put({
        type: 'saveLine',
        payload: { lineLists }
      })
    },

    // 获取票务列表
    *loadTickets({ payload }, { call, put }) {
      const { scenicId = 1, page = 1, pageSize = 10 } = payload || {}
      const res = yield call(
        ticketManagementApi.getTicketList,
        { scenicId, page, pageSize }
      )
      const { data: { data: ticketList, ...ticketListParam } } = res
      yield put({
        type: 'saveTickets',
        payload: { ticketList, ticketListParam }
      })
    },

    // 添加票务
    *addTicket({ payload }, { call, put }) {
     const res = yield call(ticketManagementApi.addTickets, payload)
     const { errorCode, message: errMsg } = res
     yield put({ type: 'loadTickets' })
     return { errorCode, errMsg }
    },

    // // 获取线路id,和起始站点id
    // *getLineMsg({payload}, { call, put }) {
    //   yield put ({
    //     type: 'saveLineId',
    //     payload
    //   })
    // },

    // 编辑票务
    *editTicket({ payload }, { call, put }) {
      yield call(ticketManagementApi.editTickets, payload)
      yield put ({ type:'loadTickets' })
    },

    // 删除票务
    *deleteTickets({ payload }, { call, put, select }) {
      yield call( ticketManagementApi.editTickets, payload )
      const { page, pageSize } = yield select(state => {
        const { 'wisdom_ticketManagement': { ticketListParam }} = state
        const { page, pageSize, total } = ticketListParam
        if((page - 1) * pageSize === total - 1) {
          return{ page: page - 1, pageSize }
        }
        return { page, pageSize }
      })

      yield put({ type: 'loadTickets', payload: { page, pageSize } })
    }
  },
  // subscriptions: {
  //   setup({ dispatch }) {
  //     dispatch({ type: 'loadLines' })
  //   },
  // },
}