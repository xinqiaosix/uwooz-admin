import React from 'react'
import { Modal, Form, Input } from 'antd'
import { connect } from 'dva'

const { TextArea } = Input;

class SellNote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    }
  }

  componentWillReceiveProps(nextProps) { // 父组件重传props时就会调用这个方法
    if (!nextProps.visible) {
      this.setState({
       value: nextProps.comment
      });
    }
  }

  onChange = ({ target: { value } }) => {
    this.setState({ value });
  };

  onCancel = () => {
    const { hideSellNote } = this.props
    this.setState({ value:'' })
    hideSellNote()
  }

  handleSumbit = async () => {
    const { hideSellNote, dispatch, orderDetail } = this.props
    const { id } = orderDetail
    const { value } = this.state
    const payload = {
      id,
      sellerComment: value 
    }
    await dispatch({
      type: 'businessManagement_allorders/ModifySellerNotes',
      payload
    })
    this.setState({ value:'' })
    hideSellNote()
  }

  render() {
    const { value } = this.state
    const { visible } = this.props
    let option = {
      visible: visible,
      title: '卖家备注',
      okText: "确定",
      cancelText: "取消",
      onCancel: this.onCancel ,
      onOk: this.handleSumbit,
    }
    return(
      <Modal { ...option }>
         <TextArea
          value={value}
          onChange={this.onChange}
          placeholder="请输入备注"
          autosize={{ minRows: 5, maxRows: 6 }}
          style={{ marginBottom: 20 }}
        />
      </Modal>
    )
  }
}

const mapStateToProps = ({ 'businessManagement_allorders': state }) => {
  const { orderDetail } = state
  return { orderDetail }
}

export default connect(mapStateToProps)(Form.create()(SellNote)) 