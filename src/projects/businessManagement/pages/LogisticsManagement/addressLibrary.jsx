/**
 * 地址库
 */
import React from 'react';
import styles from './index.module.scss';
import { connect, router } from 'dva';
import { Row, Col, Button, Table, Modal, } from 'antd';
import AllBusiness from '../../components/AllBusiness/index'
import NewAddres from './newAddres';
import { deleteAddress, } from 'businessManagement/api/logisticsOperate';
const {  withRouter, Link } = router;


class AddressLibrary extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showAddres: false, // 地址弹出框 是否显示
      showEdit: false,   // 判断是新增 还是编辑
      editAddresData: [], // 选中项的数据
    }

    this.columns = [
      {
        title: '联系人',
        dataIndex: 'theContact',
      },
      {
        title: '联系方式',
        dataIndex: 'contact',
      },
      {
        title: '地址',
        dataIndex: 'contactAddress',
        render: (text,record) => {
          return(
            <span>{text}{record.detailedAddress}</span>
          )
        }
      },
      {
        title: '商家',
        dataIndex: 'merchantId',
        render: (text,record) => {
          const { merchantCore } = record;
          const { id } = merchantCore;
          return(
            <Link to = { `Business/info/${id}` }> {record.merchantCore.merchantName} </Link>
          )
        }
      },
      {
        title: '类型',
        dataIndex: 'type',
        render: (type) => {
          let typeText = '';
          switch (type) {
            default: 
            typeText = '';
            break;
            case 1:
              typeText = '发货地址';
              break;
            case 3:
              typeText = '提货地址';
            break;
            case 2:
              typeText = '退货地址';
            break;
          }

          return(
            <span> {typeText} </span>
          )
        }
      },
      {
        title: '操作',
        dataIndex: 'Operate',
        align: 'right',
        render: (text,record) => {
          return(
            <span>
              <span 
                className = { styles.operateStyle }
                onClick = { () => this.setState({ showAddres: true, showEdit: true, }) } 
              >
                编辑 
              </span>
              <span 
                className = { styles.operateStyle }
                onClick = { () => this.deleteIogistics(record) }
              > 
                删除 
              </span>
            </span>
          )
        }
      }
    ]
    
  }

  componentDidMount(){

    const { dispatch } = this.props;
    dispatch({
      type: 'businessManagement_logistics/loadStoreList',
    })
  }

  // 删除 地址
  deleteIogistics = (record) => {
    const id = record.id;
    const state = 1;
    const { dispatch, addressParam } = this.props;
    const { page, pageSize, total } = addressParam;

    let pageNum = '';

    Modal.confirm({
      title: '删除提示',
      content: '确定删除当前信息吗?',
      okText: '确定',
      cancelText: '取消',
      async onOk() {
        const params = {
          id, 
          state
        }
        const res = await deleteAddress(params);

        if ( ( page - 1 ) * pageSize === total - 1 ) {
          pageNum = page - 1; 
        } else {
          pageNum = page
        }

        if ( res.errorCode === 200 ) {
          Modal.success({ title: '删除成功!' });
          dispatch({
            type: 'businessManagement_logistics/loadAddressList',
            payload: { page: pageNum, pageSize }
          });
        }

      }
    })
  }

  // 分页 跳转配置
  handlepagintion = (page, pageSize) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'businessManagement_logistics/loadAddressList',
      payload: { page, pageSize }
    })
  }

  // 筛选后的商家列表
  handleGetOrderList = async ( merchantId ) => {
    const { dispatch } = this.props;

    await dispatch({
      type: 'businessManagement_logistics/getQueryMerchant',
      payload: { merchantId }
    })
  }
  
  // 关闭弹出框
  onCancel = () => {
    this.setState({
      showAddres: false,
      editAddresData: [],
      showEdit: false,
    })
  }

  render() {

    const {
      addressData, // 地址库 列表数据
      addressParam, // 地址库 页码配置
    } = this.props;

    const { page, pageSize, total } = addressParam;

    return(
      <div>
        <Row className = { styles.addressLibrary } type = 'flex' align = 'bottom'>
          <Col span={2} className={styles.secondTitle}> 地址库 </Col>

          <Col span = { 20 }> 
            <AllBusiness 
             className = { styles.allBusiness }
             onScreen = {this.handleGetOrderList} 
            />
          </Col>

          <Col span = { 2 } className = { styles.addStyle }> 
            <Button type="primary" icon="plus" onClick = {() => this.setState({ showAddres: true, showEdit: false })}> 新增地址 </Button>
          </Col>
        </Row>

        <Table
          className = { styles.logisticsTable }
          columns = { this.columns }      // 表头标题
          dataSource = { addressData }    // 表单数据
          rowKey = { item => item.id }    // 表格行 key 的取值
          pagination = {{                 // 分页配置
            total: total || 0,            // 数据总数 
            current: page || 1,           // 当前页数
            pageSize: pageSize,           // 每页条数
            showTotal: total => `总共 ${ total } 个订单 `, // 用于显示数据总量和当前数据顺序
            onChange: this.handlepagintion,               // 页码改变的回调
            onShowSizeChange: this.handlepagintion,       // pageSize 变化的回调
            // showSizeChanger: true,
            // pageSizeOptions: ['3', '10', '20', '30', '40'],
          }}
          onRow = {record => {           // 点击行获取当前数据
            let list1 = [];
            let list2 = [];
            let list3 = [];
            
            return {
              onClick: event => {
                // console.log(record);

                let typeBox = record.type;                   // 类型
                let theDefaultDataBox = record.theDefault;   // 默认项

                if (theDefaultDataBox === 1 ){
                  theDefaultDataBox = null;
                }

                // 发货地址 编辑 数据回填 || 清空 
                if ( typeBox === 1 ){
                  list1.push(typeBox);
                  list1.push(theDefaultDataBox);
                }
        
                // 退货地址 编辑 数据回填 || 清空
                if ( typeBox === 2 ){
                  list2.push(typeBox);
                  list2.push(theDefaultDataBox);
                }
          
                // 自提点 编辑 数据回填 || 清空
                if ( typeBox === 3 ){
                  list3.push(typeBox);
                  list3.push(theDefaultDataBox);
                }
                
                this.setState({
                  editAddresData: record,
                  list1:list1,
                  list2:list2,
                  list3:list3
                })
              }
            }
          }} 
        />

        {/* 地址 添加 与编辑 */}
        <NewAddres
          destyroyOnClose = { true }		       // 关闭时销毁 Modal 里的子元素
          visible = { this.state.showAddres }  // 显示弹窗
          onCancel = { this.onCancel }         // 关闭弹窗
          showEdit = { this.state.showEdit }   // 判断是否为编辑项
          editAddresData = { this.state.editAddresData } // 选中项的数据
          list1 = { this.state.list1 }                   // 发货地址数据
          list2 = { this.state.list2 }                   // 退货地址数据
          list3 = { this.state.list3 }                   // 自提点数据
        />
      </div>  
    )
  }
} 

const mapStateToProps = ({ businessManagement_logistics: state }) => {
  const { addressData, addressParam, storeData, } = state;

  return { addressData, addressParam, storeData, };
}
export default withRouter(connect(mapStateToProps)(AddressLibrary));