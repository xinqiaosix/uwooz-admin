import request from '@/utils/request'

/**
 * 登录
 * @param {string} username 账号（必传）
 * @param {string} password 密码（必传）
 */
export const login = (userName, password) => request({
  url: `/provider-account/login`,
  method: 'post',
  data: {
    userName,
    password
  }
})

/**
 * 查询用户的登录状态
 */
export const checkLoginStatus = () => request({
  url: 'https://api.uwooz.com/mxomsapi/userManage/getManage',
})

// 编辑 主账号
export const uploadPrimaryAccountNumber = ({
  ...rest
} ={}) => request({
  url: '/provider-account/updateAccountAdmin',
  method: 'post',
  data: { ...rest },
})
