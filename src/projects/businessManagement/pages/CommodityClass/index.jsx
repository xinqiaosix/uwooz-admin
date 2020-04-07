import React from 'react'
import styles from './index.module.scss'
import { Layout, Button, Input, Table, Modal } from 'antd'
import { connect } from 'dva'
import NewCommodityClass from './newCommodityClass.jsx'
import { geDeleteCommodityClass } from 'businessManagement/api/commodityClass'

const { Content } = Layout
const { Search } = Input

class CommodityClass extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showAdd: false,
      showEdit: false,
      commodityClassData: [],
      classificationName: '',
    }

    this.columns = [
      {
        title: '分类名称',
        dataIndex: 'classificationName',
      },
      {
        title: '商品数',
        dataIndex: 'productNum',
      },
      {
        title: '操作',
        dataIndex: 'Operate',
        align: 'right',
        render: (text, record) => {
          return (
            <span>
              <span
                className={styles.operateStyle}
                onClick={() => this.setState({ showAdd: true, showEdit: true })}
              >
                编辑
              </span>
              <span
                className={styles.operateStyle}
                onClick={() => this.deleteIogistics(record)}
              >
                删除
              </span>
            </span>
          )
        },
      },
    ]
  }

  componentDidMount() {
    this.getCommodityClass()
  }

  // 请求分类列表
  getCommodityClass = () => {
    const { dispatch } = this.props

    dispatch({
      type: 'businessManagement_commodityClass/getCommodityClass',
    })
  }

  // 删除 分类列表
  deleteIogistics = record => {
    const { id } = record
    const { dispatch } = this.props

    Modal.confirm({
      title: '删除提示',
      content: '确定删除当前信息吗?',
      okText: '确定',
      cancelText: '取消',
      async onOk() {
        const params = {
          id,
        }
        const res = await geDeleteCommodityClass(params)

        if (res.errorCode === 200) {
          Modal.success({ title: '删除成功!' })
          dispatch({
            type: 'businessManagement_commodityClass/getCommodityClass',
          })
        }
      },
    })
  }

  // 关闭弹出框
  onCancel = () => {
    this.setState({
      showAdd: false,
    })
  }

  // 搜索
  onSearch = value => {
    this.setState({
      classificationName: value,
    })
    const { dispatch } = this.props
    const payload = {
      classificationName: value,
    }

    dispatch({
      type: 'businessManagement_commodityClass/getCommodityClass',
      payload,
    })
  }

  // 分页设置
  handlepagintion = (page, pageSize) => {
    const { dispatch } = this.props

    dispatch({
      type: 'businessManagement_commodityClass/getCommodityClass',
      payload: {
        page,
        pageSize,
        classificationName: this.state.classificationName,
      },
    })
  }

  render() {
    const { classification, classificationParams } = this.props

    const { page, pageSize, total } = classificationParams

    return (
      <div className={styles.commodityClassBox}>
        <Content className={styles.commodityClass}>
          <div className={styles.title}> 商品分类 </div>
          <div className={styles.header}>
            <Button
              type="primary"
              icon="plus"
              onClick={() => this.setState({ showAdd: true })}
            >
              {' '}
              新建分类{' '}
            </Button>
            <Search
              placeholder="名称"
              onSearch={this.onSearch}
              className={styles.search}
            />
          </div>

          <Table
            className={styles.classTable}
            columns={this.columns} // 表头标题
            dataSource={classification} // 表单数据
            rowKey={item => item.id} // 表格行 key 的取值
            pagination={{
              // 分页配置
              total: total, // 数据总数
              current: page, // 当前页数
              pageSize: pageSize, // 每页条数
              showTotal: total => `总共 ${total} 个订单 `, // 用于显示数据总量和当前数据顺序
              onChange: this.handlepagintion, // 页码改变的回调
              onShowSizeChange: this.handlepagintion, // pageSize 变化的回调
            }}
            onRow={record => {
              // 点击行获取当前数据
              return {
                onClick: event => {
                  // console.log(record);
                  this.setState({
                    commodityClassData: record,
                  })
                },
              }
            }}
          />

          <NewCommodityClass
            visible={this.state.showAdd}
            onCancel={this.onCancel}
            showEdit={this.state.showEdit}
            commodityClassData={this.state.commodityClassData}
          />
        </Content>
      </div>
    )
  }
}

const mapStateToProps = ({ businessManagement_commodityClass: state }) => {
  const { classification, classificationParams } = state
  return { classification, classificationParams }
}
export default connect(mapStateToProps)(CommodityClass)
