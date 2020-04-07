import React from 'react'
import { connect } from 'dva'
import CustomizedForm from './CustomizedForm'

/**
 * 选择商品分类
 * @param {object} props 
 */
function SelectProductCategory (props) {
  const { 
    dispatch, 
    classificationOfGoods, // redux中存放商品分类的字段
    changeStepsCurrent 
  } = props;

  /**
   * 修改redux中的商品分类
   * @param {string} values 
   */
  function onValuesChange (values) {
    dispatch({
      type: 'businessManagement_commodity/changeClassificationOfGoods',
      action: {
        payload: values
      }
    })
  }

  return(
    <CustomizedForm
      classificationOfGoods={classificationOfGoods}
      onValuesChange={onValuesChange}
      changeStepsCurrent={changeStepsCurrent}
    />
  )
}

const mapStateToProps = ({ businessManagement_commodity: state }) => {
  const { classificationOfGoods } = state;
  return { classificationOfGoods }
}

export default connect(mapStateToProps)(React.memo(SelectProductCategory))