/**
 *  观光车 => 添加
 */
import React from "react";
import { Input, Modal, message, Form, Select, DatePicker } from "antd";
import { connect, router } from 'dva';
import styles from './index.module.scss'

// 表单单项
const FormItem = Form.Item;
// 多选操作
const Option = Select.Option;
const { withRouter } = router;

// 弹出框 => 添加表单
class AddComponents extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      adminDataList: []
    };
  }

  componentDidMount() {
    this.adminData();
  }

  // 观光车人员管理列表
  adminData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'wisdom_bus/getAdminData'
    })
  };

  // 新建一条数据
  onCreate = () => {
    const { form, dispatch } = this.props

    form.validateFields(async (err, values) => {
      if (!err) {

        const {
          sightseeingName,      // 观光车名称
          typeName,             // 车辆型号
          employeeName,         // 管理员
          carNumber,            // 车牌号
          inputTime,            // 投入使用时间
          maintenanceTime,      // 检修时间
          insuranceTime,        // 保险时间
        } = values;

        let inputTimeText = "";                                   // 投入使用时间
        let maintenanceTimeText = "";                             // 检修时间
        let insuranceTimeText = "";                               // 保险时间

        if (inputTime === null) {
          inputTimeText = null;
        } else {
          inputTimeText = inputTime.format("YYYY-MM-DD");
        }

        if (maintenanceTime === null) {
          maintenanceTimeText = null;
        } else {
          maintenanceTimeText = maintenanceTime.format("YYYY-MM-DD");
        }

        if (insuranceTime === null) {
          insuranceTimeText = null;
        } else {
          insuranceTimeText = insuranceTime.format("YYYY-MM-DD");
        }

        const payload = {
          sightseeingName,      // 观光车名称
          typeName,             // 车辆型号
          manageId:employeeName, // 管理员
          carNumber,            // 车牌号
          inputTimeText,        // 投入使用时间
          maintenanceTimeText,  // 检修时间
          insuranceTimeText,    // 保险时间
        };

        const { errorCode, msg } = await dispatch({
          type: 'wisdom_bus/newSightseeingBus',
          payload
        });

        if ( errorCode === 200 ){
          // Modal.info({ content: msg });
          message.success(msg);
        }

        form.resetFields();
        this.props.onCancel();
      }
    });
  };

  // 关闭新增
  onCancel = () => {
    this.props.onCancel();
    const { form } = this.props;
    form.resetFields(); // 清空重置 输入控件的值;
  }

  render() {
    const {
      form,           // 表单参数
      visible,        // 弹出框是否可见,
      confirmLoading, // 弹出框按钮 loading
      adminDataList,
    } = this.props;

    const { getFieldDecorator } = form;

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
      title: "新增观光车",
      okText: "保存",
      cancelText: "取消",
      onOk: this.onCreate,
      onCancel: this.onCancel,
      confirmLoading: confirmLoading
    };

    return (
      <Modal {...option}>
        <Form className = { styles.formBox }  layout="vertical">
          <FormItem
            label="观光车名称:"
            required
            hasFeedback
            {...formItemLayout}
          >
            {getFieldDecorator("sightseeingName", {
              rules: [{ 
                required: true, message: "请输入观光车名称!", whitespace: true
              }],
              initialValue: ""
            })(
              <Input placeholder="请输入观光车名称" />
            )}
          </FormItem>

          <FormItem label="车辆型号:" required hasFeedback {...formItemLayout}>
            {getFieldDecorator("typeName", {
              rules: [{ 
                required: true, message: "请输入车辆型号!", whitespace: true 
              }],
              initialValue: ""
            })(
             <Input placeholder="请输入车辆型号!" />
            )}
          </FormItem>

          <FormItem label="管理人员:" required hasFeedback {...formItemLayout}>
            {getFieldDecorator("employeeName", {
              rules: [{ required: true, message: "请输入管理人员的姓名!" }]
            })(
              <Select placeholder="请输入管理人员的姓名!">
                {
                 adminDataList && adminDataList.map(items => (
                    <Option key = { items.id } value = { items.id }>
                      {items.realName}
                    </Option>
                  ))
                }
              </Select>
            )}
          </FormItem>

          <FormItem
            label="投入使用时间:"
            required
            hasFeedback
            {...formItemLayout}
          >
            {getFieldDecorator("inputTime", {
              rules: [{ required: true, message: "请输入投入使用时间!" }],
              initialValue: null
            })(
              <DatePicker
                format="YYYY-MM-DD"
                placeholder="请输入投入使用时间"
              />
            )}
          </FormItem>

          <FormItem label="检修时间:" hasFeedback {...formItemLayout}>
            {getFieldDecorator("maintenanceTime", {
              initialValue: null
            })( 
              <DatePicker format="YYYY-MM-DD" placeholder="请输入检修时间" />
            )}
          </FormItem>

          <FormItem label="保险时间:" hasFeedback {...formItemLayout}>
            {getFieldDecorator("insuranceTime", {
              initialValue: null
            })(
              <DatePicker format="YYYY-MM-DD" placeholder="请输入保险时间" />
            )}
          </FormItem>

          <FormItem label="车牌号:" hasFeedback {...formItemLayout}>
            {getFieldDecorator("carNumber", {
              rules: [{ message: "请填写车牌号!", whitespace: true }],
              initialValue: ""
            })(
             <Input placeholder="请填写车牌号!" />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

const mapStateToProps = ({ wisdom_bus: state }) => {
  const { adminDataList } = state;
  return { adminDataList };
}
export default withRouter(connect(
  mapStateToProps
)(Form.create({})(AddComponents)))