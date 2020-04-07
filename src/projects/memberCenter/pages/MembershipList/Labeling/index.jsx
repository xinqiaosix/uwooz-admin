import React from 'react'
import { Modal, Form, Checkbox, Input, Button} from 'antd'
import { connect } from 'dva'
import styles from './index.module.scss'
import './index.scss'

const FormItem=Form.Item

// 创建打标签表单
class LabelingForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addLabel: false,  // 新建标签
      labelName: ''      // 新建标签的名称
    }
  }

  // 取消
  onCancel = () => {
    this.props.form.resetFields();
    this.props.onCancel()
  }

  // 保存
  handleSumbit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values)
        this.props.onCancel()
      }
    })
  }

  // 获取添加的标签的名称
  handleGetLabelName = (e) => {
    this.setState({
      labelName: e.target.value
    })
  }

  // 添加标签
  onAddLabel = () => {
    this.setState({
      addLabel: false
    })
    this.props.onAdd(this.state.labelName)
  }
  render() {
    const {
      form,          // 表单参数（默认必须值）
      visible,       // 弹出框是否可见
      tagList,       // 标签列表
      userTagList,   // 会员的标签列表
      // recordId       // 行记录Id
    } = this.props;

    let option = {
      visible: visible,
      title: "设置标签",
      okText: "保存",
      cancelText: "取消",
      onCancel: this.onCancel,
      onOk: this.handleSumbit,
    }; // 弹出框参数

    const { getFieldDecorator } = form;

    // 默认选中的标签列表
    let list = []
    userTagList.forEach((item) => {
      list.push(item)
    })
    return (
      <Modal
        {...option}
        style={{ marginTop: '10%' }}
      >
        <Form >
          <FormItem style={{ marginBottom: 8 }}>
            {getFieldDecorator('checkbox-group', {
              initialValue: list,
            })(
              <Checkbox.Group style={{ width: '100%' }} className={styles.checkboxgroup}>
                {
                  tagList.map((item) => {
                    return (
                      <Checkbox key={item.id} value={item.id} className={styles.checkbox} style={{ marginLeft: 0 }} >{item.name}</Checkbox>
                    )
                  })
                }
              </Checkbox.Group>
            )}
          </FormItem>
        </Form>
        {
          this.state.addLabel ?
            <div className={styles.labelform}>
              <Input className={styles.input} placeholder="标签名称" onBlur={this.handleGetLabelName} ></Input>
              <Button className={styles.btn} type="primary" ghost onClick={this.onAddLabel} >添加</Button>
              <Button onClick={() => this.setState({ addLabel: !this.state.addLabel })}>取消</Button>
            </div> :
            <span className={styles.addlabel} onClick={() => this.setState({ addLabel: !this.state.addLabel })} >新建标签</span>
        }
      </Modal>
    )
  }

  // 如果this.props.recordId为空，说明是多选打标签，否则是单选打标签
  // 从而判断，添加标签是个人还是整体
}

const mapStateToProps = ({ 'memberCenter_membershipList': state }) => {
  const { membershipLists, membershipListParam, tagList } = state
  // const tagListById = labelList.reduce((acc, item) => {
  //   const { id } = item
  //   acc[id] = item
  //   return acc
  // }, {})
  return { membershipLists, membershipListParam, tagList }
}
export default connect(
  mapStateToProps
)(Form.create()(LabelingForm))
