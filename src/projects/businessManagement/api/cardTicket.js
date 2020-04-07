import request from '@/utils/request';

// 获取卡券列表
export const getCreadList = () => request({
  baseURL: 'mock',
  url: '/api/creadList',
  method: 'get',
})