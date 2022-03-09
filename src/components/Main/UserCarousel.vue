<template>
  <el-carousel
    direction="vertical"
    :autoplay="true"
    :interval="5000"
    arrow="always"
    trigger="click"
  >
    <el-carousel-item :key="item.title" v-for="item in carouselInfo">
      <div
        class="card-carousel-item"
        :style="{ background: `url(${item.url})` }"
      >
        <div>
          <h2>{{ item.title }}</h2>
          <p>{{ item.content }}</p>
        </div>
      </div>
    </el-carousel-item>
  </el-carousel>
</template>

<script>
export default {
  name: "UserCarousel",
  data() {
    return {
      carouselInfo: [
        {
          title: "日记",
          content: "做一个热爱生活的人，把生活记录下来。",
          url: "http://cdn.yuguo.work/carousel1.webp",
        },
        {
          title: "旅行",
          content:
            "我认为旅行是从大自然学习的最佳方式。走遍世界，这是我最大的梦想。",
          url: "http://cdn.yuguo.work/carousel2.webp",
        },
        {
          title: "好好打代码",
          content: "每天都要学习！",
          url: "http://cdn.yuguo.work/carousel3.webp",
        },
      ],
    };
  },
};
</script>

<style scpoed lang="less">
.el-carousel {
  margin-top: 20px;
  border-radius: 10px;
  .card-carousel-item {
    background-position: center center;
    background-size: cover;
    position: relative;
    width: 100%;
    height: 100%;
    > div {
      position: absolute;
      bottom: 0;
      padding: 2rem 1.4rem;
      h2 {
        color: #fff;
        font-size: 26px;
        padding-bottom: 0.5rem;
      }
      p {
        color: #fff;
        font-size: 14px;
      }
    }
  }
}
</style>