import React from 'react'
import { Form, Row, Col, Select, Input, DatePicker, Button } from 'antd'
import moment from 'moment';
import { connect } from 'dva'
import styles from './index.module.scss'

const { Option } = Select
const { RangePicker } = DatePicker

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  // 获取表单的值
  handleGteFieldsValue = () => {
    const { form } = this.props
    let value = {}    // 表单的值
    form.validateFields((err, fieldsValue) => {
      if(err) { 
        return;
      }
      const rangeValue = fieldsValue['orderDate'];
      const { orderSearch, searchName, source, type, distributionId } = fieldsValue
      let orderNumber = ''
      let productName = ''
      let buyersPhone = ''
      if(orderSearch === 1) {
        orderNumber = searchName
      }
      if(orderSearch === 2) {
        buyersPhone = searchName
      }
      if(orderSearch === 3) {
        productName = searchName
      }
      value = {
        dStart: rangeValue[0].format('YYYY-MM-DD'),
        dEnd: rangeValue[1].format('YYYY-MM-DD'),
        orderNumber: orderNumber === '' ? null : orderNumber,
        productName: productName === '' ? null : productName,
        buyersPhone: buyersPhone === '' ? null : buyersPhone,
        source: source === -1 ? null : source ,
        type: type === -1 ? null : type,
        distributionId: distributionId === -1 ? null : distributionId
      }
    })

    return value;
  }

  // 搜索
  onSearch = async(e) => {
    const { dispatch, merchantId, orderState } = this.props
    const res = await this.handleGteFieldsValue()
    const payload = {
      ...res,
      page: 1,
      pageSize: 10,
      merchantId: merchantId === '' ? null : merchantId,
      state: orderState === -1 ? null : orderState
    }
    dispatch({
      type: 'businessManagement_allorders/loadOrder',
      payload
    })
  }

  // 清空
  onClear = () => {
    const { form } = this.props;
    form.resetFields();
    const date = new Date()
    const dStart = `${date.getFullYear()}-${date.getMonth() + 1}-01`
    const dEnd = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    const { dispatch, merchantId, orderState } = this.props
    const payload = {
      page: 1,
      pageSize: 10,
      merchantId: merchantId === '' ? null : merchantId,
      state: orderState === -1 ? null : orderState,
      dStart,
      dEnd,
    }
    dispatch({
      type: 'businessManagement_allorders/loadOrder',
      payload
    })
  }

  componentDidUpdate(nextProps)
  {
    if(nextProps.isResetFields) {
      this.onClear()
    }
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  render() {
    const { form, orderType, deliveryType, orderSources } = this.props
    const dateFormat = 'YYYY/MM/DD'
    const { getFieldDecorator } = form
    const date = new Date();
    const formItemLayout = {
      labelCol: {             // label 标签布局
        xs: { span: 24 },     // span 栅格占位格数, 为0时 相当于 display: none, xs:小; sm: 一般;
        sm: { span: 8 },
      },
      wrapperCol: {          // 需要为输入控件设置布局样式时,使用该属性
        xs: { span: 24 },
        sm: { span: 16 },
      }
    }
    return (
      <div className={styles.search_form}>
        <Form className={styles.form}>
          <Row gutter={16}>
            <Col>
              <Form.Item label="订单搜索"  {...formItemLayout} >
                {getFieldDecorator('orderSearch', {
                  rules: [{ whitespace: true, type: 'number' }],
                  initialValue: undefined
                })(
                  <Select placeholder="订单编号" style={{ width: 130 }}>
                    <Option value={1}>订单编号</Option>
                    <Option value={2}>买家手机号</Option>
                    <Option value={3}>商品名称</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item>
                {getFieldDecorator('searchName', {
                  rules: [{ whitespace: true }],
                  initialValue: ''
                })(
                  <Input />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="订单日期：" >
            {
              getFieldDecorator('orderDate', {
                rules: [{ whitespace: true , type: 'array'}],
                initialValue: [
                  moment(`${date.getFullYear()}/${date.getMonth() + 1}/01`, dateFormat), 
                  moment(`${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`, 
                  dateFormat)
                ]
              })(
                <RangePicker  />
              )
            }
          </Form.Item>
          <Row gutter={16}>
            <Col>
              <Form.Item label="订单来源：" {...formItemLayout}>
                {
                  getFieldDecorator('source', {
                    rules: [{ whitespace: true, type: 'number'  }],
                    initialValue: -1
                  })(
                    <Select placeholder="全部"  style={{ width: 130 }}>
                      <Option value={-1}>全部</Option>
                      {
                        orderSources.map((item) => {
                          return (
                            <Option value={item.id} key={item.id}>{item.name}</Option>
                          )
                        })
                      }
                    </Select>
                  )
                }
              </Form.Item>
            </Col>
            <Col>
              <Form.Item label="订单类型：" {...formItemLayout}>
                {
                  getFieldDecorator('type', {
                    rules: [{ whitespace: true, type: 'number' }],
                    initialValue: -1
                  })(
                    <Select placeholder="全部"  style={{ width: 130 }}>
                      <Option value={-1}>全部</Option>
                      {
                        orderType.map((item) => {
                          return (
                            <Option value={item.id} key={item.id}>{item.name}</Option>
                          )
                        })
                      }
                    </Select>
                  )
                }
              </Form.Item>
            </Col>
            <Col>
              <Form.Item label="配送方式：" {...formItemLayout}>
                {
                  getFieldDecorator('distributionId', {
                    rules: [{ whitespace: true, type: 'number' }],
                    initialValue: -1
                  })(
                    <Select placeholder="全部"  style={{ width: 130 }} >
                      <Option value={-1}>全部</Option>
                      {
                        deliveryType.map((item) => {
                          return (
                            <Option value={item.id} key={item.id}>{item.name}</Option>
                          )
                        })
                      }
                    </Select>
                  )
                }
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <div className={styles.option}>
          <Button type="primary" onClick={this.onSearch} >搜索</Button>
          <span className={styles.clear} onClick={this.onClear}>清空</span>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ 'businessManagement_allorders': state }) => {
  const { orderList, orderListParam, orderType, deliveryType, orderSources } = state
  return { orderList, orderListParam, orderType, deliveryType, orderSources }
}
export default connect(mapStateToProps)(Form.create()(SearchForm))