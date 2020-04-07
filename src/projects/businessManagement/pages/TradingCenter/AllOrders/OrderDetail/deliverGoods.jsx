import React from 'react'
import { Form, Modal, Radio, Select, Input } from 'antd'
import { connect } from 'dva'
import styles from './index.module.scss'

const { Option } = Select

// 发货组件
class DeliverGoods extends React.Component {

  list = [
    {
      id: 1,
      name: '顺丰快递',
    },
    {
      id: 2,
      name: '韵达快递',
    }
  ]

  // 提交
  handleSumbit = () => {
    const { form, hideDeliverGoods, orderDetail, dispatch, handleGetOrderDetail } = this.props
    const { id} = orderDetail
    form.validateFields( async (err, values) => {
      const {
        distributionId,
        sendName,
        sendNumber,
        sendAddress
      } = values
      let payload = {}
      if (distributionId === 2) {
        payload = {
          distributionId,
          sendName,
          sendNumber,
          sendAddress,
          orderCoreId: id,          
        }
      }
      else {
        payload = {
          distributionId,
          orderCoreId: id
        }
      }

      await dispatch({
        type: 'businessManagement_allorders/Delivergoods',
        payload
      })

      handleGetOrderDetail()
      form.resetFields()
      hideDeliverGoods()
    })
  }

  // 取消
  onCancel = () => {
    const { hideDeliverGoods, form } = this.props
    form.resetFields()
    hideDeliverGoods()
  }

  render() {
    const { form, visible, addressData } = this.props;

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
      title: '发货',
      okText: '保存',
      cancelText: '取消',
      onOk: this.handleSumbit,
      onCancel: this.onCancel
    }

    return(
      <Modal {...option} >
        <Form>
          <Form.Item label="发货方式" { ...formItemLayout }>
            {
              getFieldDecorator('distributionId', {
                rules: [{ whitespace: true, type: 'string' }]
              })(
                <Radio.Group>
                  <Radio.Button value="2">物流发货</Radio.Button>
                  <Radio.Button value="3">无需物流</Radio.Button>
                </Radio.Group>
              )
            }
          </Form.Item>
          <Form.Item label="快递公司" { ...formItemLayout }>
            {
              getFieldDecorator('sendName', {
                rules: [{ whitespace: true }]
              })(
                <Select style={{width: '70%'}} placeholder="请选择">
                  {
                    this.list.map((item,index) => {
                      return(
                        <Option key={index} value={item.name}>{item.name}</Option>
                      )
                    })
                  }
                </Select>
              )
            }
          </Form.Item>
          <Form.Item label="物流单号" { ...formItemLayout }>
            {
              getFieldDecorator('sendNumber', {
                rules: [{ whitespace: true }]
              })(
                <Input placeholder="请输入"/>
              )
            }
          </Form.Item>
          <Form.Item label="选择发货地址" { ...formItemLayout }>
            {
              getFieldDecorator('sendAddress', {
                rules: [{ whitespace: true, type: 'number' }]
              })(
                <Select optionLabelProp="label" placeholder="请选择" >
                  {
                    addressData.map((item) => {
                      return (
                        <Option key={item.id} value={item.id} label={item.theContact} className={styles['select-option']}>
                          <span>{item.theContact}</span><br />
                          <span>{item.contact}</span><br />{""}
                          <span className={styles['address']}>{item.contactAddress}{item.detailedAddress}</span>{""}
                        </Option>
                      )
                    })
                  }
                </Select>
              )
            }
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

const mapStateToProps = state => {
  return {
    addressData: state.businessManagement_logistics.addressData,
    orderDetail: state.businessManagement_allorders.orderDetail
  };
};


export default connect(mapStateToProps)(Form.create()(DeliverGoods)) 
