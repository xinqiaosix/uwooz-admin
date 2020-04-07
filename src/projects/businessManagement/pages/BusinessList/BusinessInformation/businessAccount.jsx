import React from 'react'
import { Modal, Form, Input } from 'antd'
import { connect } from 'dva'
import styles from './index.module.scss'

class BusinessAccount extends React.Component{
  constructor(props)
  {
    super(props);
    this.state = {
      password: '',
      password1: ''
    }
  }

  // 取消
  onCancel = () => {
    const { form, onCancel } = this.props
    form.resetFields();
    onCancel()
  }

  // 密码输入框
  PasswordBlur = (e) => {
    const { value } = e.target
    if (value !== '') {
      if (value.length > 12 || value.length < 6) {
        Modal.info({
          content: '密码必须是6~12位数'
        })
      }
      else {
        this.setState({
          password: value
        })
      }
    }
  }

  // 确认密码输入框
  Password1Bulr = (e) => {
    const { value } = e.target
    const { password } = this.state
    if (value !== '') {
      if (value !== password) {
        Modal.info({
          content: '两次输入的密码不一致！'
        })
      }
      this.setState({
        password1: value
      })
    }
  }

  // 提交数据
  handleSumbit = () => {
    const { form, id, dispatch, onCancel } = this.props
    const { password, password1 } = this.state
    form.validateFields( async (err, values) => {
      if(err) { return }
      const {
        userName
      } = values

      if(password === '' && password1 === '')
      {
        const payload = {
          userName,
          id
        }
        await dispatch({
          type: 'businessManagement_businessList/changePassword',
          payload
        })
        form.resetFields()
        onCancel()
      }
      
      else if(password.length >= 6 && password.length <= 12 && password === password1) {
        const payload = {
          password, 
          password1,
          userName,
          id
        }
        await dispatch({
          type: 'businessManagement_businessList/changePassword',
          payload
        })
        form.resetFields()
        onCancel()
      }

      else{
        Modal.info({
          content: '密码有误'
        })
      }
    })
  }

  render() {
    const {
      visible,
      form,
      userName
    } = this.props

    const { getFieldDecorator } = form;

    let option = {
      visible: visible,
      title: "商家账号",
      okText: "保存",
      cancelText: "取消",
      onCancel: this.onCancel,
      onOk: this.handleSumbit,
    }; // 弹出框参数

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
    return(
      <Modal {...option} >
        <Form className={styles['modify-form']}>
          <Form.Item label="用户名："  hasFeedback {...formItemLayout} >
            {getFieldDecorator('userName', {
              rules: [{ whitespace: true }],
              initialValue: userName || '',
            })(
              <Input placeholder="请输入用户名" />
            )}
          </Form.Item>
          <Form.Item label="密码："  hasFeedback {...formItemLayout} >
            {getFieldDecorator('password', {
              rules: [{ whitespace: true }],
              initialValue: '',
            })(
              <Input.Password  onBlur={this.PasswordBlur} visibilityToggle={false} autoComplete="true" />
            )}
          </Form.Item>
          <Form.Item label="确认密码："  hasFeedback {...formItemLayout}>
            {getFieldDecorator('password1', {
              rules: [{ whitespace: true }],
              initialValue: '',
            })(
              <Input.Password  onBlur={this.Password1Bulr} visibilityToggle={false} autoComplete="true" />
            )}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

export default connect()(Form.create()(BusinessAccount))
