/**
 * 企业信息
 */
import React from 'react'
import styles from './index.module.scss'
import EditorialEnterprise from './editorialEnterprise'
import EditingAccount from './editingAccount'
import { connect } from 'dva'
import { Layout } from 'antd'

const { Content } = Layout

class EnterpriseInformation extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showEnterprise: false, // 是否显示 => 企业编辑弹窗
      showAccountNumber: false, // 是否显示 => 主账号编辑弹窗
      confirmLoading: false, // 显示按钮 loading
    }
  }

  componentDidMount() {
    this.enterpriseInfo()
  }

  // 获取企业信息
  enterpriseInfo = () => {
    const { dispatch, userData } = this.props
    let id = userData.accountId
    dispatch({
      type: 'enterpriseAccounts_info/loadEnterpriseInfo',
      payload: id,
    })
  }

  // 关闭 弹出框
  onCancel = e => {
    this.setState({
      showEnterprise: false,
      showAccountNumber: false,
    })
  }

  render() {
    const { enterpriseData, userData } = this.props
    const { userName, comment, boundMobille } = userData
    // console.log(userData)

    const {
      companyName, // 企业名称
      id, // 企业 id
      mobile, // 联系电话
      mailbox, // 邮箱
      publicAccountName, // 公众号
      appId, // 公众号 Id
      appSecret, // 公众号AppSecret
      trade, // 微信支付商户号
    } = enterpriseData

    let name = enterpriseData.realName

    return (
      <div id={styles.enterpriseInformation}>
        <Content className={styles.enterpriseInformationBox}>
          <div className={styles.enterpriseInformation_info}>
            <div className={styles.enterpriseInformation_title}>
              <span> 企业信息 </span>
              <span
                onClick={() => this.setState({ showEnterprise: true })}
                className={styles.enterpriseEditor}
              >
                编辑
              </span>
            </div>

            <div className={styles.enterpriseInformation_content}>
              <ul>
                <li>
                  <span> 企业名称: </span>
                  <p> {companyName} </p>
                </li>
                <li>
                  <span> 企业Id: </span>
                  <p> {id} </p>
                </li>
                <li>
                  <span> 联系人: </span>
                  <p> {name} </p>
                </li>
                <li>
                  <span> 联系电话: </span>
                  <p> {mobile} </p>
                </li>
                <li>
                  <span> 邮箱: </span>
                  <p> {mailbox} </p>
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.primaryAccountNumber}>
            <div className={styles.primaryAccountNumber_title}>
              <span> 主账号 </span>
              <span
                onClick={() => this.setState({ showAccountNumber: true })}
                className={styles.enterpriseEditor}
              >
                编辑
              </span>
            </div>

            <div className={styles.primaryAccountNumber_content}>
              <ul>
                <li>
                  <span> 用户名: </span>
                  <p> {userName} </p>
                </li>
                <li>
                  <span> 姓名: </span>
                  <p> {comment} </p>
                </li>
                <li>
                  <span> 手机号码: </span>
                  <p> {boundMobille} </p>
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.wechatSettings}>
            <div className={styles.wechatSettings_title}>
              <span> 微信设置 </span>
            </div>

            <div className={styles.wechatSettings_content}>
              <ul>
                <li>
                  <span> 公众号名称: </span>
                  <p>
                    {publicAccountName === null ? '---' : publicAccountName}
                  </p>
                </li>
                <li>
                  <span> 公众号AppID: </span>
                  <p> {appId === null ? '---' : appId} </p>
                </li>
                <li>
                  <span> 公众号AppSecret: </span>
                  <p> {appSecret === null ? '---' : appSecret} </p>
                </li>
                <li>
                  <span> 微信支付商户号: </span>
                  <p> {trade === null ? '---' : trade} </p>
                </li>
              </ul>
            </div>
          </div>
        </Content>

        {/* 企业信息 编辑框 */}
        <EditorialEnterprise
          destyroyOnClose={true} // 关闭时销毁 Modal 里的子元素
          visible={this.state.showEnterprise} // 是否显示弹窗
          confirmLoading={this.state.confirmLoading} // 是否显loading
          onCancel={this.onCancel} // 关闭弹出框
        />

        {/* 主账号 编辑框 */}
        <EditingAccount
          destyroyOnClose={true} // 关闭时销毁 Modal 里的子元素
          visible={this.state.showAccountNumber} // 是否显示弹窗
          confirmLoading={this.state.confirmLoading} // 是否显示 loading
          onCancel={this.onCancel} // 关闭弹出框
          userData={userData} // 主账号数据
        />
      </div>
    )
  }
}

// modal 中的 state 通过组件的 props 注入组件
const mapStateToProps = state => {
  return {
    userData: state.app.user,
    enterpriseData: state.enterpriseAccounts_info.enterpriseData,
  }
}
export default connect(mapStateToProps)(EnterpriseInformation)
