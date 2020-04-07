import request from '@/utils/request'

export const testMock = () => request({
  baseURL: 'mock',
  url: '/api/test',
  method: 'get',
})