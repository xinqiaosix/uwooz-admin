import React, {useState, useEffect} from 'react';
import { 
  Form,
  Input,
  Icon,
  Row,
  Col,
  Upload,
  Radio,
  Checkbox,
  Select,
  Switch,
  Spin,
  message
} from 'antd'
import { connect } from 'dva'
import styles from './index.module.scss'

const { Option } = Select;

function ProductSettings (props) {
  const { 
    form, 
    dispatch,
    specificationList: {
      productSpecifications,
      freightType
    },
    shippingTemplate,
    classificationOfGoods: {
      category,
      productTypes
    }
  } = props;
  const { getFieldDecorator } = form;

  const [specificationTableBody, changeSpecificationTableBody] = useState('')  // 修改价格，库存，编码表格
  
  const formItemInputLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 8 },
  };
  const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

  const prefix2 = 'specification-form'
  const prefix3 = 'specification-table'
  const prefix = 'productSettings'

  // 增加规格项
  function addSpecification() {
    dispatch({
      type: 'businessManagement_commodity/changeSpecificationList',
      action: {
        type: 'addSpecification',
      }
    })
  }

  // 删除规格项
  function removeSpecification() {
    dispatch({
      type: 'businessManagement_commodity/changeSpecificationList',
      action: {
        type: 'removeSpecification',
      }
    })
  }
  
  // 添加规格值
  function addSpecificationValue(e) {
    dispatch({
      type: 'businessManagement_commodity/changeSpecificationList',
      action: {
        type: 'addSpecificationValue',
        payload: {
          site: e.currentTarget.dataset.site
        }
      }
    })
  }

  // 删除规格值
  function removeSpecificationValue(e) {
    dispatch({
      type: 'businessManagement_commodity/changeSpecificationList',
      action: {
        type: 'removeSpecificationValue',
        payload: {
          firstSite: e.currentTarget.dataset.first_site,
          secondSite: e.currentTarget.dataset.second_site,
        }
      }
    })
  }

  // function normFile(e) {
  //   // console.log('Upload event:', e);
  //   if (Array.isArray(e)) {
  //     return e;
  //   }
  //   return e && e.fileList;
  // }

  // 递归处理规格值数据，会将所有的子项都进行展开
  function recursiveData(data, site) {
    const flatData = data.map((item, index) => {
      const newSite = site ? `${site}-${index}` : index;
      return (
        <div className={styles[`${prefix3}-body__item`]} key={index}>
          <div className={styles[`${prefix3}-body__item-name`]}>{item.name}</div>
          <div className={styles[`${prefix3}-body__item-children`]}>
            {
              item.children.length > 0
                ?
                recursiveData(item.children, newSite)
                :
                <div className={styles[`${prefix3}-body__item-children__input-wrap`]}>
                  <Form.Item>
                    {getFieldDecorator(`price-${newSite}`, {
                      rules: [{ required: true, message: '请输入价格!' }],
                    })(
                      <Input className={styles[`${prefix3}-body__item-children__input`]} />,
                    )}
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator(`itemStock-${newSite}`, {
                      rules: [
                        { required: true, message: '请输入库存!' }
                      ],
                    })(
                      <Input className={styles[`${prefix3}-body__item-children__input`]} />,
                    )}
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator(`coding-${newSite}`, {
                      rules: [{ required: false, message: '请输入编码!' }],
                    })(
                      <Input className={`${styles[`${prefix3}-body__item-children__input`]} ${styles[`${prefix3}-body__item-children__input-coding`]}`} />,
                    )}
                  </Form.Item>
                </div>
            }
          </div>
        </div>
      )
    })
    return flatData;
  }

  // 限制上传文件的大小和类型
  function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    if (!isJpgOrPng) {
      message.error('图片格式只能是jpg或png');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过2M');
    }
    return isJpgOrPng && isLt2M;
  }

  // 当规格表单发生改变时，规格表也随之发生变动
  useEffect(() => {
    // 用于存储上一个项的值（prevValue），本值会存储每个层级组装完成的数据
    let oldSpecificationTableBody = [];
    // 复制一份值，因为reverse会修改原数组
    let cloneSpecificationList = [].concat(productSpecifications);
    // 颠倒数组的位置，实现多对一的组装
    cloneSpecificationList.reverse().forEach((item1, index1, arr) => {
      let newSpecificationTableBody = [];
      // 为每个项赋予相关值
      item1.values.forEach((item2, index2) => {
        newSpecificationTableBody[index2] = {
          parent: item1.name,
          name: item2,
          image: item1.images[index2],
          children: oldSpecificationTableBody,
        }
      })
      // 将新的项赋值给用于存储值的prevValue，用于作为子项的children
      oldSpecificationTableBody = [].concat(newSpecificationTableBody)
    })
    // 处理数据
    const data = recursiveData(oldSpecificationTableBody)
    // 将处理过后的数据赋给specificationTableBody值
    changeSpecificationTableBody(data)
  }, [productSpecifications]) // eslint-disable-line

  // 获取物流模板数据
  useEffect(() => {
    dispatch({
      type: 'businessManagement_commodity/getShippingTemplate'
    })
  }, []) // eslint-disable-line

  return (
    <div className={styles[`${prefix}`]}>
      <h2 className={styles[`${prefix}__title`]}>商品设置</h2>
      <div className={styles[`${prefix}__form`]}>
        <Form.Item label="统一售价" {...formItemInputLayout}>
          {getFieldDecorator('unifiedPrice', {
            rules: [{ required: true, message: '请输入统一售价!' }],
          })(
            <Input prefix="￥" />,
          )}
        </Form.Item>
        <Form.Item label="划线价" {...formItemInputLayout}>
          {getFieldDecorator('markingPrice', {
            rules: [{ required: false, message: '请输入划线价!' }],
          })(
            <Input prefix="￥" />,
          )}
        </Form.Item>
        <Form.Item label="成本价" {...formItemInputLayout}>
          {getFieldDecorator('costPrice', {
            rules: [{ required: false, message: '请输入成本价!' }],
          })(
            <Input prefix="￥" />,
          )}
        </Form.Item>
        <Form.Item label="商品规格">
          <div className={styles[`${prefix2}`]}>
            <Row gutter={8} className={styles[`${prefix2}-header`]}>
              <Col span={8} className={`${styles[`${prefix2}-header__name`]} ${styles[`${prefix2}-header__item`]}`}>规格名</Col>
              <Col span={8} className={`${styles[`${prefix2}-header__value`]} ${styles[`${prefix2}-header__item`]}`}>规格值</Col>
              <Col span={3} className={`${styles[`${prefix2}-header__image`]} ${styles[`${prefix2}-header__item`]}`}>规格图</Col>
              <Col span={3} className={`${styles[`${prefix2}-header__btn`]} ${styles[`${prefix2}-header__item`]}`}></Col>
            </Row>
            <div className={styles[`${prefix2}-body`]}>
              {
                productSpecifications.map((item, index1) => {
                  return (
                    <Row gutter={8} className={styles[`${prefix2}-body__item`]} key={index1}>
                      <Col span={8} className={styles[`${prefix2}-body__item-name`]}>
                        <Form.Item>
                          {getFieldDecorator(`name-${index1}`, {
                            rules: [{ required: true, message: '请输入规格名!' }],
                          })(
                            <Input />,
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={8} className={styles[`${prefix2}-body__item-value`]}>
                        {
                          item.values.map((item, index2) => {
                            return (
                              <Form.Item key={index2}>
                                {
                                  getFieldDecorator(`value-${index1}-${index2}`, {
                                    rules: [{ required: true, message: '请输入规格值!' }],
                                  })(
                                    <Input key={index2} />,
                                  )
                                }
                              </Form.Item>
                            )
                          })
                        }
                      </Col>
                      <Col span={3} className={styles[`${prefix2}-body__item-image`]}>
                        {
                          index1 === 0 ?
                            item.images.map((item, index2) => {
                              return (
                                <Upload
                                  key={index2}
                                  name="upfile"
                                  listType="text"
                                  data={{
                                    bucketName: 'productPictrue'
                                  }}
                                  beforeUpload={beforeUpload}
                                  onStart={(file) => {
                                    props.dispatch({
                                      type: 'businessManagement_commodity/changeSpecificationList',
                                      action: {
                                        type: 'changeSpecificationImage',
                                        payload: {
                                          image: 'loadding',
                                          firstSite: index1,
                                          secondSite: index2,
                                        }
                                      }
                                    })
                                  }}
                                  onSuccess={(file) => {
                                    props.dispatch({
                                      type: 'businessManagement_commodity/changeSpecificationList',
                                      action: {
                                        type: 'changeSpecificationImage',
                                        payload: {
                                          image: file.data.url,
                                          firstSite: index1,
                                          secondSite: index2,
                                        }
                                      }
                                    })
                                  }}
                                  onError={() => {
                                    props.dispatch({
                                      type: 'businessManagement_commodity/changeSpecificationList',
                                      action: {
                                        type: 'changeSpecificationImage',
                                        payload: {
                                          image: '',
                                          firstSite: index1,
                                          secondSite: index2,
                                        }
                                      }
                                    })
                                  }}
                                  disabled={item === 'loadding'}
                                  className={styles[`${prefix2}-body__item-image-uploader`]}
                                  showUploadList={false}
                                  action="https://api.uwooz.com/mxapi/uploade/source"
                                >
                                  <Spin indicator={antIcon} spinning={item === 'loadding'}>
                                    {
                                      item && item !== 'loadding' ?
                                      <img src={`${item}?x-oss-process=image/resize,h_100`} alt="product" style={{ width: 32, height: 32 }} />
                                      :
                                      <Icon type="picture" style={{ fontSize: 20, cursor: 'pointer' }} />
                                    }
                                  </Spin>
                                </Upload>
                              )
                            })
                            :
                            null
                        }
                      </Col>
                      <Col span={3} className={styles[`${prefix2}-body__item-btn`]}>
                        {
                          item.values.map((item, index2) => {
                            if (index2 === 0) {
                              return <Icon type="plus-circle" className={`${styles[`${prefix2}-body__item-btn-item`]} ${styles[`${prefix2}-body__item-btn_add`]}`} onClick={addSpecificationValue} data-site={index1} key={index2} />
                            } else {
                              return <Icon type="minus-circle" className={`${styles[`${prefix2}-body__item-btn-item`]} ${styles[`${prefix2}-body__item-btn_delete`]}`} onClick={removeSpecificationValue} data-first_site={index1} data-second_site={index2} key={index2} />
                            }
                          })
                        }
                      </Col>
                    </Row>
                  )
                })
              }
            </div>
            <div className={styles[`${prefix2}-footer`]}>
              {
                productSpecifications.length > 0 ?
                <div className={styles[`${prefix2}-footer__btn-add`]} onClick={removeSpecification}>
                  - 删除规格项
                </div>
                :
                <div className={styles[`${prefix2}-footer__btn-add`]} onClick={addSpecification}>
                  + 增加规格项
                </div>
              }
            </div>
          </div>
        </Form.Item>
        <Form.Item label="商品规格">
          <div className={styles[`${prefix3}`]}>
            <div className={styles[`${prefix3}-header`]}>
              {
                productSpecifications.map((item, index) => {
                  return <div className={`${styles[`${prefix3}-header__item`]}`} key={index}>{item.name}</div>
                })
              }
              <div className={`${styles[`${prefix3}-header__item`]}`} >*价格</div>
              <div className={`${styles[`${prefix3}-header__item`]}`} >*库存</div>
              <div className={`${styles[`${prefix3}-header__item`]} ${styles[`${prefix3}-header__item-coding`]}`} >编码</div>
            </div>
            <div className={styles[`${prefix3}-body`]}>
              {specificationTableBody}
            </div>
          </div>
        </Form.Item>
        <Form.Item label="库存" {...formItemInputLayout} extra='输入-1为无限库存，库存为0时，自动下架'>
          {getFieldDecorator('stock', {
            rules: [{ required: true, message: '请输入库存!' }],
          })(
            <Input />,
          )}
        </Form.Item>
        <Form.Item label="减库存方式">
          {getFieldDecorator('reduceInventoryMethod', {
            rules: [{ required: true, message: '请选择减库存方式!' }],
          })(
            <Radio.Group>
              <Radio value="0">拍下减库存</Radio>
              <Radio value="1">付款后减库存</Radio>
            </Radio.Group>,
          )}
        </Form.Item>
        {
          category === 2 || productTypes === 5 ?
            null
            :
            <>
              <Form.Item label="配送方式">
                {getFieldDecorator('deliveryMethod', {
                  rules: [{ required: true, message: '请选择配送方式!', type: 'array' }],
                })(
                  <Checkbox.Group>
                    <Checkbox value="0">快递发送</Checkbox>
                    <Checkbox value="1">上门自提</Checkbox>
                  </Checkbox.Group>,
                )}
              </Form.Item>
              <Form.Item label="快递运费">
                <Row gutter={16} className={styles[`${prefix}__form__item`]}>
                  <Col span={6}>
                    <Form.Item>
                      {getFieldDecorator('freightType', {
                        rules: [{ required: true, message: '请输入或选择快递运费!' }],
                      })(
                        <Radio.Group>
                          <Radio value="0">统一运费</Radio>
                          <Radio value="1">运费模板</Radio>
                        </Radio.Group>,
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={10}>
                    <Form.Item>
                      {getFieldDecorator('freight', {
                        rules: [{ required: freightType === '0' || freightType === 0, message: '请输入快递运费!' }],
                      })(
                        <Input prefix="￥" disabled={freightType === '1' || freightType === 1} />,
                      )}
                    </Form.Item>
                    <Form.Item>
                      {getFieldDecorator('shippingTemplate', {
                        rules: [{ required: freightType === '1' || freightType === 1, message: '请选择快递运费模板!' }],
                      })(
                        <Select placeholder="请选择快递运费模板" disabled={freightType === '0' || freightType === 0}>
                          {
                            shippingTemplate.map((item) => {
                              return <Option value={item.id} key={item.id}>{item.templateName}</Option>
                            })
                          }
                        </Select>,
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Form.Item>
            </>
        }
        <Form.Item label="可申请退款">
          {getFieldDecorator('isRefund', {
            valuePropName: 'checked'
          })(
            <Switch />,
          )}
        </Form.Item>   
      </div>
    </div>
  )
}

const mapStateToProps = ({ businessManagement_commodity: state }) => {
  const { shippingTemplate, classificationOfGoods } = state
  return { shippingTemplate, classificationOfGoods }
}

export default connect(mapStateToProps)(ProductSettings)