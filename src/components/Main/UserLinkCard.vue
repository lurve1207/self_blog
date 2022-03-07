<template>
  <a :href="link.link">
    <div
      class="cardBox"
      :class="$store.state.blogAbout.mode == 'dark' ? 'dark-sec' : 'light-sec'"
    >
      <div class="pic">
        <img :src="link.avatar" alt="" />
      </div>
      <div class="words">
        <h3>{{ link.name }}</h3>
        <div>{{ link.desc }}</div>
      </div>
    </div>
  </a>
</template>

<script>
export default {
  name: "UserLinkCard",
  props: ["link"],
};
</script>

<style scoped lang="less">
a {
  .cardBox {
    border-radius: 5px;
    padding: 10px;
    margin: 10px auto 5px;
    width: 400px;
    height: 90px;
    .pic {
      float: left;
      width: 70px;
      height: 70px;
      border-radius: 5px;
      margin-right: 10px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .words {
      width: 200px;
      float: left;
      h3 {
        color: #3eaf7c;
        margin: 5px 0;
      }
      div {
        width: 100%;
        font-size: 13px;
      }
    }
  }
}
</style>