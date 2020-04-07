import request from '@/utils/request'

/**
 * 获取线路列表
 * @param {{ scenicId: number, page: number, pageSize: number }} param
 * @param param.scenicId   景区id
 * @param param.page       第几页
 * @param param.pageSize   每页显示几条
 */
export const getLineList = ({
  scenicId = 1,
  page = 1,
  pageSize = 10
} = {}) => request({
  url:'/sightseeing/routeS',
  method:'get',
  params: {
    sourceId: 2,
    scenicId,
    page,
    pageSize
  }
})

/**
 * 
 * @param {*} param
 * @param {number} param.scenicId        景区id
 * @param {string} param.routeName       线路名
 * @param {string} param.routeIntroduce  线路介绍
 * @param {string} param.stationS        站点集合
 */
export const additionalLines = ({
  scenicId = 1,
  sourceId = 2,
  ...rest
} = {}) => request({
  url: '/sightseeing/saveRoute',
  method: 'post',
  data: { scenicId, sourceId, ...rest }
})


/**
 * 删除线路
 * @param {*} 
 * @param {string}  线路id
 */
export const deleteLines = (routeId) => request({
  url: '/sightseeing/deleteRoute',
  method: 'post',
  data: { sourceId: 2, routeId }
})

/**
 * 编辑线路
 * @param {*} 
 * @param {number} param.scenicId   景区id
 * @param {number} param.id         线路id
 * @param {string} param.routeName  线路名
 * @param {string} param.stationS   站点集合
 */
export const EditorialLines = ({
  sourceId = 2,
  scenicId = 1,
  ...rest
} = {}) => request({
  url: '/sightseeing/updateRoute',
  method: 'post',
  data: { sourceId, scenicId, ...rest }
})

/**
 * 删除站点
 * @param {number} param.stationId  删除的站点id
 */
export const deleteStation = ({
  sourceId = 2,
  stationId
} = {}) => request({
  url: '/sightseeing/deleteStation',
  method: 'post',
  data: { sourceId, stationId }
})