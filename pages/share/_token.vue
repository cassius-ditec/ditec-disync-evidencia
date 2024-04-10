<template>
  <Init class="share">
    <h2>Gestão de Evidências</h2>
    <Alert type="error" show-icon v-if="!show">
      Compartilhamento não encontrado
    </Alert>
    
    <Table v-else stripe :columns="columns" :data="data" ref="table">
      <template #action="{ row }">
        <a class="ivu-btn ivu-btn-primary" :href="download(row)" target="_blank" download>Baixar Arquivo</a>
      </template>
    </Table>
  </Init>
</template>

<script>
import { get } from "@/services/api";
export default {
  data() {
    return {
      show: true,
      data: [],
      columns: [
        {
          title: "Nome do Arquivo",
          key: "nome_Arquivo",
          sortable: true,
        },
        {
          title: " ",
          slot: "action",
          align: "right",
          width: 300,
        },
      ],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      let Token = this.$route.params.token;
      await get("/api/CompartilhamentoExterno", { Token })
      .then((data) => {
        this.data = data;
      })
      .then(() => this.getEmpresa(this.data[0].iD_Empresa))
      .catch( () => this.show = false)
    },
    async getEmpresa(id) {  
      await get(`/api/Empresa/${id}`)
        .then((data) => (
          this.$emit('flagInfo', data.flagInfo)
        ))
        .catch(({ error, code }) => {console.log(error, code);})
    },
    download(row) {
      let url = `${this.$config.api}/api/Video/GetFileDownload?FileName=${row.nome_Arquivo}&IdEmpresa=${row.iD_Empresa}`;
      return url;
    },
  },
};
</script>

<style>
.share{
    display: flex;
    flex-direction: column;
    gap: 20px;
}
</style>