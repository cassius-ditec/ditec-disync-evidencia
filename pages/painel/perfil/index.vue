<template>
  <Init>
    <DataGrid titulo="Perfil">
      <template #list-left>
        <Perfil
          modulo="Perfil de Usuário"
          controller="post"
          action="perfil-new"
        >
          <Button
            type="primary"
            icon="md-add-circle"
            :to="{ name: 'painel-perfil-new' }"
            >Novo perfil</Button
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
        <Perfil
          modulo="Perfil de Usuário"
          controller="list"
          action="perfil-list-all"
        >
          <Table
            stripe
            :columns="columns"
            :data="data"
            :loading="loading"
            ref="table"
          >
            <template #action="{ row }">
              <Perfil
                modulo="Perfil de Usuário"
                controller="put"
                action="perfil-edit"
              >
                <Button
                  :to="{
                    name: 'painel-perfil-iD_Perfil',
                    params: row,
                  }"
                  icon="md-create"
                  >Editar</Button
                ></Perfil
              >
              <Perfil
                modulo="Perfil de Usuário"
                controller="delete"
                action="perfil-delete"
              >
                <Button
                  type="error"
                  icon="md-trash"
                  @click.prevent="openModal(row.iD_Perfil)"
                  v-if="row.exclusao"
                ></Button>
                <Tooltip placement="left" theme="light" v-else>
                  <template #content>
                    <p>Não pode ser excluído</p>
                    <p><i>Possui usuários ligado ao perfil</i></p>
                  </template>
                  <Button type="error" icon="md-trash" disabled></Button>
                </Tooltip>
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
          title: "Perfil",
          key: "nome",
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
      await get("/api/Perfils")
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
      await del(`/api/Perfils/${id}`)
        .then(() => {
          this.refreshData();
          this.$Notice.success({
            title: "Perfil excluido com sucesso",
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
          createPDF("Perfis Ativos", this.data, [
            ["UUID", "iD_Perfil"],
            ["Nome", "nome"],
          ]);
          break;
        case "excel":
          createExcel("Perfis Ativos", this.data, [
            ["UUID", "iD_Perfil"],
            ["Nome", "nome"],
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
