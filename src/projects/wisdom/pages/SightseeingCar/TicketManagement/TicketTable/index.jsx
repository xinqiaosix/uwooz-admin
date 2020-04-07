/* eslint-disable */
import React from 'react'
import styles from '../index.module.scss'
import { Table } from 'antd'
import CustomExpandIcon from '../customExpandIcon'
import { connect, router } from 'dva'
const { withRouter } = router

//观光车票务管理组件
class TicketManagement extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,            // 是否显示加载中动画
    }

    // 票务表头
    this.columns = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        // align: 'center',
        width: '5%',
        render: (text, record, index) => {
          return index + 1
        }
      },
      {
        title: '票务',
        dataIndex: 'name',
        key: 'name',
        width: '15%',
      },
      {
        title: '线路',
        dataIndex: 'routeName',
        key: 'routeName',
        width: '15%',
      },
      {
        title: '站点',
        dataIndex: 'stationName',
        key: 'stationName',
        width: '15%',
      },
      {
        title: '单价',
        dataIndex: 'prices',
        key: 'prices',
        // align: 'center',
        width: '5%',
        render: (text, record) => (
          <div>
            {
              record.orderProducts.length === 0 ?
                <span>￥{record.adultPrice}</span> : '/'
            }
          </div>
        )
      },
      {
        title: '可使用积分',
        dataIndex: 'coin',
        key: 'coin',
        // align: 'center',
        width: '10%',
        render: (text, record) => (
          <div>
            {
              record.orderProducts.length === 0 ?
                <span>{record.coin}</span> : '/'
            }
          </div>
        )
      },
      {
        title: '提成比例',
        dataIndex: 'ticheng',
        key: 'ticheng',
        // align: 'center',
        width: '10%',
        render: (text, record) => (
          <div>
            {
              record.orderProducts.length === 0 ?
                <span>{record.proportion}%</span> : '/'
            }
          </div>
        )
      },
      {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
        width: '15%',
      },
      {
        title: '操作',
        dataIndex: 'id',
        key: 'Operate',
        // align: 'center',
        width: '10%',
        render: (text, record) => (
          <div className={styles.operation}>
            <span className={styles.edit}>
              <span onClick={ () => this.onGetEditData(record)}>编辑&nbsp;&nbsp;</span>
            </span>
            <span className={styles.edit}>
              <span data-id={record.id} data-list={JSON.stringify(record.orderProducts)} onClick={this.onDelete} >删除</span>
            </span>
          </div>
        ),
      }
    ]
  }

  componentDidMount() {
    this.handleGetTicketList()
  }

	// 删除票务
  onDelete = (e) => {
    const { dispatch } = this.props
    let deleteList = []
    let list = JSON.parse(e.currentTarget.dataset.list)
    let ticketId = e.currentTarget.dataset.id
    if (ticketId !== undefined) {
      deleteList.push(ticketId)
    }
    else {
      list.map((item, index) => {
        deleteList.push(item.id)
      })
    }

    const payload = {
      ids: deleteList.toString()
    }
    dispatch ({
      type: 'wisdom_ticketManagement/deleteTickets',
      payload
    })
  }

	// 编辑票务
  onGetEditData = (record) => {
    const { editTicket } = this.props
    editTicket(record)
  }
	
  // 请求票务列表的方法
  handleGetTicketList = async (page = 1, pageSize = 10) => {
    const { dispatch } = this.props
    this.setState({ isLoading: true })
    await dispatch({
      type: 'wisdom_ticketManagement/loadTickets',
      payload:{ page, pageSize }
    })
    this.setState({ isLoading: false })
  }
  
  //切换页码
  handlePaginationChanged = (page, pageSize) => {
    this.handleGetTicketList(page, pageSize)
  }

  // 点击展开的数据
  onExpandedRowRender = (expandedRows) => {
    // 展开数据的表头
    const columns = [
      {
        title: '规格',
        dataIndex: 'name',
        key: 'name',
        width: '25%',
        render: (text, record, index) => {
          return (
            <div className={styles.spec_name}>
              <span type="" style={{ height: '6px', width: '6px', borderRadius: '50%', background: '#ff9212', marginRight: '3px' }}></span>
              {record.name}
            </div>
          )
        }
      },
      {
        title: '单价',
        dataIndex: 'adultPrice',
        key: 'adultPrice',
        width: '25%',
        render: (text, record, index) => {
          return (
            <span>￥{record.adultPrice}</span>
          )
        }
      },
      {
        title: '可使用积分',
        dataIndex: 'coin',
        key: 'coin',
        width: '25%'
      },
      {
        title: '提成比例',
        dataIndex: 'proportion',
        key: 'proportion',
        width: '25%',
        render: (text, record, index) => {
          return (
            <span>{record.proportion}%</span>
          )
        }
      }
    ];

    return (
      <Table
        columns={columns}
        dataSource={expandedRows.orderProducts}
        rowKey={(r, i) => (i)}
        pagination={false}
      />
    );
  };

  render(){
    const { ticketList, ticketListParam } = this.props
    const { page, pageSize, total } = ticketListParam
    return(
      <Table
        columns={this.columns}
        dataSource={ticketList}
        rowKey={(r, i) => (i)}
        expandedRowRender={this.onExpandedRowRender}
        expandIcon={CustomExpandIcon}
        pagination={{
          current: page || 1,
          total: total || 0,
          pageSize: pageSize || 1,
          showTotal: total => `共 ${total} 条`,
          onChange: this.handlePaginationChanged,
          showSizeChanger: true,
          pageSizeOptions: ['3', '10', '20', '30', '40'],
          onShowSizeChange: this.handlePaginationChanged,
        }}
        className={styles.ticket_list_table}
      />
    )
	}
}

const mapStateToProps = ({ 'wisdom_ticketManagement': state }) => {
  const { ticketList, ticketListParam } = state
  return { ticketList, ticketListParam }
}

export default withRouter(connect(mapStateToProps)(TicketManagement))
