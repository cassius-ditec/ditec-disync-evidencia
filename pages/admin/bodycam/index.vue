<template>
  <Init>
    <DataGrid titulo="Bodycam">
      <template #list-right>
        <ButtonGroup>
          <Button icon="md-search" @click.prevent="search = !search"
            >Pesquisar</Button
          >
        </ButtonGroup>
      </template>
      <template #search v-if="search">
        <Input search placeholder="Pesquisar" clearable v-model="query" />
      </template>
      <template #table>
        <section class="filtro">
          <section>
            Empresas:
            <RadioGroup
              v-model="filtrar.empresa"
              type="button"
              button-style="solid"
            >
              <Radio label="t">Todas</Radio>
              <Radio label="v">Vinculadas</Radio>
              <Radio label="d">Desvinculadas</Radio>
            </RadioGroup>
          </section>
          <section>
            Status:
            <RadioGroup
              v-model="filtrar.status"
              type="button"
              button-style="solid"
            >
              <Radio label="t">Todas</Radio>
              <Radio label="a">Ativas</Radio>
              <Radio label="i">Inativas</Radio>
            </RadioGroup>
          </section>
        </section>
        <Table
          border
          :show-header="false"
          :columns="columns"
          :data="bodycams"
          :loading="loading"
          ref="table"
        >
          <template #bodycam="{ row }">
            <div class="bodycam">
              <div data-grid="id">
                <span>ID Bodycam:</span>
                {{ row.iD_Bodycam }}
              </div>
              <div data-grid="modelo">
                <span>Modelo:</span>
                {{ row.modelo_descricao }}
              </div>
              <div data-grid="serie">
                <span>Número de Serie:</span>
                {{ row.numeroSerie }}
              </div>
              <div data-grid="device">
                <span>DeviceID:</span>
                {{ row.deviceID }}
              </div>
              <div data-grid="firmware">
                <span>Versão do Firmware:</span>
                {{ row.versaoFirmware }}
              </div>
              <div data-grid="imei">
                <span>IMEI:</span>
                {{ row.imei }}
              </div>

              <div data-grid="user">
                <span>UserID:</span>
                {{ row.userID ?? "Desvinculado" }}
              </div>
              <div data-grid="acao-empresa" v-if="row.hasEmpresa">
                <span>Empresa:</span>
                {{ row.empresa?.razao || "INEXISTENTE" }}
                <Button
                  type="primary"
                  icon="md-remove"
                  shape="circle"
                  size="small"
                  style="margin-left: 10px"
                  @click.prevent="openModalDesvincular(row)"
                  >Desvincular</Button
                >
              </div>
              <div data-grid="acao-empresa" v-else>
                <span>Empresa:</span>
                <Button
                  type="info"
                  icon="md-add"
                  shape="circle"
                  size="small"
                  @click.prevent="openModalVincular(row)"
                  >Vincular a Empresa</Button
                >
              </div>
              <div data-grid="acao-status">
                <span>Status:</span>
                <RadioGroup
                  v-model="row.status"
                  type="button"
                  button-style="solid"
                  @on-change="statusBodycam(row)"
                >
                  <Radio label="true" border>Ativo</Radio>
                  <Radio label="false" border>Inativo</Radio>
                </RadioGroup>
              </div>
              <div data-grid="acao-editar">
                <span>Ações:</span>
                <Button
                  icon="md-create"
                  long
                  :to="{
                    name: 'admin-bodycam-iD_Bodycam',
                    params: row,
                  }"
                  >Editar</Button
                >
              </div>
            </div>
          </template>
        </Table>
      </template>
    </DataGrid>
    <Modal
      v-model="modalOpen"
      title="Vincular a Empresa"
      @on-ok="vincularEmpresa"
    >
      <Select v-model="sendVinculo.IdEmpresa">
        <Option
          v-for="(empresa, iEmpresa) in empresas"
          :key="iEmpresa"
          :value="empresa.iD_Empresa"
          >{{ empresa.razao }}</Option
        >
      </Select>
    </Modal>
  </Init>
</template>

<script>
import { get, put } from "@/services/api";

export default {
  data() {
    return {
      search: false,
      query: "",
      loading: true,
      columns: [
        {
          title: "Bodycams",
          slot: "bodycam",
        },
      ],
      originalBodycams: [],
      bodycams: [],
      modelos: [],
      empresas: [],
      modalOpen: false,
      sendVinculo: { IdBodycam: 0, IdEmpresa: 0 },
      filtrar: { empresa: "t", status: "t" },
    };
  },
  watch: {
    query(to, from) {
      this.bodycams = this.originalBodycams.filter((obj) =>
        this.searchInJSON(obj, to)
      );
    },
    filtrar: {
      handler({empresa, status}) {
        this.bodycams = this.originalBodycams.filter( (item) => {
          let temEmpresa = false
          switch( empresa ){
            case "t": temEmpresa = true; break;
            case "v": temEmpresa = item.hasEmpresa ; break;
            case "d": temEmpresa = !item.hasEmpresa; break;
          }
          let temStatus = false
          switch( status ){
            case "t": temStatus = true; break;
            case "a": temStatus = (item.status == 'true') ; break;
            case "i": temStatus = (item.status == 'false') ; break;
          }
          return temEmpresa && temStatus
        } )
      },
      deep: true,
    },
    /*
    "filtrar.empresa"(to, from){
      let { empresa, status } = this.filtrar
      switch(to){
        case "t": console.log("TODOS EMPRESA"); break;
        case "v": console.log("VINCULADAS"); break;
        case "d": console.log("DESVINCULADAS"); break;
      }
      console.log("EMPRESA", empresa, status, to)
    },
    "filtrar.status"(to, from){
      let { empresa, status } = this.filtrar
      switch(to){
        case "t": console.log("TODOS STATUS"); break;
        case "a": console.log("ATIVOS"); break;
        case "i": console.log("INATIVOS"); break;
      }
      console.log("STATUS", empresa, status, to)
    }
    */
  },
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      this.loading = true;
      await get("/api/Auxiliar/ModelCamera").then(
        (data) => (this.modelos = data)
      );

      await get("/api/Empresa").then((data) => (this.empresas = data));

      await get("/api/Bodycam/GetAll")
        .then((data) => {
          return data.sort((a, b) => b.iD_Bodycam - a.iD_Bodycam);
        })
        .then(
          (data) =>
            (this.bodycams = this.originalBodycams =
              data.map((b) => {
                return {
                  ...b,
                  status: !b.inativo ? `true` : `false`,
                  modelo_descricao: this.getModelo(b),
                  hasEmpresa: b.iD_Empresa && b.iD_Empresa != 0,
                };
              }))
        )
        .finally(() => (this.loading = false));
    },
    getModelo({ modelo }) {
      let find = this.modelos.find((el) => el.id == modelo);
      return find?.descricao;
    },

    openModalDesvincular(bodycam) {
      this.$Modal.confirm({
        title: "Desvincular da empresa?",
        onOk: () => {
          this.desvincularEmpresa(bodycam);
        },
      });
    },
    async desvincularEmpresa({ iD_Bodycam }) {
      await get(`/api/Bodycam/Desvincular`, { IdBodycam: iD_Bodycam }).finally(
        () => this.initData()
      );
    },

    openModalVincular({ iD_Bodycam }) {
      this.sendVinculo.IdBodycam = iD_Bodycam;
      this.modalOpen = true;
    },

    async vincularEmpresa() {
      if (this.sendVinculo.IdEmpresa == 0) {
        return;
      }
      await get(`/api/Bodycam/Vincular`, this.sendVinculo).finally(() => {
        this.initData();
        this.sendVinculo = { IdBodycam: 0, IdEmpresa: 0 };
      });
    },

    async statusBodycam(row) {
      let status = !row.inativo;
      let id = row.iD_Bodycam;
      let bodycam = {
        iD_Bodycam: row.iD_Bodycam,
        iD_Empresa: row.iD_Empresa,
        imei: row.imei,
        modelo: row.modelo,
        numeroSerie: row.numeroSerie,
        deviceID: row.deviceID,
        userID: row.userID,
        versaoFirmware: row.versaoFirmware,
        server_Listen: row.server_Listen,
        server_SRS: row.server_SRS,
        alias: row.alias,
        inativo: status,
      };

      await put(`/api/Bodycam/${id}`, bodycam)
        .then(() => {
          this.$Notice.success({
            title: "Status Alterado",
          });
        })
        .catch(() => {
          this.$Notice.error({
            title: "Erro ao alterar Status",
          });
        })
        .finally(() => {
          this.initData();
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
  },
};
</script>


<style  scoped>
.filtro {
  padding: 20px 10px;
  display: flex;
  gap: 30px;
}
.esconderRow {
  display: none;
}
.bodycam {
  padding: 10px;
  padding-bottom: 40px;
  display: grid;
  gap: 8px;
  grid-template:
    "id id modelo modelo serie serie device device firmware firmware imei imei"
    "user user empresa empresa empresa empresa empresa status status status editar editar"
    / 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
}
.bodycam > div > span {
  font-size: 12px;
  font-weight: 900;
  color: #7a7a7a;
  display: block;
  margin-bottom: 5px;
}
.bodycam > [data-grid="id"] {
  grid-area: id;
}
.bodycam > [data-grid="modelo"] {
  grid-area: modelo;
}
.bodycam > [data-grid="device"] {
  grid-area: device;
}
.bodycam > [data-grid="serie"] {
  grid-area: serie;
}
.bodycam > [data-grid="firmware"] {
  grid-area: firmware;
}
.bodycam > [data-grid="imei"] {
  grid-area: imei;
}
.bodycam > [data-grid="user"] {
  grid-area: user;
}
.bodycam > [data-grid="acao-empresa"] {
  grid-area: empresa;
}
.bodycam > [data-grid="acao-status"] {
  grid-area: status;
}
.bodycam > [data-grid="acao-editar"] {
  grid-area: editar;
}
</style>