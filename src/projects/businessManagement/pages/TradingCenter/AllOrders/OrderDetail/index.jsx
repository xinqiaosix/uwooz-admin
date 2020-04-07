import React from 'react'
import { connect, router } from 'dva'
import { Steps, Popconfirm, Icon, Modal } from 'antd'
import styles from './index.module.scss'
import ProductTable from './productTable'   // 商品表格
import SellNote from './sellNote'           // 卖家备注弹框
import ModifyPrice from './modifyPrice'     // 修改价格弹框
import DeliverGoods from './deliverGoods'   // 发货
import Refund from './refund'               // 退款
import { formatTime } from '@/utils/index'
import * as orderApi from '../../../../api/orderList'

const { withRouter, Link } = router
const { Step } = Steps;

class OrderDetail extends React.Component {
  state = {
    showSellNote: false, // 是否显示卖家备注弹框
    showModifyPrice: false, // 是否显示修改价格弹框
    showDeliverGoods: false, // 是否显示发货弹框
    showRefund: false, // 是否显示退款弹框
    currentStep: -1, // 进度条的位置
  }

  componentDidMount() {
    this.handleGetOrderDetail()
  }

  // 获取订单详情
  handleGetOrderDetail = async () => {
    const { match, dispatch } = this.props
    const id = match.params.id
    await dispatch({
      type: 'businessManagement_allorders/getOrderDetails',
      payload: id,
    })
    this.onGetProgress()
    this.handleGetAddress()
    this.handleGetMerchantInfo()
  }

  // 根据商户id查看商户的具体信息
  handleGetMerchantInfo = () => {
    const { dispatch, orderDetail } = this.props
    const { merchantId } = orderDetail
    if (merchantId !== null) {
      dispatch({
        type: 'businessManagement_allorders/getMerchantInfo',
        payload: merchantId,
      })
    }
  }

  // 获取地址库列表
  handleGetAddress = () => {
    const { dispatch, orderDetail } = this.props
    const { merchantId } = orderDetail
    dispatch({
      type: 'businessManagement_logistics/loadAddressList',
      payload: { page: 1, pageSize: 9999, merchantId },
    })
  }

  // 获取订单进度
  onGetProgress = () => {
    const arr1 = [0, 1, 3, 4] // 物流发货或买家自提  对应：买家下单-支付-发货（买家提货）-交易完成
    const arr2 = [0, 1, 4] // 无需物流           对应：买家下单-支付-完成
    const { orderDetail, distributionId } = this.props
    const { state } = orderDetail
    let changeCurrent = false
    if (distributionId === 1) {
      arr2.forEach((item, index) => {
        if (state === item) {
          this.setState({
            currentStep: index,
          })
          changeCurrent = true
        }
      })
    } else {
      arr1.forEach((item, index) => {
        if (state === item) {
          this.setState({
            currentStep: index,
          })
          changeCurrent = true
        }
      })
    }

    if (!changeCurrent) {
      this.setState({
        currentStep: -1,
      })
    }
  }

  // 取消订单
  handleCancelOrder = async () => {
    const { orderDetail } = this.props
    const res = await orderApi.cancelOrder(orderDetail.id)
    const { errorCode } = res
    if (errorCode === 200) {
      Modal.success({
        title: '订单已取消',
      })
    }
    this.handleGetOrderDetail()
  }

