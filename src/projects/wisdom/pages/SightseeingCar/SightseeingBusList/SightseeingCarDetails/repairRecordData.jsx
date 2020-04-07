/**
 * 观光车详情 => 报修与维修记录
 */
import React from "react";
import styles from "../index.module.scss";
import { Timeline } from "antd";
import { connect, router } from 'dva';

// 时间轴
const TimelineItem = Timeline.Item;
const { withRouter } = router;

class repairRecordData extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      equipId: '',
    };
  };

  componentDidMount() {
    document.getElementById("scrollOperation").addEventListener("touchmove", this.bindScroll);
    document.getElementById("scrollOperation").addEventListener("scroll", this.bindScroll);
    this.restRoyaltyFormData();
    this.getRoyaltyForm();
  };

  componentWillUnmount() {
    document.getElementById("scrollOperation").addEventListener("touchmove", this.bindScroll);
    document.getElementById("scrollOperation").addEventListener("scroll", this.bindScroll);
  };

  // 重置维修记录
  restRoyaltyFormData = () => {
    const { dispatch, match} = this.props;
    const { params: { equipId } } = match;

    dispatch({
      type: 'wisdom_bus/restRoyaltyFormData',
      payload: { equipId }
    })
  };

  // 维修记录 列表
  getRoyaltyForm = () => {
    const { dispatch, match} = this.props;
    const { params: { equipId } } = match;
    // console.log(equipId);

    dispatch({
      type: 'wisdom_bus/getRoyaltyFormData',
      payload: { equipId }
    })
  };

  bindScroll = () => {
    // 滚动条滑动到底部加载数据
    const scrollDom = document.getElementById("scrollOperation");
    const { repairParams, dispatch, match } = this.props;
    const { params: { equipId } } = match;
    const { page, pageSize, total } = repairParams;

    if ( scrollDom.scrollTop + scrollDom.clientHeight === scrollDom.scrollHeight ) {
      let taotalList = Math.ceil(total / pageSize); // 一共有多少页,有余数进1;
     
      if ( page + 1 <= taotalList ) {
        let pageNum = page + 1;
        dispatch({
          type: 'wisdom_bus/getRoyaltyFormData',
          payload: { page: pageNum, equipId  }
        })
      } 
    }
  };

  render() {
    const { 
      repairData,
    } = this.props;

    return (
      <div className = { styles.sightseeingCarDetails_repair }>
        <div className = { styles.sightseeingCarDetails_identical_title }>
          报修与维修记录
        </div>

        <div
          className = { styles.sightseeingCarDetails_repair_content } id="scrollOperation" >
          <Timeline>
            {repairData && repairData.map(items => (
              <TimelineItem key={items.id}>
                {/* 报修类型 */}
                <span style = {{ color: items.type === 1 ? "#1890ff" : "red" }}>
                  { items.type === 0 ? "报修" : "维修" }
                </span>

                {/* 操作人员 */}
                <span> { items.empName } </span>

                {/* 操作时间 */}
                <span> { items.createTime } </span>

                {/* 损坏原因 */}
                <span> { items.damageReason } </span>

                {/* 备注 */}
                <span> { items.comment } </span>

                <div>
                  {
                    items.imgurlS !== null ? 
                    (<img style={{ width: 150, height: 110 }} src = { items.imgurlS } alt="" />) 
                    : 
                    ( "" )
                  }
                </div>
              </TimelineItem>
            ))}
          </Timeline>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ wisdom_bus: state }) => {
  const { repairData, repairParams, } = state;

  return { repairData, repairParams, }
};
export default withRouter(connect(mapStateToProps)(repairRecordData))