/* eslint-disable */
import React from 'react'
import styles from './index.module.scss'
//map子组件
class LineMap extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			lat: 0,
			lng: 0
		}
	}

	onInit = () => {
		const { qq } = window;
		var map = new qq.maps.Map(document.getElementById("linemanagementmap"), {
			center: new qq.maps.LatLng(30.380384, 120.234915),
			zoom: 17
		});
		//绑定单击事件添加参数
		qq.maps.event.addListener(map, 'click', function (event) {
			var latLng = event.latLng,
				lat = '纬度：' + latLng.getLat().toFixed(5),
				lng = '经度：' + latLng.getLng().toFixed(5);
			document.getElementById("point").innerHTML = lng + '&nbsp;&nbsp;&nbsp;&nbsp;' + lat;
			sessionStorage.setItem('lat', latLng.getLat().toFixed(5));
			sessionStorage.setItem('lng', latLng.getLng().toFixed(5));
		});
	}
	
	render() {
		return (
			<div className={styles.linemap}>
				<div className={styles.point} id="point">
				</div>
				<div id="linemanagementmap" className={styles.map}>
				</div>
			</div>
		)
	}

	componentDidMount() {
		this.onInit()

	}
}

export default LineMap