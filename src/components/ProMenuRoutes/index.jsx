import React from 'react'
import { router } from 'dva'

const { Route } = router

/**
 * 渲染侧边栏菜单所对应的 Route 匹配
 * @param {{ siderMenus: object[], proPath: string }} param
 * @param {} param.siderMenus 侧边栏菜单数组，具体结构可去看 `proA/layout/ProLayout/index` 下的说明。
 * @param {} param.proPath 这个 project 对应的一级路由
 */
const ProMenuRoutes = ({ siderMenus, proPath }) => {
  return siderMenus.reduce(
    (acc, val, index) => {
      const { path, component, children } = val

      if (children === void 0) {
        acc.push(
          <Route
            key={index}
            path={`${proPath}${path}`}
            component={component}
          ></Route>
        )
        return acc
      }

      children.forEach((child, childIndex) => {
        acc.push(
          <Route
            key={`${index}-${childIndex}`}
            path={`${proPath}${child.path}`}
            component={child.component}
          ></Route>
        )
      })
      return acc
    },
    []
  )
}

export default ProMenuRoutes
