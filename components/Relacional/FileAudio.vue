<template>
  <div v-if="urlFile">
    <audio controls>
      <source :src="urlStream" type="audio/mpeg" />
    </audio>
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
    this.urlStream = `${this.$config.api}/api/Video/GetFileStream?FileName=${this.evidencia.nome_Arquivo}&IdEmpresa=${this.getUserEmpresa}`;
  },
  methods: {
    downloadFile() {
      const url = `${this.$config.api}/api/Video/GetFileDownload?FileName=${this.evidencia.nome_Arquivo}&IdEmpresa=${this.getUserEmpresa}`;
      window.open(url, "_blank");
    },
  },
};
</script>

<style scoped>
audio {
  width: 100%;
}
</style>