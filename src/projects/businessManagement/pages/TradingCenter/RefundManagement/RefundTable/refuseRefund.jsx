import React from 'react'
import { Modal, Form, Select, Input } from 'antd'
import { connect } from 'dva'
import * as refundApi from '../../../../api/refund'
import styles from './index.module.scss'

const { Option } = Select

class RefuseRefund extends React.Component {
  // 取消
  onCancel = () => {
    const { form, hideRefuseRefund } = this.props
    form.resetFields()
    hideRefuseRefund()
  }

  // 提交数据
  handleSumbit = () => {
    const {
      form,
      hideRefuseRefund,
      orderId,
      refuseId,
      onGeRefundList,
      handleGetRefundNum,
    } = this.props

    form.validateFields(async (err, values) => {
      if (err) {
        return
      }

      const { reasonId, refusedReason } = values
      const payload = {
        orderId,
        reasonId,
        refuseId,
        refusedReason: refusedReason === undefined ? null : refusedReason,
      }

      const { errorCode } = await refundApi.refuseRefund(payload)
      if (errorCode === 200) {
        Modal.success({
          title: '已拒绝',
        })
        onGeRefundList()
        form.resetFields()
        hideRefuseRefund()
        handleGetRefundNum()
      }
    })
  }

  render() {
    const { form, visible, refundReson } = this.props
    const { getFieldDecorator } = form

    const formItemLayout = {
      labelCol: {
        // label 标签布局
        xs: { span: 24 }, // span 栅格占位格数, 为0时 相当于 display: none, xs:小; sm: 一般;
        sm: { span: 6 },
      },
      wrapperCol: {
        // 需要为输入控件设置布局样式时,使用该属性
        xs: { span: 24 },
        sm: { span: 16 },
      },
    }

    let option = {
      visible: visible,
      title: '拒绝退款',
      okText: '确定',
      cancelText: '取消',
      onCancel: this.onCancel,
      onOk: this.handleSumbit,
    }

    return (
      <Modal {...option}>
        <Form className={styles['refuse-form']}>
          <Form.Item label="拒绝理由：" {...formItemLayout}>
            {getFieldDecorator('reasonId', {
              rules: [
                {
                  required: true,
                  message: '请选择拒绝理由',
                },
              ],
            })(
              <Select placeholder="请选择拒绝理由">
                {refundReson.map(item => {
                  return (
                    <Option key={item.id} value={item.id}>
                      {item.refundReaosn}
                    </Option>
                  )
                })}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="其他理由：" {...formItemLayout}>
            {getFieldDecorator('refusedReason', {
              rules: [
                {
                  whitespace: true,
                },
              ],
            })(<Input placeholder="请输入" />)}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

const mapStateToProps = ({ 'businessManagement_refund': state }) => {
  const { refundReson } = state
  return { refundReson }
}

export default connect(mapStateToProps)(Form.create()(RefuseRefund)) 

