/* eslint-disable */
import React from 'react'
import { Icon, Modal, Steps, Form, Input, Row, Col, Button } from 'antd';
import './index.scss'
import { connect } from 'dva'
import styles from './index.module.scss'
const FormItem = Form.Item;
const {TextArea} = Input
const { Step } = Steps

// 创建第二步弹出框表单（添加票务）
let id = 0;
class TicketMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: true //用来判断规格票样式显示
    }
  }

  // 移除规格
  onRemove = k => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    if (keys.length === 1) {
      this.setState({
        display: true
      })
    }
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };
    
  // 添加规格
  onAdd = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id++);
    form.setFieldsValue({
      keys: nextKeys,
    });
    this.setState({
      display: false
    })
  };
    
  // 提交数据
  handleSubmit = e => {
    e.preventDefault();
    let list = []
    const { form, hideModal, dispatch, routeId, startStationId, endStationId } = this.props
    form.validateFields(async (err, values) => {
      if (!err) {
        const { keys, names, prices, coin, royalty } = values;

        // 从表单获取规格票的数据
        if (keys.length >= 1) {
          keys.map((key) => {
            let obj = { 'specName': names[key], 'price': prices[key], 'coin': coin[key], 'proportion': royalty[key] }
            list.push(obj)
          })
        }

        const payload = {
          price: values.price || '',                                                                                    // 单价
          coin: values.ticketcoin || '',                                                                                // 可使用旅行币
          proportion: values.proportion || '',                                                                          // 提成比例
          routeId,                                                                                                      // 线路id
          startStationId,                                                                                               // 起始站点id
          endStationId: endStationId,                                                                                   // 终点站点id
          name: values.ticketname,                                                                                      // 票务名称
          description: values.tickedes || '',                                                                           // 票务描述
          titck: list.length >= 1 ? JSON.stringify(list).replace('[', '%5B').replace(']', '%5D') : null                 // 添加的规格票的列表
        }

        const { errorCode, errMsg } = await dispatch({
          type: 'wisdom_ticketManagement/addTicket',
          payload
        })

        if(errorCode === 202 ){
          Modal.info({
            content: errMsg
          })
        }

        hideModal()
        form.resetFields()
        id = 0;
        this.setState({
          display: true
        })
      }
    });
  };

  // 取消票务添加
  onCancel = () => {
    const { form, hideModal } = this.props
    form.resetFields();
    hideModal();
    id = 0;
    this.setState({
      display: true
    })
  }

  render() {
    const {
      form,               // 表单参数（默认必须值）
    } = this.props;
    const formItemLayout = {
      labelCol: {            // label 标签布局
        xs: { span: 24 },   // span 栅格占位格数, 为0时 相当于 display: none, xs:小; sm: 一般;
        sm: { span: 6 },
      },
      wrapperCol: {         // 需要为输入控件设置布局样式时,使用该属性
        xs: { span: 24 },
        sm: { span: 16 },
      }
    }
    const { getFieldDecorator, getFieldValue } = form;

    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
      <div className={styles.ticket_list} key={k}>
        <Form.Item required>
          {getFieldDecorator(`names[${k}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [
              {
                whitespace: true,
                message: "请输入规格",
                required: true
              },
            ],
          })(
            <Input placeholder="请输入规格" style={{ width: 96, height: 27, fontSize: '12px', marginRight: 10 }} />
          )}
        </Form.Item>
        <Form.Item required >
          {getFieldDecorator(`prices[${k}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [
              {
                whitespace: true,
                message: "请输入单价",
                required: true
              },
            ],
          })(
            <Input placeholder="请输入单价" style={{ width: 96, height: 27, fontSize: '12px', marginRight: 10 }} />
          )}
        </Form.Item>
        <Form.Item required >
          {getFieldDecorator(`coin[${k}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [
              {
                whitespace: true,
                message: "",
              },
            ],
          })(
            <Input placeholder="请输入可抵扣积分" style={{ width: 119, height: 27, fontSize: '12px', marginRight: 10 }} />
          )}
        </Form.Item>
        <Form.Item required >
          {getFieldDecorator(`royalty[${k}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [
              {
                whitespace: true,
                message: "",
              },
            ],
          })(
            <span className={styles.percent}>
              <Input placeholder="0" style={{ width: 57, height: 27, fontSize: '12px' }} />
              <span style={{ marginLeft: 10 }}>%</span>
            </span>
          )}
        </Form.Item>
        {keys.length >= 1 ? (
          <Icon
            className="dynamic-delete-buttons"
            type="minus-circle-o"
            onClick={() => this.onRemove(k)}
          />
        ) : null}
      </div>
    ));

    return (
      <div className="elasticframe" style={this.props.visible ? {} : { display: 'none' }}>
        <div className="elasticframe_content">
          <div className={styles.title}>
            <img src={require('@/assets/images/returnback.png')} onClick={this.onCancel} className={styles.back} alt="" />
            <span>添加票务</span>
          </div>
          <div className={styles.steptwo}>
            <Steps current={1} labelPlacement="vertical">
              <Step title="选择线路" />
              <Step title="填写票务信息" />
            </Steps>
            <Form className={styles.addform} layout='vertical' style={{ marginTop: 30 }}>
              <FormItem label="票务名称：" required hasFeedback {...formItemLayout} >
                {getFieldDecorator('ticketname', {
                  rules: [{ required: true, message: '请输入票务名称!', whitespace: true }],
                  initialValue: '',
                })(
                  <Input placeholder="请输入票务名称"></Input>
                )}
              </FormItem>
              {
                this.state.display ?
                  <FormItem label="单价：" required hasFeedback {...formItemLayout} >
                    <Row gutter={8}>
                      <Col span={24}>
                        {getFieldDecorator('price', {
                          rules: [{ required: true, message: '请输入单价' }],
                        })(<Input prefix={<img src={require('@/assets/images/timg.jpg')} style={{ height: 15, width: 15 }} />} placeholder="请输入单价" />)}
                      </Col>
                    </Row>
                  </FormItem> : ''
              }
              <FormItem label="描述：" required hasFeedback {...formItemLayout} >
                {getFieldDecorator('tickedes', {
                  rules: [{ required: true, message: '请输入票务描述!', whitespace: true }],
                  initialValue: '',
                })(
                  <TextArea placeholder="请输入票务描述" autosize={{ minRows: 8, maxRows: 10 }} ></TextArea>
                )}
              </FormItem>
              <FormItem label="可抵扣积分：" hasFeedback {...formItemLayout}
                style={this.state.display ? {} : { display: 'none' }} >
                <Row gutter={8}>
                  <Col span={24}>
                    {getFieldDecorator('ticketcoin', {
                      rules: [{ message: '' }],
                    })(<Input placeholder="请输入可抵扣积分" />)}
                  </Col>
                </Row>
              </FormItem>
              <FormItem label="提成比例：" hasFeedback {...formItemLayout}
                style={this.state.display ? {} : { display: 'none' }}>
                <Row gutter={8}>
                  <Col span={12}>
                    {getFieldDecorator('proportion', {
                      rules: [{ message: '' }],
                    })(<Input placeholder="0" />)}
                  </Col>
                  <Col span={2}>
                    <p style={{ color: 'rgba(0,0,0,.85)', paddingTop: 5 }}>%</p>
                  </Col>
                </Row>
              </FormItem>
            </Form>
            {
              !this.state.display ?
              <div className={styles.ticket_spec}>
                <div className={styles.spec}>
                  <span>//</span>
                  <span style={{color:'rgba(0,0,0,.85)'}}>规格</span>
                  <span>//</span>
                </div>
                <div className={styles.spec_title} >
                  <span>规格名</span>
                  <span>单价</span>
                  <span>可抵扣积分</span>
                  <span className={styles.proportion}>提成比例</span>
                </div>
              </div>:''
            }
            <div className={styles.ticketspeclist}>
              {formItems}
              <div className={styles.addspec}>
                <Button type="dashed" onClick={this.onAdd} style={{ width: '63.5%', marginLeft: '10%' }}>
                  <Icon type="plus" />新增规格
                    </Button>
              </div>
            </div>
            <div className={styles.btn}>
              <Button type="primary" onClick={this.handleSubmit} style={{ marginRight: 10 }} >确定</Button>
              <Button onClick={this.onCancel}>取消</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
  
const mapStateToProps = ({ 'wisdom_ticketManagement': state }) => {
  const { ticketList, ticketListParam, lineLists, routeId, startStationId, endStationId } = state
  return { ticketList, ticketListParam, lineLists, routeId, startStationId, endStationId }
}

export default connect(
  mapStateToProps
)(Form.create()(TicketMessage))