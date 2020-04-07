import React from 'react'
import { router } from 'dva'
import { Layout } from 'antd'

import SiderMenu from '@/components/SiderMenu'
import ProMenuRoutes from '@/components/ProMenuRoutes'

import Sightseeing from 'proA/pages/Sightseeing'
import SightseeingDetail from 'proA/pages/SightseeingDetail'
import Page2 from 'proA/pages/Page2'

import { name as proName } from 'proA/router'

const { Switch, Route, Redirect } = router
const { Content } = Layout

/**
 * siderMenus 是这个 project 下的侧边栏的所有菜单。
 * 首先它是一个数组，每项是个 对象。
 * 对象必须包括 name 属性，表示菜单的名称。
 * 如果这个对象没有 children 属性，我们认为就是一级菜单，没有展开项，此时必须有 path 和 component 另外这两个属性。分别表示 对应的 路由 和 页面组件。注意 path 并没有带上它的 一级路由，因为这个可以获取到，我们就不用写很多，修改的时候也非常方便。
 * 如果有 children 属性，我们认为它还有二级菜单，在第一层我们就不需要添加 path 和 component 属性
 * children 也是一个组数，每一项都类似上面说的
 */
const siderMenus = [
  {
    name: '观光',
    path: '/Sightseeing',
    component: Sightseeing,
  },
  {
    name: '一级标题',
    children: [
      {
        name: '页面二',
        path: '/Page2',
        component: Page2,
      },
    ],
  },
]

/**
 * 这个方法主要是用来渲染侧边菜单栏右边主要内容。
 * 基本上就是 Switch 下有很多 Route。
 * ProMenuRoute 是封装好的用来渲染侧边菜单栏所需要对应的 Route 匹配。
 * 但是一般来说我们内容区域不仅仅只有侧边栏所对应的内容，比如一个 列表项某一项的详情页，这里就需要我们另外添加。
 * 另外就是进入 project 之后重定向到某个页面，最常见的就是重定向到侧边栏菜单的第一项对应的页面。
 * @param {{ path: string }} match 
 */
const renderRoutes = (match) => {
  // proPath 表示 project 所对应的一级路由
  const { path: proPath } = match
  
  return (
    <Switch>
      <Redirect exact from={proPath} to={`${proPath}${siderMenus[0].path}`}></Redirect>
      <Route path={`${proPath}/Sightseeing/:id`} component={SightseeingDetail}></Route>
      <ProMenuRoutes siderMenus={siderMenus} proPath={proPath}></ProMenuRoutes>
    </Switch>
  )
}

/**
 * 
 * @param {{ match: object }} param match 中有一个 path 属性，是自动匹配到的 project 所对应的一级路由，在下面的渲染中我们会多处使用这个
 */
const ProLayout = ({ match }) => {
  return (
    <Layout>
      <SiderMenu name={proName} menus={siderMenus}></SiderMenu>
      <Content style={{ padding: '24px' }}>
        {renderRoutes(match)}
      </Content>
    </Layout>
  )
}

export default ProLayout
