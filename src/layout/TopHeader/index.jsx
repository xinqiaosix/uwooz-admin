import React, { Component } from 'react'
import { Layout, Icon, Menu, Dropdown } from 'antd'
import { router, connect } from 'dva'

import logo from '@/assets/images/dashboard/四维旅游logo.png'

import styles from './index.module.scss'

const { Header } = Layout
const { Route, Link, withRouter } = router

class TopHeader extends Component {
  state = {
    renderBusinessMenu: null,
  }

  handleMenuCollapseClick = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'app/switchSiderMenuCollapse',
    })
  }
  
  handleClickMenu = (e) => {
    const { dispatch } = this.props
    switch (e.key) {
      case 'logout':
        dispatch({ type: 'app/logout' })
        break
    
      default:
        break
    }
  }
  
  renderListItems(projects) {
    return (
      <div className={styles['list-item-wrapper']}>
        {projects.map(({ name, path }, index) => {
          return (
            <Route
              key={index}
              className={styles['list-item']}
              path={path}
              children={({ match }) => {
                return (
                  <Link
                    className={styles[`list-item${match ? '--active' : ''}`]}
                    to={path}
                    replace={!!match}
                  >{name}</Link>
                )
              }}
            ></Route>
          )
        })}
      </div>
    )
  }
  
  renderListGroup(menus) {
    return menus.map(({ name, projects }, index) => {
      return (
        <div key={index} className={styles['list-group']}>
          <div className={styles['list-title']}>
            {/* <img className={styles['list-title-icon']} src="" alt=""/> */}
            {name}
          </div>
          <div className={styles['list-title-line']}></div>
          {this.renderListItems(projects)}
        </div>
      )
    })
  }

  componentDidMount() {
    let businessMenu = this.props.businessMenu;
    businessMenu =(<Menu>
      {
        businessMenu.map((item, index) => {
          return <Menu.Item key={index}>
            <Route
              className={styles['list-item']}
              path={item.projects[0].path}
              children={({ match }) => {
                return (
                  <Link
                    className={styles[`list-item${match ? '--active' : ''}`]}
                    to={item.projects[0].path}
                    replace={!!match}
                  >{item.name}</Link>
                )
              }}
            ></Route>
          </Menu.Item>
        })
      }
    </Menu>)
    this.setState({
      renderBusinessMenu: businessMenu
    })
  }
  
  render() {
    const { className = '', productMenus, user, isSiderMenuCollapse } = this.props

    const accountMenu = (
      <Menu onClick={this.handleClickMenu}>
        <Menu.Item key="logout">退出登录</Menu.Item>
      </Menu>
    )
    
    return (
      <Header className={`${className} ${styles['root']}`}>

        <div className={styles['menu-equal']}>
          <div
            className={styles['menu-collapse']}
            onClick={this.handleMenuCollapseClick}
          >
            <Icon
              className={styles['menu-collapse-icon']}
              type={isSiderMenuCollapse ? 'menu-unfold' : 'menu-fold'}
            ></Icon>
          </div>
          <div className={styles['logo']}>
            <img className={styles['logo-img']} src={logo} alt="" />
          </div>
        </div>

        <div className={styles['vertical-line']}></div>

        <Icon
          className={styles['home']}
          type="home"
        ></Icon>


        <div className={styles['product']}>
          产品
          <Icon className={styles['product-icon']} type="caret-down"></Icon>
          <div className={styles['list']}>
            {this.renderListGroup(productMenus)}
          </div>
        </div>

        <div className={styles['flex-grow']}></div>

        <Dropdown className={styles['account-drop']} overlay={this.state.renderBusinessMenu} placement='bottomCenter'>
          <span>
            企业
            <Icon className={styles['product-icon']} type="caret-down"></Icon>
          </span> 
        </Dropdown>

        <div className={styles['right-item']}>工单</div>

        <Icon
          className={styles['right-item']}
          type="bell"
        ></Icon>

        <Dropdown className={styles['account-drop']} overlay={accountMenu} placement='bottomCenter'>
          <span
            className={styles['account-drop']}
          >{user.userName}</span>
        </Dropdown>

        <Icon
          className={styles['right-item']}
          type="question"
        ></Icon>
      </Header>
    )
  }
}

const mapStateToProps = ({ app }) => {
  const { user, isSiderMenuCollapse } = app
  return { user, isSiderMenuCollapse }
}

// 这里加了 withRouter, 但目前该组件中还未使用到这个提供的功能，主要是为了切换 project 时，该组件会重新渲染，否则页面显示的被激活项不会变化
export default withRouter(connect(mapStateToProps)(TopHeader))
