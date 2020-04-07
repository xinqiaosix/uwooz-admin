import Mock from 'mockjs'

const Random = Mock.Random

const orderList = function() {
  let list = []
  for(let i = 1; i <= 2; i++){
    let product = []
    for(let j = 1; j <= Random.integer(1,3); j++)
    {
      let productObject = {
        productImg: Random.dataImage('300x250'),
        productName:'百世可乐',
        spec: Random.natural(1, 5) + 'L',
        price: Random.natural(5, 20),
        count: Random.integer(1, 10),
        status: Random.integer(0, 1)
      }
      product.push(productObject)
    }

    const discount = Random.float(0, 10,0, 2)
    const freight = Random.float(0, 10, 0, 2)
    const totalPrice = Random.natural(20,100)
    const paymentAmount = totalPrice + freight - discount

    let orderObject = {
      id: i,
      paymentAmount: paymentAmount.toFixed(2),
      totalPrice: totalPrice,
      freight: freight,
      discount: discount,
      buyerName: Random.cname(),
      buyerPhone: '1234567895',
      delivery: Random.integer(1, 4),
      orderStatus: Random.integer(1, 6),
      orderNum: Random.string('number', 12),
      createTime:Random.date('yyyy-MM-dd') + ' ' +Random.time('HH:mm:ss'),
      business: '星巴克',
      integral: Random.natural(1,5),
      coupon: `满${Random.integer(10, 20)}减${Random.float(0, 10,0, 2)}`,
      orderType: Random.integer(1,4),
      productList:product
    }

    list.push(orderObject)
  }

  let data = {
    page: 1,
    pageSize: 10, 
    total: 2,
    data: [...list]  
  }
  return {
    data: data
  }
} 

// 拦截ajax请求，配置mock的数据
Mock.mock(/mock\/api\/orderList/, 'get', orderList)


// 订单类型
const orderType = function() {
  let typeList = [{
    id: 1,
    name: '商城销售',
  }, {
    id: 2,
    name: '付款码支付',
  }, {
    id: 3,
    name: '服务预订',
  }, {
    id: 4,
    name: '门店销售',
  }]

  return {
    data: typeList
  }
}

Mock.mock(/mock\/api\/orderType/, 'get', orderType)

// 配送方式
const delivery = function() {
  let deliveryList = [{
    id: 1,
    name: '门店销售',
  }, {
    id: 2,
    name: '快递发货',
  }, {
    id: 3,
    name: '上门自提',
  }, {
    id: 4,
    name: '同城配送',
  }]

  return {
    data: deliveryList
  }
}

Mock.mock(/mock\/api\/delivery/, 'get', delivery)