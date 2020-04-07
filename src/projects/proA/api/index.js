import request from '@/utils/request'

/**
 * 
 * @param {{ scenicId: number, page: number, pageSize: number }} param 
 * @param param.scenicId 啥啥啥 id 
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
