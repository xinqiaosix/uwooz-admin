import React, {useState, useEffect} from 'react';
import { connect } from 'dva'
import {
  Steps,
  Button,
} from 'antd';
import styles from './index.module.scss'
import SelectProductCategory from './SelectProductCategory'
import EditProductDetails from './EditProductDetails'
import PublishGoods from './PublishGoods'
import BaseButton from '@/components/BaseButton'

const { Step } = Steps;

/**
 * 新建或编辑商品
 * @param {object} props 参数
 */
function NewCommodity (props) {
  const [stepsCurrent, changeStepsCurrent] = useState(0)
  const [isCheck, changeCheckStatus] = useState(false)
  const { history, match, location, dispatch, commodityListData, operatingState, commodityListItem } = props;

  // 取消按钮事件
  function onCancel () {
    // 当历史记录大于2时，直接历史回退，其它情况通过地址返回
    if (history.length > 2) {
      history.goBack()
    } else {
      let path = match.url.split('/');
      if (operatingState === 'New') {
        path.pop();
      } else {
        path = path.slice(0, -2)
      }
      path = path.join('/');
      if(location.search) {
        path = `${path}${location.search}`
      }
      history.push(path);
    }
    dispatch({
      type: 'businessManagement_commodity/reset'
    })
  }

  // 改变步骤进度
  function changeStep () {
    changeStepsCurrent(0)
  }

  // 保存按钮事件，触发必填项检查
  function onSave () {
    changeCheckStatus(true)
  }

  // 当类型为编辑获取数据进行数据的赋值
  useEffect(() => {
    if(match.params.type === 'Edit') {
      if (!commodityListData.data) {
        dispatch({
          type: 'businessManagement_commodity/changeOperatingState',
          data: 'Edit'
        })
        dispatch({
          type: 'businessManagement_commodity/getCommodityListItem',
          params: {
            goodsNumber: match.params.goodsNumber
          }
        })
      } else {
        dispatch({
          type: 'businessManagement_commodity/changeOperatingState',
          data: 'Edit'
        })
        const data = commodityListData.data && commodityListData.data.find((item) => {
          return item.goodsNumber === match.params.goodsNumber
        })
        dispatch({
          type: 'businessManagement_commodity/changeCommodityListItem',
          data: data
        })
      }
    } else {
      dispatch({
        type: 'businessManagement_commodity/changeOperatingState',
        data: 'New'
      })
    }
  }, []) // eslint-disable-line

  // 编辑时将数据进行处理之后回填
  useEffect(() => {
    if(match.params.type === 'Edit') {
      let sku = [];
      const {
        productName,
        goodsNumber,
        adultPrice,
        merchantId,
        quantity,
        description,
        typeId,
        categoryId,
        classificationId,
        details,
        afterThat,
        video,
        inventoryStyle,
        refundStyle,
        state,
        distribution,
        theFreight,
        productSkus,
        combination,
        productUrlS,
        courierDelivery,
        theDoorToThe,
        id,
      } = commodityListItem;
      combination && JSON.parse(combination).forEach((item, index) => {
        switch(index){
          case 0:
            sku.push({});
            sku[0].name = item.name;
            sku[0].values = item.item;
            sku[0].prices = [];
            sku[0].codings = [];
            sku[0].itemStocks = [];
            break;
          case 1:
            sku[0].images = item.item;
            break;
          default:
            break;
        }
      })
      productSkus && productSkus.forEach((item, index) => {
        sku[0].prices.push(JSON.parse(item.sku).price)
        sku[0].codings.push(item.barCode)
        sku[0].itemStocks.push(item.inventory)
      })

      const specificationList = {
        id,
        productSpecifications: sku,
        productName: productName,
        commodityCode: goodsNumber,
        unifiedPrice: adultPrice,
        stock: quantity,
        introduction: description,
        reduceInventoryMethod: inventoryStyle && inventoryStyle.toString(),
        isRefund: refundStyle === 0 || refundStyle === '0',
        fileList: (productUrlS && JSON.parse(productUrlS)) || [],
        freight: distribution === 0 ? theFreight : '',
        shippingTemplate: distribution !== 0 ? theFreight : '',
        freightType: distribution && distribution.toString(),
        deliveryMethod: [courierDelivery === 0 ? '0' : '', theDoorToThe === 0 ? '1' : '']
      }
      const productDetails = {
        productDetail: details,
        instruction: afterThat,
        videoUrl: video,
      }
      const classificationOfGoods = {
        business: merchantId,
        productTypes: typeId,
        productCategories: classificationId,
        category: categoryId,
      }
      const isOnTheShelf = state;
      dispatch({
        specificationList,
        productDetails,
        classificationOfGoods,
        isOnTheShelf,
        type: 'businessManagement_commodity/dataBackfill',
      })
    }
  }, [commodityListItem]) // eslint-disable-line

  const prefix = 'newCommodity';
  return (
    <div className={styles[`${prefix}`]}>
      <div className={styles[`${prefix}-header`]}>
        <h2 className={`${styles[`${prefix}-header__title`]} clearfix`}>{operatingState === 'New' ? '新建' : '编辑' }商品</h2>
        <BaseButton type='secondary' onClick={onCancel} className={styles[`${prefix}-header__btn`]}>取消</BaseButton>
      </div>
      <div className={styles[`${prefix}-main`]}>
        <Steps current={stepsCurrent} className={styles[`${prefix}-main__steps`]}>
          <Step title='选择商品分类' />
          <Step title='编辑商品详情' />
          <Step title='发布商品' />
        </Steps>
        {
          stepsCurrent === 0 ? <SelectProductCategory changeStepsCurrent={changeStepsCurrent} />
          : 
            stepsCurrent === 1 ? <EditProductDetails isCheck={isCheck} changeCheckStatus={changeCheckStatus} changeStepsCurrent={changeStepsCurrent} />
          :
            stepsCurrent === 2 ?  <PublishGoods changeStepsCurrent={changeStepsCurrent} />
          :
            null
        }
      </div>
      {
        stepsCurrent === 1 
        ?
          <div className={styles[`${prefix}-operate`]}>
            <Button size='large' className={styles[`${prefix}-operate_prev`]} onClick={changeStep}>上一步</Button>
            <Button size='large' type='primary' className={styles[`${prefix}-operate_save`]} onClick={onSave}>保存</Button>
            {/* <Button>预览</Button> */}
          </div>
        :
          null
      }
    </div>
  )
}

const mapStateToProps = ({ businessManagement_commodity: data }) => {
  const { commodityListData, commodityListItem, operatingState } = data;
  return { commodityListData, commodityListItem, operatingState }
}

export default connect(mapStateToProps)(NewCommodity);