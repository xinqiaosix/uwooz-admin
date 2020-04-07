/**
 * 景区项目
 */
import React from 'react'
import styles from './index.module.scss'

// antd 相关引入;
import { Layout, Table, Button, Modal, Select } from 'antd'
import { connect } from 'dva'

// 用户手机号码显示的气泡框组件
import MobileBubbleCard from './mobileBubbleCard'
import ScenicSpotOperation from './scenicSpotOperation'

const { Content } = Layout
const { Option } = Select

class ScenicSpotProject extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showAdd: false, // 确认 新增 还是 编辑
      showModal: false, // 弹出框 总状态
      scenicSpotData: [], // 景区列表 选中项的数据
      showSearch: 'none',
    }

    // 景区项目表头
    this.columns = [
      {
        title: '景区',
        dataIndex: 'name',
        width: '25%',
        render: (item, record) => {
          return (
            <span style={{ color: record.state === 1 ? '#D7D7D7' : '#000000' }}>
              {item}
            </span>
          )
        },
      },
      {
        title: '标识',
        dataIndex: 'logo',
        width: '25%',
        render: (item, record) => {
          return (
            <span style={{ color: record.state === 1 ? '#D7D7D7' : '#000000' }}>
              {item}
            </span>
          )
        },
      },
      {
        title: '负责人',
        dataIndex: 'head',
        width: '25%',
        render: (item, record) => {
          return (
            <div
              className={styles.contacts}
              style={{ color: record.state === 1 ? '#D7D7D7' : '#000000' }}
            >
              <span> {item} </span>
              <MobileBubbleCard mobile={record.headphone} />
            </div>
          )
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: '25%',
        render: (item, record) => (
          <span>
            <span
              className={styles.scenicSpotButton}
              onClick={() => this.showEdit(record)}
            >
              编辑
            </span>
            &nbsp;
            <span className={styles.scenicSpotButton}>
              {(record.state === 1 && (
                <span onClick={() => this.handleEnable(record)}> 启用 </span>
              )) ||
                (record.state === 0 && (
                  <span onClick={() => this.showStopUsing(record)}> 停用 </span>
                ))}
            </span>
          </span>
        ),
      },
    ]
  }

  componentDidMount() {
    this.scenicSpot()
  }

  // 加载景区列表
  scenicSpot = () => {
    const { dispatch } = this.props
    // const accountId = 999
    dispatch({
      type: 'enterpriseAccounts_item/loadScenicSpotList',
      // payload: accountId,
    })
  }

  // 启用
  handleEnable = record => {
    const { dispatch } = this.props
    const { id, accountId } = record
    const state = 0

    dispatch({
      type: 'enterpriseAccounts_item/openScenicSpotList',
      payload: { id, accountId, state },
    })
  }

  // 点击打开 停用 弹出框
  showStopUsing = record => {
    const { dispatch } = this.props
    const { id, accountId } = record
    const state = 1

    Modal.confirm({
      title: '确定要停用项目?!',
      connect: '停用项目后,相关产品服务及数据查看将会受到影响.',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'enterpriseAccounts_item/openScenicSpotList',
          payload: { id, accountId, state },
        })
      },
    })
  }

  // 点击弹出 => 编辑
  showEdit = () => {
    this.setState({
      showModal: true,
      showAdd: false,
    })
  }

  // 搜索的值
  handleGetSearch = value => {
    const { dispatch, scenicSpotList } = this.props
    const { accountId } = scenicSpotList
    const id = value
    const payload = {
      id,
      accountId,
    }
    dispatch({
      type: 'enterpriseAccounts_item/getScenicSpotList',
      payload,
    })
  }

  // 搜索
  handleSearch = () => {
    if (this.state.showSearch === 'none') {
      this.setState({
        showSearch: 'block',
      })
    } else {
      this.setState({
        showSearch: 'none',
      })
    }
  }

  // 关闭弹出框
  onCancel = () => {
    this.setState({
      showModal: false,
      showAdd: false,
      scenicSpotData: [],
      showStopUsing: false,
    })
  }

  render() {
    const {
      scenicSpotList,
      // scenicSpotParam,
      searchScenicSpotData,
    } = this.props

    return (
      <div id={styles.scenicSpotProject}>
        <Content className={styles.scenicSpotBox}>
          <div className={styles.scenicSpot_title}> 景区项目 </div>
          <div className={styles.scenicSpot_operation}>
            <Button
              type="primary"
              onClick={() => this.setState({ showModal: true, showAdd: true })}
            >
              {' '}
              新增{' '}
            </Button>
            <div className={styles.searchOperation}>
              <Select
                showSearch
                placeholder="请输入景区"
                className={styles.search_business}
                optionFilterProp="children"
                onChange={this.handleGetSearch}
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                style={{ display: this.state.showSearch }}
              >
                {scenicSpotList.map(item => {
                  return (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  )
                })}
              </Select>
              <Button
                shape="circle"
                icon="search"
                onClick={this.handleSearch}
              />
            </div>
          </div>

          <div className={styles.table}>
            <Table
              rowKey={item => item.id} // 表格行 key 的取值
              columns={this.columns} // 表格头部标题
              // dataSource = { scenicSpotList }  // 表格数据
              dataSource={
                searchScenicSpotData.length > 0
                  ? searchScenicSpotData
                  : scenicSpotList
              } // 表格数据
              onRow={record => {
                return {
                  onClick: event => {
                    this.setState({
                      scenicSpotData: record,
                    })
                  },
                }
              }}
            />
          </div>

          <ScenicSpotOperation
            destyroyOnClose={true} // 关闭时销毁 Modal 里的子元素
            visible={this.state.showModal} // 是否显示弹框
            onCancel={this.onCancel} // 关闭弹出框
            scenicSpotData={this.state.scenicSpotData} // 点击行 的数据
            showAdd={this.state.showAdd}
          />
        </Content>
      </div>
    )
  }
}

// modal 中的 state 通过组件的 props 注入组件
const maoStateToProps = state => {
  const {
    scenicSpotList,
    scenicSpotParam,
    searchScenicSpotData,
  } = state.enterpriseAccounts_item

  return {
    scenicSpotList,
    scenicSpotParam,
    searchScenicSpotData,
    userData: state.app.user,
  }
}
export default connect(maoStateToProps)(ScenicSpotProject)
