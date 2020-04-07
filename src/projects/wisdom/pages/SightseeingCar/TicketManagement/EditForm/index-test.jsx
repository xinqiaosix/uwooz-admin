/* eslint-disable */
import React, {useState, useRef, useEffect} from 'react'
import { Icon,Modal,Form,Input,Row,Col,Button,Layout } from 'antd';
import axios from '@/util/ajax'; // axios组件引入
import styles from './index.module.scss'
const FormItem = Form.Item;
const { TextArea } = Input

let specId = 0    // 用于动态的增减表单

// 编辑表单
function EditTicket(props) {
  const [count, setCount] = useState(0)              // 用于添加或删除规格票下标变化的标识
  const [add, setAdd] = useState(false)              // 当规格票移除完后，用来标识普通票显示与否(包括普通票的单价，提成比例，可使用积分)
  const [spec, setSpec] = useState(false)            // 通票显示与否
  const [deleteList, setDeleteList] = useState([])   // 删除的规格票集合

  // 移除规格
  const onRemove = k => {
    const { form } = props;
    const keys = form.getFieldValue('keys');
    if (keys.length === 1) {
      setAdd(false)
      setSpec(true)
    }
    if (props.data.specList[k] !== undefined) {
      const list = deleteList.concat(props.data.specList[k].id)
      setDeleteList(list)
      props.data.specList[k] = undefined
    }
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  // 添加规格
  const onAdd = () => {
    const { form } = props;
    const keys = form.getFieldValue('keys');
    setAdd(true)
    setSpec(false)
    if (count < 1) {
      if (keys.length >= 1) {
        setCount(count + 1)
        specId = keys[keys.length - 1] + 1
      }
      else {
        specId = 1
        setCount(count + 1)
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
  const handleSubmit = e => {
    e.preventDefault();
    let list = []
    let deletes = []
    props.form.validateFields((err, values) => {
      if (!err) {
        const { keys, names, prices, coin, royalty, ticketid } = values;
        if (keys.length >= 1) {   
          if (props.data.specList.length === 0) {// 删除普通票   
            deletes = deletes.concat(props.data.id)
          } 
          else{
            deletes = deleteList
          }
          keys.map((key) => {
            let obj = {
              'id': ticketid[key],
              'routeId': props.data.routeId,
              'startStationId': props.data.start,
              'endStationId': props.data.end,
              'name': values.ticketname,
              'description': values.tickedes,
              'price': prices[key],
              'coin': coin[key],
              'proportion': royalty[key],
              'specName': names[key]
            }
            list.push(obj)
          })
        }
        else {
          let obj = {
            'id': props.data.id || '',
            'routeId': props.data.routeId,
            'startStationId': props.data.start,
            'endStationId': props.data.end,
            'name': values.ticketname,
            'description': values.tickedes,
            'price': parseFloat(values.price),
            'coin': values.ticketcoin || '',
            'proportion': values.proportion || '',
            'specName': ''
          }
          list.push(obj)
          deletes = deleteList
        }

        // 请求编辑接口
        let params = {
          "scenicId": 1,
          ids: deletes.length === 0 ? null : deletes.toString(),
          ticketThe: JSON.stringify(list).replace('[', '%5B').replace(']', '%5D')

        };
        let parameter = {
          url: '/sightseeing/updateOrderProduct', // 请求地址
          params: params, // 请求时的参数
          method: 'POST', // 请求方法
          isMock: false // 是否请求mock接口
        }
        axios.ajax(parameter).then((response) => {
          if (response.errorCode == 200) {
            specId = 0
            setCount(0)
            setAdd(false)
            setSpec(false)
            setDeleteList([])
            props.edit();
            props.requestList();
            props.form.resetFields()
            Modal.info({
              content: '编辑成功！'
            })
          }
          else {
            Modal.info({
              content: '编辑失败！'
            })
          }
        })
      }
    });
  };

  // 取消
  const onCancel = () => {
    props.form.resetFields();
    props.cancelEdit();
    setAdd(false)
    setSpec(false)
    setDeleteList([])
    specId = 0
    setCount(0)
  }

  const {
    form, // 表单参数（默认必须值）
    data,
  } = props;

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
  if (data.specList !== undefined) {
    data.specList.forEach((item, index) => {
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
        props.form.getFieldValue('keys').length >= 1 ?
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
                initialValue: data.specList[k] !== undefined && data.specList[k] !== '' ? data.specList[k].id.toString() : ''
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
                initialValue: data.specList[k] !== undefined && data.specList[k] ? data.specList[k].name : ''
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
                initialValue: data.specList[k] !== undefined && data.specList[k] ? data.specList[k].adultPrice.toString() : ''
              })(
                <Input placeholder="请输入单价" style={{ width: 102, height: 27, fontSize: '12px', marginRight: 10 }} />
              )}
            </Form.Item>

            <Form.Item required>
              {getFieldDecorator(`coin[${k}]`, {
                rules: [{ whitespace: true, message: "请输入可抵扣积分" }],
                initialValue: data.specList[k] !== undefined && data.specList[k] ? data.specList[k].coin.toString() : ''
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
                initialValue: data.specList[k] !== undefined && data.specList[k] ? data.specList[k].proportion.toString() : ''
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
                  onClick={() =>onRemove(k)}
                />
              </React.Fragment>
            ) : null}
          </React.Fragment> :  ''
      }
    </div>
  ));

  return (
    <div className="elasticframe" style={props.visible ? {} : { display: 'none' }}>
      <div className="elasticframe_content">
        <div className={styles.title}>
          <img src={require('../../../../assets/images/returnback.png')} onClick={onCancel} alt=""/>
          <span>编辑票务</span>
        </div>
        <div className={styles.edit_form}>
          <Form layout='vertical' style={{ marginTop: 30 }}>
            <FormItem label="票务名称：" required hasFeedback {...formItemLayout} >
              {getFieldDecorator('ticketname', {
                rules: [{ required: true, message: '请输入票务名称!', whitespace: true }],
                initialValue: data.ticket,
              })(
                <Input placeholder="请输入票务名称"></Input>
              )}
            </FormItem>
            {
              data &&
              <React.Fragment>
                {
                  data.specList == '' ?
                    add ? '' : 
                    <FormItem label="单价：" required hasFeedback {...formItemLayout} >
                      <Row gutter={8}>
                        <Col span={24}>
                          {getFieldDecorator('price', {
                            rules: [{ required: true, message: '请输入单价' }],
                            initialValue: data.price
                          })(<Input prefix={<img src={require('../../../../assets/images/timg.jpg')} style={{ height: 15, width: 15 }} />} placeholder="请输入单价" />)}
                        </Col>
                      </Row>
                    </FormItem>
                    : spec ? 
                      <FormItem label="单价：" required hasFeedback {...formItemLayout} >
                        <Row gutter={8}>
                          <Col span={24}>
                            {getFieldDecorator('price', {
                              rules: [{ required: true, message: '请输入单价' }],
                              initialValue: ''
                            })(<Input prefix={<img src={require('../../../../assets/images/timg.jpg')} style={{ height: 15, width: 15 }} />} placeholder="请输入单价" />)}
                          </Col>
                        </Row>
                      </FormItem> : ''
                }
              </React.Fragment>
            }

            <FormItem label="描述：" required hasFeedback {...formItemLayout} >
              {getFieldDecorator('tickedes', {
                rules: [{ required: true, message: '请输入票务描述!' }],
                initialValue: data.ticketDescribe === undefined ? '' : data.ticketDescribe,
              })(
                <TextArea placeholder="请输入票务描述" autosize={{ minRows: 8, maxRows: 10 }} ></TextArea>
              )}
            </FormItem>

            {
              data &&
              <React.Fragment>
                {
                  data.specList == '' ? add ? '' :
                    <FormItem label="可抵扣积分：" hasFeedback {...formItemLayout} >
                      <Row gutter={8}>
                        <Col span={24}>
                          {getFieldDecorator('ticketcoin', {
                            rules: [{ message: '' }],
                            initialValue: data.coin
                          })(<Input placeholder="请输入可抵扣积分" />)}
                        </Col>
                      </Row>
                    </FormItem> : spec ? <FormItem label="可抵扣积分：" hasFeedback {...formItemLayout} >
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
              data  &&
              <React.Fragment>
                {
                  data.specList == '' ? add ? '' :
                    <FormItem label="提成比例：" hasFeedback {...formItemLayout} >
                      <Row gutter={8}>
                        <Col span={12}>
                          {getFieldDecorator('proportion', {
                            rules: [{ message: '' }],
                            initialValue: data.ticheng
                          })(<Input placeholder="0" />)}
                        </Col>
                        <Col span={2}>
                          <p style={{ color: 'rgba(0,0,0,.85)', paddingTop: 5 }}>%</p>
                        </Col>
                      </Row>
                    </FormItem> : spec ?
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
            props.form.getFieldValue('keys').length>=1 &&
            <div className={styles.ticket_spec}>
              <div className={styles.spec}>
                <span>//</span>
                <span style={{color:'rgba(0,0,0,.85)'}}>规格</span>
                <span>//</span>
              </div>
              {
                data!='' &&
                <div className={styles.spec_title} >
                  <span>规格名</span>
                  <span>单价</span>
                  <span>可抵扣积分</span>
                  <span className={styles.proportion}>提成比例</span>
                </div>
              }
            </div>      
          } 
          <div className={styles.ticketspeclist}>
            {formItems}
            <div className={styles.addspec}>
              <Button type="dashed" onClick={onAdd} style={{ width: '66%', marginLeft: '8%' }}>
                <Icon type="plus" />新增规格
              </Button>
            </div>
          </div>
          <div className={styles.btn}>
            <Button type="primary" onClick={handleSubmit} style={{marginRight: 10}} >确定</Button>
            <Button onClick={onCancel}>取消</Button>
          </div>
        </div>
      </div>
    </div>     
    );
}

export default Form.create({})(EditTicket);
