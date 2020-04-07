/* eslint-disable */
import React from 'react'
import LineMap from './map'
import {Form,Modal} from 'antd'
//创建地图弹出框
const MapForm = Form.create()(
	class extends React.Component {
		render() {
			const {
				visible, // 弹出框是否可见
				confirmLoading, // 弹出框按钮loadding
				onCancel,
				onSure
			} = this.props;
			let option = {
				visible: visible,
				title: "站点名坐标选址",
				okText: "确定",
				cancelText: "取消",
				onCancel: onCancel,
				onOk: onSure,
				confirmLoading: confirmLoading,
			}; // 弹出框参数

			return (
				<Modal {...option}>
					<LineMap />
				</Modal>
			)
		}
	}
)
export default MapForm;