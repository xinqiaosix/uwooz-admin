/** 
* 编辑 => 企业信息
*/
import React from 'react' ;
import styles from './index.module.scss';

// antd 相关模块的引入
import { Form, Modal, Input } from 'antd';
import { connect } from 'dva';

// 表单选项
const FormItem = Form.Item;

// 弹出框 => 编辑 企业信息
class EditorialEnterprise extends React.Component {

  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
    }
  }

  // 编辑数据
  onEdit = () => {
    const { form, enterpriseData, dispatch } = this.props;
    const { id } = enterpriseData;

    form.validateFieldsAndScroll(async (err, values) => {
      if ( !err ) {
        const payload = {
          id: id,
          companyName: values.name,
          realName: values.contacts,
          boundMobille: values.telephone,
          mobile: values.telephone,
          mailbox: values.mailbox,
        }

        // 发送数据 请求接口
        await dispatch({
          type: 'enterpriseAccounts_info/uploadEnterprise',
          payload,
        })
      }
    });
    form.resetFields();
    this.props.onCancel();
	}

  render() {

    const {
      form,           // 表单参数
      visible,        // 弹出框是否可见
      confirmLoading, // loading 显示
      enterpriseData, // 企业信息数据
      onCancel,       // 关闭弹出框
    } = this.props;

    const { getFieldDecorator } = form;

    const { companyName, realName, mobile, mailbox, } = enterpriseData;

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
       title: '企业信息',
       okText: '保存',
       cancelText: '取消',
       onOk: this.onEdit,
       onCancel: onCancel,
       confirmLoading: confirmLoading
    }

    return (
      <Modal
        { ...option }
        width = { 580 }
      >
        <Form id = { styles.editorialEnterprise } >

          <FormItem label='企业名称:' required hasFeedback { ...formItemLayout } className = { styles.formItem } >
            {
              getFieldDecorator('name',{
                rules:[{ required: true, message: '请输入企业名称!', whitespace: true }],
                initialValue: enterpriseData === [] ? '' : companyName,
              })(
                <Input placeholder= '请输入企业名称' />
              )
            }
          </FormItem>
          <FormItem label='联系人:' required hasFeedback { ...formItemLayout } className = { styles.editorialEnterprise_formItem }>
            {
              getFieldDecorator('contacts',{
                rules:[{ required: true, message: '请输入联系人!', whitespace: true }],
                initialValue: enterpriseData === [] ? '' : realName,
              })(
                <Input placeholder= '请输入联系人' />
              )
            }
          </FormItem>
          <FormItem label='联系电话:' required hasFeedback { ...formItemLayout } className = { styles.formItem }>
            {
              getFieldDecorator('telephone',{
                rules:[{ required: true, message: '请输入联系电话!', whitespace: true }],
                initialValue:  enterpriseData === [] ? '' : mobile,
              })(
                <Input placeholder= '请输入联系电话' />
              )
            }
          </FormItem>
          <FormItem label='邮箱:' { ...formItemLayout } className = { styles.formItem }>
            {
              getFieldDecorator('mailbox',{
                rules:[{ message: '请输入邮箱!',  }],
                initialValue: enterpriseData === [] ? '' : mailbox,
              })(
                <Input placeholder= '请输入邮箱' />
              )
            }
          </FormItem>

        </Form>
      </Modal>
    )
  }
}

const mapStateToProps = ({ enterpriseAccounts_info: state }) => {
  const { enterpriseData } = state;
  return { enterpriseData };
}
export default connect(mapStateToProps)(Form.create({})(EditorialEnterprise))