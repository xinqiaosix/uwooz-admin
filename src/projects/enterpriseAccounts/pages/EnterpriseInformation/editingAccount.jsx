/**
* 编辑 => 主账号
*/ 
import React from 'react';
import styles from './index.module.scss';
import { Form, Modal, Input } from 'antd';
import { connect } from 'dva';

// 表单选项
const FormItem = Form.Item;

// 弹出框 => 编辑 => 主账号
class EditingAccount extends React.Component {

  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = { };
  }

  // 编辑数据
	onAccount = () => {
    const { form, userData, dispatch } = this.props;
    const { id, userName} = userData;
    form.validateFieldsAndScroll(async (err, values) => {
      if ( !err ) {
        const payload = {
          id: id,
          userName: userName,
          comment: values.contacts,
          boundMobille: values.mailbox,
        }
        // console.log(payload)
        await dispatch({
          type: 'app/uploadPrimaryAccountNumber',
          payload,
        })
      }
    });
    form.resetFields();
    this.props.onCancel();
	}


  render() {

    const {
      form,
      visible,
      confirmLoading,
      userData,
      onCancel,
    } = this.props;

    const { getFieldDecorator } = form;

    const {	 
      userName, 
      comment, 
      boundMobille 
    } = userData;

    // 表单控件布局
    const formItemLayout = {
      // label 标签布局 
      labelCol:{
        // span 栅格占位格数，为 0 时相当于 display: none xs:小; sm:一般
        xs: { span: 24 },
        sm: { span: 4 },
      },

      // 需要为输入控件设置布局样式时，使用该属性
      wrapperCol: { 
        xs: { span: 24 },
        sm: { span: 12 },
      }
    }

    let option = {
      visible: visible,
      title: '主账号',
      okText: '保存',
      cancelText: '取消',
      onOk: this.onAccount,
      onCancel: onCancel,
      confirmLoading: confirmLoading
    }

    return(
      <Modal
        { ...option }
        width = { 580 }
      >
        <Form >

          <FormItem label='用户名:' { ...formItemLayout } className = { styles.formItem } >
            <div className = { styles.accountName }>
              <div>{ userData === [] ? '' : userName}</div>
              <p>企业绑定的主账号不可更改</p>
            </div>
          </FormItem>
          <FormItem label='姓名:' { ...formItemLayout } className = { styles.formItem }>
            {
              getFieldDecorator('contacts',{
                rules:[{ message: '请输入姓名!',}],
                initialValue: userData === [] ? '' : comment,
              })(
                <Input placeholder= '请输入姓名' />
              )
            }
          </FormItem>
          <FormItem label='手机号码:' { ...formItemLayout } className = { styles.formItem }>
            {
              getFieldDecorator('mailbox',{
                rules:[{ message: '请输入手机号码!',  }],
                initialValue:  userData === [] ? '' : boundMobille,
              })(
                <Input placeholder= '请输入手机号码' />
              )
            }
          </FormItem>

        </Form>
      </Modal>
    )
  }
}

// modal 中的 state 通過組件的 props 注入組件
const mapStateToProps = ({ enterpriseAccounts_info: state }) => {
  return{}
} 
export default connect(mapStateToProps)(Form.create({})(EditingAccount))