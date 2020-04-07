import React from 'react'
import { Modal, Form, Input } from 'antd'
import styles from './index.module.scss'
import { connect } from 'dva'
import {
  getNewCommodityClass,
  getUploadCommodityClass,
} from 'businessManagement/api/commodityClass'

const FormItem = Form.Item

class NewCommodityClass extends React.Component {
  // constructor(props) {
  //   super(props);

  // }

  // 关闭弹出框
  onCancel = () => {
    const { form } = this.props
    this.props.onCancel()
    form.resetFields()
  }

  // 新增 商品分类
  newCommodityClass = () => {
    const { form, dispatch, userData } = this.props
    const { accountId } = userData
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        const params = {
          accountId,
          classificationName: values.typeName,
        }

        const res = await getNewCommodityClass(params)

        if (res.errorCode === 200) {
          Modal.success({ title: '添加成功!' })

          dispatch({
            type: 'businessManagement_commodityClass/getCommodityClass',
            payload: accountId,
          })
        }

        this.props.onCancel()
        form.resetFields()
      }
    })
  }

  // 编辑商品分类
  uploadCommodityClass = () => {
    const { form, dispatch, commodityClassData, userData } = this.props
    const { accountId } = userData
    const { id } = commodityClassData
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        const uploadParam = {
          id,
          classificationName: values.typeName,
        }

        const res = await getUploadCommodityClass(uploadParam)

        if (res.errorCode === 200) {
          Modal.success({ title: '添加成功!' })

          dispatch({
            type: 'businessManagement_commodityClass/getCommodityClass',
            payload: accountId,
          })
        }

        this.props.onCancel()
        form.resetFields()
      }
    })
  }

  render() {
    const { form, visible, showEdit, commodityClassData } = this.props

    const { getFieldDecorator } = form

    let option = {
      visible: visible,
      title: showEdit === true ? '编辑分类' : '新建分类',
      okText: '保存',
      cancelText: '取消',
      onOk:
        showEdit === true ? this.uploadCommodityClass : this.newCommodityClass,
      onCancel: this.onCancel,
    }

    const formItemLayout = {
      // label 标签布局
      labelCol: {
        span: 6,
      },
      // 输入控件布局样式
      wrapperCol: {
        span: 14,
      },
    }

    return (
      <Modal {...option}>
        <Form className={styles.newCommodityClass}>
          <FormItem label="分类名称:" hasFeedback {...formItemLayout}>
            {getFieldDecorator('typeName', {
              rules: [{ message: '请输入分类名称!' }],
              initialValue:
                showEdit === true ? commodityClassData.classificationName : '',
            })(<Input placeholder="请输入分类名称!" />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

const mapStateToProps = state => {
  // const {} = state;
  return {
    userData: state.app.user,
  }
}
export default connect(mapStateToProps)(Form.create({})(NewCommodityClass))
