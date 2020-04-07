import React from 'react'
import { Row, Col } from 'antd'
import { connect } from 'dva'

import styles from './index.module.scss'

function OperationalStatus(props) {
  const prefix = 'operationalStatus';
  return (
    <Row gutter={16}>
      <Col span={18}>
        <Col span={18}>
          <div className={styles[`${prefix}-situation`]}>
            <div className={styles[`${prefix}-situation-today`]}>
              <div className={styles[`${prefix}-situation-today-total`]}>
                <p className={styles[`${prefix}-situation-today-total__desc`]}>
                  今日交易总额
                </p>
                <p className={styles[`${prefix}-situation-today-total__num`]}>
                  12345元
                </p>
              </div>
              <div className={styles[`${prefix}-situation-today-amount`]}>
                <p className={styles[`${prefix}-situation-today-amount__desc`]}>
                  今日交易总额
                </p>
                <p className={styles[`${prefix}-situation-today-amount__num`]}>
                  12345元
                </p>
              </div>
              <div className={styles[`${prefix}-situation-today-tourist-number`]}>
                <p className={styles[`${prefix}-situation-today-tourist-number__desc`]}>
                  今日交易总额
                </p>
                <p className={styles[`${prefix}-situation-today-tourist-number__num`]}>
                  12345元
                </p>
              </div>
              <div className={styles[`${prefix}-situation-today-total`]}>
                <p className={styles[`${prefix}-situation-today-total__desc`]}>
                  今日交易总额
                </p>
                <p className={styles[`${prefix}-situation-today-total__num`]}>
                  12345元
                </p>
              </div>
            </div>
          </div>
        </Col>
        <Col span={16}>1</Col>
      </Col>
      <Col span={6}>1</Col>
    </Row>
  )
}

const mapStateToProps = ({ wisdom_operationalStatus: page }) => {
  const { salesVolumeList, typeList, targetList } = page
  return { salesVolumeList, typeList, targetList }
}

export default connect(mapStateToProps)(OperationalStatus)
