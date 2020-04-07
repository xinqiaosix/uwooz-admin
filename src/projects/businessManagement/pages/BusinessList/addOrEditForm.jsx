import React from 'react'
import {Form, Select, Input, Upload, Icon} from 'antd'
import styles from './NewBusiness/index.module.scss'
import { connect } from 'dva'

const FormItem = Form.Item
const { Option } = Select
const { TextArea } = Input

class AddOrEditForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,     //上传的图片的loading
      imageUrl: '',
      upload: false      // 用来显示编辑时的商家logo
    }
  }
  

  handleGetBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true,  upload: true });
      return;
    }
    if (info.file.status === 'done') {
      this.handleGetBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl: imageUrl,
          loading: false,
          upload: true
        }),
      );
    }
  }

  render() {

    const { form, businessType, add, businessInfo } = this.props
    const formItemLayout = {
      labelCol: { // label 标签布局
        xs: { span: 24 }, // span 栅格占位格数, 为0时 相当于 display: none, xs:小; sm: 一般;
        sm:  { span: 2 },
      },
      wrapperCol: { // 需要为输入控件设置布局样式时,使用该属性
        xs: { span: 24 },
        sm: { span: 16 },
      }
    }

    const { getFieldDecorator } = form;
    const { imageUrl } = this.state;
    return(
      <Form className={styles.business_info_form} >
        <FormItem
          label="商家名称"
          hasFeedback
          {...formItemLayout}
          className={styles.business_name}
          help= { add ? "可输入中文, 英文, 数字, 符号, 首字不可以是符号" : ''} 
        >
          {getFieldDecorator('merchantName', {
            initialValue: add ? '' : businessInfo.merchantName,
            rules: [{ required: add ?  true : false }]
          })(
            <Input placeholder="请输入商家名称" style={{ width: 479 }} ></Input>
          )}
        </FormItem>
        <FormItem label="商家分类" hasFeedback {...formItemLayout} style={{ marginTop: 24 }} >
          {getFieldDecorator('merchantTypeId', {
            initialValue: add ? undefined : businessInfo.typeId,
            rules: [{ required: add ?  true : false, message: '请选择商家分类' }]
          })(
            <Select placeholder="请选择" style={{ width: 479 }} >
              {
                businessType.map((item) => {
                  return (
                    <Option style={{ color: 'rgba(0,0,0,.65)' }} value={item.id} key={item.id}>{item.typeName}</Option>
                  )
                })
              }
            </Select>
          )}
        </FormItem>
        <FormItem label="商家地址" hasFeedback {...formItemLayout}>
          {getFieldDecorator('address', {
            initialValue: add ? '' : businessInfo.address,
            rules: [{ required: add ?  true : false, message: '请输入商家地址' }]
          })(
            <Input placeholder="省， 市，县，街道，村，门牌号" style={{ width: 479 }} ></Input>
          )}
        </FormItem>
        <FormItem label="联系人" hasFeedback {...formItemLayout}>
          {getFieldDecorator('realName', {
            initialValue: add ? '' : businessInfo.realName ,
            rules: [{ required: add ?  true : false, message: '请输入联系人真实姓名' }]
          })(
            <Input placeholder="请输入联系人真实姓名" style={{ width: 361 }} ></Input>
          )}
        </FormItem>
        <FormItem label="联系电话" hasFeedback {...formItemLayout}>
          {getFieldDecorator('mobile', {
            initialValue: add ? '' : businessInfo.mobile,
            rules: [{ required: add ?  true : false, message: '请输入手机号码' }]
          })(
            <Input placeholder="请输入手机号码" style={{ width: 361 }} ></Input>
          )}
        </FormItem>
        <FormItem label="商家LOGO" hasFeedback {...formItemLayout}>
          {getFieldDecorator('logoUrl', {
            initialValue: '',
            rules: [{ required: add ?  true : false, message: '请上传商家LOGO' }]
          })(
            <Upload
              name="upfile"
              listType="picture-card"
              className={styles.avatar_uploader}
              showUploadList={false}
              action="https://api.uwooz.com/mxapi/uploade/source"
              onChange={this.handleChange}
            >
              {
                !add && !this.state.upload ?
                <img src={businessInfo.logoUrl} alt="avatar" style={{ width: '100%' }} /> : 
                (
                  imageUrl ?
                  <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> :
                  <div>
                    <Icon type={this.state.loading ? 'loading' : 'plus'} style={{ color: 'rgba(0, 0, 0, .65)' }} />
                    <div className={styles.ant_upload_text}>上传</div>
                  </div>
                )
              }
              {/* {
                imageUrl ?
                  <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> :
                  <div>
                    <Icon type={this.state.loading ? 'loading' : 'plus'} style={{ color: 'rgba(0, 0, 0, .65)' }} />
                    <div className={styles.ant_upload_text}>上传</div>
                  </div>
              } */}
            </Upload>
          )}
        </FormItem>
        <FormItem label="商家简介" hasFeedback {...formItemLayout} className={styles.bussiness_profile} >
          {getFieldDecorator('brief', {
            initialValue: add ? '' : businessInfo.brief,
            rules: [{ required: add ?  true : false, message: '请输入商家简介' }]
          })(
            <TextArea placeholder="商家主营项目，特色等介绍" autosize={{ minRows: 3, maxRows: 6 }} style={{ width: 440 }} ></TextArea>
          )}
        </FormItem>
      </Form>
    )
  }
}

const mapStateToProps = ({ 'businessManagement_businessList': state }) => {
  const { businessLists, businessListParam, businessType, businessInfo } = state
  return { businessLists, businessListParam, businessType, businessInfo }
}

export default connect(
  mapStateToProps
)(Form.create()(AddOrEditForm))