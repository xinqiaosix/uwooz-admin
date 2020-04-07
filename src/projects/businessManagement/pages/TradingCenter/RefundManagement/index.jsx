import React from 'react'
import styles from './index.module.scss'
import { Layout, Select, Input, Tabs } from 'antd'
import RefundTable from './RefundTable/index'
import { router, connect } from 'dva'
import * as refundApi from '../../../api/refund'
const { withRouter } = router

const { Header } = Layout
const { Option } = Select
const { Search } = Input
const { TabPane } = Tabs

class RefundManagement extends React.Component {
  state = {
    merchantName: '', // 商家名称，用于搜索时页码切换
    orderState: 5, // 退款状态
    refundNum: 0, // 退款中个数
    completedNum: 0, // 已完成的个数
    refuseNum: 0,  // 退款被驳回的个数
    currentKey: 1,
    orderNum: '', // 订单编号
  }

  // 切换不同的退款状态
  onCallBack = key => {
    //console.log(key)
    let payload = {}
    const { dispatch } = this.props

    this.setState({
      merchantName: '',
      orderNum: '',
      orderState: parseInt(key),
    })

    if (parseInt(key) === 0) {
      payload = {
        page: 1,
        pageSize: 10,
      }
    } else {
      payload = {
        page: 1,
        pageSize: 10,
        state: key,
      }
    }

    dispatch({
      type: 'businessManagement_refund/loadRefundList',
      payload,
    })
  }

  // 判断是根据订单编号还是根据商家名称查询
  handleChange = value => {
    this.setState({
      currentKey: parseInt(value),
      merchantName: '',
      orderNum: '',
    })
  }

  // 根据商家名称或者订单编号搜索订单
  handleSearchOrder = value => {
    const { dispatch } = this.props
    const { orderState, currentKey } = this.state
    let payload = {}
    if (currentKey === 1) {
      payload = {
        page: 1,
        pageSize: 10,
        refundNumber: value,
        state: orderState === 0 ? null : orderState,
      }
    } else {
      payload = {
        page: 1,
        pageSize: 10,
        merchantName: value,
        state: orderState === 0 ? null : orderState,
      }
    }
    dispatch({
      type: 'businessManagement_refund/loadRefundList',
      payload,
    })
  }

  // 输入商家名称或者订单编号
  onChange = e => {
    const { value } = e.target
    const { currentKey } = this.state
    if (currentKey === 1) {
      this.setState({
        orderNum: value,
      })
    } else {
      this.setState({
        merchantName: value,
      })
    }
  }

  // 查询不同退款状态的个数
  handleGetRefundNum = async () => {
    const { data: totalNum } = await refundApi.getRefundNum()
    let haveState5 = false
    let haveState6 = false

    totalNum.forEach(item => {
      if (item.state === 5) {
        this.setState({
          refundNum: item.count,
        })
        haveState5 = true
      }

      if (item.state === 6) {
        this.setState({
          completedNum: item.count,
        })
        haveState6 = true
      }
      
      if(item.state === 9) {
        this.setState({
          refuseNum: item.count
        })
      }
    })

    if (!haveState5) {
      this.setState({
        refundNum: 0,
      })
    }
    if (!haveState6) {
      this.setState({
        completedNum: 0,
      })
    }
  }

  componentDidMount() {
    this.handleGetRefundNum()
  }

  render() {
    const { refundNum, completedNum, currentKey, refuseNum } = this.state
    return (
      <div className={styles['refund-management']}>
        <Header className={styles['header']}>
          <span className={styles['title']}>退款管理</span>
          <span className={styles['export']}>导出数据</span>
        </Header>
        <div className={styles['screen']}>
          <Tabs
            className={styles['refund-status']}
            onChange={this.onCallBack}
          >
            <TabPane tab={`退款中（${refundNum}）`} key={5}></TabPane>
            <TabPane tab={`已完成（${completedNum}）`} key={6}></TabPane>
            <TabPane
              tab={`全部（${refundNum + completedNum + refuseNum}）`}
              key={0}
            ></TabPane>
          </Tabs>
          <div className={styles['serach']}>
            <Select
              defaultValue={this.state.currentKey}
              placeholder="订单编号"
              style={{ width: 150 }}
              onChange={this.handleChange}
            >
              <Option value={1}>订单编号</Option>
              <Option value={2}>商家名称</Option>
            </Select>
            <Search
              placeholder={currentKey === 1 ? '订单编号' : '商家名称'}
              style={{ width: 271, marginLeft: 15 }}
              className={styles['search-business']}
              value={
                this.state.merchantName === ''
                  ? this.state.orderNum
                  : this.state.merchantName
              }
              onChange={this.onChange}
              onSearch={this.handleSearchOrder}
            />
          </div>
        </div>

        {/* 退款表格 */}
        <RefundTable
          merchantName={this.state.merchantName}
          refundNumber={this.state.orderNum}
          orderState={this.state.orderState}
          handleGetRefundNum={this.handleGetRefundNum}
        />
      </div>
    )
  }
}

export default withRouter(connect()(RefundManagement))
