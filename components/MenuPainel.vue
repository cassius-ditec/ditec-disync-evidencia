<template>
  <Menu :active-name="$route.name">
    <MenuGroup title="Painel">
      <MenuItem :to="{ name: 'painel' }" name="painel">
        <Icon type="ios-stats" />Dashboard</MenuItem
      >
      <MenuItem
        :to="{ name: 'painel-redirectPage' }"
        name="painel-redirectPage"
      >
        <Icon type="md-pin" />Monitoramento
      </MenuItem>
    </MenuGroup>
    <MenuGroup title="Cadastros">
      <Perfil modulo="Usuários" controller="access" action="painel-usuario">
        <MenuItem :to="{ name: 'painel-usuario' }" name="painel-usuario">
          <Icon type="md-person" />Usuário</MenuItem
        >
      </Perfil>
      <Perfil modulo="Unidades" controller="access" action="painel-unidade">
        <MenuItem :to="{ name: 'painel-unidade' }" name="painel-unidade">
          <Icon type="md-briefcase" />Unidade</MenuItem
        >
      </Perfil>
      <Perfil
        modulo="Perfil de Usuário"
        controller="access"
        action="painel-perfil"
      >
        <MenuItem :to="{ name: 'painel-perfil' }" name="painel-perfil">
          <Icon type="md-lock" />Perfil</MenuItem
        >
      </Perfil>
      <Perfil
        modulo="Classificação - Casos"
        controller="access"
        action="painel-classificacao"
      >
        <MenuItem
          :to="{ name: 'painel-classificacao' }"
          name="painel-classificacao"
        >
          <Icon type="md-pricetag" />Classificação</MenuItem
        >
      </Perfil>
      <Perfil modulo="Casos" controller="access" action="painel-caso">
        <MenuItem :to="{ name: 'painel-caso' }" name="painel-caso">
          <Icon type="md-shuffle" />
            {{ getUser.empresa.flagInfo ? 'Ocorrência' : 'Caso' }}
          </MenuItem
        >
      </Perfil>
      <Perfil modulo="Bodycam" controller="access" action="painel-bodycam">
        <MenuItem :to="{ name: 'painel-bodycam' }" name="painel-bodycam">
          <Icon type="md-camera" />Bodycam</MenuItem
        >
      </Perfil>
      <Perfil modulo="Dock Station" controller="access" action="painel-dock">
        <MenuItem :to="{ name: 'painel-dock' }" name="painel-dock">
          <Icon type="ios-cloudy" />Dockstation</MenuItem
        >
      </Perfil>
    </MenuGroup>
    <MenuGroup title="Relatórios">
      <MenuItem
        :to="{
          name: 'painel-evidencia',
          query: {
            refresh: true,
          },
        }"
        name="painel-evidencia"
      >
        <Icon type="md-albums" />Gestor de Evidências</MenuItem
      >
      <Perfil
        modulo="Log Usuários"
        controller="access"
        action="painel-relatorio-log_usuario-filtrar"
      >
        <MenuItem
          :to="{ name: 'painel-relatorio-log_usuario-filtrar' }"
          name="painel-relatorio-log_usuario-filtrar"
        >
          <Icon type="ios-archive" />Log de Acesso</MenuItem
        >
      </Perfil>
      <Perfil
        modulo="Log Camera"
        controller="access"
        action="painel-relatorio-log_camera-filtrar"
      >
        <MenuItem
          :to="{ name: 'painel-relatorio-log_camera-filtrar' }"
          name="painel-relatorio-log_camera-filtrar"
        >
          <Icon type="ios-camera" />Log de Bodycam</MenuItem
        >
      </Perfil>
    </MenuGroup>
  </Menu>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  watch: {
    $route(to) {
      let { query } = to;
      if (query.refresh) {
        this.$router.push( { name: 'painel-redirect', query: { url: to.name} })
      }
      this.$emit("menulateral");
    },
  },
  computed: {
    ...mapGetters("auth", ["getUser"]),
  },
};
</script>