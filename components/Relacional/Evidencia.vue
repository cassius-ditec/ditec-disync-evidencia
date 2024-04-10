<template>
  <Drawer
    title="Informações da Evidência"
    width="90%"
    placement="right"
    :closable="true"
    :draggable="true"
    v-model="show"
  >
    <div id="evidencia">
      <div data-grid="EVIDENCIA">
        <RelacionalTabEvidencia :evidencia="evidencia" />
      </div>
      <div data-grid="ABAS">
        <Tabs model-value="aba" type="card" :animated="false">
          <TabPane label="Relacional" name="relacional">
            <RelacionalTabRelacaoTwo :evidencia="evidencia" />
          </TabPane>
          <Perfil
            modulo="Log Usuários"
            controller="access"
            action="painel-relatorio-log_usuario-filtrar"
          >
            <TabPane label="Compartilhamento Interno" name="shared">
              <RelacionalTabCompartilhamento :evidencia="evidencia" />
            </TabPane>
          </Perfil>
          <Perfil
            modulo="Log Usuários"
            controller="access"
            action="painel-relatorio-log_usuario-filtrar"
          >
            <TabPane label="Notas" name="notas">
              <RelacionalTabNota :evidencia="evidencia" />
            </TabPane>
          </Perfil>
          <Perfil
            modulo="Log Usuários"
            controller="access"
            action="painel-relatorio-log_usuario-filtrar"
          >
            <TabPane label="Edição" name="edicao">
              <RelacionalTabEditar :evidencia="evidencia" />
            </TabPane>
          </Perfil>
        </Tabs>
      </div>
    </div>
  </Drawer>
</template>

<script>
export default {
  props: ["evidencia"],
  data() {
    return {
      show: false,
      aba: "relacional",
    };
  },
  watch: {
    evidencia: {
      handler(to) {
        if (to.iD_Evidencia) {
          this.show = true;
        }
      },
      deep: true,
      immediate: true,
    },
    show(to) {
      if (!to) {
        this.$emit("limpar-evidencia");
      }
    },
  },
};
</script>

<style scoped>
#evidencia {
  display: grid;
  grid-template: "ABAS EVIDENCIA" /1fr max-content;
  gap: 20px;
}
#evidencia [data-grid="EVIDENCIA"] {
  grid-area: EVIDENCIA;
  background: #e8eaec;
  padding: 10px;
}
#evidencia [data-grid="ABAS"] {
  grid-area: ABAS;
}
</style>