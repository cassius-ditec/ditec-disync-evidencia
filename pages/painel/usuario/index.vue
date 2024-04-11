<template>
  <Init>
    <DataGrid titulo="Usuários">
      <template #list-left>
        <Perfil modulo="Usuários" controller="post" action="usuario-new">
          <Button
            type="primary"
            icon="md-add-circle"
            :to="{ name: 'painel-usuario-new' }"
            >Novo usuário</Button
          >
        </Perfil>
      </template>
      <template #list-right>
        <Perfil modulo="Usuários" controller="delete" action="usuario-trash">
          <Button
            icon="md-trash"
            type="warning"
            :to="{ name: 'painel-usuario-trash' }"
            >Restaurar</Button
          >
        </Perfil>
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
        <Perfil modulo="Usuários" controller="list" action="usuario-list-all">
          <Table
            stripe
            :columns="columns"
            :data="data"
            :loading="loading"
            ref="table"
          >
            <template #unidade="{ row }">
              {{ row.unidade.nome }}
            </template>
            <template #perfil="{ row }">
              {{ row.perfil.nome }}
            </template>
            <template #action="{ row }">
              <Perfil modulo="Usuários" controller="put" action="usuario-edit">
                <Button
                  :to="{
                    name: 'painel-usuario-iD_Usuario',
                    params: row,
                  }"
                  icon="md-create"
                  >Editar</Button
                ></Perfil
              >
              <Perfil modulo="Usuários" controller="delete" action="usuario-delete">
                <Button
                  type="error"
                  icon="md-trash"
                  @click.prevent="openModal(row.iD_Usuario)"
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
          title: "UUID",
          key: "userID",
          sortable: true,
          width: 100,
        },
        {
          title: "Usuário",
          key: "nome",
          sortable: true,
        },
        {
          title: "Perfil",
          slot: "perfil",
          sortable: true,
        },
        {
          title: "Unidade",
          slot: "unidade",
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
      await get("/api/Usuarios/TokenFilhos/Ativos", { ativos: true })
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
      await del(`/api/Usuarios/${id}`)
        .then(() => {
          this.refreshData();
          this.$Notice.success({
            title: "Usuário excluido com sucesso",
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
          createPDF("Usuários Ativos", this.data, [
            ["UUID", "iD_Usuario"],
            ["Nome", "nome"],
            ["Email", "email"],
            ["CPF", "cpf"],
            ["Telefone", "telefone"],
            ["Unidade", "unidade.nome"],
            ["Perfil", "perfil.nome"],
          ]);
          break;
        case "excel":
          createExcel("Usuários Ativos", this.data, [
            ["UUID", "iD_Usuario"],
            ["Nome", "nome"],
            ["Email", "email"],
            ["CPF", "cpf"],
            ["Telefone", "telefone"],
            ["Unidade", "unidade.nome"],
            ["Perfil", "perfil.nome"],
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
