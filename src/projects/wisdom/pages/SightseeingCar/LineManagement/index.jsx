import React from 'react'
import { connect, router } from 'dva'
import styles from './index.module.scss'
import { Layout, Button } from 'antd'
import AddLine from './AddLineForm/index'
import EditLine from './EditLineForm/index'
import MapForm from './MapForm/index'
import LineTable from './LineTable/index'

const { Content } = Layout;
const { withRouter } = router

class LineManagment extends React.Component{
  constructor(props){
    super(props);
    this.state = {
			visible: false,                          // 新增线路弹出框	
			mapVisible: false,											 // 新增线路是的地图弹出框
			selectedRowKeys: '', 				             // 选中数据的key值
			lineData: [],							               // 编辑线路市回填的数据
			editVisible: false,					             // 编辑弹框显示与否
			add:false,										           // 判断新增还是编辑
    }
  }

	// 编辑线路，获取回填的值
	onGetEditData = (lineData) => {
		this.setState({
			lineData: lineData,
			editVisible: true,
			add: false
		})
	}

	//新增时显示地图弹出框
	handleChangeVisible = () => {
		this.setState({
			mapVisible: true,
			visible: false
		})
	}

	//地图弹框确定
	onSure = () => {
		if(this.state.add){
			this.setState({
				mapVisible: false,
				visible: true
			})
			const form = this.formRef.props.form;
			const pointId = "coordinate[" + sessionStorage.getItem('inputId') + "]";
			form.setFieldsValue({
				[pointId]: sessionStorage.getItem('lat') + ',' + sessionStorage.getItem('lng')
			})
		}
		else{
			this.setState({
				mapVisible: false,
				editVisible: true
			})
			this.child.handleChangeForm()
		}
	}

	// 编辑显示地图与否
	handleChangeEditVisible = () => {
		this.setState({
			mapVisible: true,
			editVisible: false
		})
	}

	//地图弹框消失
	onMapACancel = () => {
		if(this.state.add){
			this.setState({
				mapVisible: false,
				visible: true
			})
		}
		else{
			this.setState({
				mapVisible: false,
				editVisible: true
			})
		}
	}

	//添加线路弹框数据提交
	handleAddSumbit = (e) => {		
		this.setState({
			visible: false,
			add:false
		});
	};

	//添加线路弹框消失
	onAddCancel = (e) => {
		this.setState({
			visible: false,
			add: false
		});
	};

	// 添加线路
	onAddLine = () => {
		this.setState({
			visible: true,
			add: true
		})
	}

	// 子组件方法，用来更改输入框中地图坐标
	onRef = (ref) => {
		this.child = ref
	}

	// 必须值,获取表单的值
	saveFormRef = (formRef) => {
		this.formRef = formRef;
	}

  render() {
    return(
      <Content>
				<div className={styles.addline}>
					<Button type="primary" onClick={this.onAddLine} >新增</Button>
				</div>

				{/* 线路表格列表 */}
				<LineTable
					editLine={this.onGetEditData}
				/>

				{/* 添加线路 */}
				<AddLine
					visible = { this.state.visible }
					onCancel = {this.onAddCancel}
					handleChange={this.handleChangeVisible}													 // 新增地图弹出框显示与否
					wrappedComponentRef={this.saveFormRef} 													 // 必须值 用来获取form 的表单值
					destyroyOnClose={true} 														               // 关闭时销毁 Modal 里的子元素
				/>

				{/* 编辑线路 */}
				<EditLine
					visible={this.state.editVisible}																	// 编辑弹出框
					data={this.state.lineData}																				// 编辑时回填的数据
					onCancel={() => this.setState({ editVisible: false })}						// 取消
					onCreate={() => this.setState({ editVisible: false })}						// 提交编辑后的数据
					onRef={this.onRef}																								// 用来调用子组件的方法
					destyroyOnClose={true} 																						// 关闭时销毁 Modal 里的子元素
					handleChange={this.handleChangeEditVisible}			  								// 编辑地图弹出框
				/>

				{/* 地图弹框 */}
				<MapForm
					visible={this.state.mapVisible}										// 控制地图弹出框显示
					destyroyOnClose={true} 														// 关闭时销毁 Modal 里的子元素
					onSure={this.onSure}														  // 新增地图弹框选择坐标
					onCancel={this.onMapACancel}									   	// 取消
				/>
      </Content>
    )
  }
}

const mapStateToProps = ({ 'wisdom_lineManagement': state }) => {
  const { lineList, lineListParam } = state
  return { lineList, lineListParam }
}

export default withRouter(connect(mapStateToProps)(LineManagment))
