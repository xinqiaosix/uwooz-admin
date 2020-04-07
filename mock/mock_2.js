import Mock from 'mockjs';

// 景区项目
const scenicSpotList = function() {
  let data = {
    page: 1,
    pageSize: 10,
    total: 5,
    data:[
      {
        id: 1,
        scenicSpot:  '默认景区',
        identification: 'muxin-wqe' ,
        personInCharge: '武一',
        state:2,
        phoneNum: '13073636278',
      },
      {
        id: 2,
        scenicSpot:  '浙江皋亭山',
        identification: 'muxin-weretet' ,
        personInCharge: '马二',
        state:1,
        phoneNum: '13073635643',
      },
      {
        id: 3,
        scenicSpot:  '浙江千岛湖',
        identification: 'muxin-qwqe' ,
        personInCharge: '张三',
        state:0,
        phoneNum: '13073631241',
      },
      {
        id: 4,
        scenicSpot:  '浙江千桃园',
        identification: 'muxin-sdfds' ,
        personInCharge: '李四',
        state:1,
        phoneNum: '13172636273',
      },
      {
        id: 5,
        scenicSpot:  '江西曹山',
        identification: 'muxin-ojbk' ,
        personInCharge: '王五',
        state:0,
        phoneNum: '13175646138',
      },
    ]
   
  }

  return {
    data: data
  }
}

// 拦截ajax请求, 配置mock数据
Mock.mock(/mock\/api\/scenicSpotLink/, 'get', scenicSpotList);

// 企业信息
const enterprise = function() {
  let data = {
    page: 1,
    pageSize: 10,
    total: 1,
    data:
      {
        name: '杭州牧心网络科技有限公司',
        id: 10009237,
        contacts: '李立',
        phoneNum: '13734579843',
        mailbox: 'mx@qqmmsh.cn',
        userName: 'muxin',
        nameText: '李立',
        enterprisePhone: '13734579843',
        publicNumber: '有我在UWOOZ',
        AppID: 'wx3498385hrj6bxs',
        AppSecret: '834390jhksdfuy78hj32n',
        businessName: '1516872861',
      },    
   
  }

  return {
    data: data
  }
}

// 拦截ajax请求, 配置mock数据
Mock.mock(/mock\/api\/enterpriseInfo/, 'get', enterprise);

// 物流管理 地址库
const addressList = function() {
  let data = {
    page: 1,
    pageSize: 10,
    total: 5,
    data: [
      {
        id: 1,
        name:  '星巴克曹山店',
        phoneNum: '13073636278',
        address: '浙江省杭州市拱墅区祥园路33号五楼B509室',
        store: '星巴克',
        type:0,
      },
      {
        id: 2,
        name:  '中秋山居',
        phoneNum: '13073634316',
        address: '浙江省杭州市拱墅区祥园路23号五楼B102室',
        store: '中秋山居',
        type:1,
      },
      {
        id: 3,
        name:  '千桃园',
        phoneNum: '13073633314',
        address: '浙江省杭州市拱江干区文博路10号1楼B1001室' ,
        store: '千桃园',
        type:2,
      },
      {
        id: 4,
        name:  '皋亭山',
        phoneNum: '13073631346',
        address: '浙江省杭州市拱江干区三义路10号' ,
        store: '皋亭山',
        type:2,
      },
      {
        id: 5,
        name:  '龙居寺',
        phoneNum: '13073633103',
        address: '浙江省杭州市拱江干区千桃园龙居寺南公交站' ,
        store: '龙居寺',
        type:1,
      },
    ]
  }

  return {
    data: data
  }
}

// 拦截 ajax 请求 配置 mock 数据
Mock.mock(/mock\/api\/addressList/, 'get', addressList);

// 运费模板
const moduleList = function() {
  let data = {
    page: 1,
    pageSize: 10,
    total: 5,
    data: [
      {
        id: 1,
        region:  '上海市,江苏省,浙江省,安徽省',
        firstPriority: '2kg',
        freight: '5',
        continuousWeight: '1kg',
        renew:2,
      },
      {
        id: 2,
        region:  '上海市,江苏省,浙江省,安徽省',
        firstPriority: '2kg',
        freight: '4',
        continuousWeight: '2kg',
        renew:4,
      },
      {
        id: 3,
        region:  '内蒙古自治区,辽宁省,吉林省,黑龙江省,海南省,',
        firstPriority: '4kg',
        freight: '8' ,
        continuousWeight: '3kg',
        renew:6,
      },
      {
        id: 4,
        region:  '西藏自治区,宁夏回族自治区,新疆维吾尔自治区',
        firstPriority: '1kg',
        freight: '9' ,
        continuousWeight: '2kg',
        renew:4,
      },
      {
        id: 5,
        region:  '内蒙古自治区,辽宁省,吉林省,黑龙江省,海南省,西藏自治区,宁夏回族自治区,新疆维吾尔自治区',
        firstPriority: '5kg',
        freight: '4' ,
        continuousWeight: '9kg',
        renew:18,
      },
    ]
  }

  return {
    data: data
  }
}

// 拦截 ajax 请求 配置 mock 数据
Mock.mock(/mock\/api\/moduleList/, 'get', moduleList);

// 运费模板
const storeList = function() {
  let data = {
    page: 1,
    pageSize: 10,
    total: 5,
    data: [
      {
        id: 1,
        name:  '星巴克',
      },
      {
        id: 2,
        name:  '中秋山居',
      },
      {
        id: 3,
        name:  '千桃园',
      },
      {
        id: 4,
        name:  '皋亭山',
      },
      {
        id: 5,
        name:  '龙居寺',
      },
    ]
  }

  return {
    data: data
  }
}

// 拦截 ajax 请求 配置 mock 数据
Mock.mock(/mock\/api\/storeList/, 'get', storeList);


// 卡券统计列表
const creadList = function() {
  let data = {
    page: 1,
    pageSize: 6,
    total: 8,
    data: [
      {
        id: 1,
        card:  '星巴克5元优惠券',
        dateOfLaunch: '2019-9-26 12:34:09' ,
        cancellationDate: '2019-9-26 14:21:16',
        business: '星巴克',
        member: '赵一',
      },
      {
        id: 3,
        card:  '星巴克10元优惠券',
        dateOfLaunch: '2019-9-26 12:34:09' ,
        cancellationDate: '2019-9-26 14:21:16',
        business: '星巴克',
        member: '赵一',
      },
      {
        id: 5,
        card:  '星巴克15元优惠券',
        dateOfLaunch: '2019-9-26 12:34:09' ,
        cancellationDate: '2019-9-26 14:21:16',
        business: '星巴克',
        member: '李二',
      },
      {
        id: 6,
        card:  '星巴克20元优惠券',
        dateOfLaunch: '2019-9-26 12:34:09' ,
        cancellationDate: '2019-9-26 14:21:16',
        business: '星巴克',
        member: '孙笑笑',
      },
      {
        id: 7,
        card:  '星巴克25元优惠券',
        dateOfLaunch: '2019-9-26 12:34:09' ,
        cancellationDate: '2019-9-26 14:21:16',
        business: '星巴克',
        member: '孙笑笑',
      },
    ]
  }

  return {
    data: data
  }
}

// 拦截 ajax 请求 配置 mock 数据
Mock.mock(/mock\/api\/creadList/, 'get', creadList);