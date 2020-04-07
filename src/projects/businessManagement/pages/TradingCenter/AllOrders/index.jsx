import React from 'react'
import styles from './index.module.scss'
import { Layout, Tabs } from 'antd'
import SearchForm from './searchform'
import OrderTable from './OrderTable/index'
import AllBusiness from '../../../components/AllBusiness/index'
// import FileSaver from 'file-saver'

import { connect, router } from 'dva'

const { Header } = Layout
const { TabPane } = Tabs
const { withRouter } = router

class AllOrders extends React.Component {

  state = {
    active: -1,         // 订单状态对呀的tab
    merchantId: '',      // 商家id
    isResetFields: false, // 是否重置表单
  }

  // 切换tab
  onCallBack = async (key) => {
    this.setState({
      active: parseInt(key) ,
      isResetFields: true
    })
    const { dispatch } = this.props;
    const { merchantId } = this.state
    const state = key === -1 ? null : key                    // 订单状态
    // const value = this.child.handleGteFieldsValue()        // 如果不重置表单获取表单的值

    // 如果重置表单
    const date = new Date()
    const dStart = `${date.getFullYear()}-${date.getMonth() + 1}-01`
    const dEnd = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

    const payload = {
      // ...value,
      dStart,
      dEnd,
      state,
      page: 1,
      pageSize: 10,
      merchantId: merchantId === '' ? null : merchantId
    }

    await dispatch({
      type: 'businessManagement_allorders/loadOrder',
      payload
    })

    this.setState({
      isResetFields: false
    })
  }

  // 筛选后的商家列表
  handleGetOrderList = async (merchantId) => {
    this.setState({
      merchantId: merchantId,
      isResetFields: true
    })
    const { dispatch } = this.props;
    // const { active } = this.state
    // const state = active === "8" ? null : active           // 订单状态
    // const value = this.child.handleGteFieldsValue()        // 如果不重置表单获取表单的值

    // 如果重置表单
    const date = new Date()
    const dStart = `${date.getFullYear()}-${date.getMonth() + 1}-01`
    const dEnd = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

    const payload = {
      // ...value,
      dStart,
      dEnd,
      //state,
      page: 1,
      pageSize: 10,
      merchantId: merchantId === undefined ? null : merchantId
    }

    await dispatch({
      type: 'businessManagement_allorders/loadOrder',
      payload
    })

    this.setState({
      isResetFields: false
    })
  }

  // 子组件方法，用来获取表单值
  onRef = (ref) => {
    this.child = ref
  }

  // 导出数据
  exportList = () => {
    // const { orderList } = this.props
    // let str = ''
    // str += '商品,件数,实付金额,买家,订单状态'
    // //通过循环拿出data数据源里的数据，并塞到str中
    // orderList.forEach((item) => {
    //   let counts = 0
    //   let product = ''
    //   item.productList.forEach((str) => {
    //     counts += str.count
    //     product += str.productName + '、'
    //   })
    //   str +='\n' + product + ',' + counts + ',' +  item.paymentAmount + ',' + item.buyerName + ',' + item.orderStatus 
    // })

    // //Excel打开后中文乱码添加如下字符串解决
    // let exportContent = "\uFEFF";
    // let blob = new Blob([exportContent + str], {
    //   type: "text/plain;charset=utf-8"
    // });
    // //根据数据生成生成文件
    // FileSaver.saveAs(blob, "demo.csv");
  }

  // 获取表单的值，用来渲染订单列表
  getFieldsValue = async () => {
    const value = await this.child.handleGteFieldsValue()
    return value
  }

  render() {
    return (
      <div className={styles.allorder}>
        <Header className={styles.header}>
          <span className={styles.head_title} >全部订单</span>

          {/* 全部商家下拉框 */}
          <AllBusiness
            onScreen={this.handleGetOrderList}
          />

        </Header>
        <div className={styles.alloption}>
          <Tabs onChange={this.onCallBack}>
            <TabPane tab="全部" key="-1"></TabPane>
            <TabPane tab="待付款" key="0"></TabPane>
            <TabPane tab="已完成" key="4"></TabPane>
            <TabPane tab="待发货" key="2"></TabPane>
            <TabPane tab="已发货" key="3"></TabPane>
            <TabPane tab="已关闭" key="7"></TabPane>
            <TabPane tab="售后" key="8"></TabPane>
          </Tabs>
          <span className={styles.export} onClick={this.exportList} >导出数据</span>
        </div>

        {/* 搜索表单 */}
        <SearchForm
          merchantId={this.state.merchantId}      // 商家id
          orderState={this.state.active}         // 订单状态 
          onRef={this.onRef}											 // 用来调用子组件的方法
          isResetFields={this.state.isResetFields}
        />

        {/* 订单列表表格 */}
        <OrderTable
          fieldsValue={this.getFieldsValue}
          merchantId={this.state.merchantId}
          orderState={this.state.active}
        />

      </div>
    )
  }
}

const mapStateToProps = ({ 'businessManagement_allorders': state }) => {
  const { orderList, orderListParam, orderType, deliveryType } = state
  const orderTypeById = orderType.reduce((acc, item) => {
    const { id } = item
    acc[id] = item
    return acc
  }, {})
  return { orderList, orderListParam, orderType, orderTypeById, deliveryType }
}

export default withRouter(connect(mapStateToProps)(AllOrders))