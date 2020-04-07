// 开发环境和胜场环境的 baseURL, 至于测试，暂时还没用到
const devBaseURL = 'https://api.uwooz.com/api'
const prodBaseURL = 'https://api.uwooz.com/api'

let finalBaseURL = ''
if (process.env.NODE_ENV === 'development') {
  finalBaseURL = devBaseURL
}
if (process.env.NODE_ENV === 'production') {
  finalBaseURL = prodBaseURL
}

export const baseURL = finalBaseURL

// key和sourceId配对使用，由后端定义
export const key1 = 'kB50erItBe3ci4R7fsuyWuX4Raq7OGMv' // 对应 sourceId 为 1
export const key2 = 'kB50erIyBe3ci4R7fsuyWuX4Raq7OGMv' // 对应 sourceId 为 2
