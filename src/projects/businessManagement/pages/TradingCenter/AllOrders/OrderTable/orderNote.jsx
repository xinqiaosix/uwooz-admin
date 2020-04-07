import React from 'react'
import { Modal, Form } from 'antd'

// const { TextArea } = Input;

class OrderNote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     // value: ''
    }
  }

  // onChange = ({ target: { value } }) => {
  //   this.setState({ value });
  // };

  onCancel = () => {
    const { hideOrderNote } = this.props
    // this.setState({ value:'' })
    hideOrderNote()
  }

  handleSumbit = () => {
    const { hideOrderNote } = this.props
    // this.setState({ value:'' })
    hideOrderNote()
  }

  render() {
    const { visible, comment } = this.props
    let option = {
      visible: visible,
      title: '订单备注',
      okText: "确定",
      cancelText: "取消",
      onCancel: this.onCancel ,
      onOk: this.handleSumbit,
    }
    return(
      <Modal { ...option }>
         {/* <TextArea
          value={value}
          onChange={this.onChange}
          placeholder="请输入备注"
          autosize={{ minRows: 5, maxRows: 6 }}
          style={{ marginBottom: 20 }}
        /> */}
        <span>订单备注：{comment}</span>
      </Modal>
    )
  }
}

export default  Form.create()(OrderNote)