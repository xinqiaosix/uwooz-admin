import request from '@/utils/request';

/**
 * 加载 观光车列表
 * @param {{ page: number, pageSize: number, sourceId: number, scenicId: number }} param
 * @param param.page      页码 默认:1 
 * @param param.pageSize  每页数量 默认: 10
 * @param param.sourceId  资源ID 默认: 2
 * @param param.scenicId  景区id 默认: 1
 */
export const getSightseeingBus = ({
  sourceId = 2,
  scenicId = 1,
  page = 1,
  pageSize = 10
} = {}) => request({
  url: 'https://test.qqmmsh.com/mxomsapi/sightseeing/sightseeingList',
  // url: '/sightseeing/sightseeingList',
  method: 'get',
  params: { sourceId, scenicId, page, pageSize }
});

/**
 * 添加 观光车
 * @param {{ sourceId: number, scenicId: number }} param
 * @param param.sourceId  资源id 默认: 2
 * @param param.scenicId  景区id 默认: 1
 */
export const newSightseeingBus = ({ 
  sourceId = 2,
  scenicId = 1,
  ...rest
} ={}) => request({
  url: 'https://test.qqmmsh.com/mxomsapi/sightseeing/saveSight',
  method: 'post',
  data: { sourceId, scenicId, ...rest }
});

/**
 * 观光车人员管理列表
 * @param {{ sourceId: number, scenicId: number }} param
 * @param param.sourceId  资源id 默认: 2
 * @param param.scenicId  景区id 默认: 1
 */
export const adminData = ({
  sourceId = 2,
  scenicId = 1,
} ={}) => request({
  url: 'https://test.qqmmsh.com/mxomsapi/sightseeing/canManage',
  method: 'get',
  params: { sourceId, scenicId, }
});

/**
 * 删除观光车
 * @param {{ sourceId: number, id: number }} param
 * @param param.sourceId 资源id 默认: 2
 * @param param.id       观光车 id 
 */
export const deleteSightseeingBus = (id) => request({
  url: 'https://test.qqmmsh.com/mxomsapi/sightseeing/daleteSight',
  method: 'post',
  data: { sourceId: 2, id }
});

/** 
 * 报修功能
 * @param {{ sourceId: number }} param
 * @param param.sourceId 资源id 默认: 2
 */
export const handleRepair = ({
  sourceId = 2,
  ...rest
}) => request({
  url: 'https://test.qqmmsh.com/mxomsapi/sightseeing/saveSightRepair',
  method: 'post',
  data: { sourceId, ...rest }
});

 /**
  * 请求司机详情 头部数据
  * @param {{ sourceId: number }} param
  * @param param.sourceId  资源id 默认: 2
  */
export const vehicleDetails = (id) => request({
  url: 'https://test.qqmmsh.com/mxomsapi/sightseeing/sightseeingOne',
  method: 'get',
  params: { sourceId: 2, id }
});

 /**
  * 编辑观光车头部数据
  * @param {{ sourceId: number }} param
  * @param param.sourceId  资源id 默认: 2
  */
export const uploadVehicleDetails = ({
  sourceId = 2,
  ...rest
}) => request({
  url: 'https://test.qqmmsh.com/mxomsapi/sightseeing/updateSight',
  method: 'post',
  data: { sourceId, ...rest }
});

 /**
  * 上下班记录
  * @param {{ sourceId: number, page; number, pagesize: number }} param
  * @param param.sourceId  资源id 默认: 2
  * @param param.page     显示第一页数据
  * @param param.pagesize 每页显示数据的条数
  */
export const commuteRecord = ({
  sourceId = 2,
  page = 1,
  pageSize = 5,
  ...rest
}) => request({
  url: 'https://test.qqmmsh.com/mxomsapi/sightseeing/recordList',
  method: 'get',
  params: { sourceId, page, pageSize, ...rest }
});

 /**
  * 报修与维修记录
  * @param {{ page: number, pageSize: number, sourceId: number }} param
  * @param param.page      显示第一页 
  * @param param.pageSize  每页显示数据的条数 默认: 20
  * @param param.sourceId  资源id 默认: 2
  */
export const royaltyFormData = ({
  sourceId = 2,
  page = 1,
  pageSize = 20,
  ...rest
}) => request({
  url: 'https://test.qqmmsh.com/mxomsapi/repair/repairList',
  method: 'get',
  params: { sourceId, page, pageSize, ...rest }
})