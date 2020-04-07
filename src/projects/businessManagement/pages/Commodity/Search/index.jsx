import React, { useState } from 'react'
import { Button, Input, Modal, Select } from 'antd';
import { router, connect } from 'dva'

import styles from './index.module.scss'

const ButtonGroup = Button.Group;
const { Search: InputSearch } = Input;
const { Option } = Select;

const { Link, withRouter } = router

/**
 * 商品管理的状态搜索栏部分
 * @param {object} props 
 */
function Search(props) {
  const { 
    onChange,               // 搜索栏值的改变（并不会触发搜索值的改变）
    onSearch,               // 搜索事件
    shelfStatus,            // 上下架状态
    inputProductName,       // 搜索值（发生搜索）
    upperAndLowerShelves,   // 上下架事件
    match,                  
    classification,         // 商品分类
    settingProductType,     // 设置商品分类
    selectedRowKeys         // tabel多选框的值
  } = props

  const [isShowModalOfType, toggleModalOfTypeStatus] = useState(false) // 是否显示分类的Modal
  const [productType, changeProductType] = useState('') // 改变商品的分类

  const prefix = 'search';

  /**
   * 展示Modal
   * @param {object} e 事件对象 
   */
  function showModalOfType (e) {
    e.stopPropagation();
    if (selectedRowKeys.length === 0) {
      Modal.info({
        content: '未选择任何商品'
      })
      return;
    }
    toggleModalOfTypeStatus(true)
  }

  // Modal取消事件
  function onCancelShowModalOfType (e) {
    e.stopPropagation();
    changeProductType('')
    toggleModalOfTypeStatus(false)
  }

  // Modal确认事件
  function onOkShowModalOfType (e) {
    e.stopPropagation();
    settingProductType(productType)
    changeProductType('')
    toggleModalOfTypeStatus(false)
  }

  // 改变商品分类
  function onChangeType(value) {
    changeProductType(value)
  }

  // 改变搜索值
  function changeProductName (e) {
    onChange(e.target.value)
  }

  return (
    <div className={styles[`${ prefix }`]}>
      <Button type="primary" className={styles[`${ prefix }__btn-new`]}>
        <Link to={`${match.url}/New`}>+ 新建商品</Link>
      </Button>
      <span className={styles[`${ prefix }__text`]}>
        批量操作： 
      </span>
      <ButtonGroup>
        <Button onClick={showModalOfType}>
          设置分类
        </Button>
        <Button onClick={upperAndLowerShelves} data-type='multiple'>
          {
            shelfStatus === '1' ? '上架' : '下架'
          }
        </Button>
      </ButtonGroup>
      <InputSearch
        placeholder="商品名称"
        onSearch={onSearch}
        className={styles[`${ prefix }__input-search`]}
        value={inputProductName}
        onChange={changeProductName}
      />
      <Modal
        title="批量设置分类"
        visible={isShowModalOfType}
        onCancel={onCancelShowModalOfType}
        onOk={onOkShowModalOfType}
        okText='保存'
        cancelText='取消'
        bodyStyle={{height: 200, textAlign: 'center'}}
        centered={true}
      >
        商品分类：
        <Select value={productType} style={{ width: 200 }} onChange={onChangeType}>
          {
            classification.length > 0 && classification.map((item) => {
              return <Option value={item.id} key={item.id}>{item.classificationName}</Option>
            })
          }
        </Select>
      </Modal>
    </div>
  )
}

const mapStateToProps = ({ businessManagement_commodity: data }) => {
  const { classification } = data;
  return { classification }
}

export default connect(mapStateToProps)(withRouter(Search))