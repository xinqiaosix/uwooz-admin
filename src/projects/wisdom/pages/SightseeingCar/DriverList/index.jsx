/*
 * 司机列表
 */
import React from 'react';
import { connect, router} from 'dva';
import { Table, Button } from 'antd';
import styles from  './index.module.scss';
import AddComponents from "./AddDriver/index";

const { withRouter, Link } = router;

class DriverList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayAdd: false,              // 新增组件 显示控制
      visible: false,                 // 是否显示弹窗
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    
    dispatch({
      type: "wisdom_driver/loadDriverList"
    });
  }

  // 分页 跳转 操作
  handlePagination = ( page, pageSize ) => {
    const { dispatch } = this.props;

    dispatch({
      type: "wisdom_driver/loadDriverList", // 如果在 model 外调用，需要添加 namespace
      payload: { page, pageSize } // 需要传递的参数
    });
  } 

  // 删除司机
  handleDelete = (record) => {
    const { id } = record;
    const { dispatch } = this.props;

    dispatch ({
      type: 'wisdom_driver/handleDeleteDriver',
      payload: id,
    })
  }

  render() {

    const { driverList, driverParam } = this.props;
    const { page, pageSize, total } = driverParam; 

    // 表头
    const columns = [
      {
        title: "序号",
        dataIndex: "id",
        width: "6%"
      },
      {
        title: "司机",
        key: "imgUrl",
        width: "16%",
        render: (item, record) => (
          <div>
            <span onClick = { () => this.detailsLink(record) }>
              <img src = { item.imgUrl } className = { styles.headPortrait } alt="" />
              <span className = { styles.driverName }> { item.driverName } </span>
            </span>
          </div>
        )
      },
      {
        title: "手机",
        dataIndex: "userName",
        width: "15%"
      },
      {
        title: "性别",
        dataIndex: "sex",
        width: "8%",
        render: (sex) => (
          <span >{ sex === 0 ? "女" : '男' }</span>
        )
      }, 
      {
        title: "年龄",
        dataIndex: "age",
        width: "8%"
      },
      {
        title: "入职时间",
        dataIndex: "entryDate",
        width: "10%"
      },
      {
        title: "线路权限 ",
        dataIndex: "routeNames",
        width: "15%",
        render: ( routeNames ) => {
          // console.log(routeNames)
          let routeList = routeNames.map(items => {
            return (
              <span key = { items.routeId }>
                <span className = { styles.routeName } >{ items.routeName }</span>
              </span>
            );
          });
          return routeList;
        }
      },
      {
        title: "操作",
        dataIndex: "operation",
        width: "10%",
        render: (text,record) => {
          const { match } = this.props;
          return (
            <span className = { styles.driverOperate }>
              {/* <span 
                onClick = { () => this.handleDetailsLink(record) } 
                className = { styles.driver_button }
              > 
                详情 
              </span> */}
              <Link to={`${match.path}/${record.id}`} > 详情 </Link>

              <span className = { styles.driver_empty } />

              <span 
                onClick = { () => this.handleDelete(record) } 
                className = { styles.driver_button }
              > 
                删除 
              </span>
            </span>
          )
        }
      }
    ];

    return(
      <div className = { styles.driverList }>
        <div className={styles.adddriver}>
					<Button type="primary" onClick={ () => this.setState({ displayAdd: true }) } >新增</Button>
				</div>
        <Table 
          columns = { columns }                   // 表头标题
          dataSource = { driverList }             // 表单数据
          rowKey = { item => item.id }            // 表格行 key 的取值
          pagination = {{                         // 分页设置
            total: total || 0,                    // 条数
            current: page || 1,                   // 当前页数
            pageSize: pageSize || 1,              // 每页条数
            showTotal: total => `共 ${total} 条`, // 显示总条数
            showQuickJumper: true,                // 开启 快速跳转
            showSizeChanger: true,                // 是否可以改变 pageSize
            onChange: this.handlePagination,      // 页码改变的回调         
            onShowSizeChange: this.handlePagination,        // pageSize 变化的回调
            pageSizeOptions: ['3', '10', '20', '30', '40'], // 指定每页可以显示多少条
          }}
          className={styles.driver_list_table}
        />

        {/* 添加司机组件 */}
        <AddComponents
          destyroyOnClose = { true }                           // 关闭时销毁 Modal 里的子元素
          wrappedComponentRef = { form => (this.form = form) } // 必需值 用来获取form 表单值
          visible = { this.state.displayAdd }                  // 控制添加的弹出框
          showModal = { () => this.setState({ displayAdd: !this.state.displayAdd }) }
      />
      </div>
    );
  }
}

// modal 中 的 state 通过组件的 props 注入组件
const mapStateToProps = ({ 'wisdom_driver': state }) => {
  // console.log(state)
  const { driverList, driverParam  } = state;
  
  return { driverList, driverParam } 
} 

export default withRouter( connect( 
  mapStateToProps 
)( DriverList ))