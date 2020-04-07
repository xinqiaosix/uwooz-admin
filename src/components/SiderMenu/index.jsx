import React from 'react'
import { Layout, Menu } from 'antd'
import { connect ,router } from 'dva'

import styles from './index.module.scss'

const { Sider } = Layout
const { Link, withRouter } = router

const calDefaultOpenKeys = (menus) => {
  return menus.reduce((acc, val, index) => {
    const { children } = val
    if (children !== void 0) {
      acc.push(`${index}`)
    }
    return acc
  }, [])
}

const renderMenuSub = ({ menus, proPath }) => {
  return menus.map(({ name, path, children }, index) => {
    if (children) {
      return (
        <Menu.SubMenu key={index} title={name}>
          {children.map(({ name: childName, path: childPath }, index) => {
            const to = `${proPath}${childPath}`
            return (
              <Menu.Item key={to}>
                <Link to={to}>{childName}</Link>
              </Menu.Item>
            )
          })}
        </Menu.SubMenu>
      )
    }

    const to = `${proPath}${path}`
    return (
      <Menu.Item key={to}>
        <Link to={to}>{name}</Link>
      </Menu.Item>
    )
  })
}

const SiderMenu = ({ name, menus, match, location, isSiderMenuCollapse }) => {
  const { path: proPath } = match
  return (
    <Sider
      className={styles['root']}
      width={240}
      collapsible
      trigger={null}
    >
      <div className={styles['title']}>{name}</div>
      <Menu
        mode="inline"
        defaultSelectedKeys={[location.pathname]}
        defaultOpenKeys={calDefaultOpenKeys(menus)}
        inlineIndent={40}
      >
        {renderMenuSub({ menus, proPath })}
      </Menu>
    </Sider>
  )
}

const mapStateToProps = ({ app }) => {
  const { isSiderMenuCollapse } = app
  return { isSiderMenuCollapse }
}

export default withRouter(connect(mapStateToProps)(SiderMenu))
