import * as commodityApi from 'businessManagement/api/commodity'

export default {
  // 商家管理 ———— 商品管理
  namespace: 'businessManagement_commodity',

  state: {
    // 来自接口
    commodityListData: [],              // 商品列表
    commodityListItem: {},              // 单个商品
    productTypes: [],                   // 商品类型
    categoryList: [],                   // 商品类目
    classification: [],                 // 商品分类
    merchantList: [],                   // 商家列表
    shippingTemplate: [],               // 运费模板
    // 页面操作
    operatingState: 'New',              // 操作类型（新建还是编辑）
    classificationOfGoods: {},          // 商品分类
    productDetails: {                   // 商品详情
      productDetail: null,              // 商品详情
      instruction: null                 // 售后说明
    },                 
    isOnTheShelf: 0,                    // 货物是否上架的状态
    specificationList: {                // 商品信息（普通项）
      productSpecifications: [],        // 商品规格
      productName: '',                  // 商品名称
      commodityCode: '',                // 商品编码
      introduction: '',                 // 商品简介
      fileList: [],                     // 商品图
      unifiedPrice: '',                 // 统一售价
      markingPrice: '',                 // 划线价
      costPrice: '',                    // 成本价
      stock: '',                        // 库存
      reduceInventoryMethod: '0',       // 减库存方式
      deliveryMethod: ['0'],            // 配送方式
      freightType: '0',                 // 运费模式
      freight: '',                      // 快递运费
      shippingTemplate: '',             // 快递运费模板
      isRefund: true                    // 是否可申请退款
    },
  },

  reducers: {
    // 数据回填
    dataBackfill(state, {
      specificationList,                // 商品信息数据
      productDetails,                   // 商品详情数据
      classificationOfGoods,            // 商品类型等数据
      isOnTheShelf                      // 是否上架
    }){
      const {
        specificationList: oldSpecificationList,
        productDetails: oldProductDetails,
        classificationOfGoods: oldClassificationOfGoods,
      } = state;
      return {
        ...state,
        specificationList: {
          ...oldSpecificationList,
          ...specificationList
        },
        productDetails: {
          ...oldProductDetails,
          ...productDetails
        },
        classificationOfGoods: {
          ...oldClassificationOfGoods,
          ...classificationOfGoods,
        },
        isOnTheShelf
      }
    },
    // 修改操作状态
    changeOperatingState(state, {
      data: operatingState
    }) {
      return {
        ...state,
        operatingState 
      }
    },
    // 修改商品列表
    changeCommodityListData(state, {
      data: commodityListData
    }) {
      return {
        ...state,
        commodityListData
      }
    },
    // 修改单个商品
    changeCommodityListItem(state, {
      data: commodityListItem
    }) {
      return {
        ...state,
        commodityListItem
      }
    },
    // 修改商品类型
    changeProductTypes(state, {
      data: productTypes
    }) {
      return {
        ...state,
        productTypes
      }
    },
    // 修改商品类目
    changeCategoryList(state, {
        data: categoryList
      }) {
      return {
        ...state,
        categoryList
      }
    },
    // 修改商品分类
    changeClassification(state, {
        data: classification
      }) {
      return {
        ...state,
        classification: classification.data ? classification.data : []
      }
    },
    // 修改运费模板
    changeShippingTemplate(state, {
        data: shippingTemplate
      }) {
      return {
        ...state,
        shippingTemplate
      }
    },
    // 修改商家列表
    changeMerchantList(state, {
        data: merchantList
      }) {
      return {
        ...state,
        merchantList
      }
    },
    // 修改商品的类型
    changeClassificationOfGoods(state, { action }) {
      const data = action.payload;
      const { classificationOfGoods } = state;
      return {
        ...state,
        classificationOfGoods : {
          ...classificationOfGoods,
          ...data
        }
      }
    },
    // 修改商品详情
    changeProductDetails(state, {
      action
    }) {
      const data = action.payload;
      const {
        productDetails
      } = state;
      return {
        ...state,
        productDetails: {
          ...productDetails,
          ...data
        }
      }
    },
    // 修改商品信息
    changeProductSettings(state, {
      action
    }) {
      const {
        payload: data,
        type
      } = action;
      const {
        specificationList
      } = state;
      // 如果类型为添加商品图片时
      if (type === 'addFile') {
        const fileList = specificationList.fileList || []
        return {
          ...state,
          specificationList: {
            ...specificationList,
            fileList: fileList.concat(data)
          }
        }
      }
      // 其它情况 
      else {
        return {
          ...state,
          specificationList: {
            ...specificationList,
            ...data
          }
        }
      }
    },
    // 修改上架状态
    changeShelfStatus(state, { action }) {
      const { payload } = action;
      return {
        ...state,
        ...payload
      }
    },
    // 修改商品规格
    changeSpecificationList(state, { action }) {
      let newProductSpecifications;
      let { specificationList:{ productSpecifications } } = state;
      let { specificationList } = state;
      const payload = action.payload || {};
      const {
        site,             // 仅有一级数组时使用
        firstSite,        // 二级数组的一级位置
        secondSite,       // 二级数组的二级位置
        name,             // 规格名
        value,            // 规格值，价格，库存，编码
        image             // 规格图片
      } = payload
      switch (action.type) {
        // 添加规格项
        case 'addSpecification':
          productSpecifications.push({
            name: '',
            values: [''],
            images: [''],
            prices: [''],
            itemStocks: [''],
            codings: ['']
          })
          newProductSpecifications = [].concat(productSpecifications);
          return {
            ...state,
            specificationList: {
              ...specificationList,
              productSpecifications: newProductSpecifications
            }
          }
        //删除规格项
        case 'removeSpecification':
          return {
            ...state,
            specificationList: {
              ...specificationList,
              productSpecifications: []
            }
          }
        // 添加规格值
        case 'addSpecificationValue':
          productSpecifications[site].values.push('')
          productSpecifications[site].images.push('')
          productSpecifications[site].prices.push('')
          productSpecifications[site].itemStocks.push('')
          productSpecifications[site].codings.push('')
          newProductSpecifications = [].concat(productSpecifications);
          return {
            ...state,
            specificationList: {
              ...specificationList,
              productSpecifications: newProductSpecifications
            }
          }
        // 移除规格值
        case 'removeSpecificationValue':
          productSpecifications[firstSite].values.splice(secondSite, 1);
          productSpecifications[firstSite].images.splice(secondSite, 1);
          productSpecifications[firstSite].prices.splice(secondSite, 1);
          productSpecifications[firstSite].itemStocks.splice(secondSite, 1);
          productSpecifications[firstSite].codings.splice(secondSite, 1);
          newProductSpecifications = [].concat(productSpecifications);
          return {
            ...state,
            specificationList: {
              ...specificationList,
              productSpecifications: newProductSpecifications
            }
          }
        // 修改规格名
        case 'changeSpecificationName':
          productSpecifications[site].name = name;
          newProductSpecifications = [].concat(productSpecifications);
          return {
            ...state,
            specificationList: {
              ...specificationList,
              productSpecifications: newProductSpecifications
            }
          }
        // 修改规格值
        case 'changeSpecificationValue':
          productSpecifications[firstSite].values.splice(secondSite, 1, value);
          newProductSpecifications = [].concat(productSpecifications);
          return {
            ...state,
            specificationList: {
              ...specificationList,
              productSpecifications: newProductSpecifications
            }
          }
        // 修改图片
        case 'changeSpecificationImage':
          productSpecifications[firstSite].images.splice(secondSite, 1, image);
          newProductSpecifications = [].concat(productSpecifications);
          return {
            ...state,
            specificationList: {
              ...specificationList,
              productSpecifications: newProductSpecifications
            }
          }
        // 修改价格
        case 'changeSpecificationPrice':
          productSpecifications[firstSite].prices.splice(secondSite, 1, value);
          newProductSpecifications = [].concat(productSpecifications);
          return {
            ...state,
            specificationList: {
              ...specificationList,
              productSpecifications: newProductSpecifications
            }
          }
        // 修改库存
        case 'changeSpecificationItemStock':
          productSpecifications[firstSite].itemStocks.splice(secondSite, 1, value);
          newProductSpecifications = [].concat(productSpecifications);
          return {
            ...state,
            specificationList: {
              ...specificationList,
              productSpecifications: newProductSpecifications
            }
          }
        // 修改编码
        case 'changeSpecificationCoding':
          productSpecifications[firstSite].codings.splice(secondSite, 1, value);
          newProductSpecifications = [].concat(productSpecifications);
          return {
            ...state,
            specificationList: {
              ...specificationList,
              productSpecifications: newProductSpecifications
            }
          }
        default:
          throw new Error('商品规格出错了');
      }
    },
    // 重置数据为空
    reset(state) {
      return {
        ...state,
        specificationList: {
          productSpecifications: [              // 商品规格
            // {
            //   name: '',                         // 规格名
            //   values: [''],                     // 规格值
            //   images: [''],                     // 规格图
            //   prices: [''],                     // 价格
            //   itemStocks: [''],                 // 库存
            //   codings: ['']                     // 编码
            // }
          ],
          productName: '',                      // 商品名称
          commodityCode: '',                    // 商品编码
          introduction: '',                     // 商品简介
          fileList: [],                         // 商品图
          unifiedPrice: '',                     // 统一售价
          markingPrice: '',                     // 划线价
          costPrice: '',                        // 成本价
          stock: '',                            // 库存
          reduceInventoryMethod: '0',           // 减库存方式
          deliveryMethod: ['0'],                // 配送方式
          freightType: '0',                     // 运费模式
          freight: '',                          // 快递运费
          shippingTemplate: '',                 // 快递运费模板
          isRefund: true                        // 是否可申请退款
        },
        operatingState: 'New',
        classificationOfGoods: {},              // 商品分类
        productDetails: {                       // 商品详情
          productDetail: null,                  // 商品详情
          instruction: null                     // 售后说明
        },
        isOnTheShelf: 0,                      // 货物是否上架的状态
      }
    }
  },

  effects: {
    // 获取商品列表
    * getCommodityListData({
      params
    }, {
      call,
      put,
      select
    }) {
      const accountId = yield select(state => state.app.user.accountId);
      const res = yield call(
        commodityApi.getCommodityListData, 
        {
          ...params,
          accountId
        }
      )
      yield put({
        type: 'changeCommodityListData',
        data: res.data
      })
    },

    // 获取单个商品的数据（编辑时使用）
    * getCommodityListItem({
      params
    }, {
      call,
      put,
      select
    }) {
      const accountId = yield select(state => state.app.user.accountId);
      const res = yield call(
        commodityApi.getCommodityListItem, 
        {
          ...params,
          accountId
        }
      )
      yield put({
        type: 'changeCommodityListItem',
        data: res.data
      })
    },

    // 获取商品类型
    * getProductTypes({
      params
    }, {
      call,
      put
    }) {
      const res = yield call(commodityApi.getProductTypes, params)
      yield put({
        type: 'changeProductTypes',
        data: res.data
      })
    },

    // 获取商品类目
    * getCategoryList({
      params
    }, {
      call,
      put
    }) {
      const res = yield call(commodityApi.getCategoryList, params)
      yield put({
        type: 'changeCategoryList',
        data: res.data
      })
    },

    // 获取商品分类
    * getClassification({
      params
    }, {
      call,
      put,
      select
    }) {
      const accountId = yield select(state => state.app.user.accountId);
      const res = yield call(
        commodityApi.getClassification, 
        {
          ...params,
          accountId
        }
      )
      yield put({
        type: 'changeClassification',
        data: res.data
      })
    },

    // 获取商家列表
    * getMerchant({
      params
    }, {
      call,
      put
    }) {
      const res = yield call(commodityApi.getMerchantList, params)
      yield put({
        type: 'changeMerchantList',
        data: res.data
      })
    },

    // 获取运费模板
    * getShippingTemplate({
      params
    }, {
      call,
      put,
      select
    }) {
      const accountId = yield select(state => state.app.user.accountId);
      const res = yield call(
        commodityApi.getShippingTemplate, {
          ...params,
          accountId
        }
      )
      yield put({
        type: 'changeShippingTemplate',
        data: res.data.data
      })
    },
  },

  subscriptions: {
    // 初始化时触发获取各类型列表数据
    setup({ dispatch, history }) {
      dispatch({
        type: 'getProductTypes',
      });
      dispatch({
        type: 'getCategoryList',
      });
      dispatch({
        type: 'getClassification',
      });
      dispatch({
        type: 'getMerchant',
      });
    },
  },
}
