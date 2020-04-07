import * as sightseeingApi from 'proA/api/sightseeing'

const timeout = (delay) => new Promise(resolve => {
  setTimeout(resolve, delay)
})

export default {
  namespace: 'proA_sightseeing',

  state: {
    sightseeingCars: [],
    sightseeingCarsParam: {},
    manages: [],
  },

  reducers: {
    saveManages(state, { payload: manages }) {
      return { ...state, manages }
    },
    
    saveSightseeingCars(state, { payload }) {
      const { sightseeingCars, sightseeingCarsParam } = payload
      return {
        ...state,
        sightseeingCars,
        sightseeingCarsParam,
      }
    },
  },

  effects: {
    *test(action, { call }) {
      yield call(timeout, 2000)
    },
    
    *loadManages(action, { call, put }) {
      const { data: manages } = yield call(sightseeingApi.getManages)
      yield put({ type: 'saveManages', payload: manages })
    },

    *loadSightseeingCars({ payload }, { call, put }) {
      const { scenicId = 1, page = 1, pageSize = 3 } = payload || {}
      const res = yield call(
        sightseeingApi.getSightseeingCars,
        { scenicId, page, pageSize },
      )
      const { data: { data: sightseeingCars, ...sightseeingCarsParam } } = res
      yield put({
        type: 'saveSightseeingCars',
        payload: { sightseeingCars, sightseeingCarsParam }
      })
    },

    *createSightseeingCar({ payload }, { call, put }) {
      yield call(sightseeingApi.createCar, payload)
      yield put({ type: 'loadSightseeingCars' })
    },

    *deleteSightseeingCar({ payload: id }, { call, put, select }) {
      yield call(sightseeingApi.deleteCar, id)

      const { page, pageSize } = yield select(state => {
        const { proA_sightseeing: { sightseeingCarsParam } } = state
        const { page, pageSize, total } = sightseeingCarsParam
        if ((page - 1) * pageSize === total - 1) {
          return { page: page - 1, pageSize }
        }
        return { page, pageSize }
      })

      yield put({
        type: 'loadSightseeingCars',
        payload: { page, pageSize },
      })
    }
  },

  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'loadManages' })
    },
  },
}
