/** 
* 观光车详情 组件
*/
import React from 'react';
import styles from '../index.module.scss';
import { withRouter } from 'react-router-dom';
import { Layout, Form,} from 'antd';
import RepairRecordData from './repairRecordData';
import PunchInRecord from './punchInRecord';
import CarHeaderData from './carHeaderData';


const { Content, } = Layout;

class SightseeingCarDetails extends React.Component {
 
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      current: 1,
    }
  }

  // 必须值（不知道为什么要有）
  saveFormRef = (formRef) => {
    this.formRef = formRef;
  }
  
  render() {

    return (

      <React.Fragment>
        <Content className={ styles.sightseeingCarDetails }>

          {/* 观光车头部信息与操作 */}
          <CarHeaderData 
            emptyData = { this.props.emptyData }        // 刷新 => 报修与维修记录
          />
  
          <div className={ styles.sightseeingCarDetails_Box }>

            {/* 观光车 => 上下班记录 */}
            <PunchInRecord />

            {/* 观光车详情 => 报修与维修记录 */}
            <RepairRecordData />

          </div>

        </Content>
      </React.Fragment>

    )
  }

}

SightseeingCarDetails = Form.create({})(SightseeingCarDetails);
export default withRouter(SightseeingCarDetails);