import request from '@/utils/request'

// export const enterprise = () => request({
//   baseURL: 'mock',
//   url: '/api/enterpriseInfo',
//   method: 'get',
// })


// 获取企业信息
export const enterprise = (id) => request({
  url: `/provider-account/accountCore/${id}`,
  method: 'get',
});

// 编辑企业信息
export const uploadEnterprise = ({
  ...rest
} = {}) => request({
  url:'/provider-account/accountCore',
  method: 'post',
  data: { ...rest }
})
