import Mock from 'mockjs'
import { random } from 'node-forge';

// 标签列表
const tagData = function() {
  const tagList = [
    {
      id: 1,
      name: '拍照',
      count: 56
    }, {
      id: 2,
      name: '上海',
      count: 22
    }, {
      id: 3,
      name: '浙江省',
      count:89
    }, {
      id: 4,
      name: '打高尔夫',
      count: 3
    }, {
      id: 5,
      name: '消费超过1万元',
      count:12
    }
  ]

  return {
    data: tagList
  }
}

// 拦截ajax请求，配置mock的数据
Mock.mock(/mock\/api\/tagList/, 'get', tagData)


// 会员列表数据
const Random = Mock.Random
const memberData = function() {
  let list = []
  for(let i = 1; i<= 5; i++) {
    let memberObject = {
      id: i,
      vipName: Random.cname(),
      avatar: Random.dataImage('300x250'),
      integral: Random.natural(500, 1000),
      sex: Random.natural(0, 1),
      phoneNum: '12345668751',
      name: '-',
      birthday: Random.date(),
      source: '有我在App',
      comment: '这个人很喜欢玩经常来',
      email: Random.email(),
      local: Random.city(true),
      registerDate: Random.date(),
      availableIntegral: Random.natural(600,2000),
      integral: Random.natural(200, 600),
      money: Random.natural(500, 1000),
      tagList: [Random.natural(1,2),Random.natural(3,5)]
    }
    list.push(memberObject)
  }
  let data = {
    page: 1,
    pageSize: 10, 
    total: 5,
    data: [...list]  
  }
  return {
    data: data
  }
}  

// 拦截ajax请求，配置mock的数据
Mock.mock(/mock\/api\/membershipList/, 'get', memberData)