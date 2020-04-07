import React from 'react';
import { connect } from 'dva'
import { Form, Modal } from 'antd'

import BasicInformation from './BasicInformation'
import ProductDetails from './ProductDetails'
import ProductSettings from './ProductSettings'
import styles from './index.module.scss'

// 编辑商品详情里的商品详情部分
class EditProductDetails extends React.PureComponent {
  
  formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 16 },
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      isCheck,
      changeStepsCurrent,
      changeCheckStatus,
      form
    } = this.props;
    // 当检查的状态改变并且检查状态为true时执行检查
    if (isCheck !== prevProps.isCheck && isCheck === true) {
      form.validateFields((err, values) => {
        let valueArray = new Set()
        for (let value in values) {
          if(value.includes('value')){
            if(valueArray.has(values[value])) {
              Modal.warning({
                content: '规格值不能相同！'
              })
              return;
            } else {
              valueArray.add(values[value])
            }
          }
        }
        if (!err) {
          changeStepsCurrent(2)
          changeCheckStatus(false)
        } else {
          // form.setFields({
          //   'coding-0': {
          //     value: '11111',
          //     errors: [new Error('请填写商品规格的编码！')],
          //   },
          // })
          Modal.warning({
            content: '有必填项未填写',
          })
        }
      });
    }
  }

  render() {
    const { 
      productTypes,
      categoryList,
      classification,
      merchantList,
      classificationOfGoods,
      fileList,
      form,
      specificationList
    } = this.props;

    const productTypeItem = productTypes.find((item) => {
      return item.id === classificationOfGoods.productTypes
    })
    const categoryListItem = categoryList.find((item) => {
      return item.id === classificationOfGoods.category
    })
    const classificationItem = classification.find((item) => {
      return item.id === classificationOfGoods.productCategories
    })
    const merchantListItem = merchantList.data && merchantList.data.find((item) => {
      return item.merchantId === classificationOfGoods.business
    })

    const prefix = "editProductDetails";
    return (
      <div className={styles[`${prefix}`]}>
        <div className={styles[`${prefix}-product-type`]}>
          <h2 className={styles[`${prefix}-product-type__title`]}>
            商品类型：
            {
              productTypeItem && productTypeItem.name
            }
          </h2>
          <div className={styles[`${prefix}-product-type__son`]}>
            <span>
              商品类目：
              {
                categoryListItem && categoryListItem.categoryName
              }
            </span>
            <span>
              商品分类：
              {
                classificationItem && classificationItem.classificationName
              }
            </span>
            <span>
              商家：
              {
                merchantListItem && merchantListItem.merchantName
              }
            </span>
          </div>
        </div>
        <Form 
          {...this.formItemLayout}
          hideRequiredMark={true}
          className={styles[`${prefix}-form`]}
        >
          <BasicInformation 
            fileList={fileList}
            form={form}
          />
          <ProductDetails/>
          <ProductSettings 
            specificationList={specificationList}
            form={form}
          />
        </Form>
      </div>
    )
  }
}

const mapStateToProps = ({ businessManagement_commodity: state }) => {
  const { 
    productTypes, 
    categoryList, 
    classification, 
    merchantList, 
    classificationOfGoods,
    specificationList,
  } = state;
  const fileList = specificationList.fileList || [];
  return { 
    productTypes, 
    categoryList, 
    classification, 
    merchantList, 
    classificationOfGoods,
    specificationList,
    fileList,
  }
}

const Edit = connect(mapStateToProps)(Form.create({
  mapPropsToFields(props) {
    const { specificationList } = props;
    const {
      productName, 
      commodityCode, 
      introduction,
      unifiedPrice,
      markingPrice,
      costPrice,
      stock,
      reduceInventoryMethod,
      deliveryMethod,
      freightType,
      freight,
      shippingTemplate,
      isRefund,
    } = specificationList;

    // 将商品规格部分的数据进行处理进行回填
    const productSpecifications = specificationList.productSpecifications.reduce((acc, item, index1) => {
      acc[`name-${index1}`] = Form.createFormField({
        value: item.name
      })
      const values = item.values.reduce((acc, item, index2) => {
        acc[`value-${index1}-${index2}`] = Form.createFormField({
          value: item
        })
        return acc;
      }, {})
      const prices = item.prices.reduce((acc, item, index2) => {
        acc[`price-${index2}`] = Form.createFormField({
          value: item
        })
        return acc;
      }, {})
      const itemStocks = item.itemStocks.reduce((acc, item, index2) => {
        acc[`itemStock-${index2}`] = Form.createFormField({
          value: item
        })
        return acc;
      }, {})
      const codings = item.codings.reduce((acc, item, index2) => {
        acc[`coding-${index2}`] = Form.createFormField({
          value: item
        })
        return acc;
      }, {})
      acc = {
        ...acc,
        ...values,
        ...prices,
        ...itemStocks,
        ...codings
      }
      return acc;
    }, {})

    // 普通数据的回填
    const productSettings = {
      productName: Form.createFormField({
        value: productName
      }),
      commodityCode: Form.createFormField({
        value: commodityCode
      }),
      introduction: Form.createFormField({
        value: introduction
      }),
      unifiedPrice: Form.createFormField({
        value: unifiedPrice
      }),
      markingPrice: Form.createFormField({
        value: markingPrice
      }),
      costPrice: Form.createFormField({
        value: costPrice
      }),
      stock: Form.createFormField({
        value: stock
      }),
      reduceInventoryMethod: Form.createFormField({
        value: reduceInventoryMethod.toString()
      }),
      deliveryMethod: Form.createFormField({
        value: deliveryMethod
      }),
      freightType: Form.createFormField({
        value: freightType.toString()
      }),
      freight: Form.createFormField({
        value: freight
      }),
      shippingTemplate: Form.createFormField({
        value: shippingTemplate
      }),
      isRefund: Form.createFormField({
        value: isRefund,
      }),
    }

    return {
      ...productSpecifications,
      ...productSettings
    };
  },
  onValuesChange(props, values) {
    props.changeCheckStatus(false)
    const keys = Object.keys(values);
    keys.forEach((item, index) => {
      const arr = item.split('-');
      // 当控件为规格名时
      if (arr[0] === 'name') {
        props.dispatch({
          type: 'businessManagement_commodity/changeSpecificationList',
          action: {
            type: 'changeSpecificationName',
            payload: {
              name: values[item],
              site: arr[1]
            }
          }
        })
      }
      // 当控件为规格值时
      else if (arr[0] === 'value') {
        props.dispatch({
          type: 'businessManagement_commodity/changeSpecificationList',
          action: {
            type: 'changeSpecificationValue',
            payload: {
              value: values[item],
              firstSite: arr[1],
              secondSite: arr[2],
            }
          }
        })
      }
      // 价格，库存，和编码暂时仅支持单规格 
      else if (arr[0] === 'price') {
        props.dispatch({
          type: 'businessManagement_commodity/changeSpecificationList',
          action: {
            type: 'changeSpecificationPrice',
            payload: {
              value: values[item],
              firstSite: 0,
              secondSite: arr[1],
            }
          }
        })
      } 
      else if (arr[0] === 'itemStock') {
        props.dispatch({
          type: 'businessManagement_commodity/changeSpecificationList',
          action: {
            type: 'changeSpecificationItemStock',
            payload: {
              value: values[item],
              firstSite: 0,
              secondSite: arr[1],
            }
          }
        })
      } else if (arr[0] === 'coding') {
        props.dispatch({
          type: 'businessManagement_commodity/changeSpecificationList',
          action: {
            type: 'changeSpecificationCoding',
            payload: {
              value: values[item],
              firstSite: 0,
              secondSite: arr[1],
            }
          }
        })
      } else if (arr[0] === 'image') {
        console.log('图片不应该再从这里过')
      } else {
        props.dispatch({
          type: 'businessManagement_commodity/changeProductSettings',
          action: {
            payload: values
          }
        })
      }
    })
  },
})(EditProductDetails));

export default Edit