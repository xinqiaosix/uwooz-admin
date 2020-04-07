/*
 * @Description: 请求方法。暂时先使用 axios , 至于 fetch 再考虑 
 使用方式：
request({
  baseURL: 'xxx', // 可选，默认项在 '@/src/config' 文件中，不同环境值也会不同
  url: 'xxx', // 请求路径，必选
  method: 'xxx', // 请求方法，可选, 大小写均可，默认 'GET'。我们这里基本上都是 'GET' 或者 'POST'。为 GET 时，需要传入 params ，为 POST 时，需要传入 data。
  headers: {}, // 请求头, 可选. 请求方法为 post put patch 时, 会默认设置 Content-Type 为 application/x-www-form-urlencoded
  params: {}, // 请求地址后面会跟上的参数，可选。对应 GET 方法。
  data: {}, // 请求体中的参数，可选。对应 POST 方法。
  // 其他参数请看 axios 文档: https://github.com/axios/axios
})
 * @Date: 2019-08-08 14:52:07
 * @LastEditTime: 2019-08-23 10:51:00
 */
import axios from 'axios'
import { baseURL, key1, key2 } from '/config'
import md5Encryption from './md5Encryption'

/**
 * 根据不同的 sourceId 选择对应的 key
 * @param {number} sourceId 1 或者 2
 * @returns {string} key1 或者 key2
 */
const chooseKey = (sourceId) => {
  switch (sourceId) {
    case 1:
      return key1
    case 2:
      return key2
  
    default:
      return key1
  }
}

/**
 * 根据传入的 params 或者 data 重新生成对应的 params 或者 data。
 * 因为我们使用时可能会用到 GET 或者 POST 方法，两者的属性中有一个 sourceId 或者没有，
 * 没有的话就默认为 1, 根据这个 sourceId 来进行参数的签名。添加一个 signed 值。
 * 样例： { a: 1, b: 'str' } -> { a: 1, b: 'str', sourceId: 1, signed: 'xxx'}
 * @param {{ sourceId?: number, string?: any }} obj 
 */
const signObj = (obj) => {
  // 下面两行这样写，主要是为了可以在 obj 中不加 sourceId 这个参数，选用默认值
  const { sourceId = 1, ...restObj } = obj

  // 当我们指定这个值为 -1 时，我们认为不进行签名，并将这个参数剔除
  if (sourceId === -1) {
    return { ...restObj }
  }

  const newObj = { ...restObj, sourceId  }
  const key = chooseKey(sourceId)
  const signed = md5Encryption(newObj, key)

  return { ...newObj, signed }
}

/**
 * 将一个普通对象序列化
 * @param {Object} obj 普通的对象, 就是只有一层的键值对, 并且 值 仅为基本类型, 如果后面 值 可能为数组或者其他, 需要修改哟
 */
const objToQueryStr = (obj) => {
  const keys = Object.keys(obj)
  const queryStr = keys.reduce((queryStr, key) => {
    // 过滤 值 为 null 项
    if (obj[key] === null) {
      return queryStr
    }

    return `${queryStr}${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}&`
  }, '')

  // 注意这里需要将最后一个 & 符号去掉(虽然不去掉也无伤大雅)
  return queryStr.slice(0, queryStr.length - 1)
}

// 这里本应该使用 request 来命名，但是在拦截器中会使用到 request 属性，以免混淆，直接使用了 instance。其他地方引入时可命名为 request
const instance = axios.create({
  baseURL,
  // withCredentials: true, // 这里设置携带 cookie 会有跨域问题，后面再说
  timeout: 10000,
})

// 这三个请求方法会手动将 data 序列化
const encodedMethods = ['post', 'patch', 'put']

// 关于拦截器可以看 axios 文档
instance.interceptors.request.use(config => {
  // 注意, 到这里 axios 会自动将 method 转为小写
  let {
    method,
    params: newParams = {},
    data: newData = {},
    ...restConfig
  } = config

  if (method === 'get') {
    newParams = signObj(newParams)
  }
  // 针对post请求的特殊处理，在请求方式为post，但是请求参数却要求加在链接后面使用 
  else if (method === 'special') {
    newParams = signObj(newParams)
    newData = null
  }
  if (encodedMethods.includes(method)) {
    newData = signObj(newData)
    // 这里我们需要手动将 data 序列化, 因为 axios 并不会帮我们做这件事, 它只会给 JSON.stringfy。至于处理方式文档中有介绍到两种, 不过我们这里比较简单, 所以就自己手动处理啦。并且如果我们手动序列化的话，axios 会自动设置 headers['Content-Type'] 为 'application/x-www-form-urlencoded'
    newData = objToQueryStr(newData)
  }
  
  const newConfig = {
    ...restConfig,
    method: method === 'special' ? 'post' : method,
    params: newParams,
    data: newData,
  }
  return newConfig
}, error => {
  // Do something with request error
  return Promise.reject(error)
})

// Add a response interceptor
instance.interceptors.response.use(response => {
  // Do something with response data
  if (response.status === 200) {
    return response.data
  }

  return response
}, error => {
  // Do something with response error
  return Promise.reject(error)
})

// 没有什么特别的用途，只是为了导出的变量名与文件名保持一致
const request = instance
export default request
