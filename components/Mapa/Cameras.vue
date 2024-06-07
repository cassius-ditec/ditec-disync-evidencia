<template>
  <div class="cameras" :style="{ '--max-columns': parseInt(grid) }" v-if="showCameras">
    <MapaCamera
      v-for="(camera, index) in cameras"
      :key="index"
      :device="camera"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: ["colunas"],
  data() {
    return {
      grid: 0,
      cameras: [],
      countCameras: 0,
      showCameras: true,
    };
  },
  watch: {
    colunas(to) {
      this.grid = to;
    },
    getCameras: "updateCameras",
    countCameras(now, after) {
      if (after > now) {
        this.showCameras = false;
        setTimeout(() => {
          this.showCameras = true;
        }, 10);
      } 
    },
    grid(to) {
      this.$emit("update-colunas", to);
    },
  },
  computed: {
    ...mapGetters("device", ["getCameras"]),
  },
  created() {
    this.grid = 3;
    this.updateCameras(); // Inicializa a data property com os dados iniciais
  },
  methods: {
    updateCameras() {
      this.countCameras = this.getCameras.length;
      this.cameras = this.getCameras;
    },
  },
};
</script>

<style scoped>
.cameras {
  width: 100%;
  height: 100%;
  padding: 15px;
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(var(--max-columns, 4), 1fr);
}
</style>