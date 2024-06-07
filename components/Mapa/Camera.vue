<template>
  <div class="camera">
    <video class="video" ref="video" controls autoplay muted loop></video>
    <div class="information">
      <div>{{ device.listen.DEVID }}</div>
      <div>{{ device.listen.AGENTE }}</div>
    </div>
    <div class="menu">
      <MapaDropdown :device="device" :close="true" @handleOpenAndPrint="takePrint" />
      <MapaPrint :openPrint="openPrint" :datePrint="datePrint" @closeModal="closeModal"/>
    </div>
  </div>
</template>

<script>

export default {
  props: ["device"],
  data() {
    return {
      flvPlayer: null,
      openPrint: false,
      datePrint: {}
    };
  },
  mounted() {
    if (process.client) {
      import("flv-h265.js").then((flvjs) => {
        this.initPlayer(flvjs);
      });
    }
  },
  beforeDestroy() {
    this.destroyVideo();
  },
  methods: {
    initPlayer(flvjs) {
      if (flvjs.isSupported()) {
        let player = this.$refs.video;
        this.flvPlayer = flvjs.createPlayer(
          {
            type: "flv",
            isLive: true,
            url: this.device.Server_SRS,
          },
          {
            autoCleanupSourceBuffer: false,
            autoCleanupMinBackwardDuration: 2 * 60,
            lazyLoad: false,
            lazyLoadMaxDuration: 3 * 60,
            lazyLoadRecoverDuration: 30,
          }
        );
        this.flvPlayer.attachMediaElement(player);
        this.flvPlayer.load();
        this.flvPlayer.play();
      }
    },
    destroyVideo() {
      if (this.flvPlayer) {
        this.flvPlayer.unload();
        this.flvPlayer.detachMediaElement();
        this.flvPlayer.destroy();
        this.flvPlayer = null;
      }
    },
    takePrint() {
      const video = this.$refs.video;
      const canvas = document.createElement('canvas');

      const videoRatio = video.videoWidth / video.videoHeight;
      const targetRatio = 1920 / 1080;

      let targetWidth, targetHeight;

      if (videoRatio > targetRatio) {
        // O vídeo é mais largo que 16:9
        targetWidth = 1920;
        targetHeight = 1920 / videoRatio;
      } else {
        // O vídeo é mais alto que 16:9
        targetWidth = 1080 * videoRatio;
        targetHeight = 1080;
      }

      canvas.width = targetWidth;
      canvas.height = targetHeight;
      
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        this.datePrint  = {
          id: this.device.listen.DEVID,
          printUrl: URL.createObjectURL(blob),
          data: this.$moment(new Date()).format('DD/MM/YYYY'),
          agente: this.device.listen.AGENTE,
          devid: this.device.listen.DEVID
        };
      }, 'image/png', 1);

      this.openPrint = true;

    },
    closeModal() {
      this.openPrint = false;
    }
  },
};
</script>

<style scoped>
.camera > * {
  box-sizing: border-box;
}
.camera {
  border: 3px solid #546e7a80;
  color: white;
  display: grid;
  grid-template:
    "video video video" min-content
    "video video video" 1fr
    "info info menu" min-content
    / min-content 1fr min-content;
}

.camera > .video {
  grid-area: video;
  display: flex;
  width: 100%;
  min-height: 100%;
  background: #546e7a80;
}

.camera > .information {
  grid-area: info;
  background: #546e7a80;
  padding: 5px;
  display: block;
  overflow: hidden;
}
.camera > .information > div {
  font-size: 12px;
  font-weight: 700;
}
.camera > .information > div:first-child {
  font-size: 10px;
  font-weight: 700;
}
.camera > .menu {
  grid-area: menu;
  background: #546e7a80;
  display: flex;
  align-items: center;
}
</style>