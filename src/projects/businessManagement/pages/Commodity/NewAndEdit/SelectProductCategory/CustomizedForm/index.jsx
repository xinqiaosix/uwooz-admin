import React from 'react';
import { Form, Select, Button } from 'antd'
import { connect } from 'dva'

import styles from './index.module.scss'

const { Option } = Select;

function CustomizedForm(props) {
  const { form, changeStepsCurrent, productTypes, categoryList, classification, merchantList } = props;
  const { getFieldDecorator } = form;

  function handleSubmit(e) {
    e.preventDefault()
    form.validateFields(err => {
      if (!err) {
        changeStepsCurrent(1)
      }
    });
  }

  const prefix = 'customizedForm'
  return (
    <Form
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 12 }}
      onSubmit={handleSubmit}
      className={styles[`${prefix}-form`]}
      hideRequiredMark={true}
    >
      <Form.Item label="选择商品类型" >
        {getFieldDecorator('productTypes', {
          rules: [{ required: true, message: '请选择商品类型' }],
        })(
          <Select
            placeholder="请选择商品类型"
          >
            {
              productTypes.length > 0 && productTypes.map((item) => {
                return <Option value={item.id} key={item.id}>{item.name}</Option>
              })
            }
          </Select>,
        )}
      </Form.Item>
      <Form.Item label="选择类目" >
        {getFieldDecorator('category', {
          rules: [{ required: true, message: '请选择类目' }],
        })(
          <Select
            placeholder="请选择类目"
          >
            {
              categoryList.length > 0 && categoryList.map((item) => {
                return <Option value={item.id} key={item.id}>{item.categoryName}</Option>
              })
            }
          </Select>,
        )}
      </Form.Item>
      <Form.Item label="商品分类" >
        {getFieldDecorator('productCategories', {
          rules: [{ required: true, message: '请选择商品分类' }],
        })(
          <Select
            placeholder="请选择商品分类"
          >
            {
              classification.length > 0 && classification.map((item) => {
                return <Option value={item.id} key={item.id}>{item.classificationName}</Option>
              })
            }
          </Select>,
        )}
      </Form.Item>
      <Form.Item label="所属商家" >
        {getFieldDecorator('business', {
          rules: [{ required: true, message: '请选择所属商家' }],
        })(
          <Select
            placeholder="请选择所属商家"
          >
            {
              merchantList.data && merchantList.data.map((item) => {
                return <Option value={item.merchantId} key={item.id}>{item.merchantName}</Option>
              })
            }
          </Select>,
        )}
      </Form.Item>
      <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
        <Button size='large' type="primary" htmlType="submit">
          下一步
        </Button>
      </Form.Item>
    </Form>
  )
}

const mapStateToProps = ({ businessManagement_commodity: state }) => {
  const { productTypes, categoryList, classification, merchantList } = state;
  return { productTypes, categoryList, classification, merchantList }
}

export default connect(mapStateToProps)(Form.create({
  // 数据来源于redux
  mapPropsToFields(props) {
    const { productTypes, category, productCategories, business} = props.classificationOfGoods;
    return {
      productTypes: Form.createFormField({
        value: productTypes
      }),
      category: Form.createFormField({
        value: category
      }),
      productCategories: Form.createFormField({
        value: productCategories
      }),
      business: Form.createFormField({
        value: business
      }),
      
    };
  },
  // 修改redux中的数据
  onValuesChange(props, values) {
    props.onValuesChange(values);
  },
})(CustomizedForm))