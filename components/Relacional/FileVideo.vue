<template>
  <div v-if="urlFile" class="video">
    <video controls @timeupdate="handleTimeUpdate" autoplay>
      <source :src="urlFile" type="video/mp4" />
    </video>
    <Button @click="downloadFile">Baixar Arquivo</Button>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: ["evidencia"],
  data() {
    return {
      urlFile: "",
    };
  },
  computed: {
    ...mapGetters("auth", ["getUserEmpresa"]),
  },
  async mounted() {
    this.urlFile = `${this.$config.api}/api/Video/GetFileDownload?FileName=${this.evidencia.nome_Arquivo}&IdEmpresa=${this.getUserEmpresa}`;
  },
  methods: {
    handleTimeUpdate(event) {
      this.$emit("videoTimeUpdate", event.target.currentTime);
    },
    downloadFile() {
      const url = `${this.$config.api}/api/Video/GetFileDownload?FileName=${this.evidencia.nome_Arquivo}&IdEmpresa=${this.getUserEmpresa}`;
      window.open(url, "_blank");
    },
  },
};
</script>

<style scoped>
.video {
  display:flex;
  flex-direction: column;
  gap:5px;
  height: 100%;
  align-items: flex-end;
  background: black;
}
video {
  width: 100%;
  height: 100%;
}
</style>