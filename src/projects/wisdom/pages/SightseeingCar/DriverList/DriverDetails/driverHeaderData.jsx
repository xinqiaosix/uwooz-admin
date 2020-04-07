/**
 * 司机详情组件 => 头部信息操作
 */
import React from "react";
import styles from '../index.module.scss';
import { connect, router} from 'dva';
// antd相关引入
import { Button, Input, Form, Layout, Row, Col, DatePicker, Modal, Select } from "antd";
import moment from "moment";
import Communal from "../../commonOperation.js";

const FormItem = Form.Item;
const { Option } = Select;
const { Sider } = Layout;
const { withRouter } = router;

class DriverHeaderData extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      visible: false,        // 是否显示弹窗
      confirm: false,        // 表单是否显示确认按钮
      onlyText: false,       // 纯文字显示
      edit: false,           // 是否编辑
      confirmLoading: false, // 是否显示loading
      imgSrc: undefined,     // 上传图片的地址
      node: {},
      imgUrl: "",
    };
  }

  componentDidMount() {
    this.routeLine();
  }

  // 编辑区 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  // 线路权限 => 数据请求
  routeLine = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'wisdom_driver/loadLineAuthority'
    })
  };

  // 编辑时 打开图片上传
  modifyFile = () => {
    const node = this.myRef.current;
    node.click();
  };

  // 图片上传时的处理函数
  fileSelected = () => {
    const that = this;
    const none = this.myRef.current;
    let nodeInfo = {
      that: that,         // 绑定this
      node: none,         // 图片
      imgSrc: "imgSrc"    // 返回数据时写入state对象的属性
    };
    Communal.fileSelected(nodeInfo);
  };

  handleChange = value => {
    console.log(`selected ${value}`);
  };

  // 打开编辑
  editingDevice = e => {
    e.preventDefault();
    this.setState({
      onlyText: false,
      edit: true,
      confirm: true
    });
  };

  // 编辑确认 操作!
  handleSubmit = e => {
    const { form, dispatch, } = this.props;

    form.validateFieldsAndScroll(async (err, values) => {

      if (!err) {
        const {
          driverName,  // 司机名称
          userName,    // 员工手机号
          idNumber,    // 身份证
          age,         // 年龄
          sex,         // 性别
          entryDate,   // 入职日期
          birthday,    // 生日
          routeNames,  // 线路权限
          imgUrl,      // 头像 
        } = values;

        const payload = {
          idNumber,    // 身份证
          age,         // 年龄
          phoneNumber: userName, // 员工手机号
          name: driverName,     // 司机名称
          driverId: this.props.driverHead.id,
        };

        // 格式化 性别
        if (sex === "男") {
          payload.sex = 1;
        } else {
          payload.sex = 0;
        }

        // 格式化 入职日期
        if (entryDate) {
          payload.entryDate = entryDate.format("YYYY-MM-DD");
        }

        // 格式化 生日
        if (birthday) {
          payload.birthday = birthday.format("YYYY-MM-DD");
        }
      
        // 格式化 线路权限的数据
        if (birthday) {
          payload.routesId = routeNames.join(",");
        }

        // 图片 src 设置
        if (this.state.imgSrc === undefined) {
          payload.imgUrl = imgUrl
        } else {
          payload.imgUrl = this.state.imgSrc;
        }
        // console.log(imgUrl);
        
        // 发送数据 请求接口
        await dispatch({
          type: 'wisdom_driver/handleEditDriver',
          payload,
        })

        this.setState({
          edit: false,
          confirm: false,
          imgSrc: undefined
        });
      }
    });
  };

  // 关闭编辑选项
  hidden = e => {
    e.preventDefault();
    this.setState({
      edit: false,
      confirm: false,
      imgSrc: undefined
    });
  };

  // 删除区 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  // 弹出 删除 确认框
  deleteDevice = e => {
    this.setState({
      visible: true
    });
  };

  // 确认删除数据
  handleOk = () => {

    const { dispatch } = this.props;
    const id = this.props.driverHead.id;
    dispatch({
      type: 'wisdom_driver/handleDeleteDriver',
      payload: id,
    });

    this.setState({
      visible: false
    });
    
    this.props.history.push('/wisdom/SightseeingCar');
  };

  // 取消删除
  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  render() {
    const { 
      form, 
      driverHead, // 头部详情
      lineData,   // 线路列表
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

    // 当前线路权限
    let lineDataList = driverHead.routeNames || [];
    let lineet = [];

    lineDataList.forEach(function(res) {
      var lineGather = res.routeId;
      lineet.push(lineGather);
    });
    // console.log(lineet);

    return (
      <div className = { styles.driverHeaderData }>
        <form method="post" encType="multipart/form-data" id="upFileId">
          <input ref={this.myRef} id="imageFile" type="file" name="upfile" onChange={this.fileSelected} style={{ display: "none" }} />
        </form>

        <Form layout="horizontal">
          <Layout>
            <Sider className = { styles.headPortrait } width={160}>
              {
                this.state.edit ? (
                  <FormItem {...formItemLayout}>
                    {getFieldDecorator("imgUrl", {
                      rules: [{ required: true, message: "请输入图片！" }],
                      initialValue: driverHead.imgUrl
                    })(
                      <div className = { styles.fileSelect } onClick = { this.modifyFile } >
                        {
                          this.state.imgSrc === undefined ? (
                            <img src = { driverHead.imgUrl } alt="" />
                          ) : (
                            <img src = { this.state.imgSrc } alt="" />
                          )
                        }
                      </div>
                    )}
                  </FormItem>
                ) : (
                  <div className = { styles.imgUrl } >
                    <img src={driverHead.imgUrl} className = { styles.imgStyle } alt="" />
                  </div>
                )
              }
            </Sider>

            <Layout>
              <Row>
                <Col span={3} className = { styles.headPortrait_top }>
                  {
                    this.state.edit ? (
                      <FormItem {...formItemLayout} label="">
                        {getFieldDecorator("driverName", {
                          initialValue: driverHead.driverName,
                          rules: [{ required: true, message: "请输入姓名" }]
                        })(<Input type="text" placeholder="" />)}
                      </FormItem>
                    ) : (
                      <div className = { styles.driverDetailsData_carName }>
                        <div>{driverHead.driverName}</div>
                      </div>
                    )
                  }
                </Col>

                <Col span={5} className = { styles.headPortrait_top }>
                  {
                    this.state.edit ? (
                      <FormItem {...formItemLayout} label="">
                        {getFieldDecorator("userName", {
                          initialValue: driverHead.userName,
                          rules: [{ required: true, message: "请输入手机号" }]
                        })(<Input type="text" placeholder="" />)}
                      </FormItem>
                    ) : (
                      <div className = { styles.driverDetailsData_carName }>
                        <div>{ driverHead.userName }</div>
                      </div>
                    )
                  }
                </Col>
              </Row>

              <Row>
                <Col span={7}>
                  {
                    this.state.edit ? (
                      <FormItem {...formItemLayout} label="性别">
                        {getFieldDecorator("sex", {
                          initialValue: driverHead  ? (driverHead["sex"] === 0 ? '女' : '男') : [],
                          rules: [{ required: true, message: "请输入性别" }]
                        })(
                          <Select placeholder="请选择性别">
                            <Option value="1">男</Option>
                            <Option value="0">女</Option>
                          </Select>
                        )}
                      </FormItem>
                    ) : (
                      <div className = { styles.driverDetailsData_detailsInfo + ' detailsInfo_sex' }>
                        <p>性别:</p>&nbsp;&nbsp;
                        <span>
                          { driverHead.sex === 1 ? "男" : "女" }
                        </span>
                      </div>
                    )
                  }
                </Col>

                <Col span={6}>
                  {
                    this.state.edit ? (
                      <FormItem {...formItemLayout} label="年龄">
                        {getFieldDecorator("age", {
                          initialValue: driverHead ? driverHead["age"] : "",
                          rules: [{ required: true, message: "请输入年龄" }]
                        })(
                         <Input type="text" placeholder="" />
                        )}
                      </FormItem>
                    ) : (
                      <div className = { styles.driverDetailsData_detailsInfo + ' detailsInfo_age' }>
                        <p>年龄:</p>&nbsp;&nbsp;
                        <span>{ driverHead.age }</span>
                      </div>
                    )
                  }
                </Col>

                <Col span={6}>
                  {
                    this.state.edit ? (
                      <FormItem {...formItemLayout} label="身份证">
                        {getFieldDecorator("idNumber", {
                          initialValue: driverHead  ? driverHead["idNumber"]  : "",
                          rules: [{ required: true, message: "请输入身份证号码" }]
                        })(
                         <Input type="text" placeholder="" />
                        )}
                      </FormItem>
                    ) : (
                      <div className = { styles.driverDetailsData_detailsInfo + ' detailsInfo_idNumber' } >
                        <p>身份证:</p>&nbsp;&nbsp;
                        <span>{ driverHead.idNumber }</span>
                      </div>
                    )
                  }
                </Col>
              </Row>

              <Row>
                <Col span={7}>
                  {
                    this.state.edit ? (
                      <FormItem {...formItemLayout} label="生日">
                        {getFieldDecorator("birthday", {
                          initialValue: driverHead.birthday !== null ? moment(driverHead.birthday) : null
                        })(
                         <DatePicker format="YYYY-MM-DD" />
                        )}
                      </FormItem>
                    ) : (
                      <div className = { styles.driverDetailsData_detailsInfo } >
                        <p>生日:</p>&nbsp;&nbsp;
                        <span>{ driverHead.birthday }</span>
                      </div>
                    )
                  }
                </Col>

                <Col span={6}>
                  {
                    this.state.edit ? (
                      <FormItem {...formItemLayout} label="入职日期">
                        {getFieldDecorator("entryDate", {
                          rules: [{ required: true, message: "请输入入职时间" }],
                          initialValue: driverHead.entryDate !== null  ? moment(driverHead.entryDate) : null
                        })(<DatePicker format="YYYY-MM-DD" />)}
                      </FormItem>
                    ) : (
                      <div className = { styles.driverDetailsData_detailsInfo } >
                        <p>入职日期:</p>&nbsp;&nbsp;
                        <span>{ driverHead.entryDate }</span>
                      </div>
                    )
                  }
                </Col>

                <Col span={10}>
                  {
                    this.state.edit ? (
                      <FormItem {...formItemLayout} label="线路权限">
                        {getFieldDecorator("routeNames", {
                          initialValue: driverHead ? lineet : [],
                          rules: [{ required: true, message: "请输入线路权限" }]
                        })(
                          <Select
                            mode = "multiple"
                            className = { styles.routeNameList }
                            placeholder = "请选择线路权限"
                            onChange = { this.handleChange }
                            optionLabelProp = "label"
                          >
                            {
                             lineData.map(item => {
                                // console.log(item.id);
                                return (
                                  <Option
                                    key = { item.id }
                                    value = { item.id }
                                    label = { item.routeName }
                                  >
                                    { item.routeName }
                                  </Option>
                                );
                              })
                            }
                          </Select>
                        )
                      }
                    </FormItem>
                    ) : (
                      <div className = { styles.driverDetailsData_detailsInfo } >
                        <p>线路权限:</p>&nbsp;&nbsp;
                        {
                          driverHead.routeNames && driverHead.routeNames.map(items => {
                            return (
                              <span key = { items.routeId } className = { styles.routeNames } >
                                <span>{ items.routeName }</span>
                              </span>
                            );
                          })
                        }
                      </div>
                    )}
                </Col>
              </Row>
            </Layout>

            <Sider className = { styles.operationFormItem } >
              <FormItem {...operationFormItem}>
                {
                  this.state.confirm ? (
                    <React.Fragment>
                      <Button  type = "primary"  onClick = {this.handleSubmit} className = { styles.operationFormItem_style } >
                        确认
                      </Button>
                      <Button  onClick = { this.hidden } className = { styles.operationFormItem_style } >
                        取消
                      </Button>
                    </React.Fragment>
                  ) : (
                    <div className = { styles.operationItem } >
                      <Button onClick = { this.deleteDevice } className = { styles.deleteDevice }>
                        删除
                      </Button>
                      <Button  type = "primary" onClick = { this.editingDevice } >
                        编辑
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
                cancelText = '取消'
                okText = '确定'
              >
                <p>确定删除这条数据？</p>
              </Modal>
            </Sider>
          </Layout>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = ({ 'wisdom_driver': state }) => {
  const { driverHead, lineData } = state;
  return { driverHead, lineData }
}

export default withRouter(connect(
  mapStateToProps
)(Form.create()(DriverHeaderData))) 