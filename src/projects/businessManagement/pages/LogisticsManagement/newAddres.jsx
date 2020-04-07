import React from 'react'
import { connect } from 'dva'
import { Modal, Form, Select, Input, Checkbox, Row, Cascader, Col } from 'antd'
import styles from './index.module.scss'
import address from '@/utils/address.js'
import {
  newAddress,
  uploadAddress,
} from 'businessManagement/api/logisticsOperate'

const FormItem = Form.Item
const { Option } = Select

class NewAddres extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      list1: [], // 编辑 发货地址 数据 回填
      list2: [], // 编辑 退回地址 数据 回填
      list3: [], // 编辑 自提点 数据 回填
    }
  }

  componentWillReceiveProps(props) {
    if (props.showEdit) {
      this.setState({
        list1: props.list1,
        list2: props.list2,
        list3: props.list3,
      })
    }
  }

  // 新增地址
  handleAdd = () => {
    const { form, dispatch, userData } = this.props

    let addressData = []
    form.validateFields(async (err, values) => {
      if (!err) {
        const {
          merchantId, // merchantId  商家
          theContact, // theContact  联系人
          contact, // contact 联系方式
          detailedAddress, // detailedAddress 详细地址
          type, // 发货数据
          type2, // 退货数据
          type3, // 自提点数据
        } = values
        let contactAddress = '' // 联系地址
        contactAddress = values.contactAddress.join(',') || ''

        // 自提点 处理
        if (type3[0] === 3 || type3[1] === 3) {
          let obj = {
            accountId: userData.accountId,
            merchantId: merchantId,
            theContact: theContact,
            contact: contact,
            detailedAddress: detailedAddress,
            contactAddress: contactAddress,
            type: 3,
            theDefault: type3[0] === 0 || type3[1] === 0 ? 0 : null,
          }
          addressData.push(obj)
        }

        // 退货地址 处理
        if (type2[0] === 2 || type2[1] === 2) {
          let obj = {
            accountId: userData.accountId,
            merchantId: merchantId,
            theContact: theContact,
            contact: contact,
            detailedAddress: detailedAddress,
            contactAddress: contactAddress,
            type: 2,
            theDefault: type2[0] === 0 || type2[1] === 0 ? 0 : null,
          }
          addressData.push(obj)
        }

        // 发货数据 处理
        if (type[0] === 1 || type[1] === 1) {
          let obj = {
            accountId: userData.accountId,
            merchantId: merchantId,
            theContact: theContact,
            contact: contact,
            detailedAddress: detailedAddress,
            contactAddress: contactAddress,
            type: 1,
            theDefault: type[0] === 0 || type[1] === 0 ? 0 : null,
          }
          addressData.push(obj)
        }

        const payload = {
          jsonString:
            addressData.length >= 1 ? JSON.stringify(addressData) : null,
        }

        let res = await newAddress(payload)
        if (res.errorCode === 200) {
          Modal.success({ title: '添加成功!' })
          dispatch({
            type: 'businessManagement_logistics/loadAddressList',
          })
        }

        this.props.onCancel()
        form.resetFields()
      }
    })
  }

  // 编辑
  handleEdit = () => {
    const { form, dispatch, editAddresData, userData } = this.props
    let { id, type, theDefault } = editAddresData

    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        const {
          theContact, // theContact  联系人
          contact, // contact 联系方式
          detailedAddress, // 详细地址
        } = values
        let theDefaultNumber = ''

        if (type === values.type[0]) {
          theDefaultNumber = values.type[1]
        } else if (type === values.type2[0]) {
          theDefaultNumber = values.type2[1]
        } else if (type === values.type3[0]) {
          theDefaultNumber = values.type3[1]
        } else {
          theDefaultNumber = theDefault
        }

        let contactAddress = '' // 联系地址
        contactAddress = values.contactAddress.join(',') || ''
        const params = {
          accountId: userData.accountId, // 企业账号ID
          id: id, // 地址 ID
          theContact, // 联系人
          contact, // 联系方式
          detailedAddress, // 详细地址
          type: type, // 地址类型
          theDefault: theDefaultNumber, // 是否默认
          contactAddress: contactAddress, // 联系地址
        }

        const res = await uploadAddress(params)

        if (res.errorCode === 200) {
          Modal.success({ title: '数据更新成功!' })
          dispatch({
            type: 'businessManagement_logistics/loadAddressList',
          })
        }

        this.props.onCancel()
        form.resetFields()
        this.setState({
          list1: [], // 编辑 发货地址 数据 回填
          list2: [], // 编辑 退回地址 数据 回填
          list3: [], // 编辑 自提点 数据 回填
        })
      }
    })
  }

  // 关闭弹出框
  onCancel = () => {
    this.props.onCancel()
    const { form } = this.props
    form.resetFields()
    this.setState({
      list1: [],
      list2: [],
      list3: [],
    })
  }

  render() {
    const {
      form,
      visible, // 弹窗是否显示
      showEdit, // 判断 是否为编辑项
      storeData, // 商家列表
      editAddresData, // 选中项的数据
    } = this.props

    // 地址转换
    let contactAddress = editAddresData.contactAddress || ''
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    }
    const formItemLayout2 = {
      labelCol: { span: 0 },
      wrapperCol: { span: 18 },
    }

    let option = {
      visible: visible,
      title: showEdit === true ? '编辑地址' : '新增地址',
      okText: '保存',
      cancelText: '取消',
      onOk: showEdit === true ? this.handleEdit : this.handleAdd,
      onCancel: this.onCancel,
    }

    // 全国省级 三级联动
    const addressData = []
    const province = Object.keys(address)
    for (let i = 0; i < province.length; i++) {
      const key = province[i]
      const city = []
      for (let c in address[key]) {
        const area = []
        for (let a in address[key][c]) {
          const areaObj = {
            value: address[key][c][a],
            label: address[key][c][a],
          }
          area.push(areaObj)
        }
        const cityObj = {
          value: c,
          label: c,
          children: area,
        }
        city.push(cityObj)
      }
      const provinceObj = {
        value: key,
        label: key,
        children: city,
      }
      addressData.push(provinceObj)
    }

    return (
      <Modal width={800} {...option}>
        <Form className={styles.addresStyle}>
          {showEdit === true ? (
            <FormItem label="商家" {...formItemLayout}>
              {
                <div className={styles.merchantName}>
                  {editAddresData.merchantCore.merchantName}
                </div>
              }
            </FormItem>
          ) : (
            <FormItem label="商家:" required {...formItemLayout}>
              {getFieldDecorator('merchantId', {
                initialValue: [],
              })(
                <Select
                  placeholder="请选择商家"
                  onChange={this.onChange}
                  onSearch={this.onSearch}
                  showSearch // 是单选模式可搜索
                  optionFilterProp="children" // 搜索时过滤对应的 option 属性 设 children 表示对内嵌内容进行搜索
                  filterOption={(
                    input,
                    option, // 是否根据输入项进行筛选
                  ) =>
                    option.props.children[0]
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {storeData &&
                    storeData.map(item => {
                      return (
                        <Option key={item.id} value={item.merchantId}>
                          {' '}
                          {item.merchantName}{' '}
                        </Option>
                      )
                    })}
                </Select>,
              )}
            </FormItem>
          )}
          <FormItem label="联系人:" required hasFeedback {...formItemLayout}>
            {getFieldDecorator('theContact', {
              rules: [{ required: true, message: '请输入联系人!' }],
              initialValue: showEdit === true ? editAddresData.theContact : '',
            })(<Input placeholder="请输入联系人 " />)}
          </FormItem>
          <FormItem label="联系方式:" required hasFeedback {...formItemLayout}>
            {getFieldDecorator('contact', {
              rules: [{ required: true, message: '请输入联系方式!' }],
              initialValue: showEdit === true ? editAddresData.contact : '',
            })(<Input placeholder="请输入联系方式" />)}
          </FormItem>
          <FormItem label="联系地址:" required {...formItemLayout}>
            {getFieldDecorator('contactAddress', {
              rules: [{ required: true, message: '请选择联系地址!' }],
              initialValue: showEdit === true ? contactAddress.split(',') : [],
            })(<Cascader placeholder="请选择联系地址" options={addressData} />)}
          </FormItem>
          <FormItem label="详细地址:" required hasFeedback {...formItemLayout}>
            {getFieldDecorator('detailedAddress', {
              relus: [{ required: true, message: '请输入详细地址!' }],
              initialValue:
                showEdit === true ? editAddresData.detailedAddress : '',
            })(<Input placeholder="请输入详细地址" />)}
          </FormItem>
          <FormItem
            label="类型:"
            required
            {...formItemLayout}
            className={styles.formItems}
          >
            {getFieldDecorator('type', {
              relus: [{ required: true, message: '请选择类型!' }],
              initialValue: showEdit === true ? this.state.list1 : [1],
            })(
              <Checkbox.Group
                disabled={
                  showEdit === true && this.state.list1.length === 0
                    ? true
                    : false
                }
                onChange={this.typeSelect1}
                className={styles.addressType}
              >
                <Row>
                  <Col span={6}>
                    {' '}
                    <Checkbox
                      disabled={showEdit === true ? true : false}
                      value={1}
                    >
                      发货地址
                    </Checkbox>{' '}
                  </Col>
                  <Col span={6}>
                    {' '}
                    <Checkbox value={0} className={styles.addressType_default}>
                      默认
                    </Checkbox>{' '}
                  </Col>
                </Row>
              </Checkbox.Group>,
            )}
          </FormItem>
          <FormItem
            label=""
            required
            {...formItemLayout2}
            className={styles.formItems}
          >
            {getFieldDecorator('type2', {
              relus: [{ required: true, message: '请选择类型!' }],
              initialValue: showEdit === true ? this.state.list2 : [],
            })(
              <Checkbox.Group
                disabled={
                  showEdit === true && this.state.list2.length === 0
                    ? true
                    : false
                }
                onChange={this.typeSelect2}
                className={styles.addressType}
              >
                <Row>
                  <Col span={8}> </Col>
                  <Col span={6}>
                    {' '}
                    <Checkbox
                      disabled={showEdit === true ? true : false}
                      value={2}
                    >
                      退货地址
                    </Checkbox>{' '}
                  </Col>
                  <Col span={6}>
                    {' '}
                    <Checkbox value={0}>默认</Checkbox>{' '}
                  </Col>
                </Row>
              </Checkbox.Group>,
            )}
          </FormItem>
          <FormItem
            label=""
            required
            {...formItemLayout2}
            className={styles.formItems}
          >
            {getFieldDecorator('type3', {
              relus: [{ required: true, message: '请选择类型!' }],
              initialValue: showEdit === true ? this.state.list3 : [],
            })(
              <Checkbox.Group
                disabled={
                  showEdit === true && this.state.list3.length === 0
                    ? true
                    : false
                }
                onChange={this.typeSelect3}
                className={styles.addressType}
              >
                <Row>
                  <Col span={8}> </Col>
                  <Col span={6}>
                    {' '}
                    <Checkbox
                      disabled={showEdit === true ? true : false}
                      value={3}
                    >
                      自提点
                    </Checkbox>{' '}
                  </Col>
                  <Col span={6}>
                    {' '}
                    <Checkbox value={0}>默认</Checkbox>{' '}
                  </Col>
                </Row>
              </Checkbox.Group>,
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}
const mapStateToProps = state => {
  const { storeData } = state.businessManagement_logistics
  return {
    userData: state.app.user,
    storeData,
  }
}
export default connect(mapStateToProps)(Form.create({})(NewAddres))
