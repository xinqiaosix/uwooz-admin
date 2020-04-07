import React from 'react'
import { Modal, Form, Input, Row, Col, Button } from 'antd'
import { connect } from 'dva'
import styles from './index.module.scss'

class ModifyPrice extends React.Component {
  state = {
    paymentAmount: 0,     // 实付金额
    modifyPrice: 0,       // 涨价或减价
    freight:0             // 修改运费
  }

  componentWillReceiveProps(nextProps) { // 父组件重传props时就会调用这个方法
    if (!nextProps.visible) {
      this.setState({
        paymentAmount: nextProps.totalPrice + nextProps.freight ,
        freight: nextProps.freight
      });
    }
  }
  
  // 修改涨价或减价输入框
  onChangeModifyPrice = (e) => {
    const { totalPrice } = this.props;
    const { freight } = this.state
    const { value } = e.target;
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if (value !== '' && !isNaN(value) && reg.test(value)) {
      const price = totalPrice + parseFloat(value) + freight
      this.setState({
        paymentAmount: price,
        modifyPrice: parseFloat(value)
      })
    }
  }

  // 修改运费
  onChangeFreight = (e) => {
    const { totalPrice } = this.props;
    const { modifyPrice } = this.state
    const { value } = e.target;
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if (value !== '' && !isNaN(value) && reg.test(value)) {
      const price = totalPrice + parseFloat(value) + modifyPrice
      this.setState({
        paymentAmount: price,
        freight: parseFloat(value)
      })
    }
  }

  // 免运费
  onFreeFreight = () => {
    const { totalPrice } = this.props;
    const { modifyPrice } = this.state
    const price = totalPrice + modifyPrice
    this.setState({
      paymentAmount: price,
      freight: 0
    })
  }

  // 提交
  handleSumbit = async () => {
    const { hideModifyPrice, dispatch, id } = this.props
    const { modifyPrice, freight } = this.state
    const payload = {
        id,
        discountPrice: modifyPrice,
        postage: freight
    }
    await dispatch({
      type: 'businessManagement_allorders/modifyPrice',
      payload
    })
    hideModifyPrice()
  }

  // 取消
  onCancel = () => {
    const { hideModifyPrice, form } = this.props
    form.resetFields()
    hideModifyPrice()
  }

  render() {
    const { visible, form, totalPrice } = this.props;
    const { paymentAmount, freight } = this.state
    const { getFieldDecorator } = form

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

    let option = {
      visible: visible,
      title: '修改价格',
      okText: '确定',
      cancelText: '取消',
      onCancel: this.onCancel,
      onOk: this.handleSumbit,
    }
    return (
      <Modal { ...option }
        footer={[
          <div key="operate" className={styles['sumbit-or-cancel']}>
            <span className={styles['explain']}>实付金额 = 订单原价 + 涨减价 + 运费</span>
            <div>
              <Button onClick={this.onCancel}>取消</Button>
              <Button key="sumbit" type="primary" onClick={this.handleSumbit}>确定</Button>
            </div>
          </div>          
        ]}
      >
        <Form className={styles['payment-form']}>
          <Row>
            <Col span={20}>
              <Form.Item label="订单原价：" {...formItemLayout}>
                {
                  getFieldDecorator('originalPrice', {
                    rules: [{ whitespace: true }],
                    initialValue: ''
                  })(
                    <span>￥{totalPrice}</span>
                  )
                }
              </Form.Item>
            </Col>
          </Row>
          
          <Row>
            <Col span={20}>
              <Form.Item label="涨价或减价：" {...formItemLayout}>
                {
                  getFieldDecorator('modifyPrice', {
                    rules: [{ whitespace: true }],
                    initialValue: ''
                  })(
                    <Input placeholder="请输入"  onChange={this.onChangeModifyPrice}/>
                  )
                }
              </Form.Item>
            </Col>
          </Row>
          
          <Row>
            <Col span={20}>
              <Form.Item label="改运费" {...formItemLayout}>
                {
                  getFieldDecorator('freight', {
                    rules: [{ whitespace: true }],
                    initialValue: freight
                  })(
                    <Input onChange={this.onChangeFreight} />
                  )
                }
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item {...formItemLayout} >
                {
                  getFieldDecorator('freeFreight', {
                    rules: [{ whitespace: true }]
                  })(
                    <span style={{color: '#ff9212', cursor: 'pointer'}} onClick={this.onFreeFreight} >免运费</span>
                  )
                }
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={20}>
              <Form.Item label="实付金额" {...formItemLayout} >
                {
                  getFieldDecorator('paymentAmount', {
                    rules: [{ whitespace: true }]
                  })(
                    <span style={{color:'#f5222d'}}>￥{paymentAmount}</span>
                  )
                }
              </Form.Item>
            </Col>
          </Row>
          
        </Form>
      </Modal>
    )
  }
}
export default connect()(Form.create()(ModifyPrice))