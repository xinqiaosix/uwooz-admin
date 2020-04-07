/**
 * 观光车 => 上下班记录模块
 */
import React from "react";
import styles from "../index.module.scss";
import { Button, Input, Form, Table, DatePicker } from "antd";
import { connect, router } from 'dva';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { withRouter } = router;

class PunchInRecord extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      queryTime: null,
      driverNameText: '',
      timeListText: ''
    };

    // 上下班记录
    this.columns = [
      {
        title: "序号",
        dataIndex: "id",
        key: "id",
        align: "left",
        width: "10%"
      },
      {
        title: "司机",
        dataIndex: "driverName",
        key: "driverName",
        align: "left",
        width: "15%"
      },
      {
        title: "类型",
        dataIndex: "type",
        key: "type",
        align: "left",
        width: "10%",
        render: (text, record) => (
          <span> { text === 0 ? '上班' : '下班' } </span>
        )
      },
      {
        title: "服务线路",
        dataIndex: "routeNames",
        key: "routeNames",
        align: "left",
        width: "20%",
        render: (item, record) => {
          let routeList = record.routeNames.map(items => {
            return (
              <span key = { items.routeId }>
                <span style = {{ paddingRight: 5 }}> { items.routeName } </span>
              </span>
            );
          });
          return routeList;
        }
      },
      {
        title: "时间",
        dataIndex: "addTime",
        key: "addTime",
        align: "left",
        width: "25%",
        sorter: (a, b) => new Date(a.addTime).getTime() - new Date(b.addTime).getTime(),
        sortDirections: ["descend", "ascend"]
      }
    ];
  };

  componentDidMount() {
    this.commuteRecord();
  }

  // 上下班记录列表
  commuteRecord = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'wisdom_bus/getCommuteRecord',
      payload: { page: 1, pageSize: 5, sourceId: 2 }
    })
  } 

  // 日历 组件 => 具体时间 天数
  SpecificTime = (date, dateString) => {
    // console.log(dateString);
    this.setState({
      queryTime: dateString
    });
  };

  // 上下班记录 查询
  queryData = e => {
    e.preventDefault();
    const { form, dispatch, match } = this.props;
    const { params: { id } } = match;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (!err) {
        // 司机名称
        let driverNameText = fieldsValue["driverNameText"];

        // 时间取值
        let timeListText = "";
        if (this.state.queryTime == null) {
          timeListText = null;
        } else if ( this.state.queryTime.join(",") === ',' ) {
          timeListText = null;
        } else{
          timeListText = this.state.queryTime.join(",");
        }

        this.setState({
          driverNameText,
          timeListText,
        })

        dispatch({
          type: 'wisdom_bus/getCommuteRecord',
          payload: { sightseeingId: id, driverName: driverNameText, time: timeListText,  }
        })
      }
    });
  };

  // 重置 上下班接口
  resetData = () => {
    // 重置一组输入控件的值
    this.props.form.resetFields();
    this.setState({
      current: 1,
      driverNameText: '',
      timeListText: '',
    });
    const { dispatch } = this.props;

    dispatch({
      type: 'wisdom_bus/getCommuteRecord',
      payload: { page: 1, pageSize: 5, sourceId: 2 }
    })
  };

  render() {
    const {
      form,
      commuteRecordData, 
      commuteRecordParams,
      match,
    } = this.props;

    const { total } = commuteRecordParams;
    const { getFieldDecorator } = form;
    const { params: { id } } = match;

    return (
      <div className = { styles.sightseeingCarDetails_commuteRecord }>
        <div className = { styles.sightseeingCarDetails_identical_title }>
          上下班记录
        </div>

        <div className = { styles.sightseeingCarDetails_goToWorkBox }>
          <div className = { styles.sightseeingCarDetails_identical_query }>
            <div className = { styles.sightseeingCarDetails_identical_name +" sightseeingCarDetails_identical_name" } >
              <Form className = { styles.searchQueryBox }>
                <FormItem label="司机" className = { styles.driverNameBox }>
                  {getFieldDecorator("driverNameText", {
                    initialValue: ""
                  })(<Input type="text" placeholder="请输入司机名称" />)}
                </FormItem>

                <FormItem label="时间">
                  {getFieldDecorator("driverQueryText", {
                    initialValue: null
                  })(
                    <RangePicker
                      className = { styles.driverQueryTime }
                      format = "YYYY-MM-DD"
                      onChange = { this.SpecificTime }
                    />
                  )}
                </FormItem>

                <div className = { styles.driverQueryOperation }>
                  <Button
                    type = "primary"
                    onClick = { this.queryData }
                    className={ styles.driverQueryOperation_queryStyle }
                  >
                    查询
                  </Button>
                  <Button onClick = { this.resetData }> 重置 </Button>
                </div>
              </Form>
            </div>
          </div>

          <div>
            <Table
              rowKey = { record => record.id }
              columns = { this.columns }          // 表头
              dataSource = { commuteRecordData }  // 表头数据
              pagination = {{
                current: this.state.current,
                pageSize: 5,
                total: total,
                showTotal: total => `共 ${ total } 条`,
                showQuickJumper: true,         // 开启 可以快速跳转至某页
                hideOnSinglePage: true,        // 只有一页时 隐藏分页器
                onChange: (current, pageSize) => {
                  this.setState({
                    current: current
                  });

                  let timeListText = this.state.timeListText;
                  let driverNameText = this.state.driverNameText;
                  const { dispatch } = this.props;
                  dispatch({
                    type: 'wisdom_bus/getCommuteRecord',
                    payload: { page: current, pageSize, sightseeingId: id, driverName: driverNameText, time: timeListText }
                  })
                }
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = ({ wisdom_bus: state }) => {
  const { commuteRecordData, commuteRecordParams } = state;
  return { commuteRecordData, commuteRecordParams }
};

export default withRouter(
  connect(mapStateToProps)(Form.create()(PunchInRecord)
))