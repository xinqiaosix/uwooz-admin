/**
 * 观光车详情组件 => 头部信息操作
 */
import React from "react";
import styles from "../index.module.scss";
import { Button, Input, Form, Layout, Row, Col, DatePicker, Modal, Select} from "antd";
import moment from "moment";
import { connect, router } from 'dva';

const FormItem = Form.Item;
const { Option } = Select;
const { Sider } = Layout;
const { withRouter } = router;

class CarHeaderData extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      visible: false,    // 是否显示弹窗
      confirm: false,    // 表单是否显示确认按钮
      onlyText: false,   // 纯文字显示
      edit: false,       // 是否编辑
      confirmLoading: false, //是否显示loading
    };
  }

  componentDidMount() { 
    this.adminData();

    const { match } = this.props;
    const { params: { id } } = match;

    if ( id !== undefined){
      this.VehicleDetails(); 
    }
  }

  // 加载 管理人员列表
  adminData = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'wisdom_bus/getAdminData',
    })
  };

  // 加载观光车详情头部信息
  VehicleDetails = () => {
    const { dispatch, match } = this.props;
    const { params: {id} } = match;

    dispatch({
      type: 'wisdom_bus/getVehicleDetails',
      payload: id
    })
  }

  // 编辑区 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  
  // 编辑 => 打开编辑选项
  editingDevice = e => {
    e.preventDefault();
    this.setState({
      onlyText: false,
      edit: true,
      confirm: true
    });
  };

  // 保存编辑之后的数据
  handleSubmit = e => {
    e.preventDefault();
    const { form, match, dispatch } = this.props;
    const { params: { id } } = match;
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {

        // 请求所需参数
        let payload = {
          id,
          sightseeingName: values.sightseeingName, // 观光车名称
          carNumber: values.carNumber,             // 车牌号
          typeName: values.typeName,               // 车辆型号
          manageId: values.manageId,               // 管理员          
          newMaintenanceTime: values.maintenanceTime.format("YYYY-MM-DD"), // 检修时间
          newInsuranceTime: values.insuranceTime.format("YYYY-MM-DD"),     // 保险到期时间
        };

        const { errorCode } = await dispatch({
          type: 'wisdom_bus/uploadVehicleDetails',
          payload
        });

        if ( errorCode === 200 ) {
          Modal.info({ content: "编辑成功!" });
        }

        this.setState({
          edit: false,
          confirm: false,
        });
      }
    });
  };

  // 取消 编辑选项
  hidden = e => {
    e.preventDefault();

    this.setState({
      edit: false,
      confirm: false
    });
  };

  // 删除区 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  // 删除 => 弹出确认框
  deleteDevice = () => {
    this.setState({
      visible: true
    });
  };

  // 确认删除
  handleOk = () => {
    const { match, dispatch } = this.props;
    const { params: { id } } = match;

    dispatch({
      type: 'wisdom_bus/deleteSightseeingBus',
      payload: id
    });

    this.setState({
      confirmLoading: true,
      visible: false
    });
    this.props.history.push('/wisdom/SightseeingBus');
  };

  // 取消删除
  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  // 报修区 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  // 报修功能
  repairOperation = () => {
    const { dispatch, headerData } = this.props;
    const { manageId, equipId } = headerData;

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
    });

  };

  render() {
    const { 
      form,
      adminDataList,  // 管理人员数据
      headerData,    // 观光车详情头部数据
    } = this.props;

    const { getFieldDecorator } = form;

    // 表单控制布局
    const formItemLayout = {
      lableCol: {
        xs: { span: 24 },
        sm: { span: this.state.onlyText ? 7 : 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: {
          span: 16,
          offset: this.state.onlyText ? 1 : 0
        }
      }
    };

    // 操作功能 设置 => 确认 || 取消
    const operationFormItem = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 8
        }
      }
    };

    return (
      <Form layout="horizontal" className = { styles.sightseeingCarDetails_bx }>
        <Layout>
          <Layout
            style={{ paddingLeft: 60 }}
            className = { styles.sightseeingCarDetails_header }
          >
            <Row className = { styles.sightseeingCarDetails_header_t1 }>
              <Col span={4} style={{ height: 40 }}>
                {
                  this.state.edit ? (
                    <FormItem {...formItemLayout} label="">
                      {getFieldDecorator("sightseeingName", {
                        initialValue: headerData.sightseeingName,
                        rules: [{ required: true, message: "请输入观光车名称" }]
                      })(<Input type="text" placeholder="" />)}
                    </FormItem>
                  ) : (
                    <div className = { styles.sightseeingCarDetails_head1 }>
                      <div>{ headerData.sightseeingName }</div>
                    </div>
                  )
                }
              </Col>

              <Col span={6} style = {{ height: 40 }}>
                <div className = { styles.sightseeingCarDetails_head2 }>
                  <p>运营状态:</p>&nbsp;&nbsp;
                  <span style = {{ color: headerData.operatingState === 0 ? "#FFB619" : "#262626" }}>
                    { headerData.operatingState === 0 ? '闲置' : '运营中' }
                  </span>
                </div>
              </Col>
            </Row>

            <Row className = { styles.sightseeingCarDetails_header_t2 }>
              <Col span={6}>
                {
                  this.state.edit ? (
                    <FormItem {...formItemLayout} label="车辆型号">
                      {getFieldDecorator("typeName", {
                        rules: [{ required: true, message: "请输入车辆型号" }],
                        initialValue: headerData.typeName
                      })(<Input type="text" placeholder="" />)}
                    </FormItem>
                  ) : (
                    <div className = { styles.sightseeingCarDetails_detailsInfo }>
                      <p>车辆型号:</p>&nbsp;&nbsp;
                      <span> { headerData.typeName }</span>
                    </div>
                  )
                }
              </Col>

              <Col span={6}>
                <div className = { styles.sightseeingCarDetails_detailsInfo }>
                  <p>车辆状态:</p>&nbsp;&nbsp;
                  <span>{ headerData.sightseeingStates === 0 ? '正常' : '损坏' } </span>
                </div>
              </Col>

              <Col span={6}>
                {
                  this.state.edit ? (
                    <FormItem {...formItemLayout} label="车牌号">
                      {getFieldDecorator("carNumber", {
                        rules: [{ required: true, message: "请输入车牌号" }],
                        initialValue: headerData.carNumber
                      })( 
                        <Input type="text" placeholder="" />
                      )}
                    </FormItem>
                  ) : (
                    <div className = { styles.sightseeingCarDetails_detailsInfo }>
                      <p>车牌:</p>&nbsp;&nbsp;
                      <span>{ headerData.carNumber }</span>
                    </div>
                  )
                }
              </Col>

              <Col span={6}>
                {
                  this.state.edit ? (
                    <FormItem {...formItemLayout} label="管理员">
                      {getFieldDecorator("manageId", {
                        rules: [{ required: true, message: "请输入管理员" }],
                        initialValue: headerData.manageId
                      })(
                        <Select
                          showSearch
                          style={{ width: "100%" }}
                          placeholder="请选择管理员"
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {
                           adminDataList && adminDataList.map(item => {
                              return (
                                <Option key = { item.id } value = { item.id }>
                                  { item.realName }
                                </Option>
                              );
                            })
                          }
                        </Select>
                      )}
                    </FormItem>
                  ) : (
                    <div className = { styles.sightseeingCarDetails_detailsInfo }>
                      <p>管理员:</p>&nbsp;&nbsp;
                      <span>
                        {
                         adminDataList && adminDataList.map(items => {
                            // console.log(items);
                            let manageIdText = [];

                            if (headerData.manageId === items.id) {
                              manageIdText.push(items.realName);
                            }

                            return (
                              <span key = { items.id }>
                                <span>{manageIdText}</span>
                              </span>
                            );
                          })
                        }
                      </span>
                    </div>
                  )
                }
              </Col>
            </Row>

            <Row className = { styles.sightseeingCarDetails_header_t2 }>
              <Col span={6} className="sightseeingCarDetails_header_b1">
                <div className = { styles.sightseeingCarDetails_detailsInfo }>
                  <p>投入使用时间:</p>&nbsp;&nbsp;
                  <span> { headerData.inputTime } </span>
                </div>
              </Col>

              <Col span={6}>
                {
                  this.state.edit ? (
                    <FormItem {...formItemLayout} label="检修时间">
                      {getFieldDecorator("maintenanceTime", {
                        initialValue: headerData.maintenanceTime !== null ? moment(headerData.maintenanceTime) : null
                      })(
                       <DatePicker format="YYYY-MM-DD" />
                      )}
                    </FormItem>
                  ) : (
                    <div className = { styles.sightseeingCarDetails_detailsInfo }>
                      <p>检修时间:</p>&nbsp;&nbsp;
                      <span> { headerData.maintenanceTime } </span>
                    </div>
                  )
                }
              </Col>

              <Col span={6}>
                {
                  this.state.edit ? (
                    <FormItem {...formItemLayout} label="保险时间">
                      {getFieldDecorator("insuranceTime", {
                        initialValue:
                          headerData.insuranceTime !== null  ? moment(headerData.insuranceTime) : null
                      })(
                       <DatePicker format="YYYY-MM-DD" />
                      )}
                    </FormItem>
                  ) : (
                    <div className = { styles.sightseeingCarDetails_detailsInfo }>
                      <p>保险时间:</p>&nbsp;&nbsp;
                      <span> { headerData.insuranceTime } </span>
                    </div>
                  )
                }
              </Col>
            </Row>
          </Layout>

          <Sider className = { styles.operationFormItem } width={260}>
            <FormItem {...operationFormItem}>
              {
                this.state.confirm ? (
                  <React.Fragment>
                    <Button  type="primary" onClick = { this.handleSubmit } className = { styles.operationFormItem_style } >
                      确认
                    </Button>
                    <Button onClick = { this.hidden } className = { styles.operationFormItem_style } >
                      取消
                    </Button>
                  </React.Fragment>
                ) : (
                  <div className={styles.operationItem}>
                    <Button type="primary" ghost onClick = { this.editingDevice }>
                      编辑
                    </Button>
                    <Button type="danger" ghost onClick = { this.deleteDevice }>
                      删除
                    </Button>
                    <Button type="primary" onClick = { this.repairOperation }>
                      报修
                    </Button>
                  </div>
                )
              }
            </FormItem>

            <Modal
              title = "提示框"
              visible = { this.state.visible }
              onOk = { this.handleOk }
              onCancel = { this.handleCancel }
            >
              <p> 确定删除这条数据？</p>
            </Modal>
          </Sider>
        </Layout>
      </Form>
    );
  }
}

// modal 中的 state 通过组建的 props 注入组件
const mapStateToProps = ({ wisdom_bus: state }) => {
  const { adminDataList, headerData } = state;
  return { adminDataList, headerData };
};
export default withRouter(connect( mapStateToProps )(Form.create()(CarHeaderData)))