import React from 'react'
import { Modal, Form, Select, Input } from 'antd'
import * as refundApi from '../../../../api/refund'
import { connect } from 'dva'
import styles from './index.module.scss'

const { Option } = Select

class ConfirmRefund extends React.Component {

  // 取消
  onCancel = () => {
    const { form, hideConfirmRefund } = this.props
    form.resetFields()
    hideConfirmRefund()
  }

  // 提交数据
  handleSumbit = () => {
    const {
      form,
      hideConfirmRefund,
      orderData,
      onGeRefundList,
      handleGetRefundNum,
      user
    } = this.props

    form.validateFields(async (err, values) => {
      if (err) {
        return
      }
      const { sureRefundWay, outTradeNo } = values
      const { accountId } = user

      const {
        orderId,
        payPrice,
        price,
        payChannel,
        appId,
        operatorId,
        id,
      } = orderData

      const payload = {
        sureRefundWay,
        outTradeNo,
        orderId,
        appId,
        operatorId,
        accountId,
        refundId: id,
        channel: payChannel,
        amount: payPrice,
        refundAmount: price,
        subject: '退款申请'
      }

      const res = await refundApi.confirmRefund(payload)
      const { errorCode } = res
      if (errorCode === 200) {
        Modal.success({
          title: '退款成功',
        })
        onGeRefundList()
        handleGetRefundNum()
      } else {
        Modal.error({
          title: '退款失败',
        })
      }

      form.resetFields()
      hideConfirmRefund()
    })
  }

  render() {
    const { visible, form, orderData } = this.props
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
      title: '确认退款',
      okText: '确定',
      cancelText: '取消',
      onCancel: this.onCancel,
      onOk: this.handleSumbit,
    }

    return (
      <Modal {...option}>
        <Form className={styles['refund-form']}>
          <Form.Item label="退款金额：" {...formItemLayout}>
            {getFieldDecorator('refundAmount', {
              rules: [{ whitespace: true }],
            })(<span style={{ color: '#f5222d' }}>￥{orderData.price}</span>)}
          </Form.Item>
          <Form.Item label="退款方式：" {...formItemLayout}>
            {getFieldDecorator('sureRefundWay', {
              rules: [{ required: true, message: '请选择退款方式' }],
              initialValue: undefined,
            })(
              <Select placeholder="请选择 退款方式">
                <Option value={1}>原路返回</Option>
                <Option value={2}>企业付款</Option>
                <Option value={3}>线下付款</Option>
                <Option value={4}>银行转账</Option>
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="退款单号：" {...formItemLayout}>
            {getFieldDecorator('outTradeNo', {
              rules: [{ required: true, message: '请填写退款单号' }],
              initialValue: '',
            })(<Input placeholder="请输入" />)}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.app.user
  };
};
export default connect(mapStateToProps)(Form.create()(ConfirmRefund)) 
