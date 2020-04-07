import React from 'react'
import styles from './index.module.scss'

// 如果没有规格票，隐藏展开图标
function CustomExpandIcon(props) {
  let text;
  if (props.record.orderProducts.length === 0) {
    text = ''
  }
  else {
    if (props.expanded) {
      text = '-';
    }
    else {
      text = '+';
    }
  }

  return (
    <React.Fragment>
      {
        props.record.orderProducts.length > 0 &&
        <span
          className={styles.expand_row_icon}
          onClick={e => props.onExpand(props.record, e)}
          dangerouslySetInnerHTML={{ __html: text }}
        />
      }
    </React.Fragment>
  );
}

export default CustomExpandIcon