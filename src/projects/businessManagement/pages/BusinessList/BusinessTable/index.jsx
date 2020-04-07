import React from  'react'
import styles from '../index.module.scss'
import { connect, router } from 'dva'  
import { Table, Popconfirm } from 'antd'
import MobileBubbleCard from './mobileBubbleCard'           // 用户手机号码显示的气泡框组件

const { withRouter, Link } = router

// 商家列表组件
class BusinessTable extends React.Component{
  constructor(props){
    super(props)
    this.state = {   
      isLoading: false
    }

    // 表头
    this.columns = [
      {
        key: 'shopname',
        // dataIndex:'vipName',
        render: (item, record) => {
          const { match } = this.props
          return (
            <div className={styles.user_info}>
              <div 
                className={styles.avatar} 
                style={{ backgroundImage: `url("${record.logoUrl}")` }}
              ></div>
              <Link to={`${match.path}/info/${record.id}`}>
                <span className={styles.shopname}>
                  {record.merchantName}
                </span>
              </Link>
            </div>
          )
        }
      }, {
        dataIndex: 'typeName',
        width: '20%',
        render: (item,record) => {
          return <span>{record.typeName}</span>
        },
      }, {
        dataIndex: 'name',
        width: '10%',
        render: (item, record) => {
          return (
            <div className={styles.contacts}>
              <span>{record.realName}</span>
              <MobileBubbleCard
                mobile={record.mobile}   // 商家手机号码
              />
            </div>
          )
        }
      }, {
        dataIndex: 'operation',
        width: '15%',
        render: (item, record) => {
          const { match } = this.props
          return(
            <span className={styles.optionlist}>
              <Link
                className={styles.see} 
                to={`${match.path}/info/${record.id}`}
              > 查看 </Link>
              <Popconfirm 
                title="确定要删除吗?" 
                okText="确定" 
                cancelText="取消"  
                onConfirm={() => this.onDeleteBusiness(record.id)}
              >
                <span style={{ cursor: 'pointer' }}>删除</span>
              </Popconfirm>
            </span>
          )
        }
      }
    ]
  }

  // 获取商家列表
  handleGetBusinessList = async (page = 1, pageSize = 10) => {
   const { dispatch, businessName, businessTypeId } = this.props
   this.setState({ isLoading: true })
   const payload = {
     page,
     pageSize,
     id: businessTypeId === '' ? null : businessTypeId,
     merchantName: businessName === '' ? null : businessName
   }
   await dispatch({
     type: 'businessManagement_businessList/loadBusinessList',
     payload
   })
   this.setState({ isLoading: false })
  }

  // 获取商家信息
  handleGetBusinessInfo = (info) => {
    const { handleGetBusinessInfo } = this.props
    handleGetBusinessInfo(info)
  }

  // 切换页码
  handlePaginationChanged = (page, pageSize) => {
    this.handleGetBusinessList(page, pageSize)
  }

  // 删除商家
  onDeleteBusiness = (id) => {
    const { dispatch } = this.props
    dispatch({
      type: 'businessManagement_businessList/deleteBusiness',
      payload: id
    })
  }

  render(){
    const { businessLists, businessListParam} = this.props
    const { page, pageSize, total } = businessListParam
    const { isLoading } = this.state
    return(
      <Table
        dataSource={businessLists}
        columns={this.columns}
        loading={isLoading}
        rowKey={(r, i) => (i)}
        pagination={{
          current: page || 1,
          total: total || 0,
          pageSize: pageSize || 1,
          showTotal: total => `总共 ${total} 个商家`,
          onChange: this.handlePaginationChanged,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          onShowSizeChange: this.handlePaginationChanged,
        }}
        className={styles.business_list_table}
      />
    )
  }
  
  componentDidMount(){
    this.handleGetBusinessList()
  }
}

const mapStateToProps = ({ 'businessManagement_businessList': state }) => {
  const { businessLists, businessListParam, businessType } = state
  return { businessLists, businessListParam, businessType }
}

export default withRouter(connect(mapStateToProps)(BusinessTable))