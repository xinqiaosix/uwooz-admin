import React from 'react'
import { router } from 'dva'

import styles from './index.module.scss'

const { withRouter } = router

class SightseeingDetail extends React.Component {
  render() {
    const { match } = this.props
    const { params: { id } } = match
    
    return (
      <div className={styles['root']}>观光车详情页：id {id}</div>
    )
  }
}

export default withRouter(SightseeingDetail)
