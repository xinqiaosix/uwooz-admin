/* eslint-disable */
import React from 'react'
import {Form,Modal,Input,Icon,Button} from 'antd'
import request from '@/utils/request'
import * as lineManagementApi from 'wisdom/api/lineManagement'
import { connect } from 'dva'
import './index.scss'
const FormItem = Form.Item;
const { TextArea } = Input;

let specId = 0

//创建编辑线路弹出框表单
class EditLine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,          // 用来判断站点下标该赋何值
      deleteList: [],    // 删除站点集合
      isEditLoading: false
    }
  }

  componentDidMount() {
    this.props.onRef(this)
  }
  
  //删除站点
  onRemove = async (k) => {
    const { form, data } = this.props;
    const keys = form.getFieldValue('keys');
    if (data.sightseeingStations[k] !== undefined) {
      const { errorCode } = await lineManagementApi.deleteStation({ stationId: data.sightseeingStations[k].id })
      if(errorCode === 200) {
        this.state.deleteList.push(data.sightseeingStations[k].id)
        form.setFieldsValue({
          keys: keys.filter(key => key !== k),
        });
        data.sightseeingStations[k] = undefined
        Modal.info({
          content: '删除成功！'
        })
      }
      else {
        Modal.info({
          content: '还存在票！'
        })
      }
    }
    else {
      form.setFieldsValue({
        keys: keys.filter(key => key !== k),
      });
    }
  };

  //添加站点
  onAdd = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    this.setState({
      add: true,
      spec: false
    })
    if (this.state.count < 1) {
      if (keys.length >= 1) {
        specId = keys[keys.length - 1] + 1
        this.setState({ count: this.state.count + 1 })
      }
      else {
        specId = 1
        this.setState({ count: this.state.count + 1 })
      }
    }
    else {
      specId = specId + 1
    }
    const nextKeys = keys.concat(specId);
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  // 获取输入框id
  handleChangeInput = (e) => {
    let id = e.currentTarget.dataset.id;
    sessionStorage.setItem('inputIds', id)
    this.props.handleChange()
  }

  // 提交编辑后的数据
  handleSumbit = () => {
    let list = []
    const { form, data, onCreate, dispatch } = this.props
    form.validateFields(async (err, values) => {
      if (!err) {
        const { keys, ids, names, coordinate } = values;
        if (keys.length === 1) {
          Modal.info({
            content: '至少两个及以上站点或不添加站点！'
          })
        }
        else {
          if (keys.length >= 2) {
            keys.map((key) => {
              let obj = { 'id': ids[key], 'stationName': names[key], 'pointLon': coordinate[key].split(',')[1], 'pointLan': coordinate[key].split(',')[0] }
              list.push(obj)
            })
          }

          //请求编辑线路接口
          const payload = {
            id: data.id,
            ids: this.state.deleteList.length === 0 ? null : this.state.deleteList.toString(),
            routeName: values.linename,
            routeIntroduce: values.linedes,
            stationS: list.length === 0 ? null : JSON.stringify(list).replace('[', '%5B').replace(']', '%5D')
          }

          this.setState({ isEditLoading: true })
          await dispatch({
            type: 'wisdom_lineManagement/EditorialLines',
            payload
          })

          specId = 0
          onCreate()
          form.resetFields()
          this.setState({
            count: 0,
            deleteList: [],
            isEditLoading: false
          })
        }
      }
    })
  }

  // 取消
  handleCancel = () => {
    const { form, onCancel } = this.props
    form.resetFields();
    onCancel();
    specId = 0;
    this.setState({
      count: 0,
      deleteList: []
    })
  }

  // 更改输入框中的地址坐标
  handleChangeForm = () => {
    const pointId = "coordinate[" + sessionStorage.getItem('inputIds') + "]";
    this.props.form.setFieldsValue({
      [pointId]: sessionStorage.getItem('lat') + ',' + sessionStorage.getItem('lng')
    })
  }

  render() {
    const {
      form,             // 表单参数（默认必须值）
      visible,          // 弹出框是否可见
      data,
    } = this.props;

    const { getFieldDecorator, getFieldValue } = form;
    const { isEditLoading } = this.state

    let option = {
      visible: visible,
      title: "编辑线路",
      okText: "确定",
      cancelText: "取消",
      onCancel: this.handleCancel,
      onOk: this.handleSumbit,
      confirmLoading: isEditLoading,
    }; // 弹出框参数

    const formItemLayout = {

      labelCol: {         // label 标签布局
        xs: { span: 24 }, // span 栅格占位格数, 为0时 相当于 display: none, xs:小; sm: 一般;
        sm: { span: 6 },
      },
      wrapperCol: {       // 需要为输入控件设置布局样式时,使用该属性
        xs: { span: 24 },
        sm: { span: 16 },
      }
    }

    let list = []
    if (data.sightseeingStations !== undefined) {
      data.sightseeingStations.forEach((item, index) => {
        if (item !== undefined) {
          list.push(index)
        }
      })
    }

    getFieldDecorator('keys', { initialValue: list });
    const keys = getFieldValue('keys');

    // 站点集合
    const formItems = keys.map((k, index) => (
      <div className="addstation" key={k}>
        <Form.Item
          required={false}
          style={{ display: 'none' }}
        >
          {getFieldDecorator(`ids[${k}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [
              {
                whitespace: true,
                message: "",
              },
            ],
            initialValue: data.sightseeingStations[k] != undefined ? data.sightseeingStations[k].id.toString() : ''
          })(
            <Input placeholder="请输入站点名称" style={{ width: 120, fontSize: '13px', marginRight: 10 }} />
          )}
        </Form.Item>
        {
          index == 0 &&
          <Form.Item required={false} label="站点名:">
            {getFieldDecorator(`names[${k}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  whitespace: true,
                  message: "请输入站点名称",
                },
              ],
              initialValue: data.sightseeingStations[k] != undefined ? data.sightseeingStations[k].stationName : ''
            })(
              <Input placeholder="请输入站点名称" style={{ width: 120, fontSize: '13px', marginRight: 10 }} />
            )}
          </Form.Item>
        }
        {
          index >= 1 &&
          <Form.Item
            required={false}
            label=""
            className="otherstation"
          >
            {getFieldDecorator(`names[${k}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  whitespace: true,
                  message: "请输入站点名称",
                },
              ],
              initialValue: data.sightseeingStations[k] != undefined ? data.sightseeingStations[k].stationName : ''
            })(
              <Input placeholder="请输入站点名称" style={{ width: 120, fontSize: '13px', marginRight: 10 }} />
            )}
          </Form.Item>
        }
        <Form.Item required={false} label="坐标:">
          {getFieldDecorator(`coordinate[${k}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [
              {
                whitespace: true,
                message: "请输入坐标",
              },
            ],
            initialValue: data.sightseeingStations[k] != undefined ? data.sightseeingStations[k].pointLan + ',' + data.sightseeingStations[k].pointLon : ''
          })(
            <Input placeholder="请输入坐标" style={{ width: 145, fontSize: '13px', marginRight: 10 }} data-id={k} onClick={this.handleChangeInput} />
          )}

        </Form.Item>
        {keys.length >= 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => this.onRemove(k)}
          />
        ) : null}
      </div>
    ));

    return (
      <Modal
        {...option}
      >
        <div className="editline lineform">
          <Form className="editline_form" layout='vertical' style={{ marginTop: 30 }}>
            <FormItem label="线路名称：" required hasFeedback {...formItemLayout} >
              {getFieldDecorator('linename', {
                rules: [{ required: true, message: '请输入线路名称!', whitespace: true }],
                initialValue: data.routeName || '',
              })(
                <Input placeholder="请输入线路名称" />
              )}
            </FormItem>
            <Form.Item label="线路描述：" required hasFeedback {...formItemLayout} >
              {getFieldDecorator('linedes', {
                rules: [{ required: true, message: '请输入线路描述!', whitespace: true }],
                initialValue: data.routeIntroduce == undefined ? '' : data.routeIntroduce,
              })(
                <TextArea placeholder="请输入线路描述" autosize={{ minRows: 3, maxRows: 6 }} />
              )}
            </Form.Item>
          </Form>
          <div className="station_list">
            {formItems}
            <div >
              <Button type="dashed" onClick={this.onAdd} style={{ marginLeft: 50 }} >
                <Icon type="plus" />新增站点
                  </Button>
            </div>
          </div>
        </div>
      </Modal>
    )
  }
}

const mapStateToProps = ({ 'wisdom_lineManagement': state }) => {
  const { lineList, lineListParam } = state
  return { lineList, lineListParam }
}

export default connect(
  mapStateToProps
)(Form.create()(EditLine))

