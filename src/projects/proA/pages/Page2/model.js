import { saga } from 'dva'

const { delay } = saga

const namespace = 'proA_page2'

const state = {
  name: 'page2',
  list: [],
}

const reducers = {
  changeName(state, { payload: name }) {
    return { ...state, name }
  },
}

const effects = {
  *test(action, { call, put }) {
    yield call(delay, 2000)
    yield put({
      type: 'changeName',
      payload: 'fhods'
    })
  },
}

const subscriptions = {}

export default {
  namespace,
  state,
  reducers,
  effects,
  subscriptions,
}
