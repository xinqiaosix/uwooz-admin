import React from 'react'
import { connect } from 'dva'
import { Modal, Form, Input, Select, DatePicker } from 'antd'

import styles from './index.module.scss'

class CreateModal extends React.Component {
  state = {
    isCreateLoading: false,
  }
  
  handleOk = () => {
    const { form, dispatch, onCreateSuccess } = this.props

    form.validateFields(async (err, values) => {
      if (err) {
        return
      }

      const {
        sightseeingName,
        typeName,
        manageId,
        inputTime,
        maintenanceTime,
        insuranceTime,
        carNumber,
      } = values

      const payload = {
        // sourceId: 2,
        // scenicId: 1,
        sightseeingName,
        typeName,
        manageId,
        // newInputTime: inputTime,
        // newMaintenanceTime: maintenanceTime,
        // newInsuranceTime: insuranceTime,
        carNumber,
      }

      if (inputTime) {
        payload.newInputTime = inputTime.format('YYYY-MM-DD')
      }
      if (maintenanceTime) {
        payload.newMaintenanceTime = inputTime.format('YYYY-MM-DD')
      }
      if (insuranceTime) {
        payload.newInsuranceTime = inputTime.format('YYYY-MM-DD')
      }

      this.setState({ isCreateLoading: true })
      await dispatch({
        type: 'proA_sightseeing/createSightseeingCar',
        payload,
      })

      this.setState({
        isCreateLoading: false,
      })
      onCreateSuccess()
    })
  }
  
  render() {
    const {
      className = "",
      form,
      manages,
      visible = false,
      onCancel,
    } = this.props
    const { isCreateLoading } = this.state
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    }
    
    return (
      <Modal
        className={`${styles['root']} ${className}`}
        visible={visible}
        title="新增观光车"
        okText="保存"
        confirmLoading={isCreateLoading}
        cancelText="取消"
        onOk={this.handleOk}
        onCancel={onCancel}
      >
        <Form>
          <Form.Item
            label="观光车名称:"
            required
            hasFeedback
            {...formItemLayout}
          >
            {getFieldDecorator("sightseeingName", {
              rules: [
                {
                  required: true,
                  message: "请输入观光车名称!",
                  whitespace: true
                }
              ],
              initialValue: ""
            })(<Input placeholder="请输入观光车名称" />)}
          </Form.Item>
          <Form.Item label="车辆型号:" required hasFeedback {...formItemLayout}>
            {getFieldDecorator("typeName", {
              rules: [
                { required: true, message: "请输入车辆型号!", whitespace: true }
              ],
              initialValue: ""
            })(<Input placeholder="请输入车辆型号!" />)}
          </Form.Item>
          <Form.Item label="管理人员:" required hasFeedback {...formItemLayout}>
            {getFieldDecorator("manageId", {
              rules: [{ required: true, message: "请输入管理人员的姓名!" }]
            })(
              <Select placeholder="请输入管理人员的姓名!">
                {manages.map(items => (
                  <Select.Option key={items.id} value={items.id}>
                    {items.realName}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item
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
          </Form.Item>
          <Form.Item label="检修时间:" hasFeedback {...formItemLayout}>
            {getFieldDecorator("maintenanceTime", {
              initialValue: null
            })(<DatePicker format="YYYY-MM-DD" placeholder="请输入检修时间" />)}
          </Form.Item>
          <Form.Item label="保险时间:" hasFeedback {...formItemLayout}>
            {getFieldDecorator("insuranceTime", {
              initialValue: null
            })(<DatePicker format="YYYY-MM-DD" placeholder="请输入保险时间" />)}
          </Form.Item>

          <Form.Item label="车牌号:" hasFeedback {...formItemLayout}>
            {getFieldDecorator("carNumber", {
              rules: [{ message: "请填写车牌号!", whitespace: true }],
              initialValue: ""
            })(<Input placeholder="请填写车牌号!" />)}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => {
  const { proA_sightseeing: { manages } } = state
  return { manages }
}

export default connect(
  mapStateToProps
)(Form.create()(CreateModal))