  render() {
    const { orderDetail, merchantInfo } = this.props
    const { distributionId } = orderDetail
    const { currentStep } = this.state
    const payTime = orderDetail.payTime
      ? formatTime('YYYY-MM-DD HH:mm:ss', +new Date(orderDetail.payTime))
      : null
    return (
      <div className={styles['order-detail']}>
        <div className={styles['header']}>
          <div className={styles['title']}>
            <Link to="/businessManagement/Orders">
              <Icon className={styles.back} type="arrow-left" />
            </Link>
            <span className={styles['text']}>订单详情</span>
          </div>
          <div className={styles['order']}>
            <span className={styles['order-msg']}>
              订单号： {orderDetail.orderNumber}
            </span>
            <span className={styles['order-msg']}>
              下单时间：{orderDetail.createTime}
            </span>
            <span className={styles['order-msg']}>
              商家：{merchantInfo.merchantName}
            </span>
          </div>
        </div>

        <div className={styles['order-step']}>
          {/* 无需物流 （门店销售订单，付款码订单，会员充值，旅行币充值）*/}
          {distributionId === 1 && (
            <Steps
              className={styles['step']}
              size="small"
              current={currentStep}
            >
              <Step title="买家下单" description={orderDetail.createTime} />
              <Step title="支付" description={payTime} />
              <Step
                title="交易完成"
                description={orderDetail.dealCompleteTime}
              ></Step>
            </Steps>
          )}

          {/* 商城销售订单（买家自提） */}
          {distributionId === 3 && (
            <Steps
              className={styles['step']}
              size="small"
              current={currentStep}
            >
              <Step title="买家下单" description={orderDetail.createTime} />
              <Step title="支付" description={payTime} />
              <Step title="买家提货" description={orderDetail.noGoodsTime} />
              <Step
                title="交易完成"
                description={orderDetail.dealCompleteTime}
              ></Step>
            </Steps>
          )}

          {/* 商城销售订单(物流发货) */}
          {distributionId === 2 || distributionId === 3 ? (
            <Steps
              className={styles['step']}
              size="small"
              current={currentStep}
            >
              <Step title="买家下单" description={orderDetail.createTime} />
              <Step title="支付" description={payTime} />
              <Step title="发货" description={orderDetail.sendGoodsTime} />
              <Step
                title="交易完成"
                description={orderDetail.dealCompleteTime}
              ></Step>
            </Steps>
          ) : (
            ''
          )}

          <div className={styles['order-operate']}>
            <span className={styles['order-operate-title']}>订单操作</span>
            {orderDetail.state === 0 && (
              <span
                className={styles['order-detail-operate']}
                onClick={() => this.setState({ showModifyPrice: true })}
              >
                修改价格
                </span>
            )}
            {orderDetail.state === 2 &&
              orderDetail.type !== 5 &&
              orderDetail.type !== 6 && (
                <span
                  className={styles['order-detail-operate']}
                  onClick={() => this.setState({ showDeliverGoods: true })}
                >
                  发货
                </span>
              )}

            {orderDetail.state === 4 || orderDetail.state === 10 || orderDetail.state === 9 ? (
              <span
                className={styles['order-detail-operate']}
                onClick={() => this.setState({ showRefund: true })}
              >
                申请退款
              </span>
            ) : (
                ''
              )}
            {orderDetail.state === 0 && (
              <Popconfirm
                title="确定取消订单吗"
                onConfirm={this.handleCancelOrder}
                okText="确定"
                cancelText="取消"
              >
                <span className={styles['order-detail-operate']}>取消订单</span>
              </Popconfirm>
            )}
            <span
              className={styles['order-detail-operate']}
              onClick={() => this.setState({ showSellNote: true })}
            >
              备注
            </span>
          </div>
          <p className={styles['sell-note']}>
            卖家备注：{orderDetail.sellerComment}
          </p>
        </div>

        <div className={styles['order-message']}>
          <div className={styles['msg']}>
            <span className={styles['common-title']}>买家信息</span>
            <span className={styles['common']}>
              会员：
              <span className={styles['buyer-name']}>
                {orderDetail.buyerName}
              </span>
            </span>
            <span className={styles['common']}>
              支付方式：{orderDetail.payType === 1 ? '微信支付' : '支付宝支付'}
            </span>
            <span className={styles['common']}>
              买家留言：{orderDetail.comment}
            </span>
          </div>
          <div className={styles['msg']}>
            <span className={styles['common-title']}>交易信息</span>
            <span className={styles['common']}>
              配送方式：{orderDetail.distributionName}
            </span>
            <span className={styles['common']}>
              快递公司：{orderDetail.sendName}
            </span>
            <span className={styles['common']}>
              物流单号：{orderDetail.sendNumber}
            </span>
          </div>
          {orderDetail.distributionName === '快递发货' ||
          orderDetail.distributionName === '同城配送' ? (
            <div className={styles['msg']}>
              <span className={styles['common-title']}>收货信息</span>
              <span className={styles['common']}>
                收货人：{orderDetail.receiveName}
              </span>
              <span className={styles['common']}>
                手机号：{orderDetail.getTelephone}
              </span>
              <span className={styles['common']}>
                地址：
                <span className={styles['address']}>
                  {orderDetail.arriveAddress}
                </span>
              </span>
            </div>
          ) : (
            ''
          )}
        </div>

        {/* 商品列表 */}
        <ProductTable />

        <div className={styles['product-price']}>
          <div className={styles['product-price-common']}>
            <span className={styles['product-price-title']}>商品总价：</span>
            <span className={styles['product-price-value']}>
              ￥{orderDetail.allPrice}
            </span>
          </div>
          <div className={styles['product-price-common']}>
            <span className={styles['product-price-title']}>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;运费：
            </span>
            <span className={styles['product-price-value']}>
              ￥{orderDetail.postage}
            </span>
          </div>
          {orderDetail.state === 0 ? (
            ''
          ) : (
            <React.Fragment>
              <div className={styles['product-price-common']}>
                <span className={styles['product-price-title']}>
                  优惠金额：
                </span>
                <span className={styles['product-price-value']}>
                  -￥{orderDetail.discountsMoney || 0}
                </span>
              </div>
              <div className={styles['product-price-common']}>
                <span className={styles['product-price-title']}>
                  使用储值：
                </span>
                <span className={styles['product-price-value']}>
                  ￥{orderDetail.payPrice}
                </span>
              </div>
            </React.Fragment>
          )}
          <div className={styles['order-price']}>
            <span className={styles['order-price-title']}>订单金额：</span>
            <span className={styles['order-price-value']}>
              ￥{orderDetail.payPrice}
            </span>
          </div>
        </div>

        {/* 卖家备注 */}
        <SellNote
          visible={this.state.showSellNote}
          hideSellNote={() => this.setState({ showSellNote: false })}
          id={orderDetail.id}
          comment={orderDetail.sellerComment}
        />

        {/* 修改价格 */}
        <ModifyPrice
          visible={this.state.showModifyPrice}
          hideModifyPrice={() => this.setState({ showModifyPrice: false })}
          totalPrice={orderDetail.allPrice}
          freight={orderDetail.postage}
          realPrice={orderDetail.payPrice}
          id={orderDetail.id}
        />

        {/* 发货 */}
        <DeliverGoods
          visible={this.state.showDeliverGoods}
          hideDeliverGoods={() => this.setState({ showDeliverGoods: false })}
          handleGetOrderDetail={this.handleGetOrderDetail}
        />

        {/* 退款弹框 */}
        <Refund
          visible={this.state.showRefund}
          hideRefund={() => this.setState({ showRefund: false })}
          handleGetOrderDetail={this.handleGetOrderDetail}
        />
      </div>
    )
  }
}

const mapStateToProps = ({ businessManagement_allorders: state }) => {
  const {
    orderList,
    orderListParam,
    orderType,
    orderDetail,
    merchantInfo,
  } = state
  const orderTypeById = orderType.reduce((acc, item) => {
    const { id } = item
    acc[id] = item
    return acc
  }, {})
  return {
    orderList,
    orderListParam,
    orderType,
    orderTypeById,
    orderDetail,
    merchantInfo,
  }
}

export default withRouter(connect(mapStateToProps)(OrderDetail))