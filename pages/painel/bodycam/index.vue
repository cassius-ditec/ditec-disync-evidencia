<template>
  <Init>
    <DataGrid titulo="Bodycam">
      <template #list-left>
        <Perfil modulo="Bodycam" controller="post" action="bodycam-new">
          <Button
            type="primary"
            icon="md-add-circle"
            :to="{ name: 'painel-bodycam-new' }"
            >Nova Bodycam</Button
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
        <Perfil modulo="Bodycam" controller="list" action="bodycam-list-all">
          <Table
            stripe
            :columns="columns"
            :data="data"
            :loading="loading"
            ref="table"
          >
            <template #modelo="{ row }">
              {{ getModelo(row) }}
            </template>
            <template #agente="{ row }">
              <div class="elAgente">
                <span>{{ row.agente?.nome ?? "Desvinculado" }}</span>
                <Perfil modulo="Bodycam" controller="put" action="bodycam-edit">
                  <Button
                    type="warning"
                    size="small"
                    icon="md-remove"
                    shape="circle"
                    :disabled="!row.agente"
                    @click.prevent="removeBodycam(row)"
                  />
                  <Button
                    size="small"
                    icon="ios-people"
                    shape="circle"
                    @click.prevent="openModalBodycam(row)"
                    >Trocar</Button
                  >
                </Perfil>
              </div>
            </template>
            <template #action="{ row }">
              <Perfil modulo="Bodycam" controller="put" action="bodycam-edit">
                <Button
                  :to="{
                    name: 'painel-bodycam-iD_Bodycam',
                    params: row,
                  }"
                  icon="md-create"
                  >Editar</Button
                ></Perfil
              >
              <Perfil
                modulo="Bodycam"
                controller="delete"
                action="bodycam-delete"
              >
                <Button
                  type="error"
                  icon="md-trash"
                  @click.prevent="openModal(row.iD_Bodycam)"
                ></Button>
              </Perfil>
            </template>
          </Table>

          <Modal v-model="modal.open" @on-cancel="modalResetBodycam">
            <template #header
              >Trocar agente da bodycam {{ modal.nome }}</template
            >
            <Select v-model="modal.user">
              <Option
                v-for="(usuario, indexUsuario) in getUsuarios"
                :key="indexUsuario"
                :value="usuario.value"
                >{{ usuario.label }}</Option
              >
            </Select>
            <template #footer>
              <Button
                type="success"
                :disabled="modal.user == ''"
                @click.prevent="modalSubmitBodycam"
                >Confirmar</Button
              >
            </template>
          </Modal>
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
          key: "iD_Bodycam",
          sortable: true,
          sortType: "desc",
          minWidth: 70,
        },
        {
          title: "Modelo",
          slot: "modelo",
          sortable: true,
          minWidth: 120,
        },
        {
          title: "Número de Serie",
          key: "numeroSerie",
          sortable: true,
          minWidth: 180,
        },
        {
          title: "IMEI",
          key: "imei",
          sortable: true,
          minWidth: 180,
        },
        {
          title: "Versão do Firmware",
          key: "versaoFirmware",
          sortable: true,
          minWidth: 200
        },
        {
          title: "Agente",
          slot: "agente",
          resizable: true,
          minWidth: 350,
        },
        {
          title: " ",
          slot: "action",
          align: "right",
          minWidth: 200,
        },
      ],
      data: [],
      usuarios: [],
      modelos: [],

      modal: {
        open: false,
        user: "",
        bodycam: {},
        nome: "",
      },
    };
  },
  computed: {
    getUsuarios() {
      return this.usuarios
        .filter((el) => el.userID != null)
        .map((el) => ({ value: el.userID, label: el.nome }));
    },
  },
  mounted() {
    this.initData();
  },
  methods: {
    openModalBodycam(bodycam) {
      this.modal.open = true;
      this.modal.user = bodycam.agente?.userID ?? 0;
      this.modal.bodycam = bodycam;
      this.modal.nome = bodycam.numeroSerie;
    },
    modalResetBodycam() {
      this.modal.open = false;
      this.modal.user = "";
      this.modal.bodycam = {};
      this.modal.nome = "";
    },
    async modalSubmitBodycam() {
      let { modelo, imei, numeroSerie } = this.modal.bodycam;
      let { user } = this.modal;
      switch (modelo) {
        case 1:
          await this.submitAgenteBodycamSS(numeroSerie, user);
          break;
        case 2:
          await this.submitAgenteBodycamSS4G(imei, user);
          break;
      }
      this.modal.open = false;
    },

    async submitAgenteBodycamSS(NumeroSerie, agentID) {
      await get("/api/ComandosCamera/ChangeAgentIDModel1", {
        NumeroSerie,
        agentID,
      }).finally(() => this.refreshData());
    },

    async submitAgenteBodycamSS4G(imei, agentID) {
      await get("/api/ComandosCamera/ChangeAgentIDFull", {
        imei,
        agentID,
      }).finally(() => this.refreshData());
    },

    async removeBodycam(bodycam) {
      let { modelo, imei, numeroSerie } = bodycam;
      console.log(modelo, imei, numeroSerie);
      switch (modelo) {
        case 1:
          await this.removeAgenteBodycamSS(numeroSerie);
          break;
        case 2:
          await this.removeAgenteBodycamSS4G(imei);
          break;
      }
    },
    async removeAgenteBodycamSS(NumeroSerie) {
      await get("/api/ComandosCamera/DesvincularAgenteIDModel1", {
        NumeroSerie,
      }).finally(() => this.refreshData());
    },

    async removeAgenteBodycamSS4G(imei) {
      await get("/api/ComandosCamera/DesvincularAgente", { imei }).finally(() =>
        this.refreshData()
      );
    },

    async initData() {
      await get("/api/Bodycam")
        .then((data) => (this.originalData = this.data = data))
        .catch(({ error, code }) => {
          console.log(error, code);
        })
        .finally(() => (this.loading = false));

      await get("/api/Usuarios/Ativos?ativos=true").then(
        (data) => (this.usuarios = data)
      );

      await get("/api/Auxiliar/ModelCamera").then(
        (data) => (this.modelos = data)
      );
    },

    getModelo({ modelo }) {
      let find = this.modelos.find((el) => el.id == modelo);
      return find?.descricao;
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
      await del(`/api/Bodycam/${id}`)
        .then(() => {
          this.refreshData();
          this.$Notice.success({
            title: "Bodycam excluida com sucesso",
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
          createPDF("Bodycams Ativas", this.data, [
            ["UUID", "iD_Bodycam"],
            ["IMEI", "imei"],
            ["Modelo", "modelo"],
            ["Número de Série", "numeroSerie"],
            ["Device ID", "deviceID"],
            ["User ID", "userID"],
            ["Versão do Firmware", "versaoFirmware"],
            ["Power", "power"],
            ["Server Listen", "server_Listen"],
            ["Server SRS", "server_SRS"],
            ["Última Conexão", "ultima_Conexao"],
          ]);
          break;
        case "excel":
          createExcel("Bodycams Ativas", this.data, [
            ["UUID", "iD_Bodycam"],
            ["IMEI", "imei"],
            ["Modelo", "modelo"],
            ["Número de Série", "numeroSerie"],
            ["Device ID", "deviceID"],
            ["User ID", "userID"],
            ["Versão do Firmware", "versaoFirmware"],
            ["Power", "power"],
            ["Server Listen", "server_Listen"],
            ["Server SRS", "server_SRS"],
            ["Última Conexão", "ultima_Conexao"],
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
<style scoped>
.elAgente {
  display: grid;
  grid-template: ". . ." / 200px min-content min-content;
  gap: 5px;
  align-items: center;
}
</style>