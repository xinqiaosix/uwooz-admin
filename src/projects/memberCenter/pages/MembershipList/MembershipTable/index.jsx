import React from 'react'
import styles from '../index.module.scss'
import { connect, router } from 'dva'
import { Table } from 'antd'

const { withRouter } = router

class MembershipTable extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      isLoading: false
    }

    // 表头
    this.columns = [
      {
        title: '全选',
        key: 'membership',
        // dataIndex:'vipName',
        render: (item, record) => {
          return (
            <div className={styles.user_info}>
              <div className={styles.avatar} style={{ backgroundImage: `url("${item.avatar}")` }}></div>
              <span className={styles.user_name} onClick={ () => this.onShowDrawer(JSON.stringify(record))}>{item.vipName}</span>
            </div>
          )
        }
      }, {
        title: '积分',
        dataIndex: 'integral',
        width: '20%'
      }, {
        title: '操作',
        dataIndex: 'operation',
        align: 'left',
        width: '15%',
        render: (item, record) => (
          <span className={styles.optionlist}>
            <span className={styles.edit} >编辑</span>
            <span onClick={this.onRowLabel} data-taglist={JSON.stringify(record.tagList)} className={styles.labeling} >打标签</span>
          </span>
        )
      }
    ]
  }

  componentDidMount(){
    this.handleGetMembershipList()
  }

  // 获取会员列表
  handleGetMembershipList = async (page= 1, pageSize = 10) => {
    const { dispatch } = this.props
    this.setState({ isLoading: true })
    await dispatch({
      type: 'memberCenter_membershipList/loadMembershipList',
      payload: { page, pageSize }
    })
    this.setState({ isLoading: false })
  }

  // 切换页码
  handlePaginationChanged = (page, pageSize) => {
    this.handleGetBusinessList(page, pageSize)
  }

  // 行内打标签点击事件
  onRowLabel = (e) => {
    const { rowLabel } = this.props
    let tagList = e.currentTarget.dataset.taglist
    let recordId = e.currentTarget.dataset.id
    rowLabel(tagList, recordId)
  }

  // 显示会员信息抽屉
  onShowDrawer = (memberInfo) => {
    const { showDrawer } = this.props
    showDrawer(memberInfo)
  };

  // 选中项
  onSelectChange = (selectedRowKeys, selectedRows) => {
    const { selectChange } = this.props
    selectChange(selectedRowKeys, selectedRows)
  }

  render(){
    const rowSelection = {
      onChange: this.onSelectChange
    };
    const { membershipLists, membershipListParam } = this.props
    const { page, pageSize, total } = membershipListParam
    const { isLoading } = this.state
    return(
      <Table
        columns={this.columns}                                            // 表头数据
        dataSource={membershipLists}                                      // 会员列表
        rowKey={(r, i) => (i)}
        rowSelection={rowSelection}
        loading={isLoading}
        pagination={{
          current: page || 1,
          total: total || 0,
          pageSize: pageSize || 1,
          showTotal: total => `共 ${total} 条`,
          onChange: this.handlePaginationChanged,
          showSizeChanger: true,
          pageSizeOptions: ['3', '10', '20', '30', '40'],
          onShowSizeChange: this.handlePaginationChanged,
        }}
        className={styles.membershiptable}
      />
    )
  }
}

const mapStateToProps = ({ 'memberCenter_membershipList': state }) => {
  const { membershipLists, membershipListParam, tagList } = state
  return { membershipLists, membershipListParam, tagList }
}

export default withRouter(connect(mapStateToProps)(MembershipTable))