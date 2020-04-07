import React from  'react'
import styles from './index.module.scss'
import { connect, router } from 'dva'  
import {Layout, Select, Input } from 'antd'
import BusinessTable from './BusinessTable'                   // 商家表格

const { Header } = Layout
const { Option } = Select;
const { Search } = Input
const { withRouter, Link } = router

// 商家列表组件
class BussinessList extends React.Component{

  state = {
    businessName: '',     // 商家名称
    businessTypeId: '',   // 选中的商家类型id  
  }

  componentDidMount() {
    this.handleGetBusinessType()
  }

  // 获取商家经营类型
  handleGetBusinessType = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'businessManagement_businessList/loadBusinessType'
    })
  }

  // 输入商家名称
  onChange = (e) => {
    const { value } = e.target
    this.setState({
      businessName: value
    })
  }

  // 根据商家名称搜索
  onSearch = (value) => {
    const { dispatch } = this.props;
    const { businessTypeId } = this.state
    let payload = {}
    if (businessTypeId) {
      payload = {
        merchantName: value,
        id: businessTypeId
      }
    }

    else {
      payload = {
        merchantName: value,
      }
    }

    dispatch({
      type: 'businessManagement_businessList/loadBusinessList', 
      payload
    })
  }

  // 根据商家经营类型筛选
  handChange = (value) => {
    this.setState({
      businessName: '',
      businessTypeId: value
    })
    const { dispatch } = this.props;
    const payload = {
      id: value
    }
    dispatch({
      type: 'businessManagement_businessList/loadBusinessList', 
      payload
    })
  }

  render(){
    const { businessType } = this.props
    const { businessName } = this.state
    return(
      <div  className={styles.bussiness_list}>
        <div className={styles.contents}>
          <Header className={styles.header}>商家列表</Header>
          <div className={styles.content}>
            <div className={styles.option}>
              <Link to={`${this.props.match.path}/New`} className={styles.new_business}>+&nbsp;&nbsp;新建商家</Link>
              <div className={styles.search}>
                <Select
                  style={{ width: 160, marginRight: 15 }}
                  placeholder="全部"
                  onChange={this.handChange}
                >
                  <Option style={{ color: 'rgba(0,0,0,.65)' }} value='' key={''}>全部</Option>
                  {
                    businessType.map((item) => {
                      return (
                        <Option style={{ color: 'rgba(0,0,0,.65)' }} value={item.id} key={item.id}>{item.typeName}</Option>
                      )
                    })
                  }
                </Select>
                <Search
                  placeholder="商家名称"
                  style={{ width: 271 }}
                  onSearch={this.onSearch}
                  value={businessName}
                  onChange={this.onChange}
                  className={styles.search_business}
                />
              </div>
            </div>

            {/* 商家表格 */}
            <BusinessTable
              businessTypeId={this.state.businessTypeId}
              businessName={businessName}
            />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ 'businessManagement_businessList': state }) => {
  const { businessLists, businessListParam, businessType } = state
  const businessTypeById = businessType.reduce((acc, item) => {
    const { id } = item
    acc[id] = item
    return acc
  }, {})
  return { businessLists, businessListParam, businessTypeById, businessType }
}

export default withRouter(connect(mapStateToProps)(BussinessList))