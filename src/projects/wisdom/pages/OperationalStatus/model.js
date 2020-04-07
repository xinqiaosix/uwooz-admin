import {
  getsalesVolumeList
} from 'wisdom/api/operationalStatus'

const namespace = 'wisdom_operationalStatus';

// 初始数据
const state = {
  salesVolumeList: [],
  typeList: [],
  targetList: []
}

// 页面逻辑
const reducers = {
  setSalesVolumeList(state, { payload: salesVolumeList }) {
    return { ...state, salesVolumeList}
  },
  setTypeList(state, { payload: typeList }) {
    return { ...state, typeList}
  },
  setTargetList(state, { payload: targetList }) {
    return { ...state, targetList}
  },
}

// 指令
const effects = {
  *getsalesVolumeList(action, { call, put }) {
    let list = yield call(getsalesVolumeList)
    yield put({
      type: 'setSalesVolumeList',
      payload: list
    })
  }
}

const subscriptions = {}

export default {
  namespace,
  state,
  reducers,
  effects,
  subscriptions,
}