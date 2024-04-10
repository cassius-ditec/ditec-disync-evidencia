<template></template>
<script>
import { mapActions } from "vuex";
export default {
  mounted() {
    this.start()
    let status = this.$store.getters["auth/getStatus"];
    if (status) {
      this.$router.push({ name: "painel" });
    } else {
      this.zerar()
      this.$router.push({ name: "login" });
    }
  },
  methods: {
    ...mapActions("auth", ["start", "zerar"]),
  },
};
</script>