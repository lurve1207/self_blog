<template>
  <div class="main">
    <aplayer
      ref="aplayer"
      :audio="audio"
      :lrcType="1"
      :fixed="true"
      :volume="0.1"
      @waiting="handleEvent"
      class="hidden-md-and-down"
    />
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<script>
export default {
  name: "UserMain",
  data() {
    return {
      audio: [],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      console.log("重新刷新音乐播放器+++++++++++++++");

      // 获取id集合
      let songs = await this.$store.dispatch("getNewSongs");
      if (songs.data.code == 200) console.log("-----成功加载此次新音乐-----");

      let idsArr = [1440443678];
      songs.data.result.forEach((element) => {
        idsArr.push(element.id);
      });
      let ids = idsArr.join(",");
      // console.log(ids, "============歌曲ids");

      // 获取详情集合
      let songDetails = await this.$store.dispatch("getSongDetail", ids);
      if (songDetails.data.code == 200)
        console.log(
          "---成功加载歌曲详情---数量：",
          songDetails.data.songs.length
        );
      songDetails.data.songs.forEach(async (ele, index) => {
        let songLyric = await this.$store.dispatch("getSongLyric", ele.id);
        if (songLyric.data.code == 200) console.log("-----成功加载歌词-----");
        let songUrl = await this.$store.dispatch("getSongsUrl", ele.id);
        if (songUrl.data.code == 200)
          console.log("-----成功加载该歌曲url-----");
        let songInfo = {
          id: ele.id,
          name: ele.name,
          artist: ele.ar[0].name,
          cover: ele.al.picUrl,
          lrc: songLyric.data.lrc.lyric,
          url: songUrl.data.data[0].url,
          // url: "",
        };

        this.audio.push(songInfo);
      });
    },
    async handleEvent() {
      console.log(this.$refs.aplayer.currentMusic.name);

      let songUrl = await this.$store.dispatch(
        "getSongsUrl",
        this.$refs.aplayer.currentMusic.id
      );
      if (songUrl.data.code == 200)
        console.log("-----重新+++成功加载该歌曲url-----");
      let songLyric = await this.$store.dispatch(
        "getSongLyric",
        this.$refs.aplayer.currentMusic.id
      );
      if (songLyric.data.code == 200)
        console.log("-----重新+++成功加载歌词-----");
      this.audio.forEach((ele, index) => {
        if (ele.id == songUrl.data.data[0].id) {
          this.audio[index].url = songUrl.data.data[0].url;
          this.audio[index].lrc = songLyric.data.lrc.lyric;
          this.$refs.aplayer.switch(this.$refs.aplayer.currentMusic.name);
        }
      });
    },
  },
};
</script>

<style lang="less">
.main {
  overflow: hidden;
}
</style>