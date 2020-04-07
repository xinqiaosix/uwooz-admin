import React from 'react'
import { Form, Icon, Input, Button, Checkbox, message } from 'antd'
import { connect, router } from 'dva'

import styles from './index.module.scss'
import companyLogo from '@/assets/images/login/logo.png'

const { Redirect, Link } = router

/**
 * 登录页面
 */
function Login(props) {
  const { 
    isLogining,   // 是否正在登录
    hasLogged,    // 是否已登录
    location,     // 路由信息
    form          // Form.create创建的表单实例对象
  } = props;
  const { 
    getFieldDecorator, // 用于和表单进行双向绑定
    validateFields     // 校验并获取一组输入域的值与 Error
  } = form;
  // 登录后的跳转路径
  const fromPath = location.state.from || { pathname: '/' }

  /**
   * 登录表单提交
   * @param {object} e - 合成对象 
   */
  function handleSubmit(e) {
    e.preventDefault();
    validateFields(async (err, values) => {
      if (!err) {
        const { dispatch } = props;
        const { username, password } = values;
        const { errorCode, errMsg } = await dispatch({
          type: 'app/login',
          username,
          password
        });
        if(errorCode !== 200) {
          message.error(errMsg);
        } else {
          message.success(errMsg)
        }
      } else {
        message.error(err)
      }
    });
  };
  // 是否已经登录
  if(hasLogged) {
    return <Redirect to={fromPath} />
  }

  return (
    <div className={styles["main"]}>
      <div className={styles["logo"]}></div>
      <div className={styles["login-wrap"]}>
        <div className={styles["go-home"]}>
          <Link to="/" className={styles['link']}>首页</Link>
        </div>
        <div className={styles["form-wrap"]}>
          <div className={styles["company-logo"]}>
            <img src={companyLogo} alt="companyLogo" className={styles["company-logo_img"]}/>
          </div>
          <div className={styles["title"]}>四维旅游运营管理系统</div>
          <Form onSubmit={handleSubmit} className={styles["login-form"]}>
            <Form.Item>
              {getFieldDecorator('username', {
                rules: [{ required: true, message: '请输入用户名/手机号/邮箱!' }],
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.45)', fontSize: 16 }} />}
                  placeholder="用户名/手机号/邮箱"
                  className={`${styles["form-input"]} overlay-input`}
                  autoComplete="true"
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码!' }],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.45)', fontSize: 16 }} />}
                  type="password"
                  placeholder="密码"
                  className={styles["form-input"]}
                  autoComplete="true"
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: false,
              })(<Checkbox className={styles['auto-login']}>自动登录</Checkbox>)}
              <Link className={styles["forgot-password"]} to="/forget">
                忘记密码？
              </Link>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className={styles["login-button"]} loading={isLogining}>
                登录
              </Button>
            </Form.Item>
          </Form>
          <div className={styles["other-login-methods"]}>
            <div className={styles["title"]}>
              <span>——————————</span>
              <span className={styles["text"]}>其它登录方式</span>
              <span>——————————</span>
            </div>
            <div className={styles["weixin"]}></div>
          </div>
          <div className={styles["other-situations"]}>
            <span className={styles["no-account"]}>没有帐号?</span>
            <Link to="/" className={styles['link']}>申请试用</Link>
            <Link to="/">联系我们</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = ({ app }) => {
  const { isLogining, hasLogged } = app
  return { isLogining, hasLogged }
}

export default connect(
  mapStateToProps,
)(Form.create({ name: 'login' })(Login))