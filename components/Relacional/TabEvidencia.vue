<template>
  <Init>
    <div class="box-03">
      <div>Evidência</div>
      <div>{{ evidencia.iD_Evidencia }}</div>
      <div>Nome</div>
      <div>{{ evidencia.nome_Arquivo }}</div>
      <div>Classificacao</div>
      <div>{{ evidencia.classificacao }}</div>
      <div>Ocorrência</div>
      <div>{{ evidencia.ocorrencia }}</div>
      <div>Tags</div>
      <div>{{ evidencia.tags }}</div>
      <div>Agente</div>
      <div>
        {{
          evidencia.agente
            ? evidencia.agente.nome ?? "Desvinculado"
            : "Desvinculado"
        }}
      </div>
    </div>
    <Divider>Datas</Divider>
    <div class="box-03">
      <div>Data de Criação</div>
      <div>{{ dataFullBr(evidencia.data) }}</div>

      <div>Data de Upload</div>
      <div>{{ dataFullBr(evidencia.data_Upload) }}</div>

      <div>Data de Gravação</div>
      <div>{{ dataFullBr(evidencia.data_Gravacao) }}</div>

      <div>Data de Expurgo</div>
      <div>{{ dataFullBr(evidencia.data_Expurgo) }}</div>

      <div>Data de Modificação</div>
      <div>{{ dataFullBr(evidencia.data_Modificacao) }}</div>
    </div>
    <Divider>Integridade</Divider>
    <div class="box-03">
      <div>Hash MD5</div>
      <div>{{ evidencia.hash_MD5 }}</div>

      <div>Hash SHA256</div>
      <div>{{ evidencia.hash_SHA256 }}</div>
    </div>
    <Divider>Dados do Arquivo</Divider>
    <div class="box-03">
      <div>Tipo do Arquivo</div>
      <div>{{ evidencia.tipo_Arquivo_desc }}</div>

      <div>Status do Arquivo</div>
      <div>{{ evidencia.status_desc }}</div>

      <div>Origem do Arquivo</div>
      <div>{{ evidencia.origem_desc }}</div>

      <div>Tamanho do Arquivo</div>
      <div>{{ evidencia.tamanho_Arquivo }}</div>
    </div>
  </Init>
</template>

<script>
export default {
  props: ["evidencia"],
  methods:{
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
  }
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