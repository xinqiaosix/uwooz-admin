import React from 'react'
import { Select } from 'antd'
import { connect, router } from 'dva'
import styles from './index.module.scss'

const { withRouter } = router
const { Option } = Select

class AllBusiness extends React.Component {

  // 获取商家列表
  handleGetBusinessList = (page = 1, pageSize = 9999) => {
    const { dispatch } = this.props
    dispatch({
      type: 'businessManagement_businessList/loadBusinessList',
      payload: { page, pageSize }
    })
  }

  // 下拉框
  onChange = (value) => {
    const { onScreen } = this.props
    onScreen(value)
  }

  componentDidMount() {
    this.handleGetBusinessList()
  }

  render() {

    const { businessLists } = this.props

    return (
      <Select
        showSearch
        placeholder="全部商家"
        className={styles.search_business}
        optionFilterProp="children"
        onChange={this.onChange}
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        <Option value={null}>全部商家</Option>
        {
          businessLists.map((item) => {
            return (
              <Option value={item.merchantId} key={item.id}>{item.merchantName}</Option>
            )
          })
        }
      </Select>
    )
  }
}

const mapStateToProps = ({ 'businessManagement_businessList': state }) => {
  const { businessLists } = state
  return { businessLists }
}

export default withRouter(connect(mapStateToProps)(AllBusiness))
