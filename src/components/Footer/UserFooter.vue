<template>
  <div class="footer" :class="$store.state.blogAbout.mode">
    <a href="https://beian.miit.gov.cn/" target="_blank">
      鄂ICP备2022002203号
    </a>
  </div>
</template>

<script>
export default {
  name: "UserFooter",
};
</script>

<style scoped lang='less'>
.footer {
  text-align: center;
  padding: 5px 10px;
}
</style>