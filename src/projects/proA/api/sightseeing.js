import request from '@/utils/request'

/**
 * 获取观光车列表
 * @param {{ scenicId: number, page: number, pageSize: number }} param 
 * @param param.scenicId 景区 id。默认 1
 * @param param.page 第几页，从 1 开始。默认 1
 * @param param.pageSize 每一页多少条。默认 10
 */
export const getSightseeingCars = ({
  scenicId = 1,
  page = 1,
  pageSize = 10
} = {}) => request({
  url: '/sightseeing/sightseeingList',
  method: 'get',
  params: {
    sourceId: 2,
    scenicId,
    page,
    pageSize,
  }
})

/**
 * 获取到所有管理员，无需传入分页页码参数
 */
export const getManages = () => request({
  url: '/sightseeing/canManage',
  mehtod: 'get',
  params: { sourceId: 2 }
})

/**
 * 新增观光车
 * @param {*} param 
 * @param {number} param.scenicId 景区id
 * @param {string} param.carNumber 车牌号
 * @param {string} param.typeName 车类型名
 */
export const createCar = ({
  sourceId = 2,
  scenicId = 1,
  ...rest
} = {}) => request({
  url: '/sightseeing/saveSight',
  method: 'post',
  data: { sourceId, scenicId, ...rest }
})

/**
 * 删除观光车
 * @param {number} id 车的id
 */
export const deleteCar = (id) => request({
  url: '/sightseeing/daleteSight',
  method: 'post',
  data: { sourceId: 2, id }
})