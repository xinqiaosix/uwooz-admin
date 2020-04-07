import request from '@/utils/request'

/**
 * 获取票务列表
 * @param {{ scenicId: number, page: number, pageSize: number }} param
 * @param param.scenicId   景区id
 * @param param.page       第几页
 * @param param.pageSize   每页显示几条
 */
export const getTicketList = ({
  scenicId = 1,
  page = 1,
  pageSize = 10
} = {}) => request({
  url: '/sightseeing/getOrderProduct',
  method: 'get',
  params: {
    sourceId: 2,
    scenicId,
    page,
    pageSize
  }
})


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
  pageSize = 9999
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
 * 添加票务
 * @param {*} param
 * @param {number}  param.scenicId
 * @param {number}  param.price                    普通票单价
 * @param {number}  param.coin                     普通票可抵扣积分
 * @param {number}  param.proportion               普通票提成比例
 * @param {number}  param.routeId                  线路id
 * @param {number}  param.startStationId           起始站点id
 * @param {number}  param.endStationId             终点站点id
 * @param {string}  param.name                     票务名称
 * @param {string}  param.description              票务描述
 * @param {string}  param.titck                    规格票集合
 * 
 */
export const addTickets = ({
  scenicId = 1,
  sourceId = 2,
  ...rest
} = {}) => request({
  url: '/sightseeing/saveOrderProduct',
  method: 'post',
  data: { scenicId, sourceId, ...rest }
})

/**
 * 编辑票务和删除票务
 * @param {*} param 
 * @param {string} param.ids          删除的票的集合
 * @param {string} param.ticketThe    传入的票的集合 
 */
export const editTickets = ({
  scenicId = 1,
  ...rest
} = {}) => request({
  url: '/sightseeing/updateOrderProduct',
  method: 'post',
  data:{ scenicId, sourceId: 2, ...rest }
})



