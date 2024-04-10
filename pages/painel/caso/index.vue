<template>
  <DataGrid :titulo="getUser.empresa.flagInfo ? 'Ocorrência' : 'Caso'">
    <template #list-left>
      <Perfil action="caso-new">
        <Button
          type="primary"
          icon="md-add-circle"
          :to="{ name: 'painel-caso-new' }"
          > {{ getUser.empresa.flagInfo ? 'Nova Ocorrência' : 'Novo Caso' }} 
        </Button>
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
      <Table
        stripe
        :columns="columns"
        :data="data"
        :loading="loading"
        ref="table"
      >
        <template #classificacao="{ row }">
          {{ row.classificacao ? row.classificacao.descricao ?? "-" : "-" }}
        </template>

        <template #datacaso="{ row }">
          {{ $moment(row.dataCaso).format("DD/MM/YYYY") }}
        </template>

        <template #usuario="{ row }">
          {{ row.user ? row.user.nome ?? "-" : "-" }}
        </template>
        <template #action="{ row }">
          <Perfil action="caso-relacional-evidencia">
            <Button
              :to="{
                name: 'painel-caso-id-evidencia',
                params: { id: row.idCasos },
              }"
              icon="md-add"
              shape="circle"
              size="small"
              type="primary"
              >Evidências</Button
            ></Perfil
          >
          <Perfil action="caso-notes">
            <Button
              :to="{
                name: 'painel-caso-id-nota',
                params: { id: row.idCasos },
              }"
              icon="md-add"
              shape="circle"
              size="small"
              type="primary"
              >Notas</Button
            ></Perfil
          >
          <Perfil action="caso-upload">
            <Button
              :to="{
                name: 'painel-caso-id-upload',
                params: { id: row.idCasos },
              }"
              icon="md-add"
              shape="circle"
              size="small"
              type="primary"
              >Upload</Button
            ></Perfil
          >
          <Perfil action="caso-edit">
            <Button
              :to="{
                name: 'painel-caso-idCasos',
                params: row,
              }"
              icon="md-create"
              >Editar</Button
            ></Perfil
          >
          <Perfil action="caso-delete">
            <Button
              type="error"
              icon="md-trash"
              @click.prevent="openModal(row.idCasos)"
            ></Button>
          </Perfil>
        </template>
      </Table>
    </template>
    <template #pagination v-if="!loading">
      <Page :total="pagination.size" :current="pagination.current" />
    </template>
  </DataGrid>
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
          title: "id",
          key: "idCasos",
          sortable: true,
          sortType: "desc",
          width: "70",
        },
        {
          title: "Ocorrência",
          key: "ocorrencia",
          sortable: true,
        },
        {
          title: "Classificação",
          slot: "classificacao",
          sortable: true,
        },
        {
          title: "Data",
          slot: "datacaso",
          sortable: true,
        },
        {
          title: "Usuário",
          slot: "usuario",
          sortable: true,
        },
        {
          title: " ",
          slot: "action",
          align: "right",
          width: 450,
        },
      ],
      data: [],
      originalData: [],
    };
  },
  mounted() {
    this.initData();
  },
  computed: {
    ...mapGetters("auth", ["getUser"]),
  },
  methods: {
    async initData() {
      await get("/api/Casos")
        .then((data) => {
          this.originalData = this.data = data.filter((el) => el.del != true);
        })
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
      await del(`/api/Casos/${id}`)
        .then(() => {
          this.refreshData();
          this.$Notice.success({
            title: this.getUser.empresa.flagInfo ? 'Ocorrência excluida com sucesso' : 'Caso excluido com sucesso',
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
      const tipoFlag = this.getUser.empresa.flagInfo == 1 ? 'Ocorrências' : 'Casos';
      switch (click) {
        case "pdf":
          createPDF(tipoFlag, this.data, [
            ["idCasos", "idCasos"],
            [
              "dataCaso",
              "dataCaso",
              (v) =>
                this.$moment(v, "YYYY-MM-DD[T]HH:mm:ss").format("DD/MM/YYYY"),
            ],
            ["Ocorrência", "ocorrencia"],
            ["classificacao", "classificacao.descricao"],
            ["user", "user.nome"],
          ]);
          break;
        case "excel":
          createExcel(tipoFlag, this.data, [
            ["idCasos", "idCasos"],
            [
              "dataCaso",
              "dataCaso",
              (v) =>
                this.$moment(v, "YYYY-MM-DD[T]HH:mm:ss").format("DD/MM/YYYY"),
            ],
            ["Ocorrência", "ocorrencia"],
            ["classificacao", "classificacao.descricao"],
            ["user", "user.nome"],
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
