<template>
  <Init>
    <main v-for="(caso, iCaso) in casos" :key="iCaso">
      <Divider>{{ caso.titulo }}</Divider>
      <div class="box-03">
        <div>Id</div>
        <div>{{ caso.idCasos }}</div>

        <div>Agente</div>
        <div>
          {{
            caso.agente ? caso.agente.nome ?? "Desvinculado" : "Desvinculado"
          }}
        </div>

        <div>Classificação</div>
        <div>
          {{ caso.classificacao ? caso.classificacao.descricao ?? "" : "" }}
        </div>

        <div>Usuário</div>
        <div>
          {{ caso.user ? caso.user.nome ?? "" : "" }}
        </div>

        <div>Descrição</div>
        <div>
          {{ caso.descricao }}
        </div>

        <div>Observação</div>
        <div>
          {{ caso.observacoes }}
        </div>

        <div>Data de Cadastro</div>
        <div>{{ dataFullBr(caso.dataCadastro) }}</div>
      </div>
    </main>
  </Init>
</template>

<script>
export default {
  props: ["evidencia"],
  methods: {
    dataBr(data) {
      return this.$moment(data).format("DD/MM/YYYY");
    },
    horaBr(data) {
      return this.$moment(data).format("HH:mm");
    },
    dataFullBr(data) {
      if (!data) return;
      return this.$moment(data).format("DD/MM/YYYY [ás] HH:mm:ss");
    },
  },
};
</script>

<style scoped>
.box-03 {
  display: grid;
  grid-template-columns: max-content 1fr;
  grid-auto-columns: max-content 1fr;
  gap: 10px;
  font-size: 12px;
}
</style>