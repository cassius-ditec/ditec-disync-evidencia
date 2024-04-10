<template>
  <Init>
    <DataGrid titulo="Unidades">
      <template #list-left>
        <Perfil modulo="Unidades" controller="post" action="unidade-new">
          <Button
            type="primary"
            icon="md-add-circle"
            :to="{ name: 'painel-unidade-new' }"
            >Nova unidade</Button
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
        <Perfil modulo="Unidades" controller="list" action="unidade-list-all">
          <Table
            stripe
            row-key="iD_Unidade"
            :columns="columns"
            :data="formatedData"
            :loading="loading"
            ref="table"
          >
            <template #action="{ row }">
              <Perfil
                modulo="Unidades"
                controller="put"
                action="unidade-edit-subunidade"
              >
                <Button
                  :to="{
                    name: 'painel-unidade-subunidade',
                    params: {
                      iD_Unidade: row.iD_Unidade,
                      nome: row.nome,
                      parent_ID: row.parent_ID,
                    },
                  }"
                  type="primary"
                  icon="md-add"
                  shape="circle"
                  size="small"
                  style="margin-right: 10px"
                  >Subunidade</Button
                >
              </Perfil>
              <Perfil modulo="Unidades" controller="put" action="unidade-edit">
                <Button
                  :to="{
                    name: 'painel-unidade-iD_Unidade',
                    params: {
                      iD_Unidade: row.iD_Unidade,
                      nome: row.nome,
                      parent_ID: row.parent_ID,
                    },
                  }"
                  icon="md-create"
                  >Editar</Button
                ></Perfil
              >
              <Perfil
                modulo="Unidades"
                controller="delete"
                action="unidade-delete"
              >
                <Button
                  type="error"
                  icon="md-trash"
                  @click.prevent="openModal(row.iD_Unidade)"
                  v-if="row.exclusao"
                ></Button>
                <Tooltip placement="left" theme="light" v-else>
                  <template #content>
                    <p>Não pode ser excluído</p>
                    <p><i>Possui usuários ligado a unidade</i></p>
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
import { mapGetters } from "vuex";
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
          title: "Unidade",
          key: "nome",
          sortable: true,
          tree: true,
        },
        {
          title: " ",
          slot: "action",
          align: "right",
          width: 300,
        },
      ],
      data: [],
      formatedData: [],
      originalData: [],
    };
  },
  computed: {
    ...mapGetters("auth", ["getUserEmpresa"]),
  },
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      await get("/api/Unidades/filhosToken")
        .then((data) => {
          let unidades = data.filter(
            (el) => el.iD_Empresa == this.getUserEmpresa
          );
          this.data = unidades;
          this.originalData = this.formatedData =
            this.criarHierarquia(unidades);
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
      await del(`/api/Unidades/${id}`)
        .then(() => {
          this.refreshData();
          this.$Notice.success({
            title: "Subunidade excluida com sucesso",
          });
        })
        .catch((error) => {
          this.$Notice.error({
            title: "Notificação de Erro ao excluir",
            desc: error,
          });
        });
    },
    criarHierarquia(arr, parent = 0) {
      return arr
        .filter((item) => item.parent_ID === parent)
        .map((child) => ({
          ...child,
          _showChildren: true,
          children: this.criarHierarquia(arr, child.iD_Unidade),
        }));
    },
    searchInJSON(obj, keyword) {
      for (let key in obj) {
        const value = obj[key];
        if (Array.isArray(value)) {
          if (this.searchInJSON(value, keyword)) {
            return true;
          }
        } else if (typeof value === "object") {
          if (this.searchInJSON(value, keyword)) {
            return true;
          }
        } else if (
          typeof value === "string" &&
          value.toLowerCase().includes(keyword.toLowerCase())
        ) {
          return true;
        }
      }
      return false;
    },
    itemDrop(click) {
      switch (click) {
        case "pdf":
          createPDF("Unidades Ativas", this.originalData, [
            ["UUID", "iD_Unidade"],
            ["Nome", "nome"],
          ], "nome");
          break;
        case "excel":
          createExcel("Usuários Ativos", this.originalData, [
            ["UUID", "iD_Unidade"],
            ["Nome", "nome"],
          ], "nome");
          break;
      }
    },
  },
  watch: {
    query(to, from) {
      if (to == "") {
        this.formatedData = this.originalData;
      } else {
        this.formatedData = this.data.filter((obj) =>
          this.searchInJSON(obj, to)
        );
      }
    },
  },
};
</script>
