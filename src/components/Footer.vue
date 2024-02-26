<script setup lang="ts"></script>

<template>
  <div id="footer">
    <img src="../assets/image/备案图标.png" alt="备案图标" />
    <a
      target="_blank"
      href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33011002017184"
      style="display: inline-block; text-decoration: none; height: 20px; line-height: 20px"
    >
      <p style="float: left; height: 20px; line-height: 20px; margin: 0px 0px 0px 5px; color: #939393">
        浙公网安备 33011002017184号
      </p>
    </a>

    <a target="_blank" href="http://beian.miit.gov.cn">
      <p style="float: left; height: 20px; line-height: 20px; margin: 0px 0px 0px 5px; color: #939393">
        ICP主体备案号：浙ICP备2023013050号
      </p>
    </a>
    <a target="_blank" href="http://beian.miit.gov.cn">
      <p style="float: left; height: 20px; line-height: 20px; margin: 0px 0px 0px 5px; color: #939393">
        网站备案号：浙ICP备2023013050号-1
      </p>
    </a>
  </div>
</template>

<style scoped less>
#footer {
  position: absolute;
  bottom: 0px;
  padding: 5px 0;
  width: 100%;
  height: 20px;
  text-align: center;
  font-size: 10px;
  a {
    display: inline-block;
  }
}
</style>
