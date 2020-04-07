import request from '@/utils/request';

// 景区项目列表
// export const scenicSpotListMock = ({
//   page = 1,
//   pageSize = 10,
// } ={}) => request({
//   baseURL: 'mock',
//   url: '/api/scenicSpotLink',
//   method: 'get',
//   params: { page, pageSize }
// })

export const scenicSpotListMock = ({
  ...rest
}) => request({
  url: `/provider-account/commpanyScnic`,
  method: 'get',
  params: { ...rest }
});

// 新增景区
export const newScenicSpotList = ({
  ...rest
} ={}) => request({
  url: '/provider-account/saveScenic',
  method:'post',
  data: { ...rest }
});

// 启用景区
export const openScenicSpotList = ({
  ...rest
} ={}) => request({
  url: '/provider-account/updayeScenic',
  method: 'post',
  data: { ...rest }
});

// 编辑景区
export const editScenicSpot = ({
  ...rest
} ={}) => request({
  url: '/provider-account/updayeScenic',
  method: 'post',
  data: { ...rest }
})