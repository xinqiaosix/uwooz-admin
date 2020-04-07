import request from '@/utils/request'

/**
 * 商品分类列表
 * @param {{ accountId: number, }} param
 * @param param.accountId 企业账号 ID  默认 999
 */
export const commodityClass = ({
  page = 1,
  pageSize = 5,
  accountId,
  ...rest
} = {}) =>
  request({
    url: `/provider-goods/classification/${accountId}`,
    method: 'get',
    params: { page, pageSize, ...rest },
  })

/**
 * 添加分类
 * @param {{ accountId: number, }} param
 * @param param.accountId 企业账号 ID  默认 999
 */
export const getNewCommodityClass = params =>
  request({
    url: '/provider-goods/classification',
    method: 'post',
    data: { ...params },
  })

/**
 * 编辑分类
 * @param {{ accountId: number, }} param
 * @param param.accountId 企业账号 ID  默认 999
 */
export const getUploadCommodityClass = params =>
  request({
    url: '/provider-goods/updateClassification',
    method: 'post',
    data: { ...params },
  })

/**
 * 删除分类
 */
export const geDeleteCommodityClass = params =>
  request({
    url: '/provider-goods/deleteClassification',
    method: 'post',
    data: { ...params },
  })
