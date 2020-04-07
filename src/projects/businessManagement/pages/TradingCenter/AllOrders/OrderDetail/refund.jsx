import React from 'react'
import { Modal, Form, Radio, Input } from 'antd'
import { connect } from 'dva'

class Refund extends React.Component {
  state = {
    refundAmount: 0, // 退款金额
    refundType: 2, // 退款方式（2：部分退款, 1: 全额退款）
  }

  // 取消
  onCancel = () => {
    const { hideRefund, form } = this.props
    form.resetFields()
    hideRefund()
  }

  // 提交
  handleSumbit = () => {
    const { form, hideRefund, orderDetail, dispatch, merchantInfo } = this.props
    const { refundAmount, refundType } = this.state
    form.validateFields(async () => {
      // if(err) {
      //   return;
      // }
      const { orderNumber, id } = orderDetail
      const { merchantName } = merchantInfo
      const payload = {
        merchantName,
        orderId: id,
        refundNumber: orderNumber,
        price: refundAmount,
        refundWay: refundType,
      }
      const { errorCode } = await dispatch({
        type: 'businessManagement_allorders/applyRefund',
        payload,
      })
      if (errorCode === 200) {
        Modal.success({
          title: '申请成功',
        })
      }
      form.resetFields()
      hideRefund()
    })
  }

  // 选择退款方式
  onChooseRefundType = e => {
    const { value } = e.target
    const { orderDetail, form } = this.props
    const { payPrice } = orderDetail
    this.setState({
      refundType: parseInt(value),
    })

    if (parseInt(value) === 1) {
      form.resetFields()
      this.setState({
        refundAmount: payPrice, // 全额退款
      })
    } else {
      this.setState({
        refundAmount: 0,
      })
    }
  }

  // 输入退款金额
  onChangeInput = e => {
    const { value } = e.target
    const { refundType } = this.state
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/
    if (!isNaN(value) && reg.test(value) && value !== '') {
      if (refundType === 2) {
        this.setState({
          refundAmount: value,
        })
      }
    } else {
      this.setState({
        refundAmount: 0,
      })
    }
  }

  render() {
    const { visible, form } = this.props
    const { getFieldDecorator } = form
    const { refundAmount, refundType } = this.state

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
      title: '申请退款',
      okText: '确定',
      cancelText: '取消',
      onOk: this.handleSumbit,
      onCancel: this.onCancel,
    }
    return (
      <Modal {...option}>
        <Form.Item label="退款方式：" {...formItemLayout}>
          {getFieldDecorator('refudnWay', {
            rules: [{ whitespace: true }],
            initialValue: '2',
          })(
            <Radio.Group onChange={this.onChooseRefundType}>
              <Radio.Button value="2">部分退款</Radio.Button>
              <Radio.Button value="1">全额退款</Radio.Button>
            </Radio.Group>,
          )}
        </Form.Item>
        {refundType === 2 && (
          <Form.Item label="退款金额：" {...formItemLayout}>
            {getFieldDecorator('refundAmount', {
              rules: [{ whitespace: true }],
            })(<Input placeholder="请输入" onChange={this.onChangeInput} />)}
          </Form.Item>
        )}
        <Form.Item label="将退款给买家" {...formItemLayout}>
          {getFieldDecorator('refund', {
            rules: [{ whitespace: true }],
          })(<span style={{ color: '#f5222d' }}>￥{refundAmount}</span>)}
        </Form.Item>
      </Modal>
    )
  }
}

const mapStateToProps = ({ businessManagement_allorders: state }) => {
  const { orderDetail, merchantInfo } = state
  return { orderDetail, merchantInfo }
}
export default connect(mapStateToProps)(Form.create()(Refund)) 