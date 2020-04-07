/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-16 15:15:42
 * @LastEditTime: 2019-08-21 11:42:44
 * @LastEditors: Please set LastEditors
 */
import Mock from 'mockjs'

Mock.setup({
  timeout: '0'
})

// 通知管理
Mock.mock('/home', 'get', {
  "errorCode": 200,
  "message": "success",
  "data": {
    "page": 1,
    "pageSize": 10,
    "total": 5,
    "data|5": [1, 2, 3, 4, 5]
  }
})

// 职员管理
Mock.mock('/staffManagement', 'post', {
  "errorCode": 200,
  "message": "success",
  "data": {
    "page": 1,
    "pageSize": 10,
    "total": 5,
    "data|5": [
      {
        "id|+1": 0,
        "number|+1": 0,
        "name|1": ["Jack", "Luck", 'Bob'],
        "phone": '13712345678',
        "department": '技术部',
        "rank": '职员',
        "startTime": '2018-5-8',
        "character": '前端',
        "operate": '操作'
      }
    ]
  }
})

//补货管理
Mock.mock('/replenishmentRecord', 'post', {
  "errorCode": 200,
  "message": "success",
  "data": {
    "page": 1,
    "pageSize": 10,
    "total": 5,
    "data|5": [
      {
        "id|+1": 0,
        //"number|+1": 0,
        "replenishmentTime":'2018-11-1 14:18:35',
        "replenishmentPersonnel":"傅小云",
        "quantity":10,
        "location":"服务点",
        "depot":"2号仓库",
        "cancel":'否',
        "return":'否',
        "operate": '操作'
      }
    ]
  }
})
// 首页渲染数据
Mock.mock('/userManage/getManage', 'post', {
  "errorCode": 200,
  "message": "已登录",
  "data": [{
      "id": 10,
      "name": "首页",
      "state": 1,
      "menu": "1",
      "authTwolist": [{
          "name": "每日统计",
          "menu": "1",
          "pid": 10
        },
        {
          "name": "游客量监控",
          "menu": "2",
          "pid": 10
        },
        {
          "name": "售票统计",
          "menu": "3",
          "pid": 10
        },
        {
          "name": "运营监控",
          "menu": "4",
          "pid": 10
        }
      ],
      "pid": 1
    },
    {
      "id": 20,
      "name": "日常运营",
      "state": 1,
      "menu": "2",
      "authTwolist": [{
          "name": "通知管理",
          "menu": "5",
          "pid": 20
        },
        {
          "name": "活动管理",
          "menu": "6",
          "pid": 20
        }
      ],
      "pid": 1
    },
    {
      "id": 30,
      "name": "财务管理",
      "state": 1,
      "menu": "3",
      "authTwolist": [{
          "name": "每日报表",
          "menu": "7",
          "pid": 30
        },
        {
          "name": "总报表",
          "menu": "8",
          "pid": 30
        }
      ],
      "pid": 1
    },
    {
      "id": 40,
      "name": "商品管理",
      "state": 1,
      "menu": "4",
      "authTwolist": [{
          "name": "商品列表",
          "menu": "9",
          "pid": 40
        },
        {
          "name": "库存管理",
          "menu": "10",
          "pid": 40
        },
        {
          "name": "采购",
          "menu": "11",
          "pid": 40
        },
        {
          "name": "申领管理",
          "menu": "12",
          "pid": 40
        },
        {
          "name": "补货",
          "menu": "13",
          "pid": 40
        },
        {
          "name": "出入库单列表",
          "menu": "14",
          "pid": 40
        }
      ],
      "pid": 1
    },
    {
      "id": 50,
      "name": "设备管理",
      "state": 1,
      "menu": "5",
      "authTwolist": [{
        "name": "设备列表",
        "menu": "15",
        "pid": 50
      }],
      "pid": 1
    },
    {
      "id": 60,
      "name": "票务管理",
      "state": 1,
      "menu": "6",
      "authTwolist": [{
          "name": "散票",
          "menu": "16",
          "pid": 60
        },
        {
          "name": "团队票",
          "menu": "17",
          "pid": 60
        }
      ],
      "pid": 1
    },
    {
      "id": 70,
      "name": "服务点管理",
      "state": 1,
      "menu": "7",
      "authTwolist": [{
        "name": "服务点",
        "menu": "18",
        "pid": 70
      }],
      "pid": 1
    },
    {
      "id": 80,
      "name": "基本信息管理",
      "state": 1,
      "menu": "8",
      "authTwolist": [{
          "name": "服务点类型管理",
          "menu": "19",
          "pid": 80
        },
        {
          "name": "职位类型",
          "menu": "20",
          "pid": 80
        },
        {
          "name": "票务类型管理",
          "menu": "21",
          "pid": 80
        },
        {
          "name": "仓库管理",
          "menu": "22",
          "pid": 80
        },
        {
          "name": "部门管理",
          "menu": "23",
          "pid": 80
        },
        {
          "name": "商品类型管理",
          "menu": "24",
          "pid": 80
        },
        {
          "name": "角色管理",
          "menu": "25",
          "pid": 80
        },
        {
          "name": "公司管理",
          "menu": "26",
          "pid": 80
        }
      ],
      "pid": 1
    },
    {
      "id": 90,
      "name": "行政",
      "state": 1,
      "menu": "9",
      "authTwolist": [{
        "name": "职员管理",
        "menu": "27",
        "pid": 90
      }],
      "pid": 1
    }
  ]
})

// 出入库单列表
Mock.mock('/InAndOutStock', 'post', {
  "errorCode": 200,
  "message": "success",
  "data": {
    "page": 1,
    "pageSize": 10,
    "total": 8,
    "data|8": [
      {
        "id|+1": 0,
        "name|1": ["操作人1号", "操作人2号", '操作人3号'],      
        "createTime":'2018-10-11',
        "type|1": ["出库","入库","损耗"],
        "cancle|1": ['是','否'],
        "number|1": [0,10,15],
        "warehouse|1": ["一号仓库", "二号仓库", '三号仓库'],
        "overTime": '2018-11-10',
        "personnel|1": ["测试员1号", "测试员2号", '测试员3号'],
        "goods|1": ['牛奶','旺仔小馒头','农夫山泉','雪碧']
      }
    ]
  }
})

// 物资列表
Mock.mock('/MaterialList', 'post', {
  "errorCode": 200,
  "message": "success",
  "data": {
    "page": 1,
    "pageSize": 10,
    "total": 8,
    "data|8": [ 
      {
          'id|+1': 0,
          'name|1': ["物资名称1号", "物资名称2号", "物资名称3号"],
          'spec':'规格',
          'materialTrpe': '物资类型',
          'price': '价格',
          'materialTerm': '保质期',
          'bjImg': 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'
      },   
    ]
  }
})

// 智慧射箭 头部信息
Mock.mock('/orderTopInfo', 'post', {
  "errorCode": 200,
  "message": "success",
  "data": {
    "page": 1,
    "pageSize": 1,
    "total": 1,
    "data|1": [ 
      {
        'deviceInfo': '智慧射箭1号',
        'creationTime': '2018-12-12',
        'activationTime':'2019-01-05',
        'type': '智慧射箭',
        'servicePoint': '孝道馆',
        'activatePersonnel': '谁呀',
        'administrator': '我',
        'status|1': ['激活','未激活'],
      },    
    ]
  }
})

// 智慧射箭 订单列表,
Mock.mock('/orderList', 'post', {
  "errorCode": 200,
  "message": "success",
  "data": {
    "page": 1,
    "pageSize": 10,
    "total": 10,
    "data|10": [ 
      {
        'id|+1': 1,
        'name|1': ["测试1号", "测试2号", "测试3号", "测试4号" ,"测试5号"],
        'amount|1':['30万', '40万',' 60万', '500万', '100万'],
        // 'amount|1':[30, 40, 60, 500, 100],
        'orderStatus|1': ['成功','退款'],
        'billingStatus|1': ['已结算','未结算'],
        'payTime|1': ['2019-1-25 14:25','2019-1-26 14:25','2019-1-27 14:25','2019-1-30 14:25','2019-1-30 14:25'],
        'img': require('@/assets/images/head.png')
      },   
  
    ]
  }
})

// 观光车 设备列表,
Mock.mock('/SightseeingCar', 'post', {
  "errorCode": 200,
  "message": "success",
  "data": {
    "page": 1,
    "pageSize": 10,
    "total": 10,
    "data|10": [ 
      {
        'key|+1': 10,
        'id|+1': 1,
        'carName': "皋亭山景区观光车", 
        'model|1':['WLQ5110', 'WLQ5112',' WLQ5113', 'WLQ5114', 'WLQ5115'],
        'carNumber|1': ['浙A666666','浙A888888','浙A999999'],
        'operationState|1': [0,1,3],
        'driverName|1': ['张三','李四','王五','马六','冯七'],
        'lineName': '从孝道馆至千桃园观光路线',
        'administrators|1':['张飞','关羽','刘备','诸葛亮'],
      },   
  
    ]
  }
})

// 观光车 => 司机列表,
Mock.mock('/driverData', 'post', {
  "errorCode": 200,
  "message": "success",
  "data": {
    "page": 1,
    "pageSize": 10,
    "total": 10,
    "data|10": [ 
      {
        'key|+1': 10,
        'id|+1': 1,
        'carName|1': ["小二","张三","李四","王五","马六","冯七","猪八",],
        'headPortrait|1': [require('@/assets/images/touxiang.jpg'),require('@/assets/images/head.png'),require('@/assets/images/11.gif'),require('@/assets/images/22.jpg')],
        'cellphoneNumber|1': ['18339837890','13766366543','13773636151','13766564567'],
        'sex|1': ['男','女'],
        'age|1': ['20','22','23','24','26'],
        'idNumber|1': ['411322199202254555','411322199303154512','411322199304104513','411322199405124325'],
        'onboardingTime|1':['2019-02-15','2019-03-18','2019-04-20','2019-05-21','2019-06-08'],

      },   
      
    ]
  }
})


// 观光车 => 观光车详情组件 => 上下班记录
Mock.mock('/punchRecord', 'post', {
  "errorCode": 200,
  "message": "success",
  "data": {
    "page": 1,
    "pageSize": 10,
    "total": 10,
    "data|10": [ 
      {
        'key|+1': 10,
        'id|+1': 1,
        'driver|1': ["小二","张三","李四","王五","马六","冯七","猪八",],
        'type|1': ['上班','下班'],
        'serviceLine|1': ['千桃园环线','皋亭山环线','神农山环线'] ,
        'ticketCheckingTime|1': ['2019-1-25','2019-1-26','2019-1-27','2019-1-30','2019-1-30'],
      },   
      
    ]
  }
})

// 观光车 => 观光车详情组件 => 报修与维修记录
Mock.mock('/repair', 'post', {
  "errorCode": 200,
  "message": "success",
  "data": {
    "page": 1,
    "pageSize": 10,
    "total": 10,
    "data|10": [ 
      {
        'key|+1': 10,
        'id|+1': 1,
        'type|1': ['报修','维修'],
        'operator|1': ["小二","张三","李四","王五","马六","冯七","猪八",],
        'operationTime|1': ['2019-1-25','2019-1-26','2019-1-27','2019-1-30','2019-1-30'],
        'reason|1': ['挡板坏了','油箱漏油','倒车镜破裂'] ,
        'remarks|1': ['需要尽快维修','油箱漏油','倒车镜破裂'] ,       
      },   
      
    ]
  }
})


// 观光车 => 管理人员列表;
Mock.mock('/adminData', 'post', {
  "errorCode": 200,
  "message": "success",
  "data": {
    "page": 1,
    "pageSize": 10,
    "total": 10,
    "data|10": [ 
      {
        'key|+1': 10,
        'id|+1': 1,
        'name|1': ["小二","张三","李四","王五","马六","冯七","猪八",]  
      },   
      
    ]
  }
})

// 观光车 => 上下班记录
Mock.mock('/commuteRecord', 'post', {
  "errorCode": 200,
  "message": "success",
  "data": {
    "page": 1,
    "pageSize": 10,
    "total": 30,
    "data|30": [ 
      {
        'key|+1': 10,
        'id|+1': 1,
        'time|1': ['2019-1-25','2019-1-26','2019-1-27','2019-1-30','2019-1-30'],
        'status|1': ['上班','下班'],
        'vehicleType|1': ['WLQ5113','WLQ5115','WLQ6223','WTP1223'],
        'lineName|1': ['千桃园环线','皋亭山环线','神农山环线'] 
      },   
      
    ]
  }
})



// 观光车 => 提成表单
Mock.mock('/royaltyForm', 'post', {
  "errorCode": 200,
  "message": "success",
  "data": {
    "page": 1,
    "pageSize": 10,
    "total": 10,
    "data|10": [ 
      {
        'key|+1': 10,
        'id|+1': 1,
        'ticketingType|1': ["成人票","儿童票","特价票",],
        'number|1': ['3','2','5','8','1'],
        'royaltyAmount|1': ['￥2','￥3.5','￥6','￥5','￥1.5'],
        'ticketCheckingTime|1': ['2019-1-25 14:25','2019-1-26 14:25','2019-1-27 14:25','2019-1-30 14:25','2019-1-30 14:25'],
        'settlementStatus|1': ['已结算','未结算'],
      },   
      
    ]
  }
})

// 共享单车 => 订单列表
Mock.mock('/adminBicycleData', 'post', {
  "errorCode": 200,
  "message": "success",
  "data": {
    "page": 1,
    "pageSize": 10,
    "total": 10,
    "data": [ 
      {
        "id": 3999,
        "orderNumber": "TCWX1904091134111452971368",
        "totalPrice": "200.00",
        "payTime": "2019-04-09 11:31:55",
        "consumeStatus": 3,
        "comment": "单车(四人),2019040911314610898868843",
        "equipId": "1000067"
      },
      {
          "id": 3981,
          "orderNumber": "TCWX1904081752252033968555",
          "totalPrice": "200.00",
          "payTime": "2019-04-08 17:50:11",
          "consumeStatus": 3,
          "comment": "单车(双人),2019040817495512044973081",
          "equipId": "1000062"
      },
      {
          "id": 3980,
          "orderNumber": "TCWX1904081741585742702849",
          "totalPrice": "200.00",
          "payTime": "2019-04-08 17:39:46",
          "consumeStatus": 3,
          "comment": "单车(双人),2019040817393510330219635",
          "equipId": "1000062"
      },
      {
          "id": 3979,
          "orderNumber": "TCAP1904081651327146757724",
          "totalPrice": "200.00",
          "payTime": "2019-04-08 16:49:18",
          "consumeStatus": 1,
          "comment": "单车(四人),2019040816491010330514838",
          "equipId": "1000067"
      },
      {
          "id": 3971,
          "orderNumber": "TCAP1904081553576442798716",
          "totalPrice": "200.00",
          "payTime": "2019-04-08 15:51:48",
          "consumeStatus": 3,
          "comment": "单车(四人),2019040815505610386290100",
          "equipId": "1000053"
      },
      {
          "id": 3945,
          "orderNumber": "TCAP1904081525313146600616",
          "totalPrice": "200.00",
          "payTime": "2019-04-08 15:23:30",
          "consumeStatus": 1,
          "comment": "单车(四人),2019040815230911489553277",
          "equipId": "1000067"
      },
      {
          "id": 3938,
          "orderNumber": "TCAP1904081458338436759352",
          "totalPrice": "200.00",
          "payTime": "2019-04-08 14:56:22",
          "consumeStatus": 1,
          "comment": "单车(四人),2019040814561111119258233",
          "equipId": "1000026"
      },
      {
          "id": 3927,
          "orderNumber": "TCAP1904081353255681079714",
          "totalPrice": "200.00",
          "payTime": "2019-04-08 13:51:16",
          "consumeStatus": 1,
          "comment": "单车(四人),2019040813510311997141898",
          "equipId": "1000067"
      },
      {
          "id": 3924,
          "orderNumber": "TCAP19040812540249142882",
          "totalPrice": "200.00",
          "payTime": "2019-04-08 12:51:49",
          "consumeStatus": 1,
          "comment": "单车(四人),2019040812513210613252978",
          "equipId": "1000053"
      },
      {
          "id": 3893,
          "orderNumber": "TCWX1904071716355853400340",
          "totalPrice": "200.00",
          "payTime": "2019-04-07 17:14:32",
          "consumeStatus": 1,
          "comment": "单车(四人),2019040717141111772937033",
          "equipId": "1000083"
      }   
    ]
  }
})

//票务管理
Mock.mock('/ticketList', 'post', {
  "errorCode": 200,
  "message": "success",
  "data": {
    "page": 1,
    "pageSize":10,
    "total":2,
     "data":[
       {
         'id':1,
         'ticketDescribe':'这里是票务描述这里是票务描述这里是票务描述这里是票务描述这里是票务描述',
         'name':'票务1',
         'ticketMessage':[
           {
             'name':'成人票',
             'price':20,
             'integral':10,
             'royaltyRatio':'5%',
             'id':1
           },
           {
            'name':'儿童票',
            'price':10,
            'integral':20,
            'royaltyRatio':'7%',
            'id':2
          },
          {
            'name':'特价票',
            'price':25,
            'integral':30,
            'royaltyRatio':'10%',
            'id':3
          }
         ]
         
       },
       {
        'id':2,
        'ticketDescribe':'这里是票务描述这里是票务描述这里是票务描述这里是票务描述这里是票务描述',
          'name':'票务2',
        'ticketMessage':[
          {
            'name':'成人票',
            'price':20,
            'integral':10,
            'royaltyRatio':'5%',
            'id':4
          },
          {
           'name':'儿童票',
           'price':10,
           'integral':20,
           'royaltyRatio':'7%',
           'id':5
         },
        
        ]
        
      },
      {
        'id':6,
        'ticketDescribe':'这里是票务描述这里是票务描述这里是票务描述这里是票务描述这里是票务描述',
        'name':'成人票',
        'price':20,
        'integral':10,
        'royaltyRatio':'5%',
        'ticketMessage':[
        ]
        
      },
      
     ]
  }
})

//观光车票务管理
Mock.mock('/sightticketList', 'post', {
  "errorCode": 200,
  "message": "success",
  "data": {
    "page": 1,
    "pageSize":10,
    "total":2,
     "data":[
       {
         'id':1,
         'ticketDescribe':'这里是票务描述这里是票务描述这里是票务描述这里是票务描述这里是票务描述',
         'lineName':'从孝道馆至千桃园观光路线',
         'pathList':[
           {
             'id':1,
             'name':'站点1'
           },
           {
            'id':2,
            'name':'站点2'
          },
          {
            'id':3,
            'name':'站点3'
          },
          {
            'id':4,
            'name':'站点4'
          }
         ],
         'ticketMessage':[
           {
             'name':'成人票',
             'price':20,
             'integral':10,
             'royaltyRatio':'5%',
             'id':1
           },
           {
            'name':'儿童票',
            'price':10,
            'integral':20,
            'royaltyRatio':'7%',
            'id':2
          },
          {
            'name':'特价票',
            'price':25,
            'integral':30,
            'royaltyRatio':'10%',
            'id':3
          }
         ]
         
       },
       {
        'id':2,
        'ticketDescribe':'这里是票务描述这里是票务描述这里是票务描述这里是票务描述这里是票务描述',
        'lineName':'从孝道馆至千桃园观光路线',
        'pathList':[
          {
            'id':1,
            'name':'站点1'
          },
          {
           'id':2,
           'name':'站点2'
         },
         {
           'id':3,
           'name':'站点3'
         },
         {
           'id':4,
           'name':'站点4'
         }
        ],
        'ticketMessage':[
          {
            'name':'成人票',
            'price':20,
            'integral':10,
            'royaltyRatio':'5%',
            'id':4
          },
          {
           'name':'儿童票',
           'price':10,
           'integral':20,
           'royaltyRatio':'7%',
           'id':5
         },
        
        ]
        
      },
      
      
     ]
  }
})

//观光车线路管理
Mock.mock('/sightseeingLine', 'post', {
  "errorCode": 200,
  "message": "success",
  "data": {
    "page": 1,
    "pageSize":10,
    "total":4,
     "data":[
       {
         'id':1,
         'ticketDescribe':'这里是票务描述这里是票务描述',
         'lineName':'从孝道馆至千桃园观光路线',
         'stationname':'1站-2站-3站-4站'
       },
       {
        'id':2,
        'ticketDescribe':'这里是票务描述这里是票务描述',
        'lineName':'线路1',
        'stationname':'1站-2站-3站-4站'
      },
      {
        'id':3,
        'ticketDescribe':'这里是票务描述这里是票务描述',
        'lineName':'线路2',
        'stationname':'1站-2站-3站-4站'
      },
      {
        'id':4,
        'ticketDescribe':'这里是票务描述这里是票务描述',
        'lineName':'线路3',
        'stationname':'1站-2站-3站-4站'
      }
      ]
  }
})

//设备管理-观光车票
Mock.mock('/sightTickets', 'post', {
  "errorCode": 200,
  "message": "success",
  "data": {
    "page": 1,
    "pageSize":10,
    "total":2,
     "data":[
       {
         'id':1,
         'ticketDescribe':'这里是票务描述这里是票务描述',
         'lineName':'从孝道馆至千桃园观光路线',
         'stationname':'1站-2站-3站-4站',
         'ticket':'票务1',
          'ticketList':[
            {
              'id':'1',
              'specs':'成人票',
              'price':'20',
              'usecoin':'20',
              'proportion':'10'
            },
            {
              'id':'2',
              'specs':'儿童票',
              'price':'20',
              'usecoin':'20',
              'proportion':'10'
            },
            {
              'id':'3',
              'specs':'特价票',
              'price':'20',
              'usecoin':'20',
              'proportion':'5'
            },
          
          ]
       },
       {
        'id':2,
        'ticketDescribe':'这里是票务描述这里是票务描述',
        'lineName':'线路1',
        'stationname':'1站-2站-3站-4站',
         'ticket':'票务2',
          'ticketList':[
            {
              'id':'4',
              'specs':'成人票',
              'price':'20',
              'usecoin':'20',
              'proportion':'10'
            },
            {
              'id':'5',
              'specs':'儿童票',
              'price':'20',
              'usecoin':'20',
              'proportion':'10'
            },
        
           ]
          },
          {
            'id':3,
            'ticketDescribe':'这里是票务描述这里是票务描述',
            'lineName':'线路1',
            'stationname':'1站-2站-3站-4站',
             'ticket':'票务2',
              'ticketList':[
                {
                  'id':'6',
                  'specs':'',
                  'price':'20',
                  'usecoin':'20',
                  'proportion':'10'
                },           
               ]
              }
      ]
  }
})

//新增票务-线路选择

Mock.mock('/sightTicketsLine', 'post', {
  "errorCode": 200,
  "message": "success",
  "data": {
    "page": 1,
    "pageSize":10,
    "total":2,
     "data":[
       {
         'id':1,
         'lineName':'从孝道馆至千桃园观光路线',
          'stationList':[
            {
              'id':'1',
              'stationname':'站点1'
            },
            {
              'id':'2',
              'stationname':'站点2'
            },
            {
              'id':'3',
              'stationname':'站点3'
            },
            {
              'id':'4',
              'stationname':'站点4'
            },
          ]
       },
       {
          'id':2,
          'lineName':'线路1',
          'stationList':[
            {
              'id':'5',
              'stationname':'站点5'
            },
            {
              'id':'6',
              'stationname':'站点7'
            },
            // {
            //   'id':'57',
            //   'stationname':'站点7'
            // },
           ]
          },
         
      ]
  }
})


//设备管理-镜子
Mock.mock('/mirrorList', 'post', {
  "errorCode": 200,
  "message": "success",
  "data": {
    "page": 1,
    "pageSize":10,
    "total":4,
    'data':[
      {
        id:1,
        equipName:'镜子1号',
        equipNum:'100001',
        severPoint:'皋亭山千桃园',
        admin:'张三',
        status:0,
        type:'智慧镜子',
        severNum:'1001',
        createTime:'2018-12-12',
        activationTime:'2018-12-12',
        activationPerson:'李四'

      },
      {
        id:2,
        equipName:'镜子2号',
        equipNum:'100002',
        severPoint:'孝道文化馆',
        admin:'李四',
        status:1,
        type:'智慧镜子',
        severNum:'1001',
        createTime:'2018-12-12',
        activationTime:'2018-12-12',
        activationPerson:'李四'
      },
      {
        id:3,
        equipName:'镜子3号',
        equipNum:'100003',
        severPoint:'皋亭山千桃园',
        admin:'张三',
        status:2,
        type:'智慧镜子',
        severNum:'1001',
        createTime:'2018-12-12',
        activationTime:'2018-12-12',
        activationPerson:'李四'
      },
      {
        id:4,
        equipName:'镜子4号',
        equipNum:'100004',
        severPoint:'孝道文化馆',
        admin:'李四',
        status:3,
        type:'智慧镜子',
        severNum:'1001',
        createTime:'2018-12-12',
        activationTime:'2018-12-12',
        activationPerson:'李四'
      },
      {
        id:5,
        equipName:'镜子5号',
        equipNum:'100005',
        severPoint:'孝道文化馆',
        admin:'李四',
        status:0,
        type:'智慧镜子',
        severNum:'1001',
        createTime:'2018-12-12',
        activationTime:'2018-12-12',
        activationPerson:'李四'
      },
      {
        id:6,
        equipName:'镜子6号',
        equipNum:'100006',
        severPoint:'皋亭山千桃园',
        admin:'张三',
        status:2,
        type:'智慧镜子',
        severNum:'1001',
        createTime:'2018-12-12',
        activationTime:'2018-12-12',
        activationPerson:'李四'
      },
    ]
  }
})





// 观光车 => 提成表单
Mock.mock('/scenicSpotProject', 'post', {

  "errorCode": 200,
  "message": "success",
  "data": {
    "page": 1,
    "pageSize": 10,

    "total": 5,
    "data|5": [{
      'id|+1': 1,
      'vipName|1': ["小二", "张三", "李四", "王五", ],
      'avatar|1': [require('@/assets/images/touxiang.jpg'), require('@/assets/images/head.png'), require('@/assets/images/11.gif'), require('@/assets/images/22.jpg')],
      'integral|1': [1900, 560, 326, 451, 550],
      'sex|1': [0, 1],
      'phoneNum|1': ['13745612347', '12345668751', '12354667854'],
      'name|1': ['-'],
      'birthday|1': ['1995年6月1日', '1996年7月1日', '1998年8月1日'],
      'source|1': ['有我在App'],
      'comment|1': ['这个人很喜欢玩经常来', '很喜欢'],
      'email|1': ['muxin@qqmmsh.com', '123@qq.com'],
      'local|1': ['中国-浙江省-杭州市', '中国-上海市', '中国-成都'],
      'registerDate|1': ['1995年6月1日', '1996年7月1日', '1998年8月1日'],
      'availableIntegral|1': [300, 500, 200, 100],
      // 'integral|1': [800, 900, 700],
      'money|1': [500, 200, 520],
      'tagList|1': [
        [{
          id: 2,
          name: '上海'
        }, {
          id: 1,
          name: '拍照'
        }, {
          id: 4,
          name: '打高尔夫'
        }],
        [{
          id: 3,
          name: '浙江省'
        }, {
          id: 5,
          name: '消费超过1万元'
        }],
        [{
          id: 4,
          name: '打高尔夫'
        }, {
          id: 2,
          name: '上海'
        }]
      ]
    }]
  }
})

// 会员列表
Mock.mock('/vipList', 'post', {
  "errorCode": 200,
  "message": "success",
  "data": {
    "page": 1,
    "pageSize": 10,
    "total": 5,
    "data|5": [{
      'id|+1': 1,
      'vipName|1': ["小二", "张三", "李四", "王五", ],
      'avatar|1': [require('@/assets/images/touxiang.jpg'), require('@/assets/images/head.png'), require('@/assets/images/11.gif'), require('@/assets/images/22.jpg')],
      'integral|1': [1900, 560, 326, 451, 550],
      'sex|1': [0, 1],
      'phoneNum|1': ['13745612347', '12345668751', '12354667854'],
      'name|1': ['-'],
      'birthday|1': ['1995年6月1日', '1996年7月1日', '1998年8月1日'],
      'source|1': ['有我在App'],
      'comment|1': ['这个人很喜欢玩经常来', '很喜欢'],
      'email|1': ['muxin@qqmmsh.com', '123@qq.com'],
      'local|1': ['中国-浙江省-杭州市', '中国-上海市', '中国-成都'],
      'registerDate|1': ['1995年6月1日', '1996年7月1日', '1998年8月1日'],
      'availableIntegral|1': [300, 500, 200, 100],
      'integral|1': [800, 900, 700],
      'money|1': [500, 200, 520],
      'tagList|1': [
        [{
          id: 2,
          name: '上海'
        }, {
          id: 1,
          name: '拍照'
        }, {
          id: 4,
          name: '打高尔夫'
        }],
        [{
          id: 3,
          name: '浙江省'
        }, {
          id: 5,
          name: '消费超过1万元'
        }],
        [{
          id: 4,
          name: '打高尔夫'
        }, {
          id: 2,
          name: '上海'
        }]
      ]
    }]
  }
})

// 会员标签列表
Mock.mock('/labelList', 'post', {
  "errorCode": 200,
  "message": "success",
  "data": [
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
})

// 商家经营类型
Mock.mock('/typelist', 'post', {
  "errorCode": 200,
  "message": "success",
  "data": [
    {
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
    }
  ]
})

// 商家列表
Mock.mock('/bussinessList', 'post', {
  "errorCode": 200,
  "message": "success",
  "data": {
    "page": 1,
    "pageSize": 10,
    "total": 3,
    "data|3": [{
      'id|+1': 1,
      'shopName|1': ["星巴克-曹山点", "希尔顿酒店", "孝道馆"],
      'avatar|1': [require('@/assets/images/touxiang.jpg'), require('@/assets/images/head.png'), require('@/assets/images/11.gif'), require('@/assets/images/22.jpg')],
      'type|1': ['餐饮/美食', '酒店/民宿', '博物馆'],
      'name|1': ['黎明', '周一', '周二'],
      'phoneNum|1': ['13745612347', '12345668751', '12354667854'],
      'comment|1': ['这个人很喜欢玩经常来', '很喜欢'],
      'local|1': [{
        localname: '中国 浙江省 杭州市',
        lng: '120.99871299',
        lat: '28.98176891'
      }, {
        localname: '江西省 曹山景区 建国路3号',
        lng: '120.99871299',
        lat: '28.98176891'
      }, {
        localname: '浙江省 杭州市 皋亭山景区',
        lng: '120.99871299',
        lat: '28.98176891'
      }],
    }]
  }
})

   

