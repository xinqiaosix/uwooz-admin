import * as busOperate from 'wisdom/api/sightseeingBus';

export default {

  // 命名空间 对应 modal.type 字符串中 '/' 前的名字
  namespace: 'wisdom_bus',

  state: {
    busList: [],       // 观光车数据列表
    busParam: {},      // 观光车列表之外的参数 => 页码 数量等
    adminDataList: [], // 管理人员数据
    headerData: {},    // 观光车详情头部数据
    commuteRecordData: [],   // 上下班记录的数据
    commuteRecordParams: {}, // 上下班记录之外的参数
    repairData: [],     // 维修记录数据  
    repairParams: {},   // 维修记录数据之外的参数
  },

  // reducers 用来接收 action 并处理数据更新 同步操作
  reducers: {

    // 加载 观光车 保存数据
    savesinghtseeingBus(state, { payload }) {
      const { busList, busParam } = payload;

      return {
        ...state,
        busList,
        busParam,
      }
    },

    // 保存 管理人员数据
    saveAdminData(state, { payload }) {
      const { adminDataList } = payload;

      return {
        ...state,
        adminDataList,
      }
    },

    // 观光车详情头部数据
    saveVehicleDetails(state, { payload }) {
      const { headerData } = payload;

      return {
        ...state,
        headerData
      }
    },

    // 上下班记录的数据
    saveCommuteRecord(state, { payload }) {
      const { commuteRecordData, commuteRecordParams } = payload;

      return {
        ...state,
        commuteRecordData, 
        commuteRecordParams
      }
    },

     // 重置维修记录
     loadRoyaltyFormData(state, { payload }) {
      let { repairData, repairParams } = payload;
      repairData = [];
      repairParams = {};

      return {
        ...state,
        repairData, 
        repairParams
      }
    },

    // 维修记录数据
    saveRoyaltyFormData(state, { payload }) {
      const { repairParams } = payload;
      let repairData = state.repairData.concat(payload.repairData);

      return {
        ...state,
        repairData, 
        repairParams
      }
    },

  },

  // 用于处理异步操作
  effects: {

    // 加载司机列表
    *loadsightseeingBusList({ payload }, { call, put }) {
      const { scenicId = 1, sourceId = 2, page = 1, pageSize = 10 } = payload || {};

      // call 调用执行函数 => 调用 singhtseeingBus 里面 加载观光车列表的方法
      const res = yield call(
        busOperate.getSightseeingBus,
        { sourceId, scenicId, page, pageSize }
      )

      const { data: { data: busList, ...busParam } } = res;

      // 加载列表 保存数据
      yield put({
        type: 'savesinghtseeingBus',
        payload: { busList, busParam }
      })
    },

    // 观光车 管理人员
    *getAdminData({ payload }, { call, put }) {
      const res = yield call( busOperate.adminData, payload );
      const { data: adminDataList } = res;

      yield put({
        type: 'saveAdminData',
        payload: { adminDataList }
      })
    },

    // 添加观光车
    *newSightseeingBus({payload}, { call, put }) {
      const res = yield call( busOperate.newSightseeingBus,payload );
      const { errorCode, message: msg } = res;

      yield put({
        type: 'loadsightseeingBusList'
      })
      return{ errorCode, msg }
    },

    // 删除观光车
    *deleteSightseeingBus({ payload: id }, { call, put, select }) {
      const res = yield call( busOperate.deleteSightseeingBus, id );
      const { errorCode, message: msg } = res;

      // 当前页面只有一条数据时,删除后跳到前一页
      const { page, pageSize } = yield select(state => {
        const { wisdom_bus: { busParam } } = state;
        const { page, pageSize, total } = busParam;

        if ( (page - 1) * pageSize === total - 1 ) {
          return { page: page -1, pageSize }
        };

        return { page, pageSize };
      });

      yield put({
        type: 'loadsightseeingBusList',
        payload: { page, pageSize }
      });

      return { errorCode, msg }
    },

    // 报修功能
    *handleRepair({ payload }, { call, put }) {
      const { equipId } = payload;
      const res = yield call( busOperate.handleRepair, payload );
      const { errorCode, message } = res;
      yield put({
        type: 'getRoyaltyFormData',
        payload: { equipId }
      });

      return { errorCode, message };
    },

    // 观光车详情头部数据
    *getVehicleDetails ({ payload: id }, { call, put }) {
      const res = yield call( busOperate.vehicleDetails, id );
      const { data: headerData  } = res;

      yield put({
        type: 'saveVehicleDetails',
        payload: { headerData }
      })
    },

    // 编辑观光车头部数据
    *uploadVehicleDetails({ payload }, { call, put }) {
      const { id } = payload;
      const res = yield call( busOperate.uploadVehicleDetails, payload );
      const { errorCode, message } = res;
      yield put({
        type: 'getVehicleDetails',
        payload: id
      });

      return { errorCode, message };
    },

    // 上下班记录数据
    *getCommuteRecord({ payload }, { call, put }) {
      // const {sourceId = 2, page = 1, pageSize = 5 } = payload || {};
      // const res = yield call( 
      //   busOperate.commuteRecord, 
      //   { sourceId, page, pageSize } 
      // );
      const res = yield call( 
        busOperate.commuteRecord, payload 
      );
      const { data: { data: commuteRecordData, ...commuteRecordParams} } = res;

      yield put({
        type: 'saveCommuteRecord',
        payload: { commuteRecordData, commuteRecordParams }
      })
    },

    // 维修记录数据
    *getRoyaltyFormData({ payload }, { call, put }) {
      const res = yield call(busOperate.royaltyFormData, payload)
      const { data: { data: repairData, ...repairParams } } = res;

      yield put({
        type: 'saveRoyaltyFormData',
        payload: { repairData, repairParams }
      });
    },

    // 重置报修与维修记录
    *restRoyaltyFormData({ payload }, { call, put }) {
      const res = yield call(busOperate.royaltyFormData, payload)
      const { data: { data: repairData, ...repairParams } } = res;

      yield put({
        type: 'loadRoyaltyFormData',
        payload: { repairData, repairParams }
      });
    }

  },

  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'loadsightseeingBusList' })
    }
  }

}