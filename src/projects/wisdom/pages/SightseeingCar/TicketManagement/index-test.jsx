/* eslint-disable */
import React, { useState, useEffect } from 'react'
import axios from '@/util/ajax'; // axios组件引入
import Utils from '@/util/tool'
import styles from './index.module.scss'
import {Layout, Table,Modal} from 'antd'
import ChooseLineForm from './ChooseLine/index'
import TicketMessage from './AddTicketMessage/index'
import EditTicket from './EditForm/index-test'
import CustomExpandIcon from './CustomExpandIcon/index'
const { Content } = Layout;

//观光车票务管理组件
function TicketManagement (props) {
  const [list, setList] = useState([])                     // 票务列表
  const [visible, setVisible] = useState(false)           // 添加票务的Modal显示与否
  const [nextVisible, setNextVisible] = useState(false)   // 选择线路后的下一步
  const [ticketData, setTicketData] = useState([])        // 编辑票务时要回填的数据
  const [editVisible, setEditVisible] = useState(false)   // 编辑的弹框显示与否
  const [lineList, setLineList] = useState([])            // 线路列表
  const [pagination, setPagination] = useState({})

  // 票务表头
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      align: 'center',
      width: '4%',
      render: (text, record, index) => {
        return index + 1
      }
    },
    {
      title: '票务',
      dataIndex: 'name',
      key: 'name',
      width: '15%',
    },
    {
      title: '线路',
      dataIndex: 'routeName',
      key: 'routeName',
      width: '15%',
    },
    {
      title: '站点',
      dataIndex: 'stationName',
      key: 'stationName',
      width: '15%',
    },
    {
      title: '单价',
      dataIndex: 'prices',
      key: 'prices',
      align: 'center',
      width: '5%',
      render: (text, record) => (
        <div>
          {
            record.orderProducts.length === 0 ?
              <span>￥{record.adultPrice}</span> : '/'
          }
        </div>
      )
    },
    {
      title: '可使用积分',
      dataIndex: 'coin',
      key: 'coin',
      align: 'center',
      width: '10%',
      render: (text, record) => (
        <div>
          {
            record.orderProducts.length === 0 ?
              <span>{record.coin}</span> : '/'
          }
        </div>
      )
    },
    {
      title: '提成比例',
      dataIndex: 'ticheng',
      key: 'ticheng',
      align: 'center',
      width: '10%',
      render: (text, record) => (
        <div>
          {
            record.orderProducts.length === 0 ?
              <span>{record.proportion}%</span> : '/'
          }
        </div>
      )
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: '15%',
    },
    {
      title: '操作',
      dataIndex: 'id',
      key: 'Operate',
      align: 'center',
      width: '10%',
      render: (text, record) => (
        <div className="operation">
          <span className='operate'>
            <a
              data-list={JSON.stringify(record.orderProducts)}  // 规格票集合
              data-id={record.id} 															// 单行数据id
              data-ticketdescribe={record.description}					// 票务描述
              data-linename={record.routeName}									// 线路名称
              data-stationname={record.stationName}							// 站点名称
              data-price={record.adultPrice}										// 普通票单价
              data-ticket={record.name}													// 票务名称
              data-coin={record.coin}														// 可使用旅行币
              data-ticheng={record.proportion}									// 提成比例
              data-start={record.startStationId}								// 起始站点id
              data-end={record.endStationId}										// 终点站点id
              data-routeid={record.routeId}											// 线路id
              onClick={onGetEditData}
            >编辑&nbsp;&nbsp;</a>
          </span>
          <span className='operate'>
            <a data-id={record.id} data-list={JSON.stringify(record.orderProducts)} onClick={onDelete} >删除</a>
          </span>
        </div>
      ),
    }
  ]

  // 首次加载数据
  useEffect(() => {
    getTicketList()
    handleGetLineList()
  }, [])

  useEffect(() => {
    setVisible(props.visible)
  }, [props.visible]) 

  // 编辑票务
  function onGetEditData(e) {
    let ticketData = {
      id: e.currentTarget.dataset.id,
      ticketDescribe: e.currentTarget.dataset.ticketdescribe,
      lineName: e.currentTarget.dataset.linename,
      stationName: e.currentTarget.dataset.stationname,
      ticket: e.currentTarget.dataset.ticket,
      coin: e.currentTarget.dataset.coin,
      price: e.currentTarget.dataset.price,
      ticheng: e.currentTarget.dataset.ticheng,
      start: e.currentTarget.dataset.start,
      end: e.currentTarget.dataset.end,
      routeId: e.currentTarget.dataset.routeid,
      specList: JSON.parse(e.currentTarget.dataset.list)
    }
    e.preventDefault();
    setTicketData(ticketData)
    setEditVisible(true)
  }

  let params = {
    page: 1,
    pageSize: 10
  }

  //请求票务列表的方法
  function getTicketList() {
    let _this = this;
    let data = {
      scenicId: 1
    };
    params = {
      ...data,
      ...params
    }
    let parameter = {
      _this: _this,                               // 绑定住this
      url: '/sightseeing/getOrderProduct',        // 请求地址
      params: params,                             // 请求时的参数
      method: 'POST',                             // 请求方法
      // list: 'list',                            // 返回数据时写入state对象的属性，默认值为'list'
      // isShowLoading: true,                     // 是否显示loadding
      isMock: false,                              // 是否请求mock接口
      pages: { showQuickJumper: true, showSizeChanger: false, size: 'small' }, // 控制分页组件显示
    }
    axios.ajax(parameter).then(data => {
      if (data.errorCode === 200) {
        setList(data.data.data)
        setPagination(Utils.pagination(_this, data.data, parameter.pages, (current) => {
          params.page = current;
          request();
        }))
      }
      else {
        Modal.info({
          title: '提示',
          content: '网络出错，请刷新重试或联系相关工作人员',
        })
      }
    })
  }

  //获取线路列表
  function handleGetLineList() {
    let params = {
      scenicId: 1,
      page: 1,
      pageSize: 9999
    };
    let parameter = {
      url: '/sightseeing/routeS', // 请求地址
      params: params, // 请求时的参数
      method: 'POST', // 请求方法
      isMock: false, // 是否请求mock接口
    }
    axios.ajax(parameter).then((response) => {
      setLineList(response.data.data)
    }).catch((response) => { }); // 发起请求
  }

  // 删除票务
  function onDelete(e) {
    var deleteList = []
    var list = JSON.parse(e.currentTarget.dataset.list)
    var ticketId = e.currentTarget.dataset.id
    if (ticketId !== undefined) {
      deleteList.push(ticketId)
    }
    else {
      list.map((item, index) => {
        deleteList.push(item.id)
      })
    }
    //请求删除接口
    let params = {
      scenicId: 1,
      ids: deleteList.toString()
    };
    let parameter = {
      url: '/sightseeing/updateOrderProduct', // 请求地址
      params: params, // 请求时的参数
      method: 'POST', // 请求方法
      isMock: false // 是否请求mock接口
    }
    axios.ajax(parameter).then((response) => {
      if (response.errorCode == 200) {
        getTicketList()
        Modal.info({
          content: '删除成功！'
        })
      }
      else {
        Modal.info({
          content: '删除失败！'
        })
      }
    })
  } 

  // 点击展开的数据
  function onExpandedRowRender(expandedRows) {
    // 展开数据的表头
    const columns = [
      {
        title: '规格',
        dataIndex: 'name',
        key: 'name',
        width: '25%',
        render: (text, record, index) => {
          return (
            <div className={styles.spec_name}>
              <span type="" style={{ height: '6px', width: '6px', borderRadius: '50%', background: '#ff9212', marginRight: '3px' }}></span>
              {record.name}
            </div>
          )
        }
      },
      {
        title: '单价',
        dataIndex: 'adultPrice',
        key: 'adultPrice',
        width: '25%',
        render: (text, record, index) => {
          return (
            <span>￥{record.adultPrice}</span>
          )
        }
      },
      {
        title: '可使用积分',
        dataIndex: 'coin',
        key: 'coin',
        width: '25%'
      },
      {
        title: '提成比例',
        dataIndex: 'proportion',
        key: 'proportion',
        width: '25%',
        render: (text, record, index) => {
          return (
            <span>{record.proportion}%</span>
          )
        }
      }
    ];

    return (
      <Table
        columns={columns}
        dataSource={expandedRows.orderProducts}
        rowKey={(r, i) => (i)}
        pagination={false}
      />
    );
  };

  // 确定选择的线路
  function onCreate(e) {
    setVisible(false)
    setNextVisible(true)
    props.showModal()
  };

  // 取消选择线路
  function onCancel(e) {
    setVisible(false)
    props.showModal()
  };

  return (
    <Content id='sightseeingcarticket'>

      {/* 票务列表 */}
      <Table
        columns={columns}
        dataSource={list}
        rowKey={(r, i) => (i)}
        expandedRowRender={onExpandedRowRender}
        pagination={pagination} // 分页选项
        expandIcon={CustomExpandIcon}
      />

      {/* 选择线路的组件 */}
      <ChooseLineForm
        destroyOnClose={true}                              // 关闭时销毁 Modal 里的子元素
        visible={visible}                                  // 弹框显示与否
        onCreate={onCreate}                                // 新建一条数据
        onCancel={onCancel}                                // 关闭弹出框
        lineList={lineList}                                // 线路列表
      />

      {/* 添加票务的组件 */}
      <TicketMessage
        destroyOnClose={true}                         // 关闭时销毁 Modal 里的子元素
        visible={nextVisible}
        onCancel={() => setNextVisible(false)}
        onAdd={() => setNextVisible(false)}
        requestList={getTicketList}
      />

      {/* 编辑票务的组件 */}
      <EditTicket
        destroyOnClose={true}                         // 关闭时销毁 Modal 里的子元素
        visible={editVisible}
        data={ticketData}
        cancelEdit={() => setEditVisible(false)}
        edit={() => setEditVisible(false)}
        requestList={getTicketList}
      />
    </Content>
  )
	
}

export default TicketManagement;
