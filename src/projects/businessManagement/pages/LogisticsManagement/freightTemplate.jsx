/**
 * 运费模板
 */
import React from  'react';
import { connect, router } from 'dva';
import { Row, Col, Collapse, Button, Table, Modal } from 'antd';
import styles from './index.module.scss';
import { deleteMould } from 'businessManagement/api/logisticsOperate';

const { Panel } = Collapse;
const { withRouter, Link } = router;

class FreightTemplate extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      showFreigh: false, // 运费模板 弹出框
    }

    this.mouldTable = [
      {
        title: '配送区域',
        dataIndex: 'distributionArea',
      },
      {
        title: '首重',
        dataIndex: 'firstHeavy',
      },
      {
        title: '运费',
        dataIndex: 'freight',
      },
      {
        title: '续重',
        dataIndex: 'continuedHeavy'
      },
      {
        title: '续费',
        dataIndex: 'renewal'
      }
    ]
  }

  componentDidMount(){

    const { dispatch } = this.props;
    dispatch({
      type: 'businessManagement_logistics/loadModuleList',
    });
  
  }

  // freightModule = (value) => {
  //    console.log(value)
  // }

  // 运费模板 操作 设置
  genExtra = (item) => (
    <div>    
      <Link type = "setting" to={`${this.props.match.path}/uploadFreight/${item.id}`} className = { styles.mouldStyles }> 编辑 </Link>

      <span type = "setting" className = { styles.mouldStyles } onClick = {() => this.deleteMould(item.id) }>
        删除
      </span>
    </div>
  );

  // 删除模板
  deleteMould = (id) => {
    const { dispatch } = this.props;

    Modal.confirm({
      title: '删除提示!',
      content: '确定删除当前信息吗?',
      okText: '确定',
      cancelText: '取消',
      async onOk() {       
        const res = await deleteMould(id);

        if ( res.errorCode === 200 ) {
          Modal.success({ title: '删除成功!' });
          dispatch({
            type: 'businessManagement_logistics/loadModuleList'
          })
        }
      }
    })     
  }

  render() {

    const { 
      moduleData, // 运费模板列表
    } = this.props;
    // console.log(moduleData);

    return(
      <div className = { styles.freightTemplate }>
        <Row className = { styles.freightModule } type = 'flex' align = 'middle'>
          <Col span = { 12 }> 运费模块 </Col>
          <Col span = { 12 } className = { styles.moduleStyle }>
            <Button type= 'primary' icon= 'plus'>  
              <Link to={`${this.props.match.path}/newFreight`} className = { styles.newFreight }> 新增模板 </Link>
            </Button>
          </Col>
        </Row>

        <Collapse
          accordion
          // defaultActiveKey = {[defaultActiveKey]}
          onChange = { this.freightModule }
          expandIconPosition = { this.expandIconPosition }
          className = { styles.moduleContent }
        >
          {
            moduleData.map((item,index) => {

              return(
                <Panel header={ item.templateName } key= { item.id } extra = { this.genExtra(item) }>
                  <Table 
                    className = { styles.moduleTable }
                    columns = { this.mouldTable }
                    dataSource = { item.distributions }
                    rowKey = { item => item.id }
                    pagination = { false }
                  />
                </Panel>
              )
            })
          }
        </Collapse>
      </div>
    )
  }
}

const mapStateToProps = ({ businessManagement_logistics: state }) =>{
  const { moduleData } = state;

  return { moduleData };
}
export default withRouter(connect(mapStateToProps)(FreightTemplate))