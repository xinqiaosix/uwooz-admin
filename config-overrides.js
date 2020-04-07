const path = require('path')
const {
  override,
  fixBabelImports,
  addWebpackAlias,
  addLessLoader,
  addBundleVisualizer,
  removeModuleScopePlugin,
} = require('customize-cra')

// `customize-cra` api 文档地址：https://github.com/arackaf/customize-cra/blob/HEAD/api.md
module.exports = override(
  // 这个配置主要是为了在使用 antd 时可以按需引入
  // antd 文档有介绍，地址： https://ant.design/docs/react/use-with-create-react-app-cn#%E4%BD%BF%E7%94%A8-babel-plugin-import
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    // style: 'css',
    style: true,
  }),

  // 配置路径别名。'@' 就代表根目录下的 src。使用，如：'@/components/xxx'
  // 另外添加了 jsconfig.json 文件，其中也类似的设置了别名，这样在 vscode 编写代码时，输入路径时会有智能提示。但是这个有时候显示提示的延迟会很长，或者干脆提示不了 ＞﹏＜
  addWebpackAlias({
    // 这里配置了这个 /config 这个别名，使用时才能这样写，否则会报错，这个目前只有在 src/utils/request 中使用到，就不再 jsconfig.json 中添加了。
    '/config': path.resolve(__dirname, 'config'),
    // /mock 同 /config
    '/mock': path.resolve(__dirname, 'mock'),
    '@': path.resolve(__dirname, 'src'),
    'proA': path.resolve(__dirname, 'src/projects/proA'),
    'memberCenter': path.resolve(__dirname, 'src/projects/memberCenter'),
    'enterpriseAccounts': path.resolve(__dirname, 'src/projects/enterpriseAccounts'),
    'businessManagement': path.resolve(__dirname, 'src/projects/businessManagement'),
    'wisdom': path.resolve(__dirname, 'src/projects/wisdom'),
  }),

  // 配置 less loader 。这篇文章有介绍：https://juejin.im/post/5b20a3546fb9a01e312833d5
  // 尚未配置颜色变量
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      "@primary-color": "#ff9212",
      "@error-color": "#f5222d",
      // 文字颜色
      "@heading-color": "#000",
      "@text-color": "rgba(0, 0, 0, .65)",
      "@text-color-secondary": "rgba(0, 0, 0, .85)",
      // 布局样式
      "@layout-header-background": "#fff",
      "@layout-sider-background": "#fff", 
      "@layout-zero-trigger-height": "40px",
      "@layout-trigger-color": "#ff9212",
      "@layout-header-padding": "0",
      // 左侧菜单列表
      "@menu-dark-submenu-bg": "#fff",
      "@menu-dark-item-active-bg": "#ffe9d0",
      "@menu-dark-highlight-color": "#ff9212",
      "@menu-dark-bg": "#fff",
      "@menu-dark-color": "rgba(0, 0, 0, 85%)",
      "@menu-inline-toplevel-item-height": "40px",
      "@menu-item-height": "40px",
      "@menu-collapsed-width": "64px",
      // 面包屑
      "@breadcrumb-base-color": "rgba(0, 0, 0, .45)",
      "@breadcrumb-last-item-color": "rgba(0, 0, 0, .65)",
      "@breadcrumb-separator-color": "rgba(0, 0, 0, .45)",
      "@breadcrumb-font-size": 14,
      // input
      "@input-color": "rgba(0, 0, 0, 65%)",
      "@input-border-color": "#d9d9d9",
      "@input-placeholder-color": "rgba(0, 0, 0, 40%)",
      "@input-disabled-bg": "#f5f5f5",
    }, // 修改主题颜色
  }),

  // 添加 webpack-bundle-analyzer 打包后包大小分析插件。
  // 第二个参数设置为 true，表示在 yarn start or build 时需显性的加上 --analyze 才会生成分析结果，每次 yarn start or build 会自动生成分析结果
  addBundleVisualizer({
    "analyzerMode": "static",
    "reportFilename": "report.html",
  }, true),

  // add webpack-ant-icon-loader
  // 文档地址：https://github.com/Beven91/webpack-ant-icon-loader
  (config) => {
    config.module.rules.push({
      loader: 'webpack-ant-icon-loader',
      enforce: 'pre',
      options: {
        chunkName: 'antd-icons', // default is antd-icons
      },
      include: [
        require.resolve('@ant-design/icons/lib/dist')
      ]
    });
    return config;
  },

  // 因为 CRA 内部 webpack 设置了在 src 下不能引入 src 之外的模块，所以我们所有的文件全部放在 src 目录下。而我们想要将 config 和 mock 文件夹放在 src 同一级话，就需要添加这个
  removeModuleScopePlugin(),
)
