/**
 *  司机 => 上下班记录模块
 */
import React from "react";
import styles from '../index.module.scss';

// antd相关引入
import { Timeline } from "antd";
import { connect } from 'dva';

// 时间轴
const TimelineItem = Timeline.Item;

class DriverPunchInRecord extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {};

  }

  componentDidMount() {
    document.getElementById("scrolls").addEventListener("touchmove", this.bindScroll);
    document.getElementById("scrolls").addEventListener("scroll", this.bindScroll);

  }

  componentWillUnmount() {
    document.getElementById("scrolls").addEventListener("touchmove", this.bindScroll);
    document.getElementById("scrolls").addEventListener("scroll", this.bindScroll);
  }


  bindScroll = () => {

    //滚动条滑动到底部加载数据
    const scrollDom = document.getElementById("scrolls");

    if ( scrollDom.scrollTop + scrollDom.clientHeight === scrollDom.scrollHeight ) {

      const { dispatch, commuteRecordParam, driverId} = this.props;
      const { total } = commuteRecordParam;
      let { page, pageSize } = commuteRecordParam;

      let taotalList = Math.ceil(total / pageSize);  // 一共有多少页,有余数进1;
   
      if ( (page + 1) <= taotalList ) {
        page = page + 1;

        dispatch({
          type: 'wisdom_driver/loadCommuteRecordList',
          payload: {page, driverId}
        })

      }
    }
  };

  render() {

    const {
      commuteRecord,          // 上下班记录的数据
      driverHead,             // 选中项的数据
    } = this.props;

    return (
      <div className = { styles.commuteRecord }>
        <div className = { styles.title }>
          上下班记录
        </div>

        <div className = { styles.content } id="scrolls">
          <Timeline>
            {
              commuteRecord.map(items => (
                <TimelineItem key = { items.id }>
                  <span>{ items.addTime }</span>
                  <span  style = {{ color: items.type === 0 ? "#0aca66" : "#1890ff" }} >
                    { items.type === 0 ? "上班" : "下班" }
                  </span>
                  <span>{ items.carNumber }</span>
                  {
                    driverHead.routeNames && driverHead.routeNames.map(item => {
                      return (
                        <span key = { item.routeId } style = {{ paddingRight: "15px" }}>
                          { item.routeName }
                        </span>
                      );
                    })
                  }
                </TimelineItem>
              ))
            }
          </Timeline>
        </div>
        
    </div>
    );
  }
}


const mapStateToProps = ({ 'wisdom_driver': state }) => {
  const { driverHead  } = state;
  return { driverHead }
  // const { commuteRecord, commuteRecordParam, driverHead  } = state;
  // return { commuteRecord, commuteRecordParam, driverHead }
}
export default connect(
  mapStateToProps
)(DriverPunchInRecord)