import React from 'react'
import styles from './index.module.scss'
import { Popover, Icon } from 'antd'

class MobileBubbleCard extends React.Component{
  constructor(props)
  {
    super(props);
    this.state = {
      visible: false   // 气泡卡片显示与否
    }
  }

  // 气泡卡片显示与隐藏的回调
  handleVisibleChange = visible => {
    this.setState({ visible });
  };

  render(){
    return(
      <Popover
        placement="top"
        trigger="click"
        content={
          <div className={styles.mobile_card}>
            <span>{this.props.mobile}</span>
            <img className={styles.hide} src={require('@/assets/images/cancel.png')} alt="" onClick={() => this.setState({ visible: !this.state.visible })} />
          </div>
        }
        visible={this.state.visible}
        onVisibleChange={this.handleVisibleChange}
      >
        <Icon type="mobile" className={styles.mobile_icon} onClick={() => this.setState({ visible: !this.state.visible })} />
      </Popover>
    )
  }
}

export default MobileBubbleCard;