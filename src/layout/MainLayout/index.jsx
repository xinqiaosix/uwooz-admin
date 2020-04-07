import React from 'react'
import { Layout } from 'antd'
import { router, dynamic } from 'dva'
import PrivateRoute from '@/components/PrivateRoute'

import TopHeader from '../TopHeader'

import styles from './index.module.scss'

const { Switch, Redirect } = router

const renderProjectRoutes = (app, menus) => {
  return (
    <Switch>
      <Redirect exact from="/" to={menus[0].projects[0].path}></Redirect>
      {menus.reduce((resArr, { projects }, titleIndex) => {
        projects.forEach(({ path, models, component }, proIndex) => {
          const key = `${titleIndex}-${proIndex}`
          resArr.push(
            <PrivateRoute
              key={key}
              path={path}
              component={dynamic({
                app,
                models,
                component,
              })}
            ></PrivateRoute>,
          )
        })
        return resArr
      }, [])}
    </Switch>
  )
}

const MainLayout = ({ app, productMenus, businessMenu }) => {
  const MainMenus = [].concat(productMenus)
  businessMenu.forEach(item => {
    MainMenus.push(item)
  })
  return (
    <Layout className={styles['root']}>
      <TopHeader
        productMenus={productMenus}
        businessMenu={businessMenu}
      ></TopHeader>
      {renderProjectRoutes(app, MainMenus)}
    </Layout>
  )
}

export default MainLayout
