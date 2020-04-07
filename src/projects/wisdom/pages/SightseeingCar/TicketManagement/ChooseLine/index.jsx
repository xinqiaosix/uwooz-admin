/* eslint-disable */
import React from 'react'
import styles from './index.module.scss'
import { Steps, Form, Button, Select } from 'antd';
import { connect } from 'dva'

const FormItem = Form.Item;
const Option = Select.Option;
const { Step } = Steps;

// 创建第一步弹出框表单（选择线路）
class ChooseLineForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      start: [],       // 起点集合
      end: [],         // 终点集合
      stationList: [], // 站点列表
      startId: '',     // 起点站id
      endId: ''        // 终点站id
    }
  }

  // 提交线路选择
  onNext = () => {
    const { form, onCreate, dispatch } = this.props;
    const { startId, endId } = this.state
    form.validateFields( async (err, values) => {
      if (!err) {
        let payload = {}
        if (startId !== '' && endId !== '') {
          payload = {
            routeId: values.linename,
            startStationId: startId,
            endStationId: endId
          }
        }
        else {
          payload = {
            routeId: values.linename,
            startStationId: '',
            endStationId: ''
          }
        }

        await dispatch({
          type: 'wisdom_ticketManagement/saveLineId',
          payload
        })

        onCreate()
        form.resetFields();
        this.setState({
          start: [],
          end: [],
          startId: '',
          endId: ''
        })
      }
    })
  }

  // 取消选择线路，选择线路弹框消失
  onCancel = () => {
    const { form, onCancel } = this.props;
    form.resetFields();
    onCancel();
    this.setState({
      start: [],
      end: [],
      startId: '',
      endId: ''
    })
  }

  // 选择线路，获取改线路下面的站点
  handleGetStationList = (value) => {
    const { lineLists } = this.props
    lineLists.map((item, index) => {
      if (value === item.id) {
        this.setState({
          start: item.sightseeingStations,
          end: item.sightseeingStations.slice(1),
          stationList: item.sightseeingStations
        })
      }
    })
  }

  // 选择起始站点
  onStartChange = (value, key) => {
    const { stationList } = this.state
    let newEnd = [];
    stationList.map((item, index) => {
      if (index > value) {
        newEnd.push(item)
      }
    })
    this.setState({
      end: newEnd,
      startId: key.props.option
    })
  }

  // 选择终点站点
  onEndChange = (value, key) => {
    const { stationList } = this.state
    let newStart = [];
    stationList.map((item, index) => {
      if (index < value + 1) {
        newStart.push(item)
      }
    })
    this.setState({
      start: newStart,
      endId: key.props.option
    })
  }

  render() {
    const {
      form,                                   // 表单参数（默认必须值）
      lineLists
    } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {                             // label 标签布局
        xs: { span: 24 },                     // span 栅格占位格数, 为0时 相当于 display: none, xs:小; sm: 一般;
        sm: { span: 6 },
      },
      wrapperCol: {                           // 需要为输入控件设置布局样式时,使用该属性
        xs: { span: 24 },
        sm: { span: 16 },
      }
    }
    return (
      <div className="elasticframe" style={this.props.visible ? {} : { display: 'none' }} >
        <div className="elasticframe_content">
          <div className={styles.title}>
            <img src={require('@/assets/images/returnback.png')} onClick={this.onCancel} className={styles.back} alt="" />
            <span>选择线路</span>
          </div>
          <div className={styles.stepone}>
            <Steps current={0} id="step" labelPlacement="vertical">
              <Step title="选择线路" />
              <Step title="填写票务信息" />
            </Steps>
            <Form layout='vertical' style={{ marginTop: 30, paddingRight: 50 }}>
              <FormItem label="线路名称：" required hasFeedback {...formItemLayout} >
                {getFieldDecorator('linename', {
                  rules: [{ required: true, message: '请选择线路!' }],
                  initialValue: undefined,
                })(
                  <Select placeholder="请选择线路" onChange={this.handleGetStationList} >
                    {lineLists ? lineLists.map((item) => {
                      return <Option value={item.id} key={item.id} data-id={item.id} >{item.routeName}</Option>
                    }) : null}
                  </Select>
                )}
              </FormItem>
              {
                this.state.start.length >= 1  ?
                  <Form.Item label="站点：" required hasFeedback {...formItemLayout}>
                    <div className={styles.selectsites}>
                      <Form.Item>
                        {getFieldDecorator('start', {
                          rules: [{ required: true, message: '请输入起始站点' }],
                          initialValue: undefined
                        })(
                          <Select placeholder="请输入起始站点" style={{ width: 160 }} onChange={this.onStartChange}>
                            {this.state.start ? this.state.start.map((item, index) => {
                              return <Option value={index} key={item.id} option={item.id}>{item.stationName}</Option>
                            }) : null}
                          </Select>
                        )}
                      </Form.Item>
                      <span style={{ color: '#c0c0c0', marginLeft: 10, marginRight: 10 }}>——</span>
                      <Form.Item >
                        {getFieldDecorator('end', {
                          rules: [{ required: true, message: '请输入终点站点' }],
                        })(
                          <Select placeholder="请输入终点站点" style={{ width: 160 }} onChange={this.onEndChange}>
                            {this.state.end ? this.state.end.map((item, index) => {
                              return <Option value={index} key={item.id} option={item.id}>{item.stationName}</Option>
                            }) : null}
                          </Select>
                        )}
                      </Form.Item>
                    </div>
                  </Form.Item> : ''
              }
            </Form>
            <div className={styles.btn}>
              <Button type="primary" onClick={this.onNext} style={{ marginRight: 10 }} >下一步</Button>
              <Button onClick={this.onCancel}>取消</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ 'wisdom_ticketManagement': state }) => {
  const { ticketList, ticketListParam, lineLists } = state
  return { ticketList, ticketListParam, lineLists }
}

export default connect(
  mapStateToProps
)(Form.create()(ChooseLineForm))