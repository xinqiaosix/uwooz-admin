import * as lineManagementApi from 'wisdom/api/lineManagement'

export default {
  namespace: 'wisdom_lineManagement',

  state: {
    lineList: [],
    lineListParam: {}
  },

  reducers: {
    saveLines(state, { payload }) {
      const { lineList, lineListParam } = payload
      return{
        ...state,
        lineList,
        lineListParam
      }
    },
  },

  effects: {
    *loadLines({ payload }, { call, put }) {
      const { scenicId = 1, page = 1, pageSize = 10 } = payload || {}
      const res = yield call(
        lineManagementApi.getLineList,
        { scenicId, page, pageSize }
      )
      const { data: { data: lineList, ...lineListParam } } = res
      yield put({
        type: 'saveLines',
        payload: { lineList, lineListParam }
      })
    },

    *additionalLines({ payload }, { call, put }) {
      yield call(lineManagementApi.additionalLines, payload)
      yield put({ type: 'loadLines' })
    },

    *deleteLines({ payload: id }, { call, put, select }) {
      yield call(lineManagementApi.deleteLines, id)
      const { page, pageSize } = yield select(state => {
        const { 'wisdom_lineManagement': { lineListParam }} = state
        const { page, pageSize, total } = lineListParam
        if((page - 1) * pageSize === total -1) {
          return{ page: page - 1, pageSize }
        }
        return { page, pageSize }
      })

      yield put({ type: 'loadLines', payload: { page, pageSize } })
    },

    *EditorialLines({ payload }, { call, put }) {
      yield call(lineManagementApi.EditorialLines, payload)
      yield put({ type: 'loadLines' })
    }
  },
  
}