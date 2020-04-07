import React from 'react'
import styles from './index.module.scss'
import { connect, router } from 'dva'
import LabelingForm from './Labeling/index'                // 打标签弹框
import MemberInformation from './MemberInformation/index'  // 会员信息抽屉
import BubbleCards from './bubbleCards'
import MembershipTable from './MembershipTable/index'

import {Button, Layout, Icon, Checkbox, Input, Popover, Modal} from 'antd'

const { Header } = Layout
const { Search } = Input
const { withRouter } = router

class MembershipList extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      selectedRowKeys: [],      // 选中项列表key值
      selectedRows:[],          // 选中项列表
      addlabel: false,          // 添加标签弹框显示与否
      visible: false,           // 打标签modal显示与否
      drawer: false,            // 会员详细信息抽屉显示与否
      membershipInfo: [],       // 会员详细信息
      userTagList: [],          // 每个会员已有的标签
      screeningLabels: [],      // 筛选标签列表（用来渲染不同的会员列表）
      recordId: '',             // 行记录id
    }
  }

  // 保存添加的标签
  onAdd = (labelName) => {
    console.log(labelName)
    this.setState({
      addlabel: false,
    })
  }

  // 获取标签列表
  handleGetLabelList = () => {
    const { dispatch } = this.props
    dispatch ({
      type: 'memberCenter_membershipList/loadTagList',
    })
  }

  // 按标签筛选，渲染不同的会员列表
  onChanges = (checkedValues) => {
    // console.log(checkedValues)
    this.setState({
      screeningLabels: checkedValues
    })
  }

  // 按昵称搜索
  onSearch = (value) => {
    console.log(value)
  }

  // 行内打标签点击事件
  onRowLabel = (tagList, recordId) => {
    this.setState({
      visible: !this.state.visible,
      userTagList: JSON.parse(tagList),
      recordId: recordId
    })
  }

  // 表头打标签点击事件
  onHeadLabel = () => {
    if (this.state.selectedRows !== '' && this.state.selectedRows !== undefined) {
      if (this.state.selectedRows.length === 1) {
        this.setState({
          visible: !this.state.visible,
          userTagList: this.state.selectedRows[0].tagList,
          recordId: this.state.selectedRows[0].id
        })
      }
      else if (this.state.selectedRows.length > 1) {
        this.setState({
          visible: !this.state.visible,
          userTagList: [],
          recordId: ''
        })
      }
      else {
        Modal.info({
          content: '请至少选中一项'
        })
      }
    }
    else {
      Modal.info({
        content: '请至少选中一项'
      })
    }
  }

  // 显示会员信息抽屉
  onShowDrawer = (memberInfo) => {
    this.setState({
      drawer: true,
      membershipInfo: JSON.parse(memberInfo)
    });
  };

  // 选中项
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRowKeys: selectedRowKeys,
      selectedRows: selectedRows
    })
  }

  render(){
    const { tagList } = this.props
    return(
      <div id="membershiplist">
        <Header className={styles.header}>
          <span className={styles.title}>会员列表</span>
          <Button type="primary">新增会员</Button>
        </Header>
        <div className={styles.content}>
          <div className={styles.label_content}>
            <div className={styles.label_header}>
              <span className={styles.label_title}>按标签筛选</span>
              <div>
                <Popover
                  placement="bottomLeft"
                  content={
                    <BubbleCards
                      onAdd={this.onAdd}
                      onCancel={() => this.setState({ addlabel: false})}
                    />
                  }
                  trigger="click"
                  visible={this.state.addlabel}
                  style={{zIndex:9}}
                >
                  <Icon className={styles.label_icon} type="plus" onClick={() => this.setState({addlabel: !this.state.addlabel}) } />
                </Popover>
              </div>
            </div>
            <div className={styles.label_list}>
              <span className={styles.smalltitle}>全部 ( 130 )</span>
              <Checkbox.Group className={styles.checkbox} onChange={this.onChanges} >
                {
                  tagList.map((item)=>{
                    return(
                      <Checkbox key={item.id} value={item.id}>{item.name} ( {item.count} )</Checkbox>
                    )
                  })
                }
              </Checkbox.Group>
            </div>
          </div>

          <div className={styles.list}>
            <div className={styles.option}>
              <Search
                placeholder="昵称"
                style={{ width: 240 }}
                onSearch={this.onSearch} // 按昵称搜索
              />
              <div className={styles.sort}>
                <span className={styles.ordercondition}>按注册日期</span>
                <div className={styles.filter}>
                  <Icon type="caret-up" style={{marginBottom:-5}} />
                  <Icon type="caret-down" />
                </div>
              </div>
            </div>
           
            {/* 会员列表表格 */}
            <MembershipTable
              selectChange={this.onSelectChange}
              rowLabel={this.onRowLabel}               // 行内打标签
              showDrawer={this.onShowDrawer}           // 右侧展开抽屉的会员信息
            />
            <Button className={styles.alwayslabel} onClick={this.onHeadLabel} >打标签</Button>
          </div>
        </div>
        
        {/* 打标签弹框 */}
        <LabelingForm
          visible={this.state.visible}                                          // 打标签弹框显示与否
          tagList={this.state.tagList}                                          // 总的标签列表
          userTagList={this.state.userTagList}                                  // 会员已有的标签
          onCancel={() => this.setState({visible: !this.state.visible})}        // 取消
          recordId={this.state.recordId}                                        // 行记录id
          onAdd={this.onAdd}                                                    // 多选时添加标签时调用
        />

        {/* 会员信息抽屉 */}
        <MemberInformation
          visible={this.state.drawer}                                           // 会员信息抽屉显示与否
          membershipInfo={this.state.membershipInfo}                            // 会员的详细信息
          hideDrawer={() => this.setState({drawer: false})}                     // 隐藏会员信息抽屉
        />
      </div>
    )
  }

  componentDidMount(){
    this.handleGetLabelList()
  }
}

const mapStateToProps = ({ 'memberCenter_membershipList': state }) => {
  const { membershipLists, membershipListParam, tagList } = state
  return { membershipLists, membershipListParam, tagList }
}

export default withRouter(connect(mapStateToProps)(MembershipList))