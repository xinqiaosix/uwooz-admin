import React from 'react';
import styles from './index.module.scss';
import { Layout, Button, Input, Table, Form, DatePicker, Select } from 'antd';
import AllBusiness from '../../components/AllBusiness/index';
import { connect } from 'dva';

const { Content } = Layout;
const { Search } = Input;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;

class CardCountingStatistics extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showAdd: false,
      showEdit: false,
      commodityClassData: [], // 选中项数据
      classificationName: '',
    }

    this.columns = [
      {
        title: '卡券',
        dataIndex: 'card',
        render: (text) => (
          <span className = { styles.cardColor }>{text}</span>
        )
      },
      {
        title: '投放日期',
        dataIndex: 'dateOfLaunch',
      },
      {
        title: '核销日期',
        dataIndex: 'cancellationDate',
      },
      {
        title: '商家',
        dataIndex: 'business',
      },
      {
        title: '会员',
        dataIndex: 'member',
      },
      {
        title: '操作',
        dataIndex: 'Operate',
        align: 'right',
        render: (text,record) => {
          return(
            <span>
              <span 
                className = { styles.operateStyle }
                onClick = { () => this.setState({ showAdd: true, showEdit: true, }) } 
              >
                查看 
              </span>
              <span 
                className = { styles.operateStyle }
                onClick = { () => this.deleteIogistics(record) }
              > 
                删除 
              </span>
            </span>
          )
        }
      }
    ]
  }

  componentDidMount(){
    this.getCreadList();
  }

  getCreadList = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'businessManagement_cardTicket/getCreadList'
    })
  }


  // 筛选后的商家列表
  handleGetOrderList = async ( merchantId ) => {
    // const { dispatch } = this.props;

    // await dispatch({
    //   type: 'businessManagement_logistics/getQueryMerchant',
    //   payload: { merchantId }
    // })
  };

  handlepagintion = (page, pageSize) => {
    console.log(page, pageSize);
  }

  render() {
    const {
      form,
      creadData, 
      // creadParams,
    } = this.props;

    // console.log(creadData,creadParams);

    const { getFieldDecorator } = form;

    return (
      <div className = { styles.cardTicketBox }>

        <Content className = { styles.cardTicket }>

          <div className = { styles.title }> 
            <div>卡券统计</div>

            <div className = { styles.allBusiness }>
              <AllBusiness 
                className = { styles.allBusiness }
                onScreen = {this.handleGetOrderList} 
              />
            </div>
          </div>

          <div className = { styles.search }>
            <Search
              placeholder = "卡券名称或id "
              onSearch = { this.onSearch }
              className = { styles.searchName }
            />

            <Form className = { styles.searchData }>
              <FormItem label="核销日期" className = { styles.cardTickData }>
                {
                  getFieldDecorator("driverQueryText", {
                    initialValue: null
                  })(
                    <RangePicker
                      className = { styles.driverQueryTime }
                      format = "YYYY-MM-DD"
                      onChange = { this.SpecificTime }
                    />
                  )
                }
              </FormItem>

              <FormItem label="卡券类型" className = { styles.cardTicketType } >
                {
                  getFieldDecorator("driverNameText", {
                    initialValue: undefined
                  })(
                    <Select
                    showSearch
                    placeholder = "全部"
                    className = { styles.search_business }
                    optionFilterProp = "children"
                    onChange = { this.handleGetSearch }
                    filterOption = {(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                  {/* {
                      scenicSpotList.map((item) => {
                        return (
                          <Option value={item.id} key={item.id}>{item.name}</Option>
                        )
                      })
                    } */}
                    <Option value='1' key='1'>测试一</Option>
                    <Option value='2' key='2'>测试二</Option>
                  </Select>
                  )
                }
              </FormItem>

              <Button type="link" onClick = { this.resetData } className = { styles.empty }> 清空 </Button>

            </Form>
          </div>

            <Table 
              className = { styles.caredData }
              columns = { this.columns }
              dataSource = { creadData }
              rowKey = { item => item.id }
              pagination = {{                   // 分页配置
                total: 0,                       // 数据总数 
                current: 1,                     // 当前页数
                pageSize: 5,                    // 每页条数
                showTotal: total => `总共 ${ total } 个订单 `, // 用于显示数据总量和当前数据顺序
                onChange: this.handlepagintion,               // 页码改变的回调
                onShowSizeChange: this.handlepagintion,       // pageSize 变化的回调
              }}
              onRow = {record => {                            // 点击行获取当前数据
                return {
                  onClick: event => {
                    // console.log(record);
                    this.setState({
                      commodityClassData: record
                    })
                  }
                }
              }} 
            />
      
        </Content>

      </div>
    )
  }
}

const mapSatateToProps = ({businessManagement_cardTicket: state}) => {
  const { creadData, creadParams } = state;
  return { creadData, creadParams }
}

export default connect(mapSatateToProps)(Form.create()(CardCountingStatistics))