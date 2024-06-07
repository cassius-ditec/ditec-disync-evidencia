<template>
  <div>
    <img :src="src" width="45" />
  </div>
</template>

<script>
export default {
  props: ["evidencia"],
  data() {
    return {
      src: "",
    };
  },
  mounted() {
    this.getThumb();
    this.getLazyThumb().then((data) => (this.src = data));
  },
  methods: {
    getThumb() {
      let row = this.evidencia;
      switch (row.tipo_Arquivo) {
        case 1:
          this.src = "/thumb-audio.jpg";
          break;
        case 2:
          this.src = "/thumb-video.jpg";
          break;
        case 3:
          this.src = "/thumb-docs.jpg";
          break;
        case 4:
          this.src = "/thumb-image.jpg";
          break;
        default:
          this.src = "/404.png";
      }
    },
    async getLazyThumb() {
      let FileName = "";
      let row = this.evidencia;
      if (row.thumb) {
        FileName = row.thumb;
      } else {
        if (row.tipo_Arquivo == 4) {
          FileName = row.nome_Arquivo;
        }
      }
      if (FileName === "") return this.src;
      let url = `/api/Video/GetFileStream?FileName=${FileName}&IdEmpresa=${this.evidencia.iD_Empresa ?? 0}`;

      try {
        const response = await fetch(url);
        return url;
      } catch (error) {
        return this.src;
      }
    },
  },
};
</script>
