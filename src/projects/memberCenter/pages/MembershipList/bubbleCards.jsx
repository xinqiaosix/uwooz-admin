import React from 'react'
import styles from  './index.module.scss'
import {Button, Input} from 'antd'
// 添加标签弹框里的内容
class BubbleCards extends React.Component{
  constructor(props)
  {
    super(props);
    this.state = {
      labelContent: '',    //要添加的标签名称
    }
  }

  // 获取添加的标签的名称
  getLabelName = (e) => {
    this.setState({
      labelContent: e.target.value
    })
  }

  // 改变输入的标签名称
  onChange = (e) =>{
    this.setState({
      labelContent: e.target.value
    })
  }
  // 取消添加标签
  onCancel = () => {
    this.setState({
      labelContent: ''
    })
    this.props.onCancel()
  }

  // 保存添加的标签
  onConfirm = () => {
    this.props.onAdd(this.state.labelContent)
    this.setState({
      labelContent: ''
    })
  }
  render(){
    return(
      <div className={styles.addlabel}>
        <Input onBlur={this.getLabelName} onChange={this.onChange} value={this.state.labelContent} placeholder="标签名称"></Input>
        <div className={styles.btn}>
          <Button style={{ marginRight: 15 }} onClick={this.onCancel} >取消</Button>
          <Button type="primary" onClick={this.onConfirm} >确定</Button>
        </div>
      </div>
    )
  }
}

export default BubbleCards;