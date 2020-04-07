import React from 'react';
import { Form, Radio, Button, Modal } from 'antd'
import { connect, router } from 'dva'
import styles from './index.module.scss'
import { newProduct, editProduct } from 'businessManagement/api/commodity';

const { withRouter } = router;

function PublishGoods (props) {
  const { 
    dispatch, 
    changeStepsCurrent, 
    isOnTheShelf,
    specificationList,
    productTypes,
    categoryList,
    merchantList,
    classificationOfGoods,
    productDetails,
    user,
    operatingState,
    history,
    match,
    location
  } = props;
  const { fileList, unifiedPrice, productName  } = specificationList;

  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
  };

  function changeStep () {
    changeStepsCurrent(1)
  }

  function onConfirm () {
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
  
  // 新建或编辑商品（调接口）
  async function onComplete () {
    let sku = {};
    let specificationKeys,
        JSONsku,
        JSONspecificationKeys,
        JSONproductUrlS;
    const accountId = user.accountId;
    const {
      productName,
      commodityCode,
      stock,
      introduction,
      reduceInventoryMethod,
      isRefund,
      freightType,
      freight,
      shippingTemplate,
      productSpecifications,
      fileList,
      deliveryMethod,
      unifiedPrice,
      id,
    } = specificationList;
    const {
      business,
      productTypes,
      productCategories,
      category
    } = classificationOfGoods;
    const {
      productDetail,
      instruction,
      videoUrl
    } = productDetails;

    // 判断是否有规格，无规格即传null
    if(productSpecifications.length > 0) {
      const {
        name,
        values,
        images,
        prices,
        itemStocks,
        codings
      } = productSpecifications[0];
      specificationKeys = [
        {
          name: name,
          item: values
        },
        {
          name: '图片',
          item: images
        }
      ]
      values.forEach((item, index) => {
        sku[item] = {
          price: prices[index],
          inventory: itemStocks[index],
          barCode: codings[index]
        }
      })
      JSONsku = JSON.stringify(sku);
      JSONspecificationKeys = JSON.stringify(specificationKeys).toString().replace(/\[/g, '%5B').replace(/\]/g, '%5D');
    } else {
      specificationKeys = null;
      sku = null
    }
    
    // 将商品规格和图片修改为JSON字符串
    if(fileList.length > 0) {
      JSONproductUrlS = JSON.stringify(fileList).toString().replace(/\[/g, '%5B').replace(/\]/g, '%5D');
    } else {
      JSONproductUrlS = null;
    }
  
    try {
      let res;
      if (operatingState === 'New') {
        res = await newProduct({
          accountId,
          productName: productName,
          adultPrice: unifiedPrice,
          goodsNumber: commodityCode,
          merchantId: business,
          quantity: stock,
          description: introduction,
          typeId: productTypes,
          categoryId: category,
          classificationId: productCategories,
          details: productDetail,
          afterThat: instruction,
          video: videoUrl,
          inventoryStyle: reduceInventoryMethod,
          refundStyle: isRefund ? 0 : 1,
          state: isOnTheShelf,
          distribution: freightType || 0,
          theFreight: (freightType === '0' || freightType === 0) ? (freight || 0) : (shippingTemplate || 0),
          sku: JSONsku,
          combination: JSONspecificationKeys,
          productUrlS: JSONproductUrlS,
          courierDelivery: deliveryMethod.indexOf('0') !== -1 ? 0 : 1,
          theDoorToThe: deliveryMethod.indexOf('1') !== -1 ? 0 : 1
        })
      } else {
        res = await editProduct({
          id,
          accountId,
          productName: productName,
          adultPrice: unifiedPrice,
          goodsNumber: commodityCode,
          merchantId: business,
          quantity: stock,
          description: introduction,
          typeId: productTypes,
          categoryId: category,
          classificationId: productCategories,
          details: productDetail,
          afterThat: instruction,
          video: videoUrl,
          inventoryStyle: reduceInventoryMethod,
          refundStyle: isRefund ? 0 : 1,
          state: isOnTheShelf,
          distribution: freightType,
          theFreight: (freightType === '0' || freightType === 0) ? freight : shippingTemplate,
          sku: JSONsku,
          combination: JSONspecificationKeys,
          productUrlS: JSONproductUrlS,
          courierDelivery: deliveryMethod.indexOf('0') !== -1 ? 0 : 1,
          theDoorToThe: deliveryMethod.indexOf('1') !== -1 ? 0 : 1
        })
      }
      if(res.errorCode === 200){
        Modal.success({
          content: `${operatingState === 'New' ? '新建' : '编辑'}商品成功`,
          onOk: onConfirm
        })
      } else {
        Modal.error({
          content: res.message
        })
      }
    } catch (error) {
      Modal.error({
        content: `${operatingState === 'New' ? '新建' : '编辑'}商品出错`
      })
    }
  }

  // 修改商品的上下架状态
  function changeShelfStatus (e) {
    dispatch({
      type: 'businessManagement_commodity/changeShelfStatus',
      action: {
        payload: {
          isOnTheShelf: e.target.value
        }
      }
    })
  }
  
  let url;

  // 当图片列表内有选择主图时显示主图，没有主图时显示第一张图片
  const img = fileList.find((item) => {
    return item.isMain
  })
  if(!img) {
    url = fileList.length > 0 && fileList[0].url
  } else {
    url = img.url
  }

  // 处理显示的商品分类名称
  const productTypeItem = productTypes.find((item) => {
    return item.id === classificationOfGoods.productTypes
  })
  const categoryListItem = categoryList.find((item) => {
    return item.id === classificationOfGoods.category
  })
  const merchantListItem = merchantList.data && merchantList.data.find((item) => {
    return item.id === classificationOfGoods.business
  })

  const prefix = 'publishGoods';
  return (
    <div className={styles[`${prefix}`]}>
      <h1>商品{operatingState === 'New' ? '新建' : '编辑'}成功</h1>
      <hr/>
      <div className={styles[`${prefix}-productList`]}>
        <div className={styles[`${prefix}-productList__item`]}>
          <div className={styles[`${prefix}-productList__item-left`]}>
            <span className={styles[`${prefix}-productList__item-img-wrap`]}>
              <img className={styles[`${prefix}-productList__item-img`]} src={url || ''} alt="" />
            </span>
            <span className={styles[`${prefix}-productList__item-title`]}>{productName}</span>
          </div>
          <div className={styles[`${prefix}-productList__item-right`]}>
            <span className={styles[`${prefix}-productList__item-type`]}> 
              {
                productTypeItem && productTypeItem.name
              } - 
              {
                categoryListItem && categoryListItem.categoryName
              }
            </span>
            <span className={styles[`${prefix}-productList__item-merchant`]}>
              {
                merchantListItem && merchantListItem.merchantName
              }
            </span>
            <span className={styles[`${prefix}-productList__item-price`]}>￥{unifiedPrice}</span>
          </div>
        </div>
      </div>
      <hr/>
      <Form {...formItemLayout} className={styles[`${prefix}-form`]}>
        <Form.Item label="上架时间" extra='如果暂不上架，可进入已下架商品中进行手动上架'>
          <Radio.Group value={isOnTheShelf} onChange={changeShelfStatus}>
            <Radio value={0}>立即上架</Radio>
            <Radio value={1}>暂不上架</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
      <div className={styles[`${prefix}-operate`]}>
        <Button size='large' className={styles[`${prefix}-operate_prev`]} onClick={changeStep}>上一步</Button>
        <Button size='large' type='primary' className={styles[`${prefix}-operate_save`]} onClick={onComplete}>完成</Button>
      </div>
    </div>
  )
}

const mapStateToProps = ({ businessManagement_commodity: state, app: { user } }) => {
  const { 
    isOnTheShelf, 
    specificationList,
    productTypes,
    categoryList,
    classification,
    merchantList,
    classificationOfGoods,
    productDetails,
    operatingState
  } = state
  return { 
    isOnTheShelf, 
    specificationList,
    productTypes,
    categoryList,
    classification,
    merchantList,
    classificationOfGoods,
    productDetails,
    user,
    operatingState
  }
}

export default withRouter(connect(mapStateToProps)(PublishGoods));