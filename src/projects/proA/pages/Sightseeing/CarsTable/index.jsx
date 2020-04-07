import React from 'react'
import { connect, router } from 'dva'
import { Table, Badge, Dropdown, Menu } from 'antd'

import styles from './index.module.scss'

const { withRouter, Link } = router

class CarsTable extends React.Component {
  state = {
    isLoading: false,
  }

  componentDidMount() {
    this.getCars()
  }

  /**
   * @param {number} page 默认 1 
   * @param {number} pageSize 默认 3
   */
  getCars = async (page = 1, pageSize = 3) => {
    const { dispatch } = this.props

    this.setState({ isLoading: true })
    await dispatch({
      type: 'proA_sightseeing/loadSightseeingCars',
      payload: { page, pageSize }
    })
    this.setState({ isLoading: false })
  }

  handlePaginationChanged = (page, pageSize) => {
    this.getCars(page, pageSize)
  }

  handleRepair = () => {}

  handleDelete = (id) => {
    const { dispatch } = this.props
    dispatch({
      type: 'proA_sightseeing/deleteSightseeingCar',
      payload: id,
    })
  }

  handleMoreItemsClick = (record, e) => {
    const { key } = e
    const { id } = record

    switch (key) {
      case 'repair':
        return this.handleRepair()
      case 'delete':
        return this.handleDelete(id)
    
      default:
        return
    }
  }
  
  render() {
    const { className = '', sightseeingCars, sightseeingCarsParam } = this.props
    const { isLoading } = this.state
    const { page, pageSize, total } = sightseeingCarsParam

    // const menu = (
    //   <Menu className={ styles.sightseeingCar_menuStyle }>
    //     <div id = { styles.sanjiao_top }></div>
    //     <Menu.Item>
    //       <span onClick = { this.handleRepair }> 报修 </span>
    //     </Menu.Item>
    //     <Menu.Divider></Menu.Divider>
    //     <Menu.Item>
    //       <span onClick = { this.handleDelete }> 删除 </span>
    //     </Menu.Item>
    //   </Menu>
    // )

    const menu = (record) => (
      <Menu onClick={e => this.handleMoreItemsClick(record, e)}>
        <div id = { styles.sanjiao_top }></div>
        <Menu.Item key="repair">
          报修
        </Menu.Item>
        <Menu.Divider></Menu.Divider>
        <Menu.Item key="delete">
          删除
        </Menu.Item>
      </Menu>
    )
    
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
      },
      {
        title: '观光车名称',
        dataIndex: 'sightseeingName',
      },
      {
        title: '车辆型号',
        dataIndex: 'typeName',
      },
      {
        title: '车牌号',
        dataIndex: 'carNumber',
      },
      {
        title: '车辆状态',
        dataIndex: 'sightseeingStates',
        render(sightseeingStates) {
          let badgeProps = {}
          switch (sightseeingStates) {
            case 0:
              badgeProps = {
                status: 'success',
                text: '正常',
              }
              break
            case 1:
              badgeProps = {
                status: 'error',
                text: '损坏',
              }
              break
            default:
              badgeProps = {
                status: 'success',
                text: '正常',
              }
              break
          }
          return <Badge {...badgeProps}></Badge>
        },
      },
      {
        title: '运营状态',
        dataIndex: 'operatingState',
      },
      {
        title: '司机名称',
        dataIndex: 'driverName',
        // render: (text, record) => (
        //   <span>
        //     {record.driverName == null ? '— — —' : record.driverName}
        //   </span>
        // ),
        render: (driverName) => (
          <span>
            {driverName === null ? '— — —' : driverName}
          </span>
        ),
      },
      {
        title: '线路名称',
        dataIndex: 'routeName',
        // render: (text, record) => (
        //   <span>
        //     {record.routeName == null ? '— — —' : record.routeName}
        //   </span>
        // ),
      },
      {
        title: '管理人员',
        dataIndex: 'manageId',
        // render: (text, record) => {
        //   let routeList = this.state.adminDataList.map(items => {
        //     // console.log(items);
        //     let manageIdText = []
        //     if (record.manageId === items.id) {
        //       manageIdText.push(items.realName);
        //     }
    
        //     return (
        //       <span key={items.id}>
        //         <span>{manageIdText == null ? '— — —' : manageIdText}</span>
        //       </span>
        //     )
    
        //   })
        //   return routeList;
        // },
        render: (manageId) => {
          const { managesById } = this.props
          return <span>{managesById[manageId] && managesById[manageId].realName}</span>
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        // render: (text, record) => (
        //   <span className={ styles.driverManagement_operation }>
        //     <a onClick={() => this.detailsLink(record)}> 详情 </a>
        //     <span className={ styles.driver_empty }></span>
        //     {/* <Dropdown overlay={<MenuMultiplexing/>} trigger={['click']}> */}
        //     <Dropdown overlay={menu} trigger={['click']}>
        //       <a className="ant-dropdown-link" > 更多 </a>
        //     </Dropdown>
        //   </span>
        // ),
        render: (text, record) => {
          const { match } = this.props
          return (
            <div>
              <Link to={`${match.path}/${record.id}`}>详情</Link>
              &nbsp;
              <span className={ styles.driver_empty }></span>
              <Dropdown overlay={menu(record)} trigger={['click']}>
                <span style={{ cursor: 'pointer', color: 'blue' }}>更多</span>
              </Dropdown>
            </div>
          )
        }
      }
    ]
    
    return (
      <React.Fragment>
        <Table
          className={`${className} ${styles['root']}`}
          rowKey={item => item.id}
          columns={columns}
          dataSource={sightseeingCars}
          loading={isLoading}
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
        ></Table>
      </React.Fragment>
    )
  }
}

const mapStateToProps = ({ proA_sightseeing: page1 }) => {
  const { sightseeingCars, sightseeingCarsParam, manages } = page1

  const managesById = manages.reduce((acc, item) => {
    const { id } = item
    acc[id] = item
    return acc
  }, {})
  
  return { sightseeingCars, sightseeingCarsParam, managesById }
}

export default withRouter(connect(mapStateToProps)(CarsTable))
