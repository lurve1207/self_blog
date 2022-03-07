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
  background-color: #171d20;
  padding-bottom: 15px;
}
</style>