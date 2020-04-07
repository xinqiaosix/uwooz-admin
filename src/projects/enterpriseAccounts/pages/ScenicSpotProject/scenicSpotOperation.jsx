import React from 'react'
import { connect } from 'dva'
import styles from './index.module.scss'
import { Form, Modal, Input } from 'antd'

const FormItem = Form.Item

class ScenicSpotOperation extends React.Component {
  constructor(props) {
    super(props)
    this.myRef = React.createRef()
    this.state = {}
  }

  // 添加景区项目
  operationModal = () => {
    const { form, dispatch, userData } = this.props

    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        const payload = {
          accountId: userData.accountId, // 企业id
          name: values.scenicSpot, // 景区名称
          logo: values.identification, // 统一标识符
          head: values.personInCharge, // 负责人
          headphone: values.phone, // 联系电话
          describe: values.explain, // 说明
        }
        // console.log(payload);
        await dispatch({
          type: 'enterpriseAccounts_item/newScenicSpotList',
          payload,
        })
      }
      form.resetFields()
    })
    this.props.onCancel()
  }

  // 编辑景区项目
  uploadScenicSpot = () => {
    const { form, dispatch, scenicSpotData, userData } = this.props

    const { id } = scenicSpotData
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        const payload = {
          id,
          accountId: userData.accountId, // 企业id
          name: values.scenicSpot, // 景区名称
          logo: values.identification, // 统一标识符
          head: values.personInCharge, // 负责人
          headphone: values.phone, // 联系电话
          describe: values.explain, // 说明
        }
        await dispatch({
          type: 'enterpriseAccounts_item/uploadScenicSpot',
          payload,
        })
      }
      form.resetFields()
    })
    this.props.onCancel()
  }

  render() {
    const { form, visible, onCancel, scenicSpotData, showAdd } = this.props

    const { getFieldDecorator } = form

    // 表单控件布局
    const formItemLayout = {
      // label 标签布局
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },

      // 输入控件布局样式
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 },
      },
    }

    let option = {
      visible: visible,
      title: '景区项目',
      okText: '保存',
      cancelText: '取消',
      onOk: showAdd === true ? this.operationModal : this.uploadScenicSpot,
      onCancel: onCancel,
    }

    return (
      <Modal width={600} {...option}>
        <Form className={styles.modalBox}>
          <FormItem label="景区名称:" required hasFeedback {...formItemLayout}>
            {getFieldDecorator('scenicSpot', {
              rules: [{ required: true, message: '请输入景区名称' }],
              initialValue: scenicSpotData === [] ? '' : scenicSpotData.name,
            })(<Input placeholder="请输入景区名称" />)}
          </FormItem>
          <FormItem label="统一标识:" {...formItemLayout}>
            {getFieldDecorator('identification', {
              initialValue: scenicSpotData === [] ? '' : scenicSpotData.logo,
            })(
              showAdd === true ? (
                <Input placeholder="请输入统一标识码" />
              ) : (
                <span> {scenicSpotData.logo} </span>
              ),
            )}
          </FormItem>
          <FormItem label="负责人:" {...formItemLayout}>
            {getFieldDecorator('personInCharge', {
              initialValue: scenicSpotData === [] ? '' : scenicSpotData.head,
            })(<Input placeholder="请输负责人" />)}
          </FormItem>
          <FormItem label="联系电话:" {...formItemLayout}>
            {getFieldDecorator('phone', {
              initialValue:
                scenicSpotData === [] ? '' : scenicSpotData.headphone,
            })(<Input placeholder="请输入电话" />)}
          </FormItem>
          <FormItem label="说明:" {...formItemLayout}>
            {getFieldDecorator('explain', {
              initialValue:
                scenicSpotData === [] ? '' : scenicSpotData.describe,
            })(<Input placeholder="请添加说明" />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

const mapStateToProps = state => {
  return {
    userData: state.app.user,
  }
}
export default connect(mapStateToProps)(Form.create({})(ScenicSpotOperation))
