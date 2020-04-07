import request from '@/utils/request'

/**
 * 地址库列表
 * @param {{ accountId: number, page: number, pageSize: number }} param
 * @param param.accountId 企业账号 ID  默认 999
 * @param param.page      第几页 默认 1
 * @param param.pageSize  每页多少条 默认 20
 */
export const getAddressList = ({ page = 1, pageSize = 20, ...rest } = {}) =>
  request({
    url: '/provider-goods/addressLibrary/list',
    method: 'get',
    params: {
      page,
      pageSize,
      ...rest,
    },
  })

/**
 * 商家列表
 * @param  {{ page: number, pageSize: number }}
 * @param param.page  第几页 默认 1
 * @param param.pageSize  每页加载的数量
 */
export const getStoreList = ({ page = 1, pageSize = 10 } = {}) =>
  request({
    url: '/provider-merchants/findSomeMerchant',
    method: 'get',
    params: {
      page,
      pageSize,
    },
  })

/**
 * 新增地址
 * @param {{ accountId: number }}
 * @param param.accountId  企业账号ID 默认 999
 */
export const newAddress = params =>
  request({
    url: '/provider-goods/addressLibrary/save',
    method: 'post',
    data: {
      ...params,
    },
  })

/**
 * 编辑地址
 * @param {{ accountId: number }}
 * @param param.accountId  企业账号ID 默认 999
 */
export const uploadAddress = params =>
  request({
    url: '/provider-goods/addressLibrary/update',
    method: 'post',
    data: {
      ...params,
    },
  })

/**
 * 删除地址
 * @param {{ accountId: number }}
 * @param param.state  删除状态 默认 1
 */
export const deleteAddress = params =>
  request({
    url: '/provider-goods/addressLibrary/update',
    method: 'post',
    data: { ...params },
  })

/**
 * 运费模板列表
 * @param {{ accountId: number }}
 * @param param.accountId  企业账号ID 默认 999
 * @param param.page       第几页 默认 1
 * @param param.pageSize   每页加载数量 默认 20
 */
export const getModuleList = ({ page = 1, pageSize = 10, ...res } = {}) =>
  request({
    url: '/provider-goods/freightTemplate/list',
    method: 'get',
    params: { page, pageSize, ...res },
  })

/**
 * 新增运费模板
 * @param {{ accountId: number }}
 * @param param.accountId  企业账号ID 默认 999
 */
export const newFreightTemplate = params =>
  request({
    url: '/provider-goods/freightTemplate/save',
    method: 'post',
    data: {
      ...params,
    },
  })

/**
 * 获取单个运费模板
 * @param { number } param.id 模板id
 */
export const oneMouleInfo = id =>
  request({
    url: `/provider-goods/freightTemplate/${id}`,
    method: 'get',
  })

/**
 * 编辑配送区域
 * @param { number } param.id 区域配送模板id
 */
export const uploadDistributionArea = params =>
  request({
    url: `/provider-goods/distribution/update`,
    method: 'post',
    data: { ...params },
  })

// 添加配送区域
export const addDistributionArea = params =>
  request({
    url: `/provider-goods/distribution/save`,
    method: 'post',
    data: { ...params },
  })

// 编辑模板
export const uploadMould = params =>
  request({
    url: '/provider-goods/freightTemplate/update',
    method: 'post',
    data: { ...params },
  })

// 删除配送区域
export const deleteRegion = params =>
  request({
    url: `/provider-goods/distribution/delete`,
    method: 'delete',
    params: { ...params },
  })

// 删除模板
export const deleteMould = id =>
  request({
    url: `/provider-goods/freightTemplate/delete/${id}`,
    method: 'delete',
  })
