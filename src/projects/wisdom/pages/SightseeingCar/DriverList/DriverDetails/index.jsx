/**
 * 司机详情 组件
 */
import React from "react";
// import './index.scss';
import styles from "../index.module.scss";
import { connect, router } from 'dva';

// 面包屑组件
import DriverHeaderData from "./driverHeaderData";
import DriverPunchInRecord from "./driverPunchInRecord";
import DriverRoyalty from "./driverRoyalty";

// antd 相关引入;
import { Layout, } from "antd";

const { withRouter } = router;
const { Content } = Layout;

// 司机详情 组件
class DriverDetails extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      id: this.props.match.params.id,  // 传过来的数据
    };
  }

  componentDidMount() {
   this.handledriver();
   this.getCommuteRecordList();
   this.loadCommuteRecord();
  }
   
  // 请求 司机详情头部数据
  handledriver = () =>{
    const { dispatch } = this.props;
    const id = this.state.id

    dispatch({
      type: "wisdom_driver/loadDriverHead",
      payload: id // 需要传递的参数
    });
  };

  // 重置 上下班记录列表
  getCommuteRecordList = () => {
    const { dispatch} = this.props;
    const driverId = this.state.id
    dispatch({
      type: 'wisdom_driver/restCommuteRecordList',
      payload: driverId
    });
  };

  // 加载 上下班记录列表
  loadCommuteRecord = () => {
    const { dispatch } = this.props;
    const driverId = this.state.id
    dispatch({
      type: 'wisdom_driver/loadCommuteRecordList',
      payload: driverId
    })
  };

  render() {
    const {
      match,               // 选中项的id
      commuteRecord, 
      commuteRecordParam,
    } = this.props;

    const { params: { id } } = match;

    return (
      <React.Fragment >

        <Content className = { styles.driverDetailsData }>

          {/* 司机详情头部 */}
          <DriverHeaderData />

          <section className = { styles.driverDetailsData_minInfo }>

            {/* 上下班记录 */}
            <DriverPunchInRecord
              driverId = { id } // 司机id
              commuteRecord = { commuteRecord }
              commuteRecordParam = { commuteRecordParam }
            />

            {/* 提成 */}
            <DriverRoyalty
              driverId = { id } // 司机id
            />

          </section>
        </Content>
      </React.Fragment>
    );
  }
}

// modal 中 的 state 通过组件的 props 注入组件
const mapStateToProps = ({ wisdom_driver: state }) => {
  const { commuteRecord, commuteRecordParam } = state;
  return { commuteRecord, commuteRecordParam }
}

export default withRouter( connect(
  mapStateToProps
)(DriverDetails)) 