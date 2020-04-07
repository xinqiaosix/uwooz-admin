import Mock from 'mockjs'

// mock一组数据
const salesVolumeList = function () {
  let List = [{
    id: 1,
    name: '全部',
  }, {
    id: 2,
    name: '酒店/民宿',
  }, {
    id: 3,
    name: '博物馆',
  }, {
    id: 4,
    name: '特产地摊',
  }]

  return {
    data: List
  }
}

// 拦截ajax请求，配置mock的数据
Mock.mock(/mock\/api\/businessType/, 'get', salesVolumeList)