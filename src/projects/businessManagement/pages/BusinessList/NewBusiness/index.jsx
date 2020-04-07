import React from 'react'
import styles from './index.module.scss'
import { Form, Input, Button, Modal, Icon } from 'antd'
import { connect, router } from 'dva'
import AddOrEditForm from '../addOrEditForm'
const FormItem = Form.Item
const { Link } = router

class NewBusiness extends React.Component {
  state = {
    password: '',
    password1: '',
  }

  componentDidMount() {
    this.handleGetBusinessType()
    this.handleGetInfo()
  }

  // 获取商家经营类型
  handleGetBusinessType = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'businessManagement_businessList/loadBusinessType',
    })
  }

  // 获取用户信息
  handleGetInfo = () => {
    const { dispatch, match } = this.props
    if (match.params.type === 'Edit') {
      const id = match.params.id
      dispatch({
        type: 'businessManagement_businessList/getOneBusinessInfo',
        payload: id,
      })
    }
  }

  // 必须值（获取用户信息表单的值）
  saveFormRef = formRef => {
    this.formRef = formRef
  }

  // 密码输入框
  PasswordBlur = e => {
    const { value } = e.target
    this.setState({
      password: value,
    })
  }

  // 确认密码输入框
  Password1Bulr = e => {
    const { value } = e.target
    const { password } = this.state
    if (value !== password) {
      Modal.info({
        content: '两次输入的密码不一致！',
      })
    }
    this.setState({
      password1: value,
    })
  }

  // 新增商户提交的数据
  handleAddSumbit = async () => {
    const { form, dispatch, history } = this.props
    const { password, password1 } = this.state
    let value1
    let value2
    let isBreak = false
    form.validateFields((err, values) => {
      if (err) {
        isBreak = true
        return
      }
      value1 = { ...values }
    })

    // 用户信息表单的值
    this.formRef.props.form.validateFields((err, values) => {
      if (err) {
        isBreak = true
        return
      }
      value2 = { ...values }
    })

    if (isBreak) {
      return
    }
    const value = { ...value1, ...value2 }

    const logoUrl = value.logoUrl ? value.logoUrl.file.response.data.url : ''
    const {
      address,
      brief,
      merchantName,
      merchantTypeId,
      mobile,
      realName,
      userName,
    } = value

    const payload = {
      address,
      brief,
      logoUrl,
      merchantName,
      merchantTypeId,
      mobile,
      realName,
      userName,
      password,
      password1,
    }

    if (password === password1) {
      const { errorCode, errMsg } = await dispatch({
        type: 'businessManagement_businessList/newBusiness',
        payload,
      })

      if (errorCode === 200) {
        const { match } = this.props
        this.formRef.props.form.resetFields()
        const url = `/${match.url.split('/')[1]}/${match.url.split('/')[2]}`
        history.push(url)
      } else if (errorCode === 415) {
        Modal.info({
          content: '请填写完整信息',
        })
      } else {
        Modal.info({
          content: errMsg,
        })
      }
    } else {
      Modal.info({
        content: '两次输入的密码不一致！',
      })
    }
  }

  // 编辑商户提交的数据
  handleEditSumbit = () => {
    // 用户信息表单的值
    const { dispatch, businessInfo, match, history } = this.props
    const id = match.params.id
    this.formRef.props.form.validateFields(async (err, values) => {
      if (err) {
        return
      }

      const { address, brief, merchantName, mobile, realName } = values

      const logoUrl = values.logoUrl
        ? values.logoUrl.file.response.data.url
        : businessInfo.logoUrl
      const merchantTypeId = values.merchantTypeId || businessInfo.typeId
      const payload = {
        id,
        address,
        brief,
        logoUrl,
        merchantName,
        merchantTypeId,
        mobile,
        realName,
      }

      const { errorCode, errMsg } = await dispatch({
        type: 'businessManagement_businessList/editBusiness',
        payload,
      })

      if (errorCode === 400) {
        Modal.info({
          title: errMsg,
        })
      }

      if (errorCode === 200) {
        this.formRef.props.form.resetFields()
        const url = `/${match.url.split('/')[1]}/${match.url.split('/')[2]}`
        history.push(`${url}/info/${id}`)
      }
    })
  }

  // 取消
  onCancel = () => {
    const { form, history, match } = this.props
    const id = match.params.id
    const url = `/${match.url.split('/')[1]}/${match.url.split('/')[2]}`
    form.resetFields()
    if (match.params.type === 'New') {
      history.push(url)
    } else {
      history.push(`${url}/info/${id}`)
    }
  }

  render() {
    const { form, match } = this.props

    const formItemLayout = {
      labelCol: {
        // label 标签布局
        xs: { span: 24 }, // span 栅格占位格数, 为0时 相当于 display: none, xs:小; sm: 一般;
        sm: { span: 2 },
      },
      wrapperCol: {
        // 需要为输入控件设置布局样式时,使用该属性
        xs: { span: 24 },
        sm: { span: 16 },
      },
    }

    const { getFieldDecorator } = form
    const url = `/${match.url.split('/')[1]}/${match.url.split('/')[2]}`

    return (
      <div className={styles.new_bussiness}>
        <div className={styles.header}>
          <Link
            to={
              match.params.type === 'New'
                ? url
                : `${url}/info/${match.params.id}`
            }
          >
            <Icon className={styles.back} type="arrow-left" />
          </Link>
          {match.params.type === 'New' ? (
            <span className={styles.title}>新建商家</span>
          ) : (
            <span className={styles.title}>编辑商家</span>
          )}
        </div>

        <div
          className={styles.bussiness_info}
          style={
            match.params.type === 'New'
              ? { borderBottom: '1px solid #e9e9e9' }
              : {}
          }
        >
          <div className={styles.bussiness_infotitle}>基本信息</div>

          {/* 商户基本信息 */}
          <AddOrEditForm
            destroyOnClose={true} // 关闭时销毁 Modal 里的子元素
            wrappedComponentRef={this.saveFormRef} // 必须值，用来获取form表单值
            add={match.params.type === 'New' ? true : false}
          />
        </div>

        {/* 登录账号 */}
        {match.params.type === 'New' && (
          <div className={styles.login_account}>
            <div className={styles.bussiness_infotitle}>登录账号</div>
            <Form className={styles.account_form}>
              <FormItem label="用户名" hasFeedback {...formItemLayout}>
                {getFieldDecorator('userName', {
                  initialValue: '',
                  rules: [{ required: true, message: '请输入登录账号' }],
                })(
                  <Input
                    placeholder="请输入登录账号用户名"
                    style={{ width: 361 }}
                  ></Input>,
                )}
              </FormItem>
              <FormItem label="密码" hasFeedback {...formItemLayout}>
                {getFieldDecorator('password', {
                  initialValue: '',
                  rules: [{ required: true, message: '请输入密码' }],
                })(
                  <Input.Password
                    onBlur={this.PasswordBlur}
                    style={{ width: 361 }}
                    visibilityToggle={false}
                    autoComplete="true"
                  />,
                )}
              </FormItem>
              <FormItem label="确认密码" hasFeedback {...formItemLayout}>
                {getFieldDecorator('password1', {
                  initialValue: '',
                  rules: [{ required: true, message: '请再次输入密码' }],
                })(
                  <Input.Password
                    onBlur={this.Password1Bulr}
                    style={{ width: 361 }}
                    visibilityToggle={false}
                    autoComplete="true"
                  />,
                )}
              </FormItem>
            </Form>
          </div>
        )}

        <div className={styles.option}>
          <Button
            type="primary"
            className={styles.sumbit}
            onClick={
              match.params.type === 'New'
                ? this.handleAddSumbit
                : this.handleEditSumbit
            }
          >
            提交
          </Button>
          <Button onClick={this.onCancel}>取消</Button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ 'businessManagement_businessList': state }) => {
  const { businessLists, businessListParam, businessType, businessInfo } = state
  return { businessLists, businessListParam, businessType, businessInfo }
}

export default connect(
  mapStateToProps
)(Form.create()(NewBusiness))
