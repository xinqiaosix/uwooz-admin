import request from '@/utils/request'

export const tagListMock = () => request({
  baseURL: 'mock',
  url: '/api/tagList',
  method: 'get',
})

export const membershipListMock = () => request({
  baseURL: 'mock',
  url: '/api/membershipList',
  method: 'get',
})