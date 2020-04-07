import React from 'react'
import { Drawer, Tag } from 'antd'
import {connect, router } from 'dva'
import styles from './index.module.scss'

const { withRouter } = router

class MemberInformation extends React.Component{
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  render(){
    const {
      visible,
      membershipInfo,
      hideDrawer,
      tagListById
    } = this.props

    let option = {
      visible: visible,
      width: '600px',
      closable: true,
      onClose: hideDrawer
    }
    return(
      <Drawer
        {...option}
        title = { 
          <div className={styles.head}>
            <div className={styles.bigtitle}>
              <span className={styles.title}>会员信息</span>
              <span className={styles.edit}>编辑</span>
            </div>
          </div>  
        }
      >
        <div className={styles.user_info}>
          <div className={styles.avatar} style={{ backgroundImage: `url(" ${membershipInfo.avatar} ")` }} ></div>
          <span className={styles.username}>{membershipInfo.vipName}</span>
        </div>

        <div className={styles.aboutuser}>
          <div className={styles.user_infolist}>

            <div className={styles.list_left}>
              <span className={styles.userkey}>性别:&nbsp;&nbsp;
                <span className={styles.uservalue}>{membershipInfo.sex === 0 ? '男' : '女'}</span>
              </span>

              <span className={styles.userkey}>手机号码:&nbsp;&nbsp;
                <span className={styles.uservalue}>{membershipInfo.phoneNum}</span>
              </span>

              <span className={styles.userkey}>生日:&nbsp;&nbsp;
                <span className={styles.uservalue}>{membershipInfo.birthday}</span>
              </span>

              <span className={styles.userkey}>来源:&nbsp;&nbsp;
                <span className={styles.uservalue}>{membershipInfo.source}</span>
              </span>

              <span className={styles.userkey}>备注:&nbsp;&nbsp;
                <span className={styles.uservalue}>{membershipInfo.comment}</span>
              </span>
            </div>

            <div className={styles.list_right}>
              <span className={styles.userkey}>真实姓名:&nbsp;&nbsp;
                <span className={styles.uservalue}>{membershipInfo.name}</span>
              </span>

              <span className={styles.userkey}>邮箱:&nbsp;&nbsp;
                <span className={styles.uservalue}>{membershipInfo.email}</span>
              </span>

              <span className={styles.userkey}>地区:&nbsp;&nbsp;
                <span className={styles.uservalue}>{membershipInfo.local}</span>
              </span>

              <span className={styles.userkey}>注册日期:&nbsp;&nbsp;
                <span className={styles.uservalue}>2019年
                6月20日</span>
              </span>
            </div>
            
          </div>

          <div className={styles.user_integral}>
            <span className={styles.userkey}>可用积分:&nbsp;&nbsp;
              <span className={styles.uservalue}>{membershipInfo.availableIntegral}</span>
            </span>
            <span className={styles.userkey}>获得积分:&nbsp;&nbsp;
              <span className={styles.uservalue}>{membershipInfo.integral}</span>
            </span>
            <span className={styles.userkey}>储值金额:&nbsp;&nbsp;
              <span className={styles.uservalue}>￥{membershipInfo.money}</span>
            </span>
          </div>

          <div className={styles.labellist}>
            {
              membershipInfo.tagList !== undefined ?
                membershipInfo.tagList.map((item) => {
                  return (
                    <Tag key={item} className={styles.tag}>{tagListById[item] && tagListById[item].name}</Tag>
                  )
                }) : ''
            }
          </div>
        </div>
      </Drawer>
    )
  }
}

const mapStateToProps = ({ 'memberCenter_membershipList': state }) => {
  const { membershipLists, membershipListParam, tagList } = state
  const tagListById = tagList.reduce((acc, item) => {
    const { id } = item
    acc[id] = item
    return acc
  }, {})
  return { membershipLists, membershipListParam, tagListById, tagList }
}

export default withRouter(connect(mapStateToProps)(MemberInformation))