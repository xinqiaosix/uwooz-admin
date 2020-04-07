/**
 * 配送地址
 */
import React from 'react';
import { Modal, Form, TreeSelect, Row, Col, Input } from 'antd';
import styles from './index.module.scss';
import { connect, router } from 'dva';
import address from '@/utils/address.js';
import { addDistributionArea, uploadDistributionArea } from 'businessManagement/api/logisticsOperate';

const FormItem = Form.Item;
const { SHOW_PARENT } = TreeSelect;
const { withRouter } = router;

class DeliveryModal extends React.Component {

  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      addressValue: undefined,
    }

  }

  getRandomCode = (length) => {
    if (length > 0) {
      var data = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
      var nums = "";
    for (var i = 0; i < length; i++) {
      var r = parseInt(Math.random() * 61);
      nums += data[r];
    }
      return nums;
    } else {
      return false;
    }
  }


  // 添加 配送区域
  handleStorage = () => {
    const { form, match, dispatch } = this.props;
    const { params: { type, id } } = match;

    form.validateFields(async (err, values) => {
      if (!err){
        const {
          firstPriority,    // 首重
          freight,          // 运费
          continuousWeight, // 续重
          renew,            // 续费
        } = values;

        let addressValue = this.state.addressValue || '';
        let addressText = addressValue.join(',');
        
        if ( type === 'uploadFreight' ) {

          const res = await addDistributionArea({
            distributionArea: addressText,
            firstHeavy: firstPriority,
            freight,
            continuedHeavy: continuousWeight,
            renewal:renew,
            freightTemplateId: id
          });

          if ( res.errorCode === 200 ) {
            Modal.success({ title: '添加成功!' })
            dispatch({
              type: 'businessManagement_logistics/getOneMouleList',
              payload: id
            });
          }

        } else {
          let delivery = {
            id: this.getRandomCode(10),
            distributionArea: addressText,
            firstHeavy: firstPriority,
            freight,
            continuedHeavy: continuousWeight,
            renewal:renew,
          }
  
          this.props.distributionArea(delivery);
          Modal.success({ title: '添加成功' })
        }

        this.setState({
          addressValue:undefined
        });

        form.resetFields();
        this.props.onCancel();
      }
    })
  }

  // 编辑配送区域
  handleEditDelivery = () => {
    const { areaData, dispatch, form, match } = this.props;
    
    // 模板 id
    const moduleId = match.params.id;
    const { params:{ type } } = match;

    form.validateFields(async (err, values) => {

      if (!err){
        const {
          firstPriority,    // 首重
          freight,          // 运费
          continuousWeight, // 续重
          renew,            // 续费
        } = values;

        const { distributionArea, id } = areaData;
       
        let addressText = '';

        if( this.state.addressValue === undefined ) {
          addressText = distributionArea;
        } else {
          let addressValue = this.state.addressValue || '';
          addressText = addressValue.join(',');
        }

        
        const payload = {
          moduleId: moduleId,
          id: id,
          distributionArea: addressText,
          firstHeavy: firstPriority,
          freight,
          continuedHeavy: continuousWeight,
          renewal:renew,
        }

        if (type === 'uploadFreight') {
          const res = await uploadDistributionArea(payload);

          if ( res.errorCode === 200 ) {
            Modal.success({ title: '数据更新成功!' });
            dispatch({
              type: 'businessManagement_logistics/getOneMouleList',
              payload: moduleId
            });
          }

        } else {
          this.props.distributionArea(payload);
          Modal.success({ title: '数据更新成功!' })
        }

        this.setState({
          addressValue:undefined
        })
        this.props.form.resetFields();
        this.props.onCancel();
      }
    })
  }

  // 关闭 配送 弹框
  onCancel = () => {
    this.props.onCancel();

    this.setState({
      addressValue:undefined
    })
    const { form } = this.props;
    form.resetFields();
  }

  // 配送区域 地址选择 
  deliveryRegion = (value) => {
    this.setState({
      addressValue:value,
    })
    // console.log(value)
  }

  render() {

    const {
      visible,
      form,
      areaData, // 编辑选中项的数据
      showEditModular, // 判断 是不是修改项
    } = this.props;
  
    // console.log(areaData)
    const { distributionArea } = areaData;
    let addressInfo = distributionArea && distributionArea.split(",");

    let option = {
      visible: visible,
      title: '配送区域',
      okText: '确定',
      cancelText: '取消',
      onOk: showEditModular === true ? this.handleEditDelivery : this.handleStorage,
      onCancel: this.onCancel,
    }

    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    }
    const rowFormItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 16 },
    }

    const { getFieldDecorator } = form;

    // 配送区域 全国省级三级联动
    const addressData = [];
    const province = Object.keys(address);

    for ( let i = 0; i < province.length; i++ ){
      const key = province[i];
      const city = [];
      let number = 1;
      for ( let j in address[key] ){
        const area = [];
        for ( let k in address[key][j] ){
            const obj = {
              'title': address[key][j][k],
              'value': key + '_' + j + '_' + address[key][j][k],
              'key': i + '-' +  (number++) + '-' + k ,
            }
            area.push(obj)
          }
        const obj1 = {
          'title': j,
          'value': key + '_' + j,
          'key': i + '-' + number++,
          'children': area
        }
        city.push(obj1);
      }
      const obj2 = {
        'title': key,
        'value': key,
        'key': i,
        'children': city,
      }
      addressData.push(obj2)
    }

    return(
      <Modal
        width = { 580 }
        { ...option }
      >
        <Form className = { styles.formBoxStyle }>
          <FormItem label = '配送区域:' { ...formItemLayout }>
            {
              getFieldDecorator('treeSelect',{
                initialValue: showEditModular === true ? addressInfo :  [],
              })(
                <TreeSelect 
                  searchPlaceholder = '请选择配送区域'
                  onChange = { this.deliveryRegion }
                  treeData = { addressData }            // treeNodes 数据，如果设置则不需要手动构造 TreeNode 节点（value 在整个树范围内唯一）
                  showCheckedStrategy = { SHOW_PARENT } // 定义选中项回填的方式。
                  treeCheckable = { true }              // 显示 checkbox
                  dropdownMatchSelectWidth              // 下拉菜单和选择器同宽
                  dropdownStyle = {{ maxHeight: 400, overflow: 'auto' }}
                />
              )
            }
          </FormItem>

          <Row className = { styles.rowStyle }>
            <Col span = { 2 }> </Col>
            <Col span = { 10 }>
              <FormItem label = '首重:' { ...rowFormItemLayout }>
                {
                  getFieldDecorator('firstPriority',{
                    initialValue: showEditModular === true ? areaData.firstHeavy :  '',
                  })(
                    <Input suffix="kg" placeholder = '请输入' />
                  )
                }
              </FormItem>
            </Col>
            <Col span = { 10 }>
              <FormItem label = '运费:' { ...rowFormItemLayout }>
                {
                  getFieldDecorator('freight',{
                    initialValue: showEditModular === true ? areaData.freight: '',
                  })(
                    <Input prefix="￥" placeholder = '请输入' />
                  )
                }
              </FormItem>
            </Col>
          </Row>
          
          <Row className = { styles.rowStyle }>
            <Col span = { 2 }> </Col>
            <Col span = { 10 }>
              <FormItem label = '续重:' { ...rowFormItemLayout }>
                {
                  getFieldDecorator('continuousWeight',{
                    initialValue: showEditModular === true ? areaData.continuedHeavy : '',
                  })(
                    <Input suffix="kg" placeholder = '请输入' />
                  )
                }
              </FormItem>
            </Col>
            <Col span = { 10 }>
              <FormItem label = '续费:' { ...rowFormItemLayout }>
                {
                  getFieldDecorator('renew',{
                    initialValue: showEditModular === true ? areaData.renewal : '',
                  })(
                    <Input prefix="￥" placeholder = '请输入' />
                  )
                }
              </FormItem>
            </Col>
          </Row>
         
        </Form>
      </Modal>
    )
  }
}

const mapStateToProps = ({ businessManagement_logistics: state }) => {
  return { }
}
export default  withRouter(connect(mapStateToProps)(Form.create({})(DeliveryModal)))