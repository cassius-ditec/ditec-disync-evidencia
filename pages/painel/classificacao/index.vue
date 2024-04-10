<template>
  <Init>
    <DataGrid titulo="Classificação">
      <template #list-left>
        <Perfil modulo="Classificação - Casos" controller="post" action="classificacao-new">
          <Button
            type="primary"
            icon="md-add-circle"
            :to="{ name: 'painel-classificacao-new' }"
            >Nova Classificação</Button
          >
        </Perfil>
      </template>
      <template #list-right>
        <ButtonGroup>
          <Button icon="md-refresh-circle" @click.prevent="refreshData"
            >Recarregar</Button
          >
          <Button icon="md-search" @click.prevent="search = !search"
            >Pesquisar</Button
          >
          <Dropdown @on-click="itemDrop">
            <Button icon="md-download">Download</Button>
            <template #list>
              <DropdownMenu>
                <DropdownItem name="pdf">PDF</DropdownItem>
                <DropdownItem divided name="excel">Excel/CSV</DropdownItem>
              </DropdownMenu>
            </template>
          </Dropdown>
        </ButtonGroup>
      </template>
      <template #search v-if="search">
        <Input search placeholder="Pesquisar" clearable v-model="query" />
      </template>
      <template #table>
        <Perfil modulo="Classificação - Casos" controller="list" action="classificacao-list-all">
          <Table
            stripe
            :columns="columns"
            :data="data"
            :loading="loading"
            ref="table"
          >
            <template #action="{ row }">
              <Perfil modulo="Classificação - Casos" controller="put" action="classificacao-edit">
                <Button
                  :to="{
                    name: 'painel-classificacao-idClassificacao',
                    params: row,
                  }"
                  icon="md-create"
                  >Editar</Button
                ></Perfil
              >
              <Perfil modulo="Classificação - Casos" controller="delete" action="classificacao-delete">
                <Button
                  type="error"
                  icon="md-trash"
                  @click.prevent="openModal(row.idClassificacao)"
                ></Button>
              </Perfil>
            </template>
          </Table>
        </Perfil>
      </template>
      <template #pagination v-if="!loading">
        <Page :total="pagination.size" :current="pagination.current" />
      </template>
    </DataGrid>
  </Init>
</template>

<script>
import { get, del } from "@/services/api";
import { createPDF } from "@/services/exportData/pdf";
import { createExcel } from "@/services/exportData/excel";
export default {
  data() {
    return {
      search: false,
      query: "",
      loading: true,
      pagination: {
        current: 1,
        size: 10,
      },
      columns: [
        {
          title: "ID",
          key: "idClassificacao",
          sortable: true,
          width: "100px",
        },
        {
          title: "Classificação",
          key: "descricao",
          sortable: true,
        },
        {
          title: " ",
          slot: "action",
          align: "right",
          width: 300,
        },
      ],
      data: [],
      originalData: [],
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      await get("/api/ClassificacaoCasos/ativos")
        .then((data) => (this.originalData = this.data = data))
        .catch(({ error, code }) => {
          console.log(error, code);
        })
        .finally(() => (this.loading = false));
    },
    refreshData() {
      this.loading = true;
      this.initData();
    },
    openModal(id) {
      this.$Modal.confirm({
        title: "Deseja excluir?",
        onOk: () => {
          this.deleteRow(id);
        },
      });
    },
    async deleteRow(id) {
      await del(`/api/ClassificacaoCasos/${id}`)
        .then(() => {
          this.refreshData();
          this.$Notice.success({
            title: "Classificação excluida com sucesso",
          });
        })
        .catch((error) => {
          this.$Notice.error({
            title: "Notificação de Erro ao excluir",
            desc: error,
          });
        });
    },
    searchInJSON(obj, keyword) {
      for (let key in obj) {
        if (typeof obj[key] === "object") {
          if (this.searchInJSON(obj[key], keyword)) {
            return true;
          }
        } else if (
          typeof obj[key] === "string" &&
          obj[key].toLowerCase().includes(keyword.toLowerCase())
        ) {
          return true;
        }
      }
      return false;
    },
    itemDrop(click) {
      switch (click) {
        case "pdf":
          createPDF("Classificações Ativas", this.data, [
            ["UUID", "idClassificacao"],
            ["Descrição", "descricao"],
          ]);
          break;
        case "excel":
          createExcel("Classificações Ativas", this.data, [
            ["UUID", "idClassificacao"],
            ["Descrição", "descricao"],
          ]);
          break;
      }
    },
  },
  watch: {
    query(to, from) {
      this.data = this.originalData.filter((obj) => this.searchInJSON(obj, to));
    },
  },
};
</script>
