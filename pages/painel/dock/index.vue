<template>
  <Init>
    <DataGrid titulo="Dockstation">
      <template #list-left> </template>
      <template #list-right>
        <ButtonGroup>
          <Button icon="md-refresh-circle" @click.prevent="refreshData"
            >Recarregar</Button
          >
          <Button icon="md-search" @click.prevent="search = !search"
            >Pesquisar</Button
          >
        </ButtonGroup>
        <Dropdown @on-click="itemDrop">
          <Button icon="md-download">Download</Button>
          <template #list>
            <DropdownMenu>
              <DropdownItem name="pdf">PDF</DropdownItem>
              <DropdownItem divided name="excel">Excel/CSV</DropdownItem>
            </DropdownMenu>
          </template>
        </Dropdown>
      </template>
      <template #search v-if="search">
        <Input search placeholder="Pesquisar" clearable v-model="query" />
      </template>
      <template #table>
        <Perfil modulo="Dock Station" controller="list" action="dock-list-all">
          <Table
            stripe
            :columns="columns"
            :data="data"
            :loading="loading"
            ref="table"
          >
            <template #action="{ row }">
              <Perfil modulo="Dock Station" controller="delete" action="dock-delete">
                <Button
                  type="error"
                  icon="md-trash"
                  @click.prevent="openModal(row.iD_Dock)"
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
import moment from "moment";
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
          title: "Nome",
          key: "nome",
          sortable: true,
        },
        {
          title: "Local",
          key: "local",
          sortable: true,
        },
        {
          title: "Status Conexão",
          key: "status_Conexao",
          sortable: true,
          render: (h, params) => {
            return h("span", "online");
          },
        },
        {
          title: "Última Atualização",
          key: "ultima_Atualização",
          sortable: true,
          render: (h, params) => {
            const date = params.row.ultima_Atualização;
            const formattedDate = moment(date).format("DD/MM/YYYY HH:mm:ss");
            return h("span", formattedDate);
          },
        },
        {
          title: "Espaço Livre",
          key: "espaco_Livre",
          sortable: true,
        },
        {
          title: " ",
          slot: "action",
          align: "right",
        },
      ],
      data: [],
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      await get("/api/Dock")
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
      await del(`/api/Dock/${id}`)
        .then(() => {
          this.refreshData();
          this.$Notice.success({
            title: "Dock excluida com sucesso",
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
          createPDF("Docks", this.data, [
            ["UUID", "iD_Dock"],
            ["Nome", "nome"],
            ["Local", "local"],
            ["Coordenadas", "coordenadas"],
            ["Status da Conexão", "status_Conexao"],
            ["Última Atualização", "ultima_Atualização"],
          ]);
          break;
        case "excel":
          createExcel("Docks", this.data, [
            ["UUID", "iD_Dock"],
            ["Nome", "nome"],
            ["Local", "local"],
            ["Coordenadas", "coordenadas"],
            ["Status da Conexão", "status_Conexao"],
            ["Última Atualização", "ultima_Atualização"],
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
  