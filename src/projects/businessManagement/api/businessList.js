import request from '@/utils/request'

/**
 * 获取商家列表
 * @param {{page: number, pageSize: number, merchantName: string }} param
 * @param param.page          第几页
 * @param param.pageSize      每页显示几条
 * @param param.merchantName  商户名称（用于搜索）
 * @param param.id        商户类型id
 */
export const getBusinessist = ({
  page = 1,
  pageSize = 10,
  ...rest
} = {}) => request({
  // baseURL:'',
  url:'/provider-merchants/findSomeMerchant',
  method:'get',
  params: {
    sourceId: null,
    // scenicId,
    page,
    pageSize,
    ...rest
  }
})


/**
 * 获取商户所有类型
 * 
 */
export const getBusinessType = () => request({
  url:'/provider-merchants/findList',
  method: 'get',
  param: { sourceId: 2 }
})

/**
 * 新建商家
 * @param {*}
 * @param { string } param.accountId      企业id
 * @param { string } param.address        商户地址
 * @param { string } param.brief          商户简介
 * @param { string } param.logoUrl        商户logo图片
 * @param { string } param.merchantName   商户名称
 * @param { number } param.merchantTypeId 商户类型
 * @param { string } param.mobile         电话
 * @param { string } param.realName       商家联系人姓名
 */
export const newBusiness = ({
  ...rest
} = {}) => request({
  url: '/provider-merchants/insertMerchant',
  method: 'post',
  data: {...rest }
})

/**
 * 查看商家具体信息
 * @param { number } param.id            商家id
 */

export const getOneBusinessInfo = (id) => request({
  // baseURL: '',
  url: `/provider-merchants/find/${id}`,
  method: 'get',
});

/**
 *删除商家
 * @param { number } param.id            商家id
 */
export const deleteBusiness = (id) => request({
  // baseURL:'',
  url: `/provider-merchants/delete/${id}`,
  method: 'delete',
  // data: { id }
});

/**
 * 修改商家信息
 * @param { * }
 * @param { string } param.address        商户地址
 * @param { string } param.id             商户id
 * @param { string } param.logoUrl        商户logo图片
 * @param { string } param.merchantName   商户名称
 * @param { number } param.merchantTypeId 商户类型
 * @param { string } param.mobile         电话
 * @param { string } param.realName       商家联系人姓名            
 */
export const editBusiness = ({
  ...rest
} = {}) => request({
  url: '/provider-merchants/updateMerchant',
  method: 'post',
  data: { ...rest }
})

/**
 * 修改商家密码和用户名
 * @param {*}
 * @param { number } param.id          商户id
 * @param { string } param.password    商户密码
 * @param { string } param.password1   确认密码
 * @param { string } param.userName    商户账号
 */
export const changePassword = ({
  ...rest
} = {}) => request({
  url: '/provider-merchants/update',
  method: 'post',
  data: { ...rest }    
})

/**
 * 修改商家位置坐标
 * @param {*}
 * @param { number } param.id         商户id
 * @param { string } param.latitude   纬度
 * @param { string } param.longitude  经度
 * @param { string } param.poi        关联poi
 */
export const modifyLocation = ({
  ...rest
} = {}) => request({
  url: '/provider-merchants/updateCoordinate',
  method: 'post',
  data: { ...rest }
})

