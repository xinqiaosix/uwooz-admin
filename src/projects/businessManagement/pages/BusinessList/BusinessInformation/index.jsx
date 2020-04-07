import React from 'react'
import styles from './index.module.scss'
import { Icon } from 'antd';
import BusinessAccount from './businessAccount'
import PositionCoordinates from './positionalCoordinates'   // 位置坐标弹框
import BusinessQRCode from './businessQRCode'               // 商家二维码弹框
import { connect, router } from 'dva'

const { withRouter, Link } = router

class BusinessInformation extends React.Component{
  constructor(props)
  {
    super(props);
    this.state = {
      showBusinessAccountModal: false,         // 是否显示商家账号弹框
      showPosition: false,                     // 是否显示位置坐标弹框
      showQRCode: false,                       // 是否显示商家二维码弹框
      data:[]                                  // 用户信息
    }
  }

  // 获取用户信息
  handleGetInfo = () => {
    const { dispatch, match } = this.props
    const id = match.params.id
    dispatch({
      type: 'businessManagement_businessList/getOneBusinessInfo',
      payload: id
    })
  }

  // 获取商家经营类型
  handleGetBusinessType = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'businessManagement_businessList/loadBusinessType'
    })
  }


  componentDidMount() {
    this.handleGetInfo()
    this.handleGetBusinessType()
  }

  render() {
    const { businessInfo, match } = this.props
    const url = `/${match.url.split('/')[1]}/${match.url.split('/')[2]}`
    return (
      <div className={styles.business_info}>
        <div className={styles.header}>
          <div className={styles.title}>
            <Link to={url}>
              {/* <span className={styles.back}>&#8592;</span> */}
              <Icon className={styles.back} type="arrow-left" />
            </Link>
            <span className={styles.text}>商家信息</span>
          </div>
          <div className={styles.business_account}>
            <span className={styles.code} onClick={() => this.setState({ showQRCode: true })}>收款二维码</span>
            <span className={styles.account_title}>商家端账号</span>
            <span className={styles.account}>{businessInfo.userName}</span>
            <Icon
              type="edit"
              style={{ color: '#ff9212' }}
              onClick={() => this.setState({ showBusinessAccountModal: true })}
            />
          </div>
        </div>

        <div className={styles.basic_info}>
          <div className={styles.info}>
            <div className={styles.info_left}>
              <div className={styles.info_title}>
                <span className={styles.titles}>基本信息</span>
                <Link
                  to={`${url}/Edit/${match.params.id}`}
                  className={styles.edit}
                >
                  &nbsp;&nbsp;修改
                </Link>
              </div>
              <span className={styles.key}>
                商家名称:
                <span className={styles.value}>
                  {businessInfo.merchantName}
                </span>
              </span>
              <span className={styles.key}>
                分类:
                <span className={styles.value}>{businessInfo.typeName}</span>
              </span>
              <span className={styles.key}>
                地址:
                <span className={styles.value}>{businessInfo.address}</span>
              </span>
              <span className={styles.key}>
                联系人:
                <span className={styles.value}>{businessInfo.realName}</span>
              </span>
              <span className={styles.key}>
                联系电话:
                <span className={styles.value}>{businessInfo.mobile}</span>
              </span>
              <span className={styles.key}>
                简介:
                <span className={styles.value}>{businessInfo.brief}</span>
              </span>
            </div>
            <div
              className={styles.avatar}
              style={{ backgroundImage: `url(${businessInfo.logoUrl})` }}
            ></div>
          </div>
        </div>

        <div className={styles.position}>
          <div className={styles.info_title}>
            <span className={styles.titles}>位置坐标</span>
            <span
              className={styles.edit}
              onClick={() => this.setState({ showPosition: true })}
            >
              修改
            </span>
          </div>
          <div className={styles.coordinate}>
            <span className={styles.key}>
              经度:
              <span className={styles.value}>{businessInfo.longitude}</span>
            </span>
            <span className={styles.key}>
              纬度:
              <span className={styles.value}>{businessInfo.latitude}</span>
            </span>
            <span className={styles.key}>
              关联POI:
              <span className={styles.relation}>{businessInfo.poi}</span>
            </span>
          </div>
        </div>

        {/* 商家账号组件 */}
        <BusinessAccount
          visible={this.state.showBusinessAccountModal}
          onCancel={() => this.setState({ showBusinessAccountModal: false })}
          userName={businessInfo.userName}
          id={businessInfo.id}
        />

        {/* 位置坐标组件 */}
        <PositionCoordinates
          visible={this.state.showPosition}
          onCancel={() => this.setState({ showPosition: false })}
          id={businessInfo.id}
          longitude={businessInfo.longitude}
          latitude={businessInfo.latitude}
        />

        {/* 商家二维码 */}
        <BusinessQRCode
          visible={this.state.showQRCode}
          onHideQRCode={() => this.setState({ showQRCode: false }) }
        />
      </div>
    )
  }
}

const mapStateToProps = ({ 'businessManagement_businessList': state }) => {
  const { businessLists, businessListParam, businessType, businessInfo } = state
  return { businessLists, businessListParam, businessType, businessInfo }
}

export default withRouter(connect(mapStateToProps)(BusinessInformation))