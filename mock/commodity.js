import Mock from 'mockjs'

// 获取 mock.Random 对象
const Random = Mock.Random
// mock一组数据
const commondityListData = function () {
  let data = []
  for (let i = 0; i < 100; i++) {
    let newArticleObject = {
      commodity: {
        name: '百事可乐',
        picture: Random.dataImage('80x80', '商品图片')
      },
      price: Random.natural(0, 1000),
      sort: '地方特产-酒类',
      type: '实物商品',
      stock: Random.natural(0, 100),
      merchant: '星巴克',
      id: Random.natural(0, 100)
    }
    data.push(newArticleObject)
  }
  return {
    data: data
  }
}

// 拦截ajax请求，配置mock的数据
Mock.mock(/mock\/api\/businessManagement\/commodity/, 'get', commondityListData)
