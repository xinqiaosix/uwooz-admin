import React from 'react'
import styles from './index.module.scss'
import { connect } from 'dva'
import { Form, Input } from 'antd'

const FormItem = Form.Item

class LoginAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    const {
      form,
    } = this.props

    const formItemLayout = {
      labelCol: { // label 标签布局
        xs: { span: 24 }, // span 栅格占位格数, 为0时 相当于 display: none, xs:小; sm: 一般;
        sm: { span: 2 },
      },
      wrapperCol: { // 需要为输入控件设置布局样式时,使用该属性
        xs: { span: 24 },
        sm: { span: 16 },
      }
    }

    const { getFieldDecorator } = form;
    return(
      <div className={styles.login_account}>
        <div className={styles.bussiness_infotitle}>登录账号</div>
        <Form className={ styles.account_form } >
          <FormItem label="用户名" hasFeedback {...formItemLayout}>
            {getFieldDecorator('userName', {
              initialValue: '',
            })(
              <Input placeholder="请输入登录账号用户名" style={{ width: 361 }} ></Input>
            )}
          </FormItem>
          <FormItem label="密码" hasFeedback {...formItemLayout}>
            {getFieldDecorator('password', {
              initialValue: '',
            })(
              <Input.Password style={{ width: 361 }} visibilityToggle={false} autoComplete="true" />
            )}
          </FormItem>
          <FormItem label="确认密码" hasFeedback {...formItemLayout}>
            {getFieldDecorator('password1', {
              initialValue: '',
            })(
              <Input.Password style={{ width: 361 }} visibilityToggle={false} autoComplete="true" />
            )}
          </FormItem>
        </Form>
      </div>
    )
  }
}

const mapStateToProps = ({ 'businessManagement_businessList': state }) => {
  const { businessLists, businessListParam, businessType } = state
  return { businessLists, businessListParam, businessType }
}

export default connect(
  mapStateToProps
)(Form.create()(LoginAccount))