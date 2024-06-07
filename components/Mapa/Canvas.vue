<template>
  <div class="canvas">
    <Split v-model="divisao.aside" min="340px">
      <template #left>
        <slot name="aside" />
      </template>
      <template #right>
        <Split v-model="divisao.main" mode="vertical">
          <template #top>
            <slot name="mapa" />
          </template>
          <template #bottom>
            <slot name="monitoramento" />
          </template>
        </Split>
      </template>
    </Split>
    <slot name="detalhe" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      divisao: {
        aside: "340px",
        main: 0.5,
      },
    };
  },
  computed: {
    ...mapGetters("device", ["initCanvas"]),
  },
  watch: {
    initCanvas(to) {
      if (to) {
        this.$Spin.hide();
      }
    },
  },
  mounted() {
    this.$Spin.show();
  },
};
</script>

<style scoped>
.canvas {
  height: 100%;
  max-height: 100%;
}
</style>