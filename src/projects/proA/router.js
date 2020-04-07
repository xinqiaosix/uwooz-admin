// 该 name 变量指的是单独的 project 的名称，需要在头部 `产品` 列表中显示使用，在左侧菜单栏的顶部也需要使用到。所以这里我们先声明该变量，并且导出，在使用左侧菜单栏引入并使用
export const name = '项目A'

const router = {
  name,
  /**
   * 进入该 project 的路由，注意这里只是这个 project 所映射的一级路由。
   * 在 `Link` 到该 project 下时，只会使用该路由，后面的自动跳转到哪个页面需要在每个 project 中自己处理。
   * 比如需要跳转到第一个页面，就需要使用 `Redirect` 处理。这个在 `ProLayout` 中会有说明
   */
  path: '/proA',
  /**
   * models 是这个 project 下使用到的所有的 model。
   * 新建了一个，就需要在这里的数组里添加一个，写法按照这样写就行。
   * import 是为了代码分割，前面注释的 webpackChunkName 是告诉 webpack 打包时生成文件的 chunkName。
   * ！！！注意：这个注释并非没用，尽量都加上，这样在最终打包后生成的所有文件中，我们可以清晰的定位到。所以如果是复制的话，请一定按照格式进行修改。
   */
  models: () => [
    // import(/* webpackChunkName: 'proA_SightseeingModel' */ 'proA/pages/Sightseeing/model'),
    import(/* webpackChunkName: 'proA_Page2Model' */ 'proA/pages/Page2/model'),
  ],
  /**
   * component 是这个 project 布局，或者也可以说是包裹了这个 project 的最顶层组件。
   * 同样这里会打包成一个单独文件，我们在进入指定 project 时，才会去加载这个文件。
   * !!! 还是要注意,这里的注释并非无用, 如果是复制的话, 请记得修改.
   */
  component: () => import(/* webpackChunkName: 'proA' */ 'proA/layout/ProLayout'),
}

export default router
