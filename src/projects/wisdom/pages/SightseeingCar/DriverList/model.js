import * as driverOperate from 'wisdom/api/driver';

export default {

  // 命名空间 对应modal.type 字符串中的 '/' 前的名字
  namespace: 'wisdom_driver',

  state: {
    driverList: [],     // 司机数据列表
    driverParam: {},    // 司机数据列表之外的参数 => 页码 总量等
    lineData: [],       // 线路列表
    lineParam: {},      // 线路列表之外的参数 => 页码 数量等
    driverHead: [],     // 司机详情 头部信息
    commuteRecord: [],  // 上下班记录列表
    commuteRecordParam: {}, // 上下班记录 => 页码 数量等
    royaltyFormData: {},    // 司机提成列表
    royaltyFormParam: {},   // 司机提成 相关的参数 => 页码 数量等
  },

  // reducers 用来接收 action 并且处理数据更新 同步操作
  reducers: {

    // 加载司机列表 => 保存数据
    saveDriverList(state, { payload }) {
      const { driverList, driverParam } = payload;

      return {
        ...state,
        driverList,
        driverParam,
      }
    },

    // 加载线路权限列表 => 提取保存数据
    saveLineAuthority(state, { payload }) {
      const { lineData, lineParam } = payload;

      return { 
        ...state, 
        lineData,
        lineParam,  
      }
    },

    // 加载司机详情 头部信息
    saveDriverHead(state, { payload }) {
      const { driverHead } = payload;

      return {
        ...state,
        driverHead,
      }
    },

    // 重置
    loadRestCommuteRecordList(state, { payload }) {
      let { commuteRecord, commuteRecordParam } = payload;
      commuteRecord = [];
      commuteRecordParam = {};
      return {
        ...state,
        commuteRecord,
        commuteRecordParam
      }
    },

    // 加载保存司机 上下班记录
    saveCommuteRecord(state, { payload }) { 
      const { commuteRecordParam } = payload;
      let commuteRecord = state.commuteRecord.concat(payload.commuteRecord);

      return {
        ...state,
        commuteRecord,
        commuteRecordParam,
      }
    },

    // 司机提成 
    saveroyaltyForm(state, { payload }) {
      const { royaltyFormData, royaltyFormParam } = payload;

      return {
        ...state,
        royaltyFormData,
        royaltyFormParam
      }
    }
 
  },

  // 用于处理异步操作
  effects: {

    // 加载司机列表
    *loadDriverList({ payload }, { call, put }) {

      const { scenicId = 1, page = 1, pageSize = 10 } = payload || {};
      
      // call 调用执行函数 (调用 driver 里面 司机列表方法 )
      const res = yield call(
        driverOperate.getDriverList,
        { scenicId, page, pageSize },
      )

      const { data: { data: driverList, ...driverParam } } = res;

      // 保存数据 加载列表
      yield put({
        type: 'saveDriverList',
        payload: { driverList, driverParam }
      })
    },

    // 删除 司机
    *handleDeleteDriver({ payload: id }, { call, put, select }) {
      // call 调用执行 driver 里面的删除司机的方法
      yield call( driverOperate.deleteDriver, id );

      // 最后一页只有一条数据时,删除后跳到前一页 
      const { page, pageSize } = yield select( state => {
        const { wisdom_driver: { driverParam } } = state;
        const { page, pageSize, total } = driverParam;

        if ( (page - 1) * pageSize === total - 1 ) {
          return  { page: page - 1, pageSize }
        };

        return { page, pageSize };

      })

      yield put({
        type: 'loadDriverList',
        payload: { page, pageSize }
      })
    },

    // 加载 线路权限
    *loadLineAuthority(action, {call, put }) {
      const res = yield call( 
        driverOperate.getLineAuthority,
      );
      const { data: { data: lineData, ...lineParam } } = res;

      yield put({ 
        type: 'saveLineAuthority',
        payload: { lineData, lineParam }
      });
    },

    // 新增司机
    *handleAddDriver({ payload }, { call, put }) {
      yield call(driverOperate.addDriver, payload);
      yield put({ type: 'loadDriverList' });
    },

    // 加载司机详情 头部数据
    *loadDriverHead({payload: id}, { call, put, }) {
      // 
      const res = yield call(driverOperate.driverDetailsHed, id);

      const { data: driverHead } = res;

      yield put({ 
        type: 'saveDriverHead',
        payload: { driverHead }
      })

    },

    // 编辑司机
    *handleEditDriver({ payload }, { call, put }){

      yield call(driverOperate.driverEditOperate, payload);

      const { driverId } = payload;

      yield put({ 
        type: 'loadDriverHead',
        payload: driverId
      });
    },

    // 上下班记录
    *loadCommuteRecordList({ payload }, { call, put }) {
      const { sourceId = 2, page = 1, pageSize = 20, driverId } = payload || {};
      
      const res = yield call( 
        driverOperate.commuteRecordList, 
        {sourceId, page, pageSize, driverId}
      );

      const { data: { data: commuteRecord, ...commuteRecordParam } } = res;
      
      // 保存数据 加载列表
      yield put({
        type: 'saveCommuteRecord',
        payload: { commuteRecord, commuteRecordParam }
      })
    },

    // 重置 上下班记录
    *restCommuteRecordList({ payload }, { call, put }) {
      const { sourceId = 2, page = 1, pageSize = 20, driverId } = payload || {};
      
      const res = yield call( 
        driverOperate.commuteRecordList, 
        {sourceId, page, pageSize, driverId}
      );

      const { data: { data: commuteRecord, ...commuteRecordParam } } = res;

      // 保存数据 加载列表
      yield put({
        type: 'loadRestCommuteRecordList',
        payload: { commuteRecord, commuteRecordParam }
      })
    },

    // 司机提成
    *loadroyaltyForm({ payload }, { call, put }) {
      const { page = 1, pageSize = 5, day = '01', month = null, sourceId = 2, driverId } = payload || {};

      // 传参 请求司机提成接口
      const res = yield call(
        driverOperate.royaltyForm,
        { page, pageSize, day, month, sourceId, driverId }
      );

      const { data: { pageBean: royaltyFormData, ...royaltyFormParam } } = res;

      // 保存数据 加载列表
      yield put({
        type: 'saveroyaltyForm',
        payload: { royaltyFormData, royaltyFormParam}
      })

    },
    
  },

  // subscriptions: {
  //   setup({ dispatch }) {
  //     dispatch({ type: 'loadDriverList' })
  //   }
  // }
}