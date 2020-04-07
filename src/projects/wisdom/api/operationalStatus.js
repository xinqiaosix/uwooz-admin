import request from '@/utils/request'

/**
 * 获取销量数据
 */
export const getsalesVolumeList = (
  {
    time
  } = {}
) => request({
  url: '/sightseeing/sightseeingList',
  method: 'get',
  params: {
    time
  }
})

