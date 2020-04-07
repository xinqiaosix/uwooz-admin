import request from '@/utils/request';

/**
 * 获取司机列表
 * @param {{ scenicId: number, page: number, pageSize: number }} param;
 * @param param.scenicId 景区id
 * @param param.page     第几页, 从 1 开始, 默认为 1
 * @param param.pageSize 每页有多少条, 默认为 10
 */

export const getDriverList = ({
  scenicId = 1,
  page = 1,
  pageSize = 10
  } = {}) => request({
  url: 'https://test.qqmmsh.com/mxomsapi/sightseeing/driverS',
  method: 'get',
  params: {
    scenicId,
    page,
    pageSize, 
  }
});

/**
 * 删除司机
 * @param { number } id 车的id 
 */
export const deleteDriver = (id) => request({
  url: 'https://test.qqmmsh.com/mxomsapi/sightseeing/deleteDriver',
  method: 'post',
  data: { sourceId: 2, id }
});

/**
 * 图片上传
 */
export const imageUpload = (formData) => request({
  url: 'https://api.uwooz.com/mxapi/uploade/source',
  method: 'post',
  headers: {
    'Content-Type': 'multipart/form-data'
  },
  data: { formData, backetName: 'test' }
});

/**
 * 线路权限列表
 * @param {{ scenicId: number, sourceId: number, page: number, pageSize: number }} param
 * @param param.scenicId  景区ID 默认 1
 * @param param.sourceId  资源ID 默认 2
 * @param param.page      页码 默认 1
 * @param param.pageSize  每页加载的条数 默认加载全部 暂定9999
 */
export const getLineAuthority = ({
  scenicId = 1,
  sourceId = 2,
  page = 1,
  pageSize = 9999,
} = {}) => request({
  url: 'https://test.qqmmsh.com/mxomsapi/sightseeing/routeS',
  method: 'get',
  params: {
    scenicId,
    sourceId,
    page,
    pageSize
  }
});

/**
 * 新增司机
 * @param { * } param 
 * @param { number } param.scenicId      景区id 默认: 1
 * @param { number } param.sourceId      资源id 默认: 2
 * @param { string } param.name          司机名
 * @param { number } param.age           年龄
 * @param { number } param.sex           性别
 * @param { string } param.idNumber      身份证
 * @param { string } param.phoneNumber   手机号
 * @param { string } param.entryDate     入职日期
 * @param { string } param.birthday      生日
 * @param { number } params.routesId     线路id
 * @param { string } params.imgUrl       司机头像
 */
export const addDriver = ({
  sourceId = 2,
  scenicId = 1,
  ...rest
} = {}) => request({
  url: 'https://test.qqmmsh.com/mxomsapi/sightseeing/saveDriver',
  method: 'post',
  data: { sourceId, scenicId, ...rest }
});

/**
 * 选中项的 => 司机数据详情
 * @param {{ sourceId: number, id: number }}
 * @param param.sourceId  资源id 默认: 2
 * @param param.id        司机id
 */
export const driverDetailsHed = (id) => request({
  url: 'https://test.qqmmsh.com/mxomsapi/sightseeing/sightseeingDriverOne',
  method: 'get',
  params: { sourceId: 2, id }
});

/**
 * 编辑司机
 * @param { * } param
 * @param { number } param.scenicId     景区ID 默认: 1
 * @param { number } param.sourceId     资源id 默认: 2 
 * */
export const driverEditOperate = ({
  sourceId = 2,
  scenicId = 1,
  ...rest
} = {}) => request({
  url: 'https://test.qqmmsh.com/mxomsapi/sightseeing/updateDriver',
  method: 'post',
  data: { scenicId, sourceId, ...rest }
});

/**
 * 上下班记录的数据
 * @param {sourceId: number, driverId: number }
 * @param param.sourceId   资源id 默认: 2
 * @param param.driverId   司机id
 */
export const commuteRecordList = ({
  sourceId = 2,
  page = 1,
  pageSize = 20,
  driverId,
} = {}) => request({
  url: 'https://test.qqmmsh.com/mxomsapi/sightseeing/recordList',
  method: 'get',
  params: { sourceId, page, pageSize, driverId }
});

/**
 * 司机提成
 * @param  { * } params
 * @param { number } param.page        默认: 1
 * @param { number } param.pageSize    默认: 5
 * @param { string } param.day         默认: 当月第一天 01
 * @param { null } params.moth         默认: null
 */

 export const royaltyForm = ({
  page = 1,
  pageSize = 5,
  day = '01',
  month = null,
  sourceId = 2,
  driverId,
 } = {}) => request({
   url: 'https://test.qqmmsh.com/mxomsapi/sightseeing/commission',
   method: 'post',
   data: { page, pageSize, day, month, sourceId, driverId }
});