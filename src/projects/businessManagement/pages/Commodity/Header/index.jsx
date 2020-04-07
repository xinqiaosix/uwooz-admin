import React from 'react'

import styles from './index.module.scss'
import AllBusiness from 'businessManagement/components/AllBusiness'

/**
 * 商品管理的header
 * @param {object} props 
 */
function Header(props) {
  const { 
    setValue // 修改商家
  } = props;

  return (
    <div className={styles['header']}>
      <div className={styles['header__title']}>商品列表</div>
      <AllBusiness 
        onScreen={setValue}
      />
    </div>
  )
}

export default React.memo(Header)