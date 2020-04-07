import dva from 'dva'
import { createBrowserHistory } from 'history'
import { Modal } from 'antd'

import appModel from '@/models/app'
import RouterConfig from '@/RouterConfig'

import './styles/index.scss'

// 这样可以仅在开发环境中引入 mockjs 依赖，生成环境将不会依赖 mockjs。mock 就只在这里引入，其他地方不用引入。
(process.env.NODE_ENV === 'development') && require('/mock')

const app = dva({
  history: createBrowserHistory(),
  onError(e, dispatch) {
    Modal.error({
      content: e.message
    })
    console.log(e.message);
  },
})

if (process.env.NODE_ENV === 'development') {
  app.use({
    // 开发环境下会使用到 redux-logger 插件，如果不想用，将下面一行注释掉即可
    // onAction: require('redux-logger').createLogger(),
  })
}

app.model(appModel)

app.router(RouterConfig)

app.start('#root')