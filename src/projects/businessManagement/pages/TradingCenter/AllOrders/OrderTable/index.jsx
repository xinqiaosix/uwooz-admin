import React from 'react'
import { Table, Pagination, Popover } from 'antd'
import { router, connect } from 'dva'
import OrderNote from './orderNote'
import styles from './index.module.scss'

const { withRouter, Link } = router
const { Column } = Table;

class OrderTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showOrderNote: false,   // 是否显示订单备注弹框
      comment: '',            // 订单备注
    }
  }

  // 获取订单列表
  handleGetOrderList = async (page = 1, pageSize = 10) => {
    const { dispatch, fieldsValue, merchantId, orderState } = this.props;
    const value = await fieldsValue()
    await dispatch({
      type: 'businessManagement_allorders/loadOrder',
      payload: {
        page,
        pageSize,
        merchantId: merchantId === '' ? null : merchantId,
        state: orderState === -1 ? null : orderState,
        ...value
      }
    })
  }

  // 切换页码
  handlePaginationChanged = (page, pageSize) => {
    this.handleGetOrderList(page, pageSize)
  }

  // 显示订单备注弹框
  onShowOrderNote = (comment) => {
    this.setState({
      showOrderNote: true,
      comment: comment
    })
  }

  componentDidMount() {
    this.handleGetOrderList()
  }

  render() {
    const { orderList, orderListParam } = this.props
    const { page, pageSize, total } = orderListParam
    return (
      <div className={styles['order-table']} id="table">
        <div className={styles['title']}>
          <span className={styles['title-product']}>商品</span>
          <span className={styles['title-price']}>实付金额</span>
          <span className={styles['title-buyer']}>买家</span>
          <span className={styles['title-delivery']}>配送</span>
          <span className={styles['title-status']}>订单状态</span>
          <span className={styles['title-operate']}>操作</span>
        </div>
        {
          orderList.map((item, index) => {
            return (
              <div key={index}>
                <Table
                  title={() => (
                    <span className={styles['table-title']}>
                      订单号：{item.orderNumber}&nbsp;&nbsp;&nbsp; 下单时间：
                      {item.createTime}&nbsp;&nbsp;&nbsp;
                      {item.business}
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
                      item.orderDetails.map((str, id) => {
                        return (
                          <div
                            key={id}
                            className={styles['product-list']}
                            style={
                              id === item.orderDetails.length - 1
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
                    dataIndex="realPrice"
                    key="realPrice"
                    width="10%"
                    align="center"
                    render={() => (
                      <div className={styles['about-price']}>
                        <span className={styles['real-price']}>
                          {item.payPrice}
                        </span>
                        {item.postage > 0 && (
                          <span className={styles['freight-price']}>
                            含运费&nbsp;{item.postage}
                          </span>
                        )}
                        <Popover
                          trigger="click"
                          content={
                            <div className={styles['coupon']}>
                              {item.orderDiscounts.map(str => {
                                return (
                                  <span key={str.id}>
                                    {str.typeId === 1 && '旅行币'}
                                    {str.typeId === 2 && '积分'}
                                    {str.typeId === 4 && '优惠券'}
                                    &nbsp;&nbsp;{str.discountsMoney}
                                  </span>
                                )
                              })}
                            </div>
                          }
                        >
                          {item.allPrice - item.payPrice > 0 && (
                            <span className={styles['discount-price']}>
                              已优惠&nbsp;
                              {(item.allPrice - item.payPrice)}
                            </span>
                          )}
                        </Popover>
                      </div>
                    )}
                  />
                  <Column
                    dataIndex="buyer"
                    key="buyer"
                    width="15%"
                    align="center"
                    render={() => (
                      <div className={styles['buyer']}>
                        <span className={styles['username']}>
                          {item.buyerName}
                        </span>
                        <span className={styles['phone']}>
                          {item.buyersPhone}
                        </span>
                      </div>
                    )}
                  />
                  <Column
                    dataIndex="delivery"
                    key="delivery"
                    width="10%"
                    align="center"
                    render={() => (
                      <p className={styles['common']}>
                        {item.distributionName}
                      </p>
                    )}
                  />
                  <Column
                    dataIndex="orderStatus"
                    key="orderStatus"
                    width="8%"
                    align="center"
                    render={() => (
                      <p className={styles['common']}>{item.stateName}</p>
                    )}
                  />
                  <Column
                    dataIndex="operation"
                    key="operation"
                    width="10%"
                    align="right"
                    render={() => (
                      <p className={styles['operate']}>
                        <Link to={`${this.props.match.path}/detail/${item.id}`}>
                          详情
                        </Link>
                        <span
                          onClick={() => this.onShowOrderNote(item.comment)}
                          className={styles['comment']}
                        >
                          备注
                        </span>
                      </p>
                    )}
                  />
                </Table>
              </div>
            )
          })
        }
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

        {/* 卖家备注弹框 */}
        <OrderNote
          visible={this.state.showOrderNote}
          hideOrderNote={() => this.setState({ showOrderNote: false })}
          comment={this.state.comment}
        />

      </div>
    )
  }
}

const mapStateToProps = ({ 'businessManagement_allorders': state }) => {
  const { orderList, orderListParam, deliveryType } = state
  const deliveryTypeById = deliveryType.reduce((acc, item) => {
    const { id } = item
    acc[id] = item
    return acc
  }, {})
  return { orderList, orderListParam, deliveryTypeById }
}

export default withRouter(connect(mapStateToProps)(OrderTable))