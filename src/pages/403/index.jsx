import React from 'react';
import BaseButton from '@/components/BaseButton';
import styles from './index.module.scss';
import NoAccess_403 from '@/assets/images/NoAccess/403.png';
import { Button } from 'antd'

function NoAccess() {
  return(
    <div className={styles.container}>
      <div className={styles.imgWrap}>
        <img src={NoAccess_403} alt="403" />
      </div>
      <p className={styles.title}>403</p>
      <p className={styles.text}>抱歉，您无权访问</p>
      <BaseButton type='secondary' style={{marginTop: 30}}>返回</BaseButton>
      <hr className={styles.hr} />
      <div className={styles.contact}>
        有疑问？想了解该产品详情？
        <Button type='primary' style={{marginLeft: 20}}>联系我们</Button>
      </div>
    </div>
  )
}

export default NoAccess;