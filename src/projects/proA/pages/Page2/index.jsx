import React from 'react'
import { connect } from 'dva'

import styles from './index.module.scss'

class Page2 extends React.Component {
  // componentDidMount() {
  //   const { dispatch } = this.props
  //   const res = dispatch({
  //     type: 'proA_page2/test',
  //   })
  //   console.log(res)
  // }

  render() {
    const { className } = this.props

    return (
      <div className={`${className} ${styles['root']}`}>
        Page2
      </div>
    )
  }
}

export default connect()(Page2)
