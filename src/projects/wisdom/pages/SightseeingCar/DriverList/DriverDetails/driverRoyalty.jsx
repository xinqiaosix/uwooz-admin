/**
 *  司机 => 提成模块
 */
import React from "react";
import styles from '../index.module.scss';
import { connect, } from 'dva';

// antd相关引入
import { DatePicker, Table } from "antd";

const { MonthPicker } = DatePicker;

class DriverRoyalty extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      startTime: [],
      queryMonth: '',
      queryDay: '',
    };

    // 司机提成数据表
    this.columns = [
      {
        title: "序号",
        key: "id",
        dataIndex: "id",
        align: "center",
        width: "10%"
      },
      {
        title: "票务类型",
        key: "ticketName",
        dataIndex: "ticketName",
        align: "center",
        width: "25%"
      },
      {
        title: "数量",
        dataIndex: "num",
        align: "center",
        width: "10%"
      },
      {
        title: "提成金额",
        key: "pushMany",
        dataIndex: "pushMany",
        align: "center",
        width: "15%"
      },
      {
        title: "检票时间",
        key: "addTime",
        dataIndex: "addTime",
        align: "center",
        width: "25%",
        sorter: (a, b) =>
          new Date(a.addTime).getTime() - new Date(b.addTime).getTime(),
          sortDirections: ["descend", "ascend"]
      },
      {
        title: "结算状态",
        key: "states",
        dataIndex: "states",
        align: "center",
        width: "15%",
        render: (states) => (
          <span style={{ color: states === 0 ? '' : '#1890ff' }}> { states === 0 ? '未结算提成' : '已结算提成' } </span>
        )
      }
    ];
  }

  componentDidMount() {
    this.loadroyaltyFormDataList();
  }

  loadroyaltyFormDataList = () => {
    const { dispatch, driverId, } = this.props;

    dispatch ({
      type: 'wisdom_driver/loadroyaltyForm',
      payload: { driverId }
    })

  }

  // 日历 组件 => 月份
  MonthPic = (date, dateString) => {
    this.setState({
      startTime: dateString
    });
 
    const { dispatch, driverId, } = this.props;
    const month = dateString;
  
    dispatch ({
      type: 'wisdom_driver/loadroyaltyForm',
      payload: { driverId , month }
    })
  };

  // 不可选择的日期
  disabledDate = current => {
    let startTime = this.state.startTime;

    if ( startTime.length !== 0 ) {
      let startYear = startTime.substring(0, 4);
      let startMonth = startTime.substring(6, 7) ;
      let endMonth = parseInt(startMonth) + 1;

      let startTotalTime = ` ${startYear}/0${startMonth}/01 `;
      let endTotalTime = ` ${startYear}/0${endMonth}/01 `;

      var StartMsec = Date.parse(startTotalTime);
      var endMsec = Date.parse(endTotalTime);

      // 不能选择本月之前和 本月之后
      if (current > endMsec) {
        return true;
      } else if (current < StartMsec) {
        return true;
      }
    } else {
      return;
    }
  };

  // 日历 组件 => 具体时间 天数
  SpecificTime = (date, dateString) => {
    let queryMonth = dateString.substring(0, 7);
    let queryDay = dateString.substring(8, 10);

    this.setState({
      queryMonth: queryMonth,
      queryDay: queryDay,
    })

    const { dispatch, driverId, } = this.props;
    const month = queryMonth;
    const day =  queryDay;
  
    dispatch ({
      type: 'wisdom_driver/loadroyaltyForm',
      payload: { driverId , month, day }
    })
  };

  render() {
    const {
      royaltyFormData,   // 司机提成列表
      royaltyFormParam,  // 司机提成 相关的参数 => 页码 数量等
    } = this.props;

    const { data, ...royaltyDataParam } = royaltyFormData;
    const { total } = royaltyDataParam;
    const { theTotal, not, has, dayTheTotal, dayNot} = royaltyFormParam;

    // console.log(data);
    // console.log(royaltyDataParam)

    return (
      <div className = { styles.royalty }>
        <div className = { styles.title }>提成</div>

        <MonthPicker
          className = { styles.monthPicker_1 }
          onChange = { this.MonthPic }
          placeholder = "开始时间"
        />

        <div className = { styles.stateBox }>
          {
            not === theTotal && has === 0 ? (
              <div className = {styles.identicalBox_style}>
                <p> 本月提成已全部结算！</p>

                <div>
                  <div>
                    <span>￥</span>
                    <span>{ theTotal }</span>
                  </div>

                  <span> 已结算提成 </span>
                </div>  
              </div>
            ) : (
              <div className = { styles.state }>
                <div className = { styles.money }>
                  <p>&nbsp;本月提成&nbsp;:</p>
                  <div>
                    ￥<span>{ theTotal }</span>
                  </div>
                </div>

                <div className = { styles.difference }>
                  <div className = { styles.identical_style }>
                    <p> &nbsp;&nbsp;未结算提成 </p>
                    <div className = { styles.unliquidated }>
                      <span>￥</span>
                      <span>{ not }</span>
                    </div>
                  </div>

                  <div className = { styles.identical_style }>
                    <p> &nbsp;&nbsp;已结算提成 </p>
                    <div className = { styles.settled }>
                      <span>￥</span>
                      <span>{ has }</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          }
        </div>

        <div className = { styles.monthlyOrders }>
          本月订单共<span>{ royaltyFormParam.total }</span>笔
        </div>

        <div className = { styles.form }>
          <div className = { styles.formTitle }>
            <DatePicker
              className = { styles.monthPicker_2 }
              onChange = { this.SpecificTime }
              placeholder = "开始时间"
              format = "YYYY-MM-DD"
              disabledDate = { this.disabledDate }
            />

            <div className = { styles.driverDetailsData_formTitle_tic }>
              <div className = { styles.formTitle_left }>
                <span>当日未结算 : </span>
                <span className = { styles.dayUnliquidated_color }>
                  ￥<span> { dayNot } </span>
                </span>
              </div>
              <div>
                当日提成 : ￥<span> { dayTheTotal } </span>
              </div>
            </div>
          </div>

          <Table
            rowKey = { record => record.id }
            columns = { this.columns }  // 表头
            dataSource = { data }       // 表头数据
            pagination = {{
              pageSize: 5,
              total: total,
              showTotal: total => `共 ${ total } 条`,
              showQuickJumper: true,     // 开启 可以快速跳转至某页
              onChange: (current, pageSize) => {
                const { dispatch, driverId } = this.props;
                let page = current;
                const month = this.state.queryMonth;
                const day =  this.state.queryDay;
                
                dispatch({
                  type: 'wisdom_driver/loadroyaltyForm',
                  payload: { driverId, page, pageSize, month, day }
                })
              }
            }}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ 'wisdom_driver': state }) => {
  const { royaltyFormData, royaltyFormParam } = state;
  return { royaltyFormData, royaltyFormParam }
}

export default connect(mapStateToProps)(DriverRoyalty);