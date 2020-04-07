import request from '@/utils/request'

/**
 * 获取商品列表
 * @param {{ page: number, pageSize: number }} param 
 * @param param.page 第几页，从 1 开始。默认 1
 * @param param.pageSize 每一页多少条。默认 10
 * @param param.accountId - 企业账户
 * @param param.merchantId 商家id
 * @param param.state - 是否上架的状态
 * @param param.productName 商品名称
 * @param param.priceSorted - 排序方式
 */
export const getCommodityListData = ({
  page = 1,
  pageSize = 10,
  accountId,
  merchantId,
  state,
  productName,
  priceSorted
} = {}) => request({
  url: '/provider-goods/goods',
  method: 'get',
  params: {
    page,
    pageSize,
    accountId,
    merchantId,
    state,
    productName,
    priceSorted
  }
})

/**
 * 获取单个商品
 * @param {{ page: number, pageSize: number }} param 
 * @param param.page 第几页，从 1 开始。默认 1
 * @param param.pageSize 每一页多少条。默认 10
 * @param param.accountId - 企业账户
 */
export const getCommodityListItem = ({
  page = 1,
  pageSize = 10,
  accountId,
  goodsNumber
} = {}) => request({
  url: `/provider-goods/goods/${goodsNumber}`,
  method: 'get',
  params: {
    page,
    pageSize,
    accountId,
  }
})

/**
 * 获取商品类型
 * @param {{ page: number, pageSize: number, accountId: number }} param 
 * @param param.page 第几页，从 1 开始。默认 1
 * @param param.pageSize 每一页多少条。默认 10
 * @param param.accountId - 企业账户
 */
export const getProductTypes = ({
  page = 1,
  pageSize = 9999,
  accountId
} = {}) => request({
  url: '/provider-goods/productType',
  method: 'get',
  params: {
    page,
    pageSize,
    accountId
  }
})

/**
 * 获取商品类目
 * @param {{ page: number, pageSize: number, accountId: number }} param 
 * @param param.page 第几页，从 1 开始。默认 1
 * @param param.pageSize 每一页多少条。默认 10
 * @param param.accountId - 企业账户
 */
export const getCategoryList = ({
  page = 1,
  pageSize = 9999,
  accountId
} = {}) => request({
  url: '/provider-goods/categoryList',
  method: 'get',
  params: {
    page,
    pageSize,
    accountId
  }
})

/**
 * 获取商品分类
 * @param {{ page: number, pageSize: number, accountId: number }} param 
 * @param param.page 第几页，从 1 开始。默认 1
 * @param param.pageSize 每一页多少条。默认 10
 * @param param.accountId - 企业账号
 */
export const getClassification = ({
  page = 1,
  pageSize = 9999,
  accountId
} = {}) => request({
  url: `/provider-goods/classification/${accountId}`,
  method: 'get',
  params: {
    page,
    pageSize,
    accountId
  }
})

/**
 * 获取商家列表
 * @param {{ page: number, pageSize: number, accountId: number }} param 
 * @param param.page 第几页，从 1 开始。默认 1
 * @param param.pageSize 每一页多少条。默认 10
 * @param param.accountId - 企业账号
 */
export const getMerchantList = ({
  page = 1,
  pageSize = 9999,
  accountId
} = {}) => request({
  url: '/provider-merchants/findSomeMerchant',
  method: 'get',
  params: {
    page,
    pageSize,
    accountId
  }
})

/**
 * 获取运费模板
 * @param {{ page: number, pageSize: number, accountId: number }} param 
 * @param param.page 第几页
 * @param param.pageSize 
 * @param param.accountId - 企业账号
 */
export const getShippingTemplate = ({
  page = 1,
  pageSize = 9999,
  accountId
} = {}) => request({
  url: '/provider-goods/freightTemplate/list',
  method: 'get',
  params: {
    page,
    pageSize,
    accountId
  }
})

/**
 * 下架和设置商品分类
 * @param {{ classificationId: string, ids: string, state: string }} param 
 * @param param.classificationId - 商品分类id
 * @param param.ids 商品id
 * @param param.state 上下架状态
 */
export const changeAndSetProduct = ({
  classificationId = null,
  ids,
  state = null
}) => request({
  url: '/provider-goods/theShelves',
  method: 'post',
  data: {
    classificationId,
    ids,
    state
  }
})

/**
 * 新建商品
 */
export const newProduct = (params) => {
  let res = request({
    url: `/provider-goods/product`,
    method: 'special',
    params
  }) 
  return res
}

/**
 * 编辑商品
 */
export const editProduct = (params) => request({
  url: `/provider-goods/updateGoods`,
  method: 'special',
  params
})