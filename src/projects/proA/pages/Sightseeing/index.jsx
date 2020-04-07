import React from 'react'
import { Button } from 'antd'

import CreateModal from './CreateModal'
import CarsTable from './CarsTable'

import styles from './index.module.scss'

class Sightseeing extends React.Component {
  state = {
    isCreateModalShow: false,
  }
  
  render() {
    const { className = '', } = this.props
    const { isCreateModalShow } = this.state

    return (
      <div className={`${className} ${styles['root']}`}>
        <Button
          type="primary"
          onClick={() => { this.setState({ isCreateModalShow: true }) }}
        >新 增</Button>

        <CreateModal
          visible={isCreateModalShow}
          onCreateSuccess={ () => this.setState({ isCreateModalShow: false }) }
          onCancel={() => { this.setState({ isCreateModalShow: false }) }}
        ></CreateModal>

        <CarsTable></CarsTable>
      </div>
    )
  }
}

export default Sightseeing
