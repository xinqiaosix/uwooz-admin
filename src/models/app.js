import * as userManageApi from '@/api/userManage'

const setAccountToLocalStorage = (username, password) => {
  localStorage.setItem('account', JSON.stringify({ username, password }))
}

const namespace = 'app'

const state = {
  // 是否正在登录
  isLogining: false,
  // 是否已登录。
  hasLogged: false,
  user: {},

  isSiderMenuCollapse: false, // 控制左侧菜单是否折叠
}

const reducers = {
  loginStart(state) {
    return {
      ...state,
      isLogining: true,
    }
  },
  
  loginSuccessed(state, { user }) {
    return {
      ...state,
      hasLogged: true,
      isLogining: false,
      user,
    }
  },

  loginFailed(state) {
    return {
      ...state,
      isLogining: false,
    }
  },

  logout(state) {
    localStorage.removeItem('account')
    return {
      ...state,
      isLogining: false,
      hasLogged: false,
      user: {},
    }
  },

  switchSiderMenuCollapse(state) {
    return {
      ...state,
      isSiderMenuCollapse: !state.isSiderMenuCollapse,
    }
  },

  // 更新主账号信息
  savePrimaryAccountNumber(state, { payload }) {
    const { comment, boundMobille, userName } = payload;
    return {
      ...state,
      user: {
        comment, 
        boundMobille,
        userName,
      }
    }
  },
}

const effects = {
  *login({ username, password }, { call, put, ...rest }) {
    yield put({ type: 'loginStart' })
    const res = yield call(userManageApi.login, username, password)
    const { data: user, errorCode, message: errMsg } = res

    if (errorCode !== 200) {
      yield put({ type: 'loginFailed' })
      return { errorCode, errMsg }
    }
    
    setAccountToLocalStorage(username, password)
    yield put({ type: 'loginSuccessed', user })
    return { errorCode, errMsg }
  },

  // 编辑 主账号 
  *uploadPrimaryAccountNumber({ payload }, { call, put,}){
    const { boundMobille, comment, userName } = payload;
    yield call( userManageApi.uploadPrimaryAccountNumber, payload );
    yield put ({
      type: 'savePrimaryAccountNumber',
      payload: { boundMobille, comment , userName}
    })

  }
}

const subscriptions = {
  setup({ dispatch }) {
    const account = localStorage.getItem('account')
    if (account !== null) {
      const { username, password } = JSON.parse(account)
      dispatch({ type: 'login', username, password })
    }
  }
}

export default {
  namespace,
  state,
  reducers,
  effects,
  subscriptions,
}
