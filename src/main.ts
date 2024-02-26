import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import App from './App.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// element plus 基础样式
import 'element-plus/dist/index.css'
// 覆盖 element plus 样式
import './assets/less/element.less'
// 界面基础样式
import './assets/less/base.less'

const app = createApp(App)

// 引入 element 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
// 引入 element 组件库
app.use(ElementPlus)

app.mount('#app')
