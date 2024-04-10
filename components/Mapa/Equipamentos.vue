<template>
  <div class="equipamentos">
    <MapaEquipamento v-for="(device, index) in devices" :key="index" :device="device"/>
  </div>
</template>

<script>
export default {
  props: ["devices"],
};
</script>
<style>
.equipamentos {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>