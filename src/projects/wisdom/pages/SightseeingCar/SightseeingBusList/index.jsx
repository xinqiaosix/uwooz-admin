// 观光车列表 
import React from 'react';
import styles from './index.module.scss';
import { Layout, Modal, Table, Dropdown, Menu, Badge, Button } from 'antd';
import { connect, router } from 'dva';
import SightseeingCarDetails from './SightseeingCarDetails';
import AddSightseeingCar from './addComponents.jsx';

const { Content } = Layout;
const { withRouter, Link } = router;

// 观光车列表 组件
class SightseeingBusList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      headerId: '',       // 观光车id
      showCarDetails: 'none',    // 是否显示 观光车详情
      showAddComponents: false,  // 是否显示 添加数据的组件
    }

    // 表头
    this.columns = [
      {
        title: '序号',
        dataIndex: 'id',
        width: "5%",
      }, {
        title: '观光车名称',
        dataIndex: 'sightseeingName',
        width: "10%",
        render: (text) => (
          <span className={ styles.sightseeingName }>{text}</span>
        )
      }, {
        title: '车辆型号',
        dataIndex: 'typeName',
        width: '8%',
      }, {
        title: '车牌号',
        dataIndex: 'carNumber',
        width: '10%',
      }, {
        title: '车辆状态',
        dataIndex: 'sightseeingStates',
        width: '8%',
        render(text,record) {
          return (
            <Badge status={ text === 0 ? 'success' : 'error' } text={ text === 0 ? '正常' : '损坏' } />
          );
        },
      }, {
        title: '运营状态',
        dataIndex: 'operatingState',
        width: '8%',
        render(text,record) {
          return (
            <Badge status={ text === 0 ? 'warning' : 'success' } text={ text === 0 ? '闲置' : '运营中' } />
          );
        },
      }, {
        title: '司机名称',
        dataIndex: 'driverName',
        width: '8%',
        render: (text) => (
          <span>
            {text == null ? '— — —' : text}
          </span>
        )
      }, {
        title: '线路名称',
        dataIndex: 'routeName',
        width: '20%',
        render: (text) => (
          <span>
            {text == null ? '— — —' : text}
          </span>
        )
      }, {
        title: '管理人员',
        dataIndex: 'manageId',
        width: '8%',
        render: (text, record) => {
          const { adminDataList } = this.props;
          let routeList = adminDataList && adminDataList.map(items => {
            let manageIdText = []
            if (record.manageId === items.id) {
              manageIdText.push(items.realName);
            }
            return (
              <span key={items.id}>
                <span>{manageIdText == null ? '— — —' : manageIdText}</span>
              </span>
            )
          })
          return routeList;
        }
      }, {
        title: '操作',
        dataIndex: 'operation',
        width: '8%',
        render: (text, record) => {
          const { match } = this.props;
          return (
            <span className={ styles.driverManagement_operation }>
              <Link to = { `${match.path}/${record.id}/${record.equipId}` }> 详情 </Link>  
              <span className={ styles.driver_empty }></span>
              <Dropdown overlay={menu} trigger={['click']} className={ styles.bus_dropdown }>
                <span> 更多 </span>
              </Dropdown>
            </span>
          )
        }
      }

    ];

    const menu = (
      <Menu className={ styles.sightseeingCar_menuStyle }>
        <div id = { styles.sanjiao_top }></div>
        <Menu.Item>
          <span onClick = { this.handleRepair }> 报修 </span>
        </Menu.Item>
        <Menu.Divider></Menu.Divider>
        <Menu.Item>
          <span onClick = { this.handleDelete }> 删除 </span>
        </Menu.Item>
      </Menu>
    );
  };

  componentDidMount() {
    this.loadsightseeingBusList();
    this.adminData();
  };

  // 必须值（不知道为什么要有）
  saveFormRef = (formRef) => {
    this.formRef = formRef;
  };

  // 加载 观光车列表
  loadsightseeingBusList = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'wisdom_bus/loadsightseeingBusList',
    })
  }

  // 加载 管理人员列表
  adminData = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'wisdom_bus/getAdminData',
    })
  };

  // 新增区 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  // 新建一条数据
  onCreate = (e) => {  
    this.setState({
      showAddComponents: false,
    });
  };

  // 点击关闭弹出框 
  onCancel = () => {
    this.setState({
      showAddComponents: false,
      confirmLoading: false,
    })
  };

  // 删除 => 报修区 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    
  // 删除数据
  handleDelete = () => {

    const { dispatch } = this.props;
    let id = this.state.headerId;

     Modal.confirm({
      title: '删除提示',
      content: '确定删除当前信息吗?',
      okText: '确定',
      cancelText: '取消',
      async onOk() {
        const { errorCode, msg } = await dispatch({
          type: 'wisdom_bus/deleteSightseeingBus',
          payload: id 
        });
        if ( errorCode === 200 ){
          Modal.info({ content: msg });
        }
      }
    })
  };

  // 报修
  handleRepair = () => {
    const { manageId, equipId } = this.state.rowData;
    const { dispatch } = this.props;

    const payload = {
      equipId,
      manageId,
      type: 0
    }

    Modal.confirm({
      title: '报修提示',
      content: '你确定要对这个设备进行报修吗？',
      okText: '确定',
      cancelText: '取消',
      async onOk() {

        const { errorCode } = await dispatch({
          type: 'wisdom_bus/handleRepair',
          payload
        });

        if ( errorCode === 200 ) {
          Modal.info({ content: '报修成功！',  })
        } 
      }
    })

  }

  render() {
    const {
      busList,
      busParam
    } = this.props;

    let { page, total } = busParam;

    return (
      <Content className={ styles.SightseeingCarList }>

        <div className={ styles.SightseeingCarList_tab }>
          <div className={styles.addbus}>
            <Button type="primary" onClick={ () => this.setState({ showAddComponents: true }) } >新增</Button>
          </div>
          <Table
            rowKey = { record => record.id }
            columns = { this.columns }                // 表头数据 
            dataSource = { busList }                  // 数据
            operationList = { this.operationList }    // 表单操作列表
            bordered = { false }                      // 是否显示边框
            details = { this.details }                // 设置详情                                 
            handleDelete = { this.handleDelete }      // 删除数据
            repair = { this.handleRepair }            // 报修
            isSelect = { this.isSelect }              // 下拉框选项
            selectItems = { this.selectItems }        // 下拉框选项列表项
            className={styles.bus_list_table}
            onRow = { record => {                     // 点击行
              return {
                onClick: event => {
                  this.setState({
                    headerId: record.id,
                  })
                },
              };
            }}
            pagination = {{
              total: total,
              showTotal: total => `共 ${total} 条`,
              hideOnSinglePage: true,               // 只有一页时 隐藏分页器                           
              showQuickJumper: true,                // 开启 可以快速跳转至某页                                        
              onChange: (current, pageSize) => {
                page = current;
                const { dispatch } = this.props;

                dispatch({
                  type: 'wisdom_bus/loadsightseeingBusList',
                  payload: { page, pageSize }
                })
              }
            }}
          />          
        </div>

        {/* 添加数据组件 */}
        <AddSightseeingCar 
          onRef = { this.onRef }
          destyroyOnClose = { true }                          // 关闭时销毁 Modal 里的子元素
          visible = { this.state.showAddComponents }          // 是否显示弹窗
          confirmLoading = { this.state.confirmLoading }      // 确认按钮 loading
          onCreate = { this.onCreate }                        // 新建一条数据
          onCancel = { this.onCancel }                        // 关闭弹窗 
        />

        {/* 观光车详情组件 */}
        <div className={ styles.SightseeingCarDetails } style = {{ display: this.state.showCarDetails }}>
          <SightseeingCarDetails />
        </div>

      </Content>
    )
  }
}

// modal 中 的 state 通过组件的 props 注入组件
const mapStateToProps = ({ wisdom_bus: state }) => {
  const { busList, busParam, adminDataList } = state;

  return { busList, busParam, adminDataList };
};
export default withRouter(connect(
  mapStateToProps
)(SightseeingBusList))