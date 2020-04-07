import React, { useState, useEffect, useRef } from 'react';
import { connect, router } from 'dva'
import { Table, Tabs, Modal } from 'antd';
import QRCode from 'qrcode.react';
import BaseButton from '@/components/BaseButton'

import styles from './index.module.scss';
import { changeAndSetProduct } from 'businessManagement/api/commodity';
import Header from './Header/index'
import Search from './Search/index'

const { Link } = router
const { TabPane } = Tabs;

/**
 * 商品管理
 * @param {object} props 参数
 */
function Commodity (props) {
  const { 
    dispatch, 
    commodityListData, // 商品列表数据
    match, 
    location 
  } = props;

  const page = location.search && parseInt(location.search.split('=')[1]) // 获取页面当前页数的参数

  // 关于状态问题，目前以下状态是直接保存在组件内的，当组件被切换时会被删除
  // 如果需要在其它组件切换至当前组件要保留的状态，需要转到redux中
  const [merchant, setMerchant] = useState('')                  // 商家
  const [shelfStatus, setShelfStatus] = useState('0')           // 上下架状态
  const [searchValue, setSearchValue] = useState('')            // 商家名搜索值
  const [inputProductName, setInputProductName] = useState('')  // 商家名输入值
  const [priceSort, setPriceSort] = useState(0)                 // 价格排序
  const [selectedRowKeys, setSelectedRowKeys] = useState('')    // table选中项的id
  const [isLoading, toggleLoading] = useState(false)            // 是否显示lodding
  const [current, setCurrent] = useState(page || 1)             // 分页控件参数
  const [isQRcodeVisible, changeQRcodeVisible] = useState(false)// 二维码弹出框是否显示
  const [productInfo, setproductInfo] = useState({})            // 商品二维码

  const prevSort = useRef(undefined)                            // 存储价格排序的状态用于对比
  const isFirst = useRef(0)                                     // 用于判断是否为第一次渲染
  
  // 分页组件的参数（具体查看antd文档）
  const pagination = {
    current: current,
    total: commodityListData.total,
    showTotal: total => `总共 ${total} 件商品`,
    pageSize: 10,
    onChange: changePagination
  }

  // tabel表格关于列的参数
  const columns = [
    {
      title: '商品',
      align: 'center',
      dataIndex: 'productName',
      width: 260,
      render: (item, record, index) => {
        return (
          <React.Fragment>
            <span className={styles['imgWrap']}>
              <img src={record.picture} alt="" />
            </span>
            <span>{record.productName}</span>
          </React.Fragment>
        )
      }
    },
    {
      title: '价格',
      align: 'center',
      sorter: true,
      dataIndex: 'adultPrice',
      render: (text) => {
        return (
          <span>￥{text}</span>
        )
      }
    },
    {
      title: '分类',
      align: 'center',
      dataIndex: 'classificationName',
    },
    {
      title: '类型',
      align: 'center',
      dataIndex: 'typeName',
    },
    {
      title: '库存',
      align: 'center',
      dataIndex: 'quantity',
    },
    {
      title: '商家',
      align: 'center',
      dataIndex: 'merchantCore',
      render: (item) => {
        return item && item.merchantName
      }
    },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'operate',
      render: (text, record, index) => {
        return (
          <React.Fragment>
            <Link to={`${match.url}/Edit/${record.goodsNumber}?page=${pagination.current}`}>编辑 </Link>
            <span className={styles['link']} onClick={showQR} data-id={record.goodsNumber} data-product-name={record.productName} data-merchant-id={record.merchantId}>商品码 </span>
            <span className={styles['link']} onClick={upperAndLowerShelves} data-id={record.id}>{shelfStatus === '1' ? '上架' : '下架'}</span>
          </React.Fragment>
        )
      }
    },
  ];

  // tabel表格关于行的参数
  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys)
    },
    selectedRowKeys: selectedRowKeys
  };

  // 将tabel表格的数据进行预处理
  const dataSource = commodityListData.data && commodityListData.data.map((item, index) => {
    item.key = item.id;
    return item;
  })

  // 当选择框商家改变时重置上下架状态，清空搜索框的输入内容和搜索值（搜索值和输入值的关系为点击搜索时会将输入值赋给搜索值），
  useEffect(() => {
    setShelfStatus('0');
    setSearchValue('');
    setInputProductName('');
  }, [merchant])

  // 当上下架状态改变时清空搜索框的输入内容和搜索值
  useEffect(() => {
    setSearchValue('');
    setInputProductName('');
  }, [shelfStatus])

  // 当商家，上下架状态，搜索框输入值，价格排序，表格页数发生变化时触发数据的重新获取
  useEffect(() => {
    getCommodityListData()
  }, [merchant, shelfStatus, searchValue, priceSort, current]) // eslint-disable-line

  // 当商家，上下架状态，搜索值发生变化时将表格页数重置为1，价格排序重置为默认排序
  useEffect(() => {
    if (isFirst.current !== 0){
      setCurrent(1)
      setPriceSort(0);
    }
  }, [merchant, shelfStatus, searchValue]) // eslint-disable-line

  // 当价格排序发生变化时重置表格页数为1
  useEffect(() => {
    if (isFirst.current !== 0) {
      setCurrent(1)
    } else {
      isFirst.current = 1
    }
  }, [priceSort]) // eslint-disable-line

  // 进入组件时重置表单数据，防止直接切换导致的bug
  useEffect(() => {
    dispatch({
      type: 'businessManagement_commodity/reset',
    })
  }, []) // eslint-disable-line

  // 获取表格数据
  async function getCommodityListData() {
    toggleLoading(true)
    await dispatch({
      type: 'businessManagement_commodity/getCommodityListData',
      params: {
        page: current,
        pageSize: pagination.pageSize,
        merchantId: merchant,
        state: shelfStatus,
        productName: searchValue,
        priceSorted: priceSort,
      }
    })
    // 重置表格多选框
    setSelectedRowKeys([]);
    toggleLoading(false)
  }

  /**
   * 修改当前表格页数，将页数放入地址栏的参数中（history直接操作不会导致页面刷新）
   * @param {number} page 页数
   * @param {number} pageSize 数量 
   */
  function changePagination (page, pageSize) {
    setCurrent(page)
    window.history.pushState('', '', `?page=${page}`)
  }

  /**
   * 分页、排序、筛选变化时触发
   * @param {object} pagination 分页参数
   * @param {object} filters 筛选条件
   * @param {object} sorter 排序
   */
  function onTableChange (pagination, filters, sorter) {
    if (prevSort.current === sorter.order) {
      return;
    }
    if (sorter.order === 'ascend') {
      setPriceSort(1)
    } else if (sorter.order === 'descend') {
      setPriceSort(2)
    } else {
      setPriceSort(0)
    }
    prevSort.current = sorter.order;
  }

  /**
   * 上下架商品
   * @param {object} e 事件对象
   */
  async function upperAndLowerShelves (e) {
    try {
      let ids;
      // 是否为多选
      if(e.target.dataset.type === 'multiple') {
        if (selectedRowKeys.length === 0) {
          Modal.info({
            content: '未选择任何商品'
          })
          return;
        }
        ids = selectedRowKeys.join(',');
      } else {
        ids = e.target.dataset.id;
      }
      toggleLoading(true)
      await changeAndSetProduct({
        classificationId: '',
        state: shelfStatus === '0' ? '1' : '0',
        ids: ids
      })
      toggleLoading(false)
      Modal.success({
        content: shelfStatus === '0' ? '下架商品成功' : '上架商品成功'
      })
      getCommodityListData()
    } catch (error) {
      toggleLoading(false)
      Modal.error({
        content: error.message
      })
    }
  }

  /**
   * 设置商品分类
   * @param {string} type 类别
   */
  async function settingProductType (type) {
    try {
      if (selectedRowKeys.length === 0) {
        Modal.info({
          content: '未选择任何商品'
        })
        return;
      }
      const ids = selectedRowKeys.join(',');
      toggleLoading(true)
      await changeAndSetProduct({
        classificationId: type,
        ids: ids
      })
      toggleLoading(false)
      Modal.success({
        content: '标签设置成功'
      })
      getCommodityListData()
    } catch (error) {
      toggleLoading(false)
      Modal.error({
        content: error.message
      })
    }
  }

  // 显示商品二维码
  function showQR(e) {
    const {
      id: goodsNumber,
      productName,
      merchantId
    } = e.target.dataset
    setproductInfo({
      goodsNumber,
      productName,
      merchantId
    })
    changeQRcodeVisible(true)
  }

  // 隐藏商品二维码
  function hideQR() {
    changeQRcodeVisible(false)
  }

  // 下载二维码图片
  function exportCanvasAsPNG() {

    var canvasElement = document.getElementById('QRcode');

    var MIME_TYPE = "image/png";

    var imgURL = canvasElement.toDataURL(MIME_TYPE);

    var dlLink = document.createElement('a');
    dlLink.download = `商品：${productInfo.productName}的二维码`;
    dlLink.href = imgURL;
    dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(':');

    document.body.appendChild(dlLink);
    dlLink.click();
    document.body.removeChild(dlLink);
}

  const prefix = 'commodity'

  return (
    <div className={styles[`${prefix}`]}>
      <Header setValue={setMerchant}/>
      <main className={styles[`${prefix}-main`]}>
        <Tabs
          onChange={setShelfStatus}
          activeKey={shelfStatus}
        >
          <TabPane tab="出售中" key="0" />
          <TabPane tab="已下架" key="1" />
        </Tabs>
        <Search 
          onSearch={setSearchValue}
          selectedRowKeys={selectedRowKeys}
          shelfStatus={shelfStatus}
          inputProductName={inputProductName}
          onChange={setInputProductName}
          upperAndLowerShelves={upperAndLowerShelves}
          settingProductType={settingProductType}
        />
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={dataSource}
          pagination={pagination}
          onChange={onTableChange}
          loading={isLoading}
        />
      </main>
      <Modal
        title='商品收款码'
        centered={true}
        footer={null}
        visible={isQRcodeVisible}
        onCancel={hideQR}
        bodyStyle={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '10px 0 20px'
        }}
      >
        <p>扫描该二维码，可直接下单购买</p>
        <QRCode value={`https://mobile.uwooz.com/minApp/uwooz/?goodsNumber=${productInfo.goodsNumber}&merchantId=${productInfo.merchantId}`} size={1280} style={{width: 200, height: 200, margin:'20px 0 30px'}} id='QRcode'/>
        <BaseButton type='secondary' onClick={exportCanvasAsPNG}>下载二维码</BaseButton>
        <hr className={styles[`${prefix}-hr`]} />
        <BaseButton type='main' onClick={hideQR}>确定</BaseButton>
      </Modal>
    </div>
  )
}

const mapStateToProps = ({ businessManagement_commodity: data }) => {
  const { commodityListData } = data;
  return { commodityListData }
}

export default connect(mapStateToProps)(React.memo(Commodity))