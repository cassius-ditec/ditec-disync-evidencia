<template>
  <Evidence title="Gestor de Evidências">
    <div v-if="evidencias.length == 0">
      <Alert type="error" show-icon>
        Nenhuma evidência encontrada
        <template #desc>
          <Button :to="{ name: 'painel-evidencia' }" type="text"
            >Clique aqui para refinar sua pesquisa.</Button
          >
        </template>
      </Alert>
    </div>

    <template #header>
      <Button :to="{ name: 'painel-evidencia' }">Refinar Pesquisa</Button>
    </template>

    <RelacionalEvidencia
      :evidencia="evidencia"
      @limpar-evidencia="limparEvidencia"
    />
    <Timeline>
      <TimelineItem
        v-for="(evidencias, data) in getEvidenciasGroupData"
        :key="data"
      >
        <p class="time">{{ dataBr(data) }}</p>
        <div class="grid-content">
          <Table stripe size="small" :columns="columns" :data="evidencias">
            <template #data="{ row }">
              {{ horaBr(row.data) }}
            </template>
            <template #thumb="{ row }">
              <RelacionalThumb :evidencia="row" />
            </template>
            <template #arquivo="{ row }">
              <Tag color="magenta" v-if="row.data_Expurgo"
                >Expurgado em: {{ dataBr(row.data_Expurgo) }}</Tag
              >
              <Button
                size="small"
                @click="showEvidencia(row)"
                style="font-size: 10px"
                >{{ row.nome_Arquivo }}</Button
              >
            </template>
            <template #action="{ row }">
              <div class="btn-acoes">
                <Button
                  type="info"
                  shape="circle"
                  size="small"
                  icon="md-add"
                  @click.prevent="addInCaso(row)"
                >{{getUser.empresa.flagInfo ? 'Ocorrência' : 'Caso'}}</Button
                >
                <Button
                  type="info"
                  shape="circle"
                  size="small"
                  icon="md-add"
                  @click.prevent="addInShare(row)"
                  >Compartilhar</Button
                >
              </div>
            </template>
          </Table>
        </div>
      </TimelineItem>
    </Timeline>
    <template #aside>
      <main v-if="evidenciasCaso.length > 0">
        <h3>{{getUser.empresa.flagInfo ? 'Ocorrências' : 'Casos'}}</h3>
        <Select
          transfer
          filterable
          clearable
          v-model="casos.value"
          @on-clear="refreshCaso"
        >
          <Option
            v-for="(caso, i) in casos.data"
            :key="i"
            :value="caso.value"
            :label="caso.label"
          >
            <span>{{ caso.label }}</span>
          </Option>
        </Select>

        <List :border="true" header="Evidências">
          <ListItem
            v-for="(evidencia, ind) in evidenciasCaso"
            :key="ind"
            class="box-evidencia"
          >
            <div class="ellipsis">{{ evidencia.nome_Arquivo }}</div>
            <Button
              size="small"
              type="error"
              shape="circle"
              icon="md-trash"
              @click.prevent="removeInCaso(evidencia)"
            ></Button>
          </ListItem>
        </List>

        <Button
          type="warning"
          long
          @click.prevent="sendCaso"
          :disabled="casos.value == 0"
          > {{getUser.empresa.flagInfo ? 'Anexar à ocorrência' : 'Anexar ao Caso'}} </Button
        >
      </main>
      <main v-if="evidenciasShare.length > 0">
        <h3>Compartilhamento Externo:</h3>
        <List :border="true" header="Evidências">
          <ListItem
            v-for="(evidencia, ind) in evidenciasShare"
            :key="ind"
            class="box-evidencia"
          >
            <div class="ellipsis">{{ evidencia.nome_Arquivo }}</div>
            <Button
              size="small"
              type="error"
              shape="circle"
              icon="md-trash"
              @click.prevent="removeInShare(evidencia)"
            ></Button>
          </ListItem>
        </List>

        <Select
          transfer
          filterable
          clearable
          v-model="tempo"
          placeholder="Compartilhar por quanto tempo?"
        >
          <Option
            v-for="(dia, i) in dias"
            :key="i"
            :value="dia.value"
            :label="dia.label"
          />
        </Select>

        <Button
          v-if="shareLink == ''"
          type="warning"
          long
          @click.prevent="sendShare"
          :disabled="tempo == 0"
          >Criar link</Button
        >
        <Input v-else v-model="shareLink" disabled>
          <template #append>
            <Button icon="ios-copy" @click.prevent="copiarLink"></Button>
          </template>
        </Input>
      </main>
    </template>
  </Evidence>
</template>

<script>
import { get, post } from "@/services/api";
import moment from "moment";
import { mapGetters, mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      evidencia: {},
      columns: [
        {
          title: "Hora",
          slot: "data",
          width: 70,
        },
        {
          title: " ",
          slot: "thumb",
          width: 70,
        },
        {
          title: "Arquivo",
          slot: "arquivo",
          ellipsis: true,
        },
        {
          title: " ",
          slot: "action",
          width: 230,
        },
      ],
      casos: {
        originalData: [],
        data: [],
        value: 0,
      },
      evidenciasCaso: [],
      evidenciasShare: [],
      dias: [
        { value: 24, label: "24 horas" },
        { value: 48, label: "48 horas" },
        { value: 72, label: "72 horas" },
      ],
      tempo: 0,
      shareLink: "",
    };
  },
  watch: {
    "casos.originalData"(to) {
      this.casos.data = [
        {
          value: 0,
          label: this.getUser.empresa.flagInfo ? 'Selecione uma ocorrência' : 'Selecione um caso',
        },
        ...to.map((el) => ({
          value: el.idCasos,
          label: el.ocorrencia,
        })),
      ];
    },
  },
  computed: {
    ...mapState("evidencia", ["evidencias"]),
    ...mapGetters("evidencia", [
      "showEvidencias",
      "getEvidenciasGroupData",
      "getUpdate",
    ]),
    ...mapGetters("auth", ["getUser"]),
  
  },
  mounted() {
    this.$Spin.hide();
    if (!this.showEvidencias) {
      this.$router.push({ name: "painel-evidencia" });
    }
    this.initData();
  },
  methods: {
    ...mapActions("evidencia", ["setEvidencias", "updateEvidenciasFormatos"]),
    async initData() {
      await get("/api/Casos").then(
        (data) =>
          (this.casos.originalData = data.filter((el) => el.del != true))
      );
    },
    showEvidencia(evidencia) {
      this.evidencia = evidencia;
    },
    limparEvidencia() {
      this.evidencia = {};
    },
    dataBr(data) {
      return moment(data).format("DD/MM/YYYY");
    },
    horaBr(data) {
      return moment(data).format("HH:mm");
    },
    dataFullBr(data) {
      if (!data) return;
      return moment(data).format("DD/MM/YYYY [ás] HH:mm:ss");
    },
    addInCaso(row) {
      let find = this.evidenciasCaso.find(
        (el) => el.iD_Evidencia == row.iD_Evidencia
      );
      if (!find) {
        this.evidenciasCaso.push(row);
      }
    },
    addInShare(row) {
      let find = this.evidenciasShare.find(
        (el) => el.iD_Evidencia == row.iD_Evidencia
      );
      if (!find) {
        this.evidenciasShare.push(row);
        this.shareLink = "";
      }
    },
    removeInCaso(row) {
      let findIndex = this.evidenciasCaso.findIndex(
        (el) => el.iD_Evidencia == row.iD_Evidencia
      );
      if (findIndex !== -1) {
        this.evidenciasCaso.splice(findIndex, 1);
      }
    },
    removeInShare(row) {
      let findIndex = this.evidenciasShare.findIndex(
        (el) => el.iD_Evidencia == row.iD_Evidencia
      );
      if (findIndex !== -1) {
        this.evidenciasShare.splice(findIndex, 1);
        this.shareLink = "";
      }
    },
    refreshCaso() {
      this.casos.value = 0;
    },
    async sendCaso() {
      let send = {
        idCasos: this.casos.value,
        idVideoData: 0,
      };
      this.evidenciasCaso.forEach(async (evidencia) => {
        send.idVideoData = evidencia.iD_Evidencia;
        await post("/api/CasosVideoDatas", send);
      });
      await this.refreshEvidencias();
    },
    async sendShare() {
      let url = new URL(window.location.href);
      //this.shareLink = `${url.protocol}//${url.host}/share/${randon}`
      let send = this.evidenciasShare.map((ev) => ev.iD_Evidencia);
      await post(
        `/api/CompartilhamentoExterno?validadeHoras=${this.tempo}`,
        send
      )
        .then((data) => this.shareLink = `${url.protocol}//${url.host}/share/${data.token}`)
        .catch((err) => console.log(err));
    },
    copiarLink() {
      navigator.clipboard.writeText(this.shareLink);
    },
    async refreshEvidencias() {
      let { endpoint, share, data, formato, formatos } = this.getUpdate;

      await get(endpoint, data)
        .then((data) => {
          this.setEvidencias(data);
        })
        .then(() =>
          this.updateEvidenciasFormatos({
            value: formato,
            formatos: formatos,
          })
        )
        .finally(() => {
          this.evidenciasCaso = [];
          this.$Notice.success({
            title: this.getUser.empresa.flagInfo ? 'Evidências anexadas a ocorrência' : 'Evidências anexadas ao caso',
          });
        });
    },
  },
};
</script>

<style scoped>
.time {
  font-size: 14px;
  font-weight: bold;
}
.content {
  padding-left: 5px;
}
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.box-evidencia {
  display: grid;
  grid-template: ". ." / 1fr min-content;
}
.btn-acoes{
  display: flex;
  justify-content: center;
}
</style>