import React from 'react'
import { connect, router } from 'dva'
import styles from '../index.module.scss'
import { Table, Modal } from 'antd'

const { withRouter } = router

class LineTable extends React.Component{
  constructor(props){
    super(props);
    this.state = {
			isLoading:false,
    }

    // 表头
		this.colums = [
			{
				title: '序号',
				dataIndex: 'id',
				width: '5%',
				// align: 'center',
				render: (text, record, index) => {
					return index + 1
				}
			},
			{
				title: '线路名称',
				dataIndex: 'routeName',
				width: '20%',
			},
			{
				title: '线路描述',
				dataIndex: 'routeIntroduce',
				render: (text, record, index) => {
					return (
						<span className={styles.route_introduce}>{record.routeIntroduce}</span>
					)
				}
			},
			{
				title: '站点',
				dataIndex: 'stationNames',
				render: (text, record, index) => {
					return (
						<React.Fragment>
							{
								record.sightseeingStations.length > 0 ?
									<div className={styles.station_list}>
										{
											record.sightseeingStations.map((item, index) => {
												return (
													<span key={item.id}> {index < record.sightseeingStations.length - 1 ? item.stationName + '--' : item.stationName}</span>
												)
											})
										}
									</div> :
									<div>无</div>
							}
						</React.Fragment>
					)
				}
			},
			{
				title: '操作',
				dataIndex: 'id',
				key: 'operate',
				align: 'center',
				width: '10%',
				render: (text, record, index) => {
					return (
						<span>
							<span
								onClick={ () => this.onGetEditData(record)}
								style={{marginRight: 10}}
								className={styles.option}
							>编辑</span>
							{
								record.sightseeingStations.length === 0 ?
								 <span className={styles.option} onClick={ () => this.onDeleteLine(record.id)} data-id={record.id}>删除</span> : 
								 <span className={styles.option} onClick={this.onDeleteStationLine} data-id={record.id}>删除</span>
							}
						</span>
					)
				}
			}
		]
  }

	componentDidMount() {
		this.handleGetLineList()
	}

	// 获取新路列表
	handleGetLineList = async (page = 1, pageSize = 10) => {
		const { dispatch } = this.props

    this.setState({ isLoading: true })
    await dispatch({
      type: 'wisdom_lineManagement/loadLines',
      payload: { page, pageSize }
    })
    this.setState({ isLoading: false })
	}

	//切换页码
	handlePaginationChanged = (page, pageSize) => {
   this.handleGetLineList(page, pageSize)
	}

	// 删除无站点线路
	onDeleteLine =  (routeId) => {
		const { dispatch } = this.props
		dispatch({
			type: 'wisdom_lineManagement/deleteLines',
			payload: routeId
		})
	}

	// 含站点线路无法删除
	onDeleteStationLine = () => {
		Modal.info({
			content: '存在站点无法删除！'
		})
	}
	// 编辑线路，获取回填的值
	onGetEditData = (lineData) => {
    const { editLine } = this.props
    editLine(lineData)
	}

  render() {
		const { lineList, lineListParam } = this.props
		const { page, pageSize, total } = lineListParam
    return(
      <Table
        rowKey={item => item.id}
        columns={this.colums}
        dataSource={lineList}
        pagination={{
          current: page || 1,
          total: total || 0,
          pageSize: pageSize || 1,
          showTotal: total => `共 ${total} 条`,
          onChange: this.handlePaginationChanged,
          showSizeChanger: true,
          pageSizeOptions: ['3', '10', '20', '30', '40'],
          onShowSizeChange: this.handlePaginationChanged,
        }}
        className={styles.line_list_table}
      />
    )
  }
}

const mapStateToProps = ({ 'wisdom_lineManagement': state }) => {
  const { lineList, lineListParam } = state
  return { lineList, lineListParam }
}

export default withRouter(connect(mapStateToProps)(LineTable))
