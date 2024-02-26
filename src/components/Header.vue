<script setup lang="ts">
import { reactive } from 'vue'

const view = reactive({
  activeIndex: window.location.pathname
})
</script>

<template>
  <el-menu id="menu" :router="true" :default-active="view.activeIndex" :ellipsis="false" mode="horizontal">
    <div id="logo">
      <img src="../assets/image/logo.jpg" alt="logo" />
      <span>标注台</span>
    </div>
    <!-- <div class="flex-grow"></div>
    <el-menu-item index="/">个人简历</el-menu-item>
    <el-menu-item index="/instance">项目实例</el-menu-item>
    <el-menu-item index="/about">关于本站</el-menu-item> -->
  </el-menu>
</template>

<style scoped less>
#menu {
  padding: 0 10px;
  #logo {
    display: flex;
    padding: 10px;
    span {
      line-height: 40px;
    }
  }
  /* .flex-grow {
    flex-grow: 1;
  } */
  border-bottom: 1px, solid, #dcdfe6;
}
</style>
