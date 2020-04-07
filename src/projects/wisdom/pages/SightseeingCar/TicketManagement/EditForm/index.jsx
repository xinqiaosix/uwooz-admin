/* eslint-disable */
import React from 'react'
import { Icon, Form, Input, Row, Col, Button } from 'antd';
import styles from './index.module.scss'
import { connect } from 'dva'
const FormItem = Form.Item;
const { TextArea } = Input

let specId = 0

// 编辑表单
class EditTicket extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,       // 用于添加或删除规格票下标变化的标识
      add: false,     // 当规格票移除完后，用来标识普通票显示与否(包括普通票的单价，提成比例，可使用积分)
      spec: false,    // 通票显示与否 
      deleteList: []  // 删除的规格票集合
    }
  }
  // 移除规格
  onRemove = k => {
    const { form, data } = this.props;
    const { deleteList } = this.state
    const keys = form.getFieldValue('keys');
    if (keys.length === 1) {
      this.setState({
        add: false,
        spec: true
      })
    }
    if (data.orderProducts[k] !== undefined) {
      deleteList.push(data.orderProducts[k].id)
      data.orderProducts[k] = undefined
    }
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  // 添加规格
  onAdd = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    this.setState({
      add: true,
      spec: false
    })
    if (this.state.count < 1) {
      if (keys.length >= 1) {
        specId = keys[keys.length - 1] + 1
        this.setState({
          count: this.state.count + 1
        })
      }
      else {
        specId = 1
        this.setState({
          count: this.state.count + 1
        })
      }
    }
    else {
      specId = specId + 1
    }
    const nextKeys = keys.concat(specId);
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  // 提交
  handleSubmit = e => {
    e.preventDefault();
    let list = []
    const { form, data, hideModal, dispatch } = this.props
    const { deleteList } = this.state
    form.validateFields( async (err, values) => {
      if (!err) {
        const { keys, names, prices, coin, royalty, ticketid } = values;
        if (keys.length >= 1) {
          if (data.orderProducts.length === 0) {// 删除普通票
            deleteList.push(data.id)
          }
          keys.map((key) => {
            let obj = {
              id: ticketid[key],
              routeId: data.routeId,
              startStationId: data.startStationId,
              endStationId: data.endStationId,
              name: values.ticketname,
              description: values.tickedes,
              price: prices[key],
              coin: coin[key],
              proportion: royalty[key],
              specName: names[key]
            }
            list.push(obj)
          })
        }
        else {
          let obj = {
            id: data.id || '' ,
            routeId: data.routeId,
            startStationId: data.startStationId,
            endStationId: data.endStationId,
            name: values.ticketname,
            description: values.tickedes,
            price: parseFloat(values.price),
            coin: values.ticketcoin || '' ,
            proportion: values.proportion || '' ,
            specName: ''
          }
          list.push(obj)
        }

        // 请求编辑接口
        const payload = {
          ids: deleteList.length === 0 ? null : deleteList.toString(),
          ticketThe: JSON.stringify(list).replace('[', '%5B').replace(']', '%5D')
        }

        await dispatch({
          type: 'wisdom_ticketManagement/editTicket',
          payload
        })

        this.setState({
          count: 0,
          add: false,
          spec: false,
          deleteList: []
        })
        hideModal()
        form.resetFields()
      }
    });
  };

  // 取消
  onCancel = () => {
    const { form, hideModal } = this.props
    form.resetFields();
    hideModal();
    this.setState({
      add: false,
      spec: false,
      deleteList: [],
      count: 0,
    })
  }

  render() {
    const {
      form, // 表单参数（默认必须值）
      data,
      visible
    } = this.props;

    const formItemLayout = {
      labelCol: { // label 标签布局
        xs: { span: 24 }, // span 栅格占位格数, 为0时 相当于 display: none, xs:小; sm: 一般;
        sm: { span: 5 },
      },
      wrapperCol: { // 需要为输入控件设置布局样式时,使用该属性
        xs: { span: 24 },
        sm: { span: 16 },
      }
    }

    const { getFieldDecorator, getFieldValue } = form;

    // 用于初始化规格票集合
    let list = []
    if (data.orderProducts !== undefined) {
      data.orderProducts.forEach((item, index) => {
        if (item !== undefined && item !== '') {
          list.push(index)
        }
      })
    }

    getFieldDecorator('keys', { initialValue: list });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
      <div className={styles.ticket_list} key={k}>
        {
          form.getFieldValue('keys').length >= 1 ?
            <React.Fragment>
              <Form.Item
                required
                style={{ display: 'none' }}
              >
                {getFieldDecorator(`ticketid[${k}]`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  rules: [
                    {
                      whitespace: true,
                      message: "",
                    },
                  ],
                  initialValue: data.orderProducts[k] !== undefined && data.orderProducts[k] !== '' ? data.orderProducts[k].id.toString() : ''
                })(
                  <Input placeholder="" style={{ width: 30, height: 27, fontSize: '12px', marginRight: 10 }} />
                )}

              </Form.Item>
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
                  initialValue: data.orderProducts[k] !== undefined && data.orderProducts[k] ? data.orderProducts[k].name : ''
                })(
                  <Input placeholder="请输入规格" style={{ width: 96, height: 27, fontSize: '12px', marginRight: 10 }} />
                )}
              </Form.Item>

              <Form.Item required>
                {getFieldDecorator(`prices[${k}]`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  rules: [
                    {
                      whitespace: true,
                      message: "请输入单价",
                      required: true
                    },
                  ],
                  initialValue: data.orderProducts[k] !== undefined && data.orderProducts[k] ? data.orderProducts[k].adultPrice.toString() : ''
                })(
                  <Input placeholder="请输入单价" style={{ width: 102, height: 27, fontSize: '12px', marginRight: 10 }} />
                )}
              </Form.Item>

              <Form.Item required>
                {getFieldDecorator(`coin[${k}]`, {
                  rules: [{ whitespace: true, message: "请输入可抵扣积分" }],
                  initialValue: data.orderProducts[k] !== undefined && data.orderProducts[k] ? data.orderProducts[k].coin.toString() : ''
                })(
                  <Input placeholder="请输入可抵扣积分" style={{ width: 122, height: 27, fontSize: '12px', marginRight: 10 }} />
                )}
              </Form.Item>

              <Form.Item required>
                {getFieldDecorator(`royalty[${k}]`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  rules: [
                    {
                      whitespace: true,
                      message: "提成比例",
                    },
                  ],
                  initialValue: data.orderProducts[k] !== undefined && data.orderProducts[k] ? data.orderProducts[k].proportion.toString() : ''
                })(
                  <Input placeholder="0" style={{ width: 57, height: 27, fontSize: '12px' }} />
                )}
              </Form.Item>

              {keys.length >= 1 ? (
                <React.Fragment>
                  <span style={{ marginLeft: 5, height: 20, marginTop: 10 }}>%</span>
                  <Icon
                    className="dynamic-delete-buttons"
                    type="minus-circle-o"
                    onClick={() => this.onRemove(k)}
                  />
                </React.Fragment>
              ) : null}
            </React.Fragment> : ''
        }
      </div>
    ));
    return (
      <div className="elasticframe" style={visible ? {} : { display: 'none' }}>
        <div className="elasticframe_content">
          <div className={styles.title}>
            <img src={require('@/assets/images/returnback.png')} onClick={this.onCancel} alt="" />
            <span>编辑票务</span>
          </div>
          <div className={styles.edit_form}>
            <Form layout='vertical' style={{ marginTop: 30 }}>
              <FormItem label="票务名称：" required hasFeedback {...formItemLayout} >
                {getFieldDecorator('ticketname', {
                  rules: [{ required: true, message: '请输入票务名称!', whitespace: true }],
                  initialValue: data.name,
                })(
                  <Input placeholder="请输入票务名称"></Input>
                )}
              </FormItem>
              {
                data && data.orderProducts &&
                <React.Fragment>
                  {
                    data.orderProducts.length === 0 ?
                      this.state.add ? '' :
                        <FormItem label="单价：" required hasFeedback {...formItemLayout} >
                          <Row gutter={8}>
                            <Col span={24}>
                              {getFieldDecorator('price', {
                                rules: [{ required: true, message: '请输入单价' }],
                                initialValue: data.adultPrice
                              })(<Input prefix={<img src={require('@/assets/images/timg.jpg')} style={{ height: 15, width: 15 }} />} placeholder="请输入单价" />)}
                            </Col>
                          </Row>
                        </FormItem>
                      : this.state.spec ?
                        <FormItem label="单价：" required hasFeedback {...formItemLayout} >
                          <Row gutter={8}>
                            <Col span={24}>
                              {getFieldDecorator('price', {
                                rules: [{ required: true, message: '请输入单价' }],
                                initialValue: ''
                              })(<Input prefix={<img src={require('@/assets/images/timg.jpg')} style={{ height: 15, width: 15 }} />} placeholder="请输入单价" />)}
                            </Col>
                          </Row>
                        </FormItem> : ''
                  }
                </React.Fragment>
              }

              <FormItem label="描述：" required hasFeedback {...formItemLayout} >
                {getFieldDecorator('tickedes', {
                  rules: [{ required: true, message: '请输入票务描述!' }],
                  initialValue: data.description === undefined ? '' : data.description,
                })(
                  <TextArea placeholder="请输入票务描述" autosize={{ minRows: 8, maxRows: 10 }} ></TextArea>
                )}
              </FormItem>

              {
                data && data.orderProducts &&
                <React.Fragment>
                  {
                    data.orderProducts.length === 0 ? this.state.add ? '' :
                      <FormItem label="可抵扣积分：" hasFeedback {...formItemLayout} >
                        <Row gutter={8}>
                          <Col span={24}>
                            {getFieldDecorator('ticketcoin', {
                              rules: [{ message: '' }],
                              initialValue: data.coin.toString()
                            })(<Input placeholder="请输入可抵扣积分" />)}
                          </Col>
                        </Row>
                      </FormItem> : this.state.spec ? <FormItem label="可抵扣积分：" hasFeedback {...formItemLayout} >
                        <Row gutter={8}>
                          <Col span={24}>
                            {getFieldDecorator('ticketcoin', {
                              rules: [{ message: '' }],
                              initialValue: ''
                            })(<Input placeholder="请输入可抵扣积分" />)}
                          </Col>
                        </Row>
                      </FormItem> : ''
                  }
                </React.Fragment>
              }
              {
                data && data.orderProducts &&
                <React.Fragment>
                  {
                    data.orderProducts.length === 0 ? this.state.add ? '' :
                      <FormItem label="提成比例：" hasFeedback {...formItemLayout} >
                        <Row gutter={8}>
                          <Col span={12}>
                            {getFieldDecorator('proportion', {
                              rules: [{ message: '' }],
                              initialValue: data.proportion.toString()
                            })(<Input placeholder="0" />)}
                          </Col>
                          <Col span={2}>
                            <p style={{ color: 'rgba(0,0,0,.85)', paddingTop: 5 }}>%</p>
                          </Col>
                        </Row>
                      </FormItem> : this.state.spec ?
                        <FormItem label="提成比例：" hasFeedback {...formItemLayout} >
                          <Row gutter={8}>
                            <Col span={12}>
                              {getFieldDecorator('proportion', {
                                rules: [{ message: '' }],
                                initialValue: ''
                              })(<Input placeholder="0" />)}
                            </Col>
                            <Col span={2}>
                              <p style={{ color: 'rgba(0,0,0,.85)', paddingTop: 5 }}>%</p>
                            </Col>
                          </Row>
                        </FormItem> : ''
                  }
                </React.Fragment>
              }
            </Form>   
            {
              form.getFieldValue('keys').length >= 1 &&
              <div className={styles.ticket_spec}>
                <div className={styles.spec}>
                  <span>//</span>
                  <span style={{color:'rgba(0,0,0,.85)'}}>规格</span>
                  <span>//</span>
                </div>
                {
                  data.length >= 1 &&
                  <div className={styles.spec_title} >
                    <span>规格名</span>
                    <span>单价</span>
                    <span>可抵扣积分</span>
                    <span className={styles.proportion}>提成比例</span>
                  </div>
                }
              </div>      
            } 
            <div className={styles.ticket_speclist}>
              {formItems}
              <div className={styles.addspec}>
                <Button type="dashed" onClick={this.onAdd} style={{ width: '66%', marginLeft: '8%' }}>
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
  const { ticketList, ticketListParam, lineLists } = state
  return { ticketList, ticketListParam, lineLists }
}

export default connect(
  mapStateToProps
)(Form.create()(EditTicket))