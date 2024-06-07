<template>
  <Menu :active-name="$route.name">
    <MenuGroup title="Cadastros">
      <MenuItem :to="{ name: 'admin-empresa' }" name="painel-empresa">
        <Icon type="md-person" />Empresa</MenuItem
      >
      <MenuItem :to="{ name: 'admin-bodycam' }" name="painel-bodycam">
        <Icon type="md-camera" />Bodycam</MenuItem
      >
    </MenuGroup>
  </Menu>
</template>
<script>
export default {
  watch: {
    $route() {
      this.$emit("menulateral");
    },
  },
};
</script>