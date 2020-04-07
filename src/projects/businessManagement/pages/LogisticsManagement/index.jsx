/**
 * 物流管理
 */
import React from 'react';
import styles from './index.module.scss';
import { connect, router } from 'dva';
import { Layout, Row, Col,} from 'antd';
import FreightTemplate from './freightTemplate';
import AddressLibrary from './addressLibrary';

const { Content } = Layout;
const {  withRouter } = router;

class LogisticsManagement extends React.Component {

  render() {

    return(
      <Content className = { styles.logisticsBox }>

        <Row className = { styles.background }>
          <Col span = { 24 } className = { styles.title }> 物流管理 </Col>
        </Row>

        {/* 地址库 */}
        <AddressLibrary />

        {/* 运费模板 */}
        <FreightTemplate />

      </Content>  
    )
  }
} 

const mapStateToProps = ({ businessManagement_logistics: state }) => {
  const { addressData, addressParam, storeData, } = state;

  return { addressData, addressParam, storeData, };
}
export default withRouter(connect(mapStateToProps)(LogisticsManagement));