<template>
  <div class="file" v-if="urlFile">
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
    this.urlFile = `${this.$config.api}/api/Video/GetFileStream?FileName=${this.evidencia.nome_Arquivo}&IdEmpresa=${this.getUserEmpresa}`;
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
.file {
width: 100%;
height: 100%;
display: flex;
}
</style>