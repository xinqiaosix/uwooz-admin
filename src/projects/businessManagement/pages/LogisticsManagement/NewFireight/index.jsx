/**
 * 新增运费模板
 */
import React from 'react'
import { connect, router } from 'dva'
import styles from './index.module.scss'
import { Form, Table, PageHeader, Input, Button, Row, Col, Modal } from 'antd'
import DeliveryModal from './deliveryModal'
import {
  newFreightTemplate,
  uploadMould,
  deleteRegion,
} from 'businessManagement/api/logisticsOperate'

const FormItem = Form.Item
const { withRouter } = router

class NewFreight extends React.Component {
  constructor(props) {
    super(props)
    this.myRef = React.createRef()
    this.state = {
      showDelivery: false, // 配送区域弹出框
      areaData: [], // 编辑选中项的数据
      deliveryData: [], // 配送数据
      showEditModular: false, // 判断是不是 修改项
      moduleId: this.props.match.params.id, // 传过来的数据
    }

    this.columns = [
      {
        title: '配送区域',
        dataIndex: 'distributionArea',
      },
      {
        title: '首重',
        dataIndex: 'firstHeavy',
      },
      {
        title: '运费',
        dataIndex: 'freight',
      },
      {
        title: '续重',
        dataIndex: 'continuedHeavy',
      },
      {
        title: '续费',
        dataIndex: 'renewal',
      },
      {
        title: '操作',
        dataIndex: 'operate',
        render: (text, record) => {
          return (
            <span>
              <span
                className={styles.operateStyle}
                onClick={() =>
                  this.setState({ showDelivery: true, showEditModular: true })
                }
              >
                修改
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
    this.editTemplate()
  }

  editTemplate = () => {
    const { dispatch, match } = this.props
    const {
      params: { id, type },
    } = match

    if (type === 'uploadFreight') {
      dispatch({
        type: 'businessManagement_logistics/getOneMouleList',
        payload: id,
      })
    }
  }

  // 关闭 配送 弹出框
  onCancel = () => {
    this.setState({
      showDelivery: false,
    })
  }

  // 新增 配送
  newDelivery = () => {
    this.setState({
      showDelivery: true,
      showEditModular: false,
    })
  }

  // 接受配送区域的数据 编辑 || 新增
  distributionArea = delivery => {
    // console.log(delivery)
    let deliveryData = []

    if (this.state.showEditModular === true) {
      deliveryData = this.state.deliveryData

      deliveryData.forEach((items, index) => {
        if (items.id === delivery.id) {
          deliveryData.splice(index, 1, delivery)
        }
      })
    } else {
      deliveryData = this.state.deliveryData.concat(delivery)
    }

    this.setState({
      deliveryData: deliveryData,
    })
    // console.log(deliveryData)
  }

  // 删除 配送区域
  deleteIogistics = record => {
    const { dispatch, match } = this.props
    const {
      params: { type, id },
    } = match

    if (type === 'uploadFreight') {
      const payload = {
        id: record.id,
        moduleId: id,
      }

      Modal.confirm({
        title: '删除提示!',
        content: '确定要删除当条信息吗?',
        okText: '确定',
        cancelText: '取消',
        async onOk() {
          const res = await deleteRegion(payload)

          if (res.errorCode === 200) {
            Modal.success({ title: '删除成功!' })
            dispatch({
              type: 'businessManagement_logistics/getOneMouleList',
              payload: id,
            })
          }
        },
      })
    } else {
      let deliveryData = this.state.deliveryData

      if (deliveryData) {
        deliveryData.forEach((items, index) => {
          if (items.id === record.id) {
            deliveryData.splice(items, 1)
          }
        })
      }
      Modal.success({ title: '删除成功!' })
    }
  }

  // 新建  || 编辑
  handleSave = () => {
    const { dispatch, form, match, userData } = this.props
    const {
      params: { type, id },
    } = match

    form.validateFields(async (err, values) => {
      if (!err) {
        const { name } = values
        if (type === 'uploadFreight') {
          const payload = {
            id: id,
            accountId: userData.accountId,
            templateName: name,
          }

          const res = await uploadMould(payload)

          if (res.errorCode === 200) {
            Modal.success({ title: '更新成功!' })
            dispatch({
              type: 'businessManagement_logistics/loadModuleList',
            })
          }
        } else {
          const distributionArea = this.state.deliveryData

          distributionArea.forEach((items, index) => {
            delete items.id
          })
          distributionArea.name = name

          const payload = {
            accountId: userData.accountId,
            templateName: name,
            DistributionJson:
              distributionArea.length >= 1
                ? JSON.stringify(distributionArea)
                : null,
          }

          const res = await newFreightTemplate(payload)

          if (res.errorCode === 200) {
            Modal.success({ title: '添加成功!' })
            dispatch({
              type: 'businessManagement_logistics/loadModuleList',
            })
          }
        }

        this.props.history.push('/businessManagement/Logistics')
      }
    })
  }

  // 取消
  handleCancel = () => {
    window.history.back()
  }

  render() {
    const { form, oneModuleData, oneModuleDataParams, match } = this.props

    const {
      params: { type },
    } = match
    const { getFieldDecorator } = form
    const { templateName } = oneModuleDataParams || ''

    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 21 },
    }

    return (
      <div className={styles.newFreight}>
        <PageHeader
          onBack={() => window.history.back()}
          title={type === 'uploadFreight' ? '编辑运费模板' : '新增运费模板'}
        />

        <Form {...formItemLayout} className={styles.formItemLayout}>
          <FormItem
            label="模板名称:"
            required
            hasFeedback
            className={styles.formItem}
          >
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入模板名称!' }],
              initialValue: type === 'uploadFreight' ? templateName : '',
            })(<Input placeholder="请输入模板名称" />)}
          </FormItem>

          <FormItem
            label="配送区域:"
            required
            hasFeedback
            className={styles.formItem}
          >
            <Table
              className={styles.deliveryTable}
              columns={this.columns}
              dataSource={
                type === 'uploadFreight'
                  ? oneModuleData
                  : this.state.deliveryData
              }
              rowKey={(r, i) => i}
              pagination={false}
              onRow={record => {
                return {
                  onClick: event => {
                    // console.log(record)
                    this.setState({
                      areaData: record,
                    })
                  },
                }
              }}
            />
          </FormItem>
        </Form>

        <Row>
          <Col span={2}> </Col>
          <Col>
            <Button type="primary" icon="plus" onClick={this.newDelivery}>
              {' '}
              增加配送地址{' '}
            </Button>
          </Col>
        </Row>

        <Row className={styles.freightButtom}>
          <Col span={2}> </Col>
          <Col>
            <Button type="primary" size="large" onClick={this.handleSave}>
              {' '}
              保存{' '}
            </Button>
            <Button
              size="large"
              onClick={this.handleCancel}
              className={styles.cancelStyle}
            >
              {' '}
              取消{' '}
            </Button>
          </Col>
        </Row>

        {/* 新增配送地址 */}
        <DeliveryModal
          visible={this.state.showDelivery} // 弹出框显示控制
          onCancel={this.onCancel} // 关闭弹出框
          areaData={this.state.areaData} // 点击修改选中的数据
          showEditModular={this.state.showEditModular} // 判断是不是 修改项
          distributionArea={this.distributionArea}
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {
    oneModuleData,
    oneModuleDataParams,
  } = state.businessManagement_logistics

  return {
    oneModuleData,
    oneModuleDataParams,
    userData: state.app.user,
  }
}
export default withRouter(connect(mapStateToProps)(Form.create({})(NewFreight)))
