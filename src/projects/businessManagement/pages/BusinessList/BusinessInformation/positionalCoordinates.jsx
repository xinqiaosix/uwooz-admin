import React from 'react'
import { Modal, Form, Input, Select } from 'antd'
import styles from './index.module.scss'
import { connect } from 'dva'

const { Option } = Select

class PositionCoordinates extends React.Component{
  constructor(props)
  {
    super(props);
    this.state = {

    }
  }

  // 取消
  onCancel = () => {
    const { form, onCancel } = this.props
    form.resetFields();
    onCancel()
  }

  // 提交数据
  handleSumbit = () => {
    const { form, id, dispatch, onCancel } = this.props;
    form.validateFields( async (err, values) => {
      const {
        latitude,
        longitude,
        poi
      } = values

      const payload = {
        id,
        latitude,
        longitude,
        poi: poi || '' 
      }

      await dispatch({
        type: 'businessManagement_businessList/modifyLocation',
        payload
      })

      form.resetFields()
      onCancel()
    })
  }

  render() {
    const {
      visible,
      form,
      longitude,
      latitude
    } = this.props

    const { getFieldDecorator } = form;

    let option = {
      visible: visible,
      title: "位置坐标",
      okText: "保存",
      cancelText: "取消",
      onCancel: this.onCancel,
      onOk: this.handleSumbit,
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
    return(
      <Modal {...option} >
        <Form className={styles['modify-form']}>
          <Form.Item label="经度："  hasFeedback {...formItemLayout} >
            {getFieldDecorator('longitude', {
              rules: [{ whitespace: true }],
              initialValue: longitude || '',
            })(
              <Input placeholder="" />
            )}
          </Form.Item>
          <Form.Item label="纬度："  hasFeedback {...formItemLayout} >
            {getFieldDecorator('latitude', {
              rules: [{ whitespace: true }],
              initialValue: latitude || '',
            })(
              <Input placeholder="" />
            )}
          </Form.Item>
          <Form.Item label="关联POI："  hasFeedback {...formItemLayout}>
            {getFieldDecorator('poi', {
              rules: [{ whitespace: true }],
              initialValue: undefined,
            })(
              <Select>
                <Option value="1">星巴克-曹山店</Option>
              </Select>
            )}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

export default connect()(Form.create()(PositionCoordinates)) 