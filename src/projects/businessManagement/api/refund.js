import request from '@/utils/request'

/**
 * 查询退款记录
 * @param {*}
 * @param { string } param.merchantName        商户名称
 * @param { number } param.page                第几页
 * @param { number } param.pageSize            每页显示几条
 * @param { string } param.refundNumber        订单号
 * @param { string } param.state               退款状态
 */

export const getRefunList = ({ page = 1, pageSize = 10, ...rest } = {}) =>
  request({
    url: '/provider-order/refundList',
    method: 'get',
    params: {
      page,
      pageSize,
      ...rest,
    },
  })

/**
 * 查询退款个数（退款中，已完成）
 */
export const getRefundNum = () =>
  request({
    url: '/provider-order/listBytotle',
    method: 'get',
  })

/**
 * 确认退款
 * @param {*}
 * @param { number }     param.accountId       企业账户id
 * @param { number }     param.channel         支付渠道应用id
 * @param { string }     param.appId           支付应用id
 * @param { string }     param.orderId         订单id
 * @param { string }     param.refundId        退款id
 * @param { string }     param.outTradeNo      商户订单编号
 * @param { number }     param.refundAmount    退款金额
 * @param { number }     param.amount          支付金额
 * @param { string }     param.sureRefundWay   退款金额
 * @param { string }     param.operatorId      收银员id
 */

export const confirmRefund = ({ ...rest } = {}) =>
  request({
    url: '/provider-order/confirmRefund',
    method: 'post',
    data: { ...rest },
  })

/**
 * 拒绝退款
 * @param {*}
 * @param { string }    param.orderId        订单id
 * @param { string }    param.reasonId       拒绝退款的理由
 * @param { string }    param.refusedReason  其他理由
 * @param { string }    param.refuseId       退款id
 */
export const refuseRefund = ({ ...rest } = {}) =>
  request({
    url: '/provider-order/refuseRefund',
    method: 'post',
    data: { ...rest },
  })

/**
 * 查询拒绝理由列表
 */
export const refundReson = () =>
  request({
    url: '/provider-order/listByRefuse',
    method: 'get',
  })
