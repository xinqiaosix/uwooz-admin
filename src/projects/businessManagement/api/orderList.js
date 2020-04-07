import request from '@/utils/request'

export const orderListMock = () =>
  request({
    baseURL: 'mock',
    url: '/api/orderList',
    method: 'get',
  })

// 订单类型
export const orderTypeMock = () =>
  request({
    baseURL: 'mock',
    url: 'api/orderType',
    method: 'get',
  })

//  配送方式
export const deliveryType = () =>
  request({
    baseURL: 'mock',
    url: 'api/delivery',
    method: 'get',
  })

/**
 * 获取订单配送方式
 * @param {*}
 */
export const getOrderDistribution = () =>
  request({
    url: '/provider-order/orderDistributions',
    method: 'get',
  })

/**
 * 获取订单来源
 * @param {*}
 */
export const getOrderSources = () =>
  request({
    url: '/provider-order/orderSources',
    method: 'get',
  })

/**
 * 获取订单类型
 */
export const getOrderTypes = () =>
  request({
    url: '/provider-order/orderTypes',
    method: 'get',
  })

/**
 * 获取订单状态
 * @param {*} param0
 */
export const getOrderState = () =>
  request({
    url: '/provider-order/orderStateNames',
    method: 'get',
  })

/**
 * 获取订单列表
 * @param {*}
 * @param { number } param.accountId       企业账户id
 * @param { string } param.buyersPhone     买家手机号
 * @param { string } param.dEnd            结束时间
 * @param { string } param.dStart          开始时间
 * @param { string } param.orderNumber     订单编号
 * @param { number } param.page            第几页
 * @param { number } param.pageSize        每页显示几条
 * @param { string } param.productName     商品名称
 * @param { number } param.source          订单来源
 * @param { string } param.merchantId      商家id
 * @param {  }       param.state           订单状态id
 */
export const getOrderList = ({
  page = 1,
  pageSize = 10,
  // accountId = 999,
  ...rest
} = {}) =>
  request({
    url: '/provider-order/orderList',
    method: 'get',
    params: {
      page,
      pageSize,
      // accountId,
      ...rest,
    },
  })

/**
 * 获取订单详情
 * @param { number }  param.id          // 订单id
 */
export const getOrderDetail = id =>
  request({
    url: `/provider-order/getDetails/${id}`,
    method: 'get',
  })

/**
 * 修改价格
 * @param { string }     param.id               // 订单id
 * @param { string }     param.discountPrice    // 涨价或减价
 * @param { string }     param.postage          // 运费
 */
export const modifyPrice = ({ ...rest } = {}) =>
  request({
    url: '/provider-order/updatePrice',
    data: {
      ...rest,
    },
    method: 'post',
  })

/**
 * 修改卖家备注
 * @param { string }  param.id               // 订单id
 * @param { string }  param.sellerComment    // 卖家备注
 */
export const ModifySellerNotes = ({ ...rest } = {}) =>
  request({
    url: '/provider-order/update',
    data: {
      ...rest,
    },
    method: 'post',
  })

/**
 * 发货
 * @param { string }   param.orderCoreId     // 订单id
 * @param { string }   param.sendAddress     // 发货地址
 * @param { string }   param.sendName        // 快递公司
 * @param { string }   param.sendNumber      // 物流单号
 */
export const Delivergoods = ({ ...rest } = {}) =>
  request({
    url: '/provider-order/send',
    data: { ...rest },
    method: 'post',
  })

/**
 * 申请退款
 * @param {  }                param.merchantId         // 商户id
 * @param { number }          param.orderId            // 订单id
 * @param { string }          param.price              // 退款金额
 * @param { refundNumber  }   param.refundNumber       // 订单号
 */
export const applyRefund = ({ ...rest } = {}) =>
  request({
    url: '/provider-order/refund',
    data: { ...rest },
    method: 'post',
  })

/**
 * 根据商户id查找商户的具体信息
 * @param { string } param.merchantId
 */
export const getMerchant = merchantId =>
  request({
    url: `/provider-merchants/findmerchant/${merchantId}`,
    method: 'get',
  })

/**
 * 取消订单
 * @param { number } param.id
 */
export const cancelOrder = id =>
  request({
    url: `/provider-order/cancel/${id}`,
    method: 'delete',
  })
