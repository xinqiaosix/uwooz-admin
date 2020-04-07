/* eslint-disable */
import React from 'react'
import {Form,Modal,Input,Icon,Button} from 'antd'
import { connect } from 'dva'
const FormItem = Form.Item;
const { TextArea } = Input;

//创建新增线路弹出框表单

let id = 0;
class AddLine extends React.Component {
  constructor(props)
  {
    super(props);
    this.state = {
      isCreateLoading: false
    }
  }

  //移除站点
  onRemove = k => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  //添加站点
  onAdd = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id++);
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  // 获取输入框的id
  handleChangeInput = (e) => {
    let id = e.currentTarget.dataset.id;
    sessionStorage.setItem('inputId', id)
    this.props.handleChange()
  }

  // 提交
  handleSumbit = () => {
    const { dispatch, onCancel, form } = this.props
    form.validateFields(async (err, values) => {
      if (!err) {
        let list = ''
        const { keys, names, coordinate } = values;
        if (keys.length >= 1) {
          keys.map((key) => {
            if (key < keys.length - 1) {
              if (names[key] && coordinate[key]) {
                let obj = `${names[key]},${coordinate[key].split(',')[1]},${coordinate[key].split(',')[0]}`
                list += obj + '/'
              }
            }
            else {
              if (names[key] && coordinate[key]) {
                let obj = `${names[key]},${coordinate[key].split(',')[1]},${coordinate[key].split(',')[0]}`
                list += obj
              }
            }
          })
        }
        if (keys.length === 1) {
          Modal.info({
            content: '至少添加两个及以上站点！'
          })
          return;
        }

        // 请求添加线路接口
        const {
          routeName,
          routeIntroduce
        } = values

        const payload = {
          routeName,
          routeIntroduce,
          stationS: list.length === 0 ? null : list
        }

        this.setState({ isCreateLoading: true })
        await dispatch({
          type: 'wisdom_lineManagement/additionalLines',
          payload
        })

        id = 0
        this.setState({ isCreateLoading: false })
        onCancel();
        form.resetFields()
      }
    })
  }

  // 取消
  handleCancel = () => {
    const { form, onCancel } = this.props
    form.resetFields()
    onCancel();
    id = 0;
  }

  render() {
    const {
      form,              // 表单参数（默认必须值）
      visible,           // 弹出框是否可见
    } = this.props;

    const { getFieldDecorator, getFieldValue } = form;
    const { isCreateLoading } = this.state

    let option = {
      visible: visible,
      title: "新增线路",
      okText: "确定",
      cancelText: "取消",
      onCancel: this.handleCancel,
      onOk: this.handleSumbit,
      confirmLoading : isCreateLoading
    }; // 弹出框参数

    const formItemLayout = {
      labelCol: {             // label 标签布局
        xs: { span: 24 },     // span 栅格占位格数, 为0时 相当于 display: none, xs:小; sm: 一般;
        sm: { span: 6 },
      },
      wrapperCol: {          // 需要为输入控件设置布局样式时,使用该属性
        xs: { span: 24 },
        sm: { span: 16 },
      }
    }
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');

    // 站点集合
    const formItems = keys.map((k, index) => (
      <div className="addstation" key={k}>
        {
          index >= 1 &&
          <Form.Item
            className="otherstation"
            label=""
          >
            {getFieldDecorator(`names[${k}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  whitespace: true,
                  message: "请输入站点名称",
                },
              ],
            })(
              <Input placeholder="请输入站点名称" style={{ width: 120, fontSize: '13px', marginRight: 10 }} />
            )}
          </Form.Item>
        }
        {
          index == 0 &&
          <Form.Item
            label="站点名："
          >
            {getFieldDecorator(`names[${k}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  whitespace: true,
                  message: "请输入站点名称",
                },
              ],
            })(
              <Input placeholder="请输入站点名称" style={{ width: 120, fontSize: '13px', marginRight: 10 }} />
            )}
          </Form.Item>
        }

        <Form.Item
          label="坐标："
        >
          {getFieldDecorator(`coordinate[${k}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [
              {
                whitespace: true,
                message: "请输入坐标",
              },
            ],
          })(
            <Input placeholder="请输入坐标" style={{ width: 145, fontSize: '13px', marginRight: 10 }} data-id={k} onClick={this.handleChangeInput} />
          )}

        </Form.Item>
        {keys.length >= 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => this.onRemove(k)}
          />
        ) : null}
      </div>
    ));

    return (
      <Modal
        {...option}
      >
        <div className="addline lineform">
          <Form className="addline_form" layout='vertical' style={{ marginTop: 30 }}>
            <FormItem label="线路名称：" required hasFeedback {...formItemLayout} >
              {getFieldDecorator('routeName', {
                rules: [{ required: true, message: '请输入线路名称!', whitespace: true }],
                initialValue: '',
              })(
                <Input placeholder="请输入线路名称" />
              )}
            </FormItem>
            <Form.Item label="线路描述：" required hasFeedback {...formItemLayout} >
              {getFieldDecorator('routeIntroduce', {
                rules: [{ required: true, message: '请输入线路描述!', whitespace: true }],
                initialValue: '',
              })(
                <TextArea placeholder="请输入线路描述" autosize={{ minRows: 3, maxRows: 6 }} />
              )}
            </Form.Item>
            <div className="station_list">
              {formItems}
              <div >
                <Button type="dashed" onClick={this.onAdd} style={{ marginLeft: 60 }} >
                  <Icon type="plus" />新增站点
                  </Button>
              </div>
            </div>
          </Form>
        </div>
      </Modal>
    )
  }
}

const mapStateToProps = ({ 'wisdom_lineManagement': state }) => {
  const { lineList, lineListParam } = state
  return { lineList, lineListParam }
}

export default connect(
  mapStateToProps
)(Form.create()(AddLine))
