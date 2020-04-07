/**
 *  观光车司机端 => 弹出框 => 添加司机
 */
import React from "react";
import { connect } from 'dva';
import './index.scss';
import styles from "./index.module.scss";

// antd相关引入
import { Form, Modal, Select, Input, DatePicker, Row, Col } from "antd";
import Communal from "../../commonOperation";

// 表单单项
const FormItem = Form.Item;

// 多选操作
const Option = Select.Option;

// 弹出框 => 添加表单
class AddComponents extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      imgSrc: undefined,
      displayAdd: this.props.visible,
      confirmLoading: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'wisdom_driver/loadLineAuthority'
    })
  }

  // 编辑时 打开图片上传
  modifyFile = () => {
    const node = this.myRef.current;
    node.click();
  };

  // 图片上传的 函数处理
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

  // 新建一条数据
  onCreate = () => {
    const { form, dispatch, } = this.props;

    form.validateFields(async (err, values) => {

      if (!err) {
       
        const {
          name,         // 司机名
          phoneNumber,  // 手机
          sex,          // 性别
          age,          // 年龄
          idNumber,     // 身份证
          entryDate,    // 入职日期 
          routesId,     // 线路权限 id
          birthday      // 生日
        } = values;

        const payload = {
          name,
          phoneNumber,
          sex,
          age,
          idNumber,
        };

         // 将线路权限数组中的id放入一个字符串中, 并用逗号隔开
        if(routesId) {
          payload.routesId = routesId.join(",")
        }

        // 获取 头像 设置
        if (this.state.imgSrc === undefined) {
          alert("请添加图片！");
          return;
        } else {
           payload.imgUrl = this.state.imgSrc;
        }

        // 格式化 入职日期
        if (entryDate) {
          payload.entryDate = entryDate.format("YYYY-MM-DD");
        } else {
          payload.entryDate = null;
        }

        // 格式化 生日
        if (birthday) {
          payload.birthday = birthday.format("YYYY-MM-DD");
        } else {
          payload.birthday = null;
        }

        this.setState({
          confirmLoading: true,
        });

        // 发送添加数据 请求接口
        await dispatch({
          type: 'wisdom_driver/handleAddDriver',
          payload,
        });
        
        this.setState({
          confirmLoading: false,
          imgSrc: undefined,
        });
    
        this.props.showModal();
        form.resetFields();
      }
    });
  };

  // 关闭 => 新增弹框
  onCancel = e => {
    this.setState({
      displayAdd: false,
      imgSrc: undefined
    });

    this.props.showModal();
    const form = this.props.form;
    form.resetFields();
  };

  render() {
    const {
      form,            // 表单参数
      visible,         // 弹出框是否可见,
      lineData,        // 线路权限列表
    } = this.props;

    const { getFieldDecorator } = form;
    const { confirmLoading } = this.state;

    // 表单控件布局
    const formItemLayout = {
      // label 标签布局
      labelCol: {
        // span 栅格占位格数，为 0 时相当于 display: none xs:小; sm:一般
        xs: { span: 24 },
        sm: { span: 6 }
      },

      // 需要为输入控件设置布局样式时，使用该属性
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };

    // 弹出框参数
    let option = {
      visible: visible,
      title: "新建",
      okText: "保存",
      cancelText: "取消",
      onOk: this.onCreate,
      onCancel: this.onCancel,
    };

    return (
      <Modal 
        width = { 600 }
        { ...option } 
        confirmLoading = { confirmLoading }
      >
        <form method="post" encType="multipart/form-data" id="upFileId">
          <input  ref={this.myRef} id="imageFile" type="file" name="upfile"  onChange = { this.fileSelected } style={{ display: "none" }} />
        </form>

        <Form className= { styles.addComponentsFormBox + ' addComponentsFormBox' }  layout="vertical">
          <Row className= { styles.AddComponents_t1 } >
            <Col span={6}>
              <div className= { styles.addComponents_head1 } >
                <div className= { styles.addComponents_head1_img } >
                  {
                    this.state.imgSrc === undefined ? (
                      <img src={require("@/assets/images/addHader.png")} className= { styles.addComponents_headimg_style }  alt=""  />
                    ) : (
                      <img  src={this.state.imgSrc}  className= { styles.addComponents_headimg_style }   alt="" />
                    )
                  }
                </div>
                <div className= { styles.addComponents_head1_text + ' fileSelect' }  onClick = { this.modifyFile } >
                  上传头像
                </div>
              </div>
            </Col>

            <Col span={15}>
              <FormItem label="司机名:" required hasFeedback {...formItemLayout} >
                {getFieldDecorator("name", {
                  rules: [{
                    required: true,  message: "请输入司机名!", whitespace: true
                  }],
                  initialValue: ""
                })(
                  <Input placeholder="请输入司机名" />
                )}
              </FormItem>

              <FormItem label="线路权限:" required {...formItemLayout}>
                {getFieldDecorator("routesId", {
                  rules: [{ required: true, message: "请选择线路权限!" }],
                  initialValue: []
                })(
                  <Select
                    mode = "multiple"
                    style = {{ width: "100%" }}
                    placeholder = "请选择线路权限"
                    onChange = { this.handleChange }
                    optionLabelProp = "label"
                    showArrow
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
                )}
              </FormItem>

              <FormItem label="手机:" required hasFeedback {...formItemLayout}>
                {getFieldDecorator("phoneNumber", {
                  rules: [{
                    required: true, message: "请输入手机号码!", whitespace: true }
                  ],
                  initialValue: ""
                })(
                  <Input placeholder="请输入手机号码!" />
                )}
              </FormItem>

              <FormItem label="性别:" required hasFeedback {...formItemLayout}>
                {getFieldDecorator("sex", {
                  rules: [{ required: true, message: "请选择性别!" }]
                })(
                  <Select placeholder="请选择性别!">
                    <Option value="1">男</Option>
                    <Option value="0">女</Option>
                  </Select>
                )}
              </FormItem>

              <FormItem label="年龄:" required hasFeedback {...formItemLayout}>
                {getFieldDecorator("age", {
                  rules: [{ required: true, message: "请输入年龄!" }],
                  initialValue: ""
                })(
                  <Input placeholder="请输入年龄" />
                )}
              </FormItem>

              <FormItem label="生日:" hasFeedback {...formItemLayout}>
                {getFieldDecorator("birthday", {
                  initialValue: null
                })(
                  <DatePicker format="YYYY-MM-DD" placeholder="请输入生日!" />
                )}
              </FormItem>

              <FormItem label="身份证号:" hasFeedback {...formItemLayout}>
                {getFieldDecorator("idNumber", {
                  rules: [{ message: "请输入身份证号!", whitespace: true }],
                  initialValue: ""
                })(
                 <Input placeholder="请输入身份证号" />
                )}
              </FormItem>

              <FormItem
                label="入职时间:"  required  hasFeedback  {...formItemLayout}>
                {getFieldDecorator("entryDate", {
                  initialValue: null
                })(
                  <DatePicker  format="YYYY-MM-DD" placeholder="请选择入职时间" />
                )}
              </FormItem>
            </Col>

            <Col span={3} />
          </Row>
        </Form>
      
      </Modal>
    );
  }
}

const mapStateToProps = ({ 'wisdom_driver': state }) => {
  const { lineData } = state;
  return{ lineData }
}

export default connect(
  mapStateToProps
)(Form.create({})(AddComponents))