/* eslint-disable */
import React from 'react'
import styles from './index.module.scss'
import {Layout, Button } from 'antd'
import ChooseLineForm from './ChooseLine/index'
import TicketMessage from './AddTicketMessage/index'
import EditTicket from './EditForm/index'
import TicketTable from './TicketTable'
import { connect, router } from 'dva'


const { Content } = Layout;
const { withRouter } = router

//观光车票务管理组件
class TicketManagement extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      visible: false,              // 添加票务的Modal显示与否
      nextVisible: false,          // 选择线路后的下一步
      ticketData: [],              // 编辑票务时要回填的数据
      editVisible: false,          // 编辑的弹框显示与否
    }
  }

  componentDidMount() {
    this.handleGetLineList()
  }

	// 编辑票务
  onGetEditData = (ticketData) => {
    this.setState({
      ticketData: ticketData,    // 编辑时所要回填的数据
      editVisible: true,         // 编辑弹框显示
    })
  }
	
  // 获取线路列表
  handleGetLineList = (page = 1, pageSize = 9999) => {
    const { dispatch } = this.props
    dispatch({
      type: 'wisdom_ticketManagement/loadLine',
      payload: { page, pageSize }
    })
  }

  // 确定选择的线路
  onCreate = (e) => {
    this.setState({
      visible: false,
      nextVisible: true
    });
  };
	
  // 取消选择线路
  onCancel = (e) => {
    this.setState({
    	visible: false,
    })
	};
     
  render(){
    return(
      <Content id='sightseeingcarticket'>
        {
          !this.state.editVisible && !this.state.visible && !this.state.nextVisible ?
            <React.Fragment>
              <div className={styles.addticket}>
                <Button type="primary" onClick={() => this.setState({ visible: true })} >新增</Button>
              </div>

              {/* 票务列表表格 */}
              <TicketTable
                editTicket={this.onGetEditData}
              />
            </React.Fragment>
            : ''
        }
			
				{/* 选择线路的组件 */}
        <ChooseLineForm
          destroyOnClose={true}                         // 关闭时销毁 Modal 里的子元素
          visible={this.state.visible}                  // 弹框显示与否
          onCreate={this.onCreate}                      // 新建一条数据
          onCancel={this.onCancel}                      // 关闭弹出框
        />

				{/* 添加票务的组件 */}
        <TicketMessage
          destroyOnClose={true}                         // 关闭时销毁 Modal 里的子元素
          visible={this.state.nextVisible}
          hideModal={() => this.setState({ nextVisible: false })}
          requestList={this.requestList}
        />
      
        {/* 编辑票务的组件 */}
        <EditTicket
          destroyOnClose={true}                         // 关闭时销毁 Modal 里的子元素
          visible={this.state.editVisible}
          data={this.state.ticketData}
          hideModal={() => this.setState({ editVisible: false })}
          requestList={this.requestList}
        />
      </Content>
    )
	}
}

const mapStateToProps = ({ 'wisdom_ticketManagement': state }) => {
  const { ticketList, ticketListParam, lineLists } = state
  return { ticketList, ticketListParam, lineLists }
}

export default withRouter(connect(mapStateToProps)(TicketManagement))
