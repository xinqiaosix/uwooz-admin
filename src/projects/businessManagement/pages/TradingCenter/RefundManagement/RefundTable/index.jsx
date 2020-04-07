import React from 'react'
import { Table, Pagination } from 'antd'
import { router, connect } from 'dva'
import styles from './index.module.scss'
import ConfirmRefund from './confirmRefund'       // 确认退款弹框
import RefuseRefund from './refuseRefund'         // 拒绝退款弹框

const { withRouter } = router
const { Column } = Table;

class RefundTable extends React.Component {
  state = {
    showConfirmRefund: false,    // 是否显示确认退款弹框
    showRefuseRefund: false,     // 是否显示拒绝退款弹框
    orderData: {},               // 确认退款传过去的数据
    orderId: '',                 // 订单id
    refuseId: '',                // 订单列表id（拒绝退款时会用到）
  }

  handleGeRefundList = async (page = 1, pageSize = 10) => {
    const { dispatch, orderState, merchantName, refundNumber } = this.props
    await dispatch({
      type: 'businessManagement_refund/loadRefundList',
      payload: {
        page,
        pageSize,
        merchantName: merchantName === '' ? null : merchantName,
        refundNumber: refundNumber === '' ? null : refundNumber,
        state: orderState === 0 ? null : orderState,
      },
    })
  }

  // 切换页码
  handlePaginationChanged = (page, pageSize) => {
    this.handleGeRefundList(page, pageSize)
  }

  // 显示确认退款框
  showConfirmRefund = e => {
    const orderData = JSON.parse(e.currentTarget.dataset.item)
    this.setState({
      orderData,
      showConfirmRefund: true,
    })
  }

  // 显示拒绝退款框
  showRefuseRefund = e => {
    const orderId = e.currentTarget.dataset.orderid
    const refuseId = e.currentTarget.dataset.id
    this.setState({
      orderId,
      refuseId,
      showRefuseRefund: true,
    })
  }

  componentDidMount() {
    this.handleGeRefundList()
  }

  render() {
    const { refundList, refundListParam, handleGetRefundNum } = this.props
    const { page, pageSize, total } = refundListParam
    const { showConfirmRefund, showRefuseRefund } = this.state
    return (
      <div className={styles['refund-table']} id="table">
        <div className={styles['title']}>
          <span className={styles['title-product']}>商品</span>
          <span className={styles['title-price']}>实付金额</span>
          <span className={styles['title-refund-type']}>退款方式</span>
          <span className={styles['title-refund-amount']}>退款金额</span>
          <span className={styles['title-status']}>订单状态</span>
          <span className={styles['title-operate']}>操作</span>
        </div>
        {refundList.map((item, index) => {
          return (
            <div key={index}>
              <Table
                title={() => (
                  <span className={styles['table-title']}>
                    订单号：{item.refundNumber}&nbsp;&nbsp;&nbsp; 下单时间：
                    {item.createTime}&nbsp;&nbsp;&nbsp;
                    {item.merchantName}
                  </span>
                )}
                dataSource={[item]}
                rowKey={(r, i) => i}
                className={styles['table']}
                bordered
                pagination={false}
              >
                <Column
                  dataIndex="product"
                  key="product"
                  render={() =>
                    item.goodsInfoList.map((str, id) => {
                      return (
                        <div
                          key={id}
                          className={styles['product-list']}
                          style={
                            id === item.goodsInfoList.length - 1
                              ? { border: 'none' }
                              : {}
                          }
                        >
                          <img
                            className={styles['product-img']}
                            src={JSON.parse(str.goodsInfo).url}
                            alt=""
                          />
                          <div className={styles['product-msg']}>
                            <div className={styles['product']}>
                              <span className={styles['name']}>
                                {JSON.parse(str.goodsInfo).productName}
                              </span>
                              <span className={styles['spec']}>
                                {JSON.parse(str.goodsInfo).price}
                              </span>
                            </div>
                            <div className={styles['product']}>
                              <span className={styles['spec']}>
                                {JSON.parse(str.goodsInfo).spceName}
                              </span>
                              <span className={styles['spec']}>
                                {str.number}件
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  }
                />
                <Column
                  dataIndex="paymentAmount"
                  key="paymentAmount"
                  width="10%"
                  align="center"
                  render={() => (
                    <div className={styles['about-price']}>
                      <span className={styles['real-price']}>
                        {item.payPrice}
                      </span>
                    </div>
                  )}
                />
                <Column
                  dataIndex="refundType"
                  key="refundType"
                  width="15%"
                  align="center"
                  render={() => (
                    <p className={styles['common']}>
                      {item.refundWay === 2 ? '部分退款' : '全部退款'}
                    </p>
                  )}
                />
                <Column
                  dataIndex="refundAmount"
                  key="refundAmount"
                  width="10%"
                  align="center"
                  render={() => (
                    <p
                      className={styles['common']}
                      style={{ color: '#f5222d' }}
                    >
                      {item.price}
                    </p>
                  )}
                />
                <Column
                  dataIndex="orderStatus"
                  key="orderStatus"
                  width="8%"
                  align="center"
                  render={() => (
                    <p className={styles['common']}>
                      {item.state === 5 && '退款中'}
                      { item.state === 6 && '已完成' }
                      { item.state === 9 && '退款已驳回' }
                    </p>
                  )}
                />
                <Column
                  dataIndex="operation"
                  key="operation"
                  width="10%"
                  align="right"
                  render={() =>
                    item.state === 5 ? (
                      <React.Fragment>
                        <p className={styles['operate']}>
                          <span
                            className={styles['confirm']}
                            onClick={this.showConfirmRefund}
                            data-item={JSON.stringify(item)}
                          >
                            确认退款
                          </span>
                          <span
                            className={styles['refuse']}
                            data-orderid={item.orderId}
                            data-id={item.id}
                            onClick={this.showRefuseRefund}
                          >
                            拒绝
                          </span>
                        </p>
                      </React.Fragment>
                    ) : (
                      <p className={styles['operate']}>无</p>
                    )
                  }
                />
              </Table>
            </div>
          )
        })}
        <div className={styles['pagination']}>
          <Pagination
            current={page || 1}
            total={total || 0}
            pageSize={pageSize || 1}
            showTotal={total => `总共 ${total} 个订单`}
            onChange={this.handlePaginationChanged}
            showSizeChanger={true}
            pageSizeOptions={['10', '20', '50']}
            onShowSizeChange={this.handlePaginationChanged}
          />
        </div>

        {/* 确认退款弹框 */}
        <ConfirmRefund
          visible={showConfirmRefund}
          orderData={this.state.orderData}
          onGeRefundList={this.handleGeRefundList}
          handleGetRefundNum={handleGetRefundNum}
          hideConfirmRefund={() => this.setState({ showConfirmRefund: false })}
        />

        {/* 拒绝退款弹框 */}
        <RefuseRefund
          visible={showRefuseRefund}
          orderId={this.state.orderId}
          refuseId={this.state.refuseId}
          onGeRefundList={this.handleGeRefundList}
          handleGetRefundNum={handleGetRefundNum}
          hideRefuseRefund={() => this.setState({ showRefuseRefund: false })}
        />
      </div>
    )
  }
}

const mapStateToProps = ({ 'businessManagement_refund': state }) => {
  const { refundList, refundListParam } = state
  return { refundList, refundListParam }
}

export default withRouter(connect(mapStateToProps)(RefundTable))