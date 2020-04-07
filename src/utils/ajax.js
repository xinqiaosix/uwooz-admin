import axios from 'axios'
import { Modal } from 'antd'
import Utils from '@/utils/tool'

import md5Encryption from './md5Encryption';

export default class Axios {

  // 获取数据列表进行表格渲染
  static requestList(parameter) {
    let {
      _this, // 绑定住this
      url, // 请求地址
      params, // 请求参数
      pages = { showQuickJumper: true, showSizeChanger: false, size: 'small' }, // 控制分页组件显示
      method = 'GET', // 请求方法
      list = 'list', // 返回数据时写入state对象的属性
      handleList = () => { }, // 处理返回对象的方法
      isShowLoading = true, // 是否显示loadding
      changeSignWay = false,
      isMock = false
    } = parameter
    this.ajax({
      url,
      params,
      method,
      isShowLoading,
      isMock,
      changeSignWay
    }).then((data) => {
      if (data && data.data && data.data.data) {
        let dataList = data.data.data.map((item, index) => {
          item.key = item.id;
          return item;
        });
        _this.setState({
          confirmLoading: false,
          pageSize: data.data.pageSize,
          [list]: dataList,
          pagination: Utils.pagination(_this, data.data, pages, (current) => {
            _this.params.page = current;
            _this.requestList();
          })
        }, () => {
          handleList();
        })
      } else if (data && data.data) {
        let dataList = data.data.map((item, index) => {
          item.key = item.id;
          return item;
        });
        _this.setState({
          confirmLoading: false,
          [list]: dataList
        }, () => {
          handleList();
        })
      }
    }).catch((data) => {
      Modal.info({
        title: '提示',
        content: '网络出错，请刷新重试或联系相关工作人员',
        onOk: () => { }
      })
    });
  }

  // Ajax请求封装
  static ajax(options) {
    let baseUrl = '';
    if (options.isMock) {
      baseUrl = '';
    } else {
      baseUrl = 'https://test.qqmmsh.com/mxomsapi';
    }
    let data = {
      "sourceId": options.changeSignWay ? 2 : 1
    }
    data = Object.assign(data, options.params || {}); // 合并对象
    let md5 = md5Encryption(data, options.changeSignWay ? 'kB50erIyBe3ci4R7fsuyWuX4Raq7OGMv' : 'kB50erItBe3ci4R7fsuyWuX4Raq7OGMv'); // 加密对象
    let params = Object.assign(data, { signed: md5 }); // 合并对象
    return new Promise((resolve, reject) => {
      axios({
        url: options.url,
        method: options.method || "GET",
        baseURL: baseUrl,
        timeout: 10000,
        params: options.isMock ? undefined : params,
        withCredentials: options.cookie ? true : false,
        headers : options.headers || '',
        data: options.data || ''
      }).then((response) => {
        if (response.status === 200) {
          let data = response.data;
          if (data.errorCode === 200) {
            resolve(data);
          } else if (data.errorCode === 401) {
            if (options.cookie) {
              // window.location.replace('https://oms.uwooz.com/login');
            } else {
              resolve(data);
            }
          } else if (data.errorCode === 400) {
            Modal.info({
              title: '提示',
              content: data.message,
              onOk: () => { }
            })
          } else {
            Modal.info({
              title: '提示',
              content: data.message,
              onOk: () => { }
            })
          }
        } else {
          reject(response);
        }
      }).catch((response) => {
        reject(response);
      })
    })
  }
}