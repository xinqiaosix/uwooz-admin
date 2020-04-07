import React from 'react'
import { Table } from 'antd'
import { router, connect } from 'dva'
import styles from './index.module.scss'
const { withRouter } = router

class ProductTable extends React.Component {
 constructor(props) {
   super(props);
   this.state = {};
   this.columns = [
     {
       title: '商品',
       dataIndex: 'product',
       render: (text, record, index) => {
         return (
           <div className={styles['product']}>
             <img className={styles['product-img']} src={JSON.parse(record.goodsInfo).url} alt="" />
             <span className={styles['product-name']}>{JSON.parse(record.goodsInfo).productName}</span>
           </div>
         )
       }
     },
     {
       title: '规格',
       dataIndex: 'specName',
       align: 'right',
       width: '10%',
       render: (text, record, index) => {
        return (
          <span>{JSON.parse(record.goodsInfo).spceName}</span>
        )
      }
     },
     {
        title: '单价',
        dataIndex: 'price',
        align: 'right',
        width: '5%',
        render: (text, record, index) => {
          return (
            <span>{JSON.parse(record.goodsInfo).price}</span>
          )
        }
     },
     {
       title: '数量',
       dataIndex:'number',
       align: 'center',
       width: '10%'
     },
     {
       title: '状态',
       dataIndex: 'status',
       align: 'right',
       width:'10%',
       render: (text, record, index) => {
         const { orderDetail } = this.props
         const { stateName } = orderDetail
         return(
           <span>{stateName}</span>
         )
       }
     }
   ]
 }
  render() {
    const { orderDetail } = this.props
    const { orderDetails } = orderDetail
    return(
      <div className={styles['product-table']}>
        <Table
          dataSource={orderDetails}
          pagination={false}
          columns={this.columns}
          rowKey={(r, i) => (i)}
          bordered
        />
      </div>
    )
  }
}

const mapStateToProps = ({ 'businessManagement_allorders': state }) => {
  const { orderDetail, orderState } = state
  return { orderDetail, orderState }
}

export default withRouter(connect(mapStateToProps)(ProductTable))