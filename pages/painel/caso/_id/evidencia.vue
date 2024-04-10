<template>
  <div class="grid-evidencias">
    <section>
      <Collapse v-model="tabOpen">
        <Panel name="caso">
          {{ caso.ocorrencia }}
          <template #content>
            <div class="data-list-01">
              <div>Ocorrência</div>
              <div>{{ caso.ocorrencia }}</div>

              <div>Classificação</div>
              <div>
                {{
                  caso.classificacao ? caso.classificacao.descricao ?? "-" : "-"
                }}
              </div>

              <div> {{ getUser.empresa.flagInfo ? 'Ordem de serviço' : 'Vulgo' }} </div>
              <div>{{ caso.titulo }}</div>

              <div>Data</div>
              <div>{{ $moment(caso.dataCaso).format("DD/MM/YYYY") }}</div>

              <div>Usuário</div>
              <div>{{ caso.user ? caso.user.nome ?? "-" : "-" }}</div>
            </div>
          </template>
        </Panel>
        <Panel name="nota">
          Notas
          <template #content>
            <div class="notas">
              <article v-for="(nota, indexNota) in notas" :key="indexNota">
                <header>
                  <h2>{{ nota.titulo }}</h2>
                  <h4>{{ $moment(nota.dataNota).format("DD/MM/YYYY") }}</h4>
                </header>
                {{ nota.nota }}
              </article>
            </div>
          </template>
        </Panel>
        <Panel name="upload">
          Agentes
          <template #content>
            <List border>
              <ListItem v-for="agente in agentes" :key="agente.userID">
                <ListItemMeta
                  :title="agente.userID"
                  :description="agente.nome"
                />
              </ListItem>
            </List>
          </template>
        </Panel>
      </Collapse>
    </section>
    <section>
      <Collapse v-model="tabOpen">
        <Panel name="filtro">
          Filtrar
          <template #content>
            <Input search placeholder="Pesquisar" clearable v-model="query" />
          </template>
        </Panel>
      </Collapse>
    </section>
    <section>
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
            </Table>
          </div>
        </TimelineItem>
      </Timeline>
    </section>
  </div>
</template>

<script>
import { get } from "@/services/api";
import { mapGetters } from "vuex";
export default {
  data: () => ({
    tabOpen: ["caso"],
    caso: {},
    notas: [],
    agentes: [],
    evidencias: {
      data: [],
      original: [],
    },
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
    ],
    query: "",
  }),
  computed: {
    ...mapGetters("auth", ["getUser"]),
    getEvidenciasGroupData() {
      let evidencias = this.evidencias.data;
      let todasDatas = evidencias.map((ev) =>
        this.$moment(ev.data).format("YYYY-MM-DD")
      );
      let datas = [...new Set(todasDatas)].sort((a, b) => b.localeCompare(a));
      let grupo = {};
      datas.forEach((data) => {
        grupo[data] = evidencias.filter(
          (ev) => this.$moment(ev.data).format("YYYY-MM-DD") === data
        );
      });
      return grupo;
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      let { id } = this.$route.params;
      await get(`/api/Casos/${id}`).then((data) => (this.caso = data));

      await get(`/api/NotasCasos/Casos/${id}`).then(
        (data) => (this.notas = data)
      );

      await get("/api/Casos/GetAgentesCaso", { IdCaso: id }).then(
        (data) => (this.agentes = data)
      );

      await get("/api/Casos/GetEvidenciasCaso", { IdCaso: id }).then(
        (data) => (this.evidencias.original = this.evidencias.data = data)
      );
    },
    dataBr(data) {
      return this.$moment(data).format("DD/MM/YYYY");
    },
    horaBr(data) {
      return this.$moment(data).format("HH:mm");
    },
    dataFullBr(data) {
      if (!data) return;
      return this.$moment(data).format("DD/MM/YYYY [ás] HH:mm:ss");
    },
    showEvidencia(evidencia) {
      this.evidencia = evidencia;
    },
    limparEvidencia() {
      this.evidencia = {};
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
  watch: {
    query(to) {
        this.evidencias.data = this.evidencias.original.filter((obj) => this.searchInJSON(obj, to));
    },
  },
};
</script>

<style scoped>
.grid-evidencias {
  padding: 15px;
  display: grid;
  grid-template:
    "caso filtro" max-content
    "caso resultado" 1fr
    / 400px 1fr;

  width: 100%;
  height: 100%;
  gap: 10px;
}
.grid-evidencias > section:nth-child(1) {
  grid-area: caso;
}
.grid-evidencias > section:nth-child(2) {
  grid-area: filtro;
}
.grid-evidencias > section:nth-child(3) {
  grid-area: resultado;
}

.data-list-01 {
  display: grid;
  grid-template: ". ." / auto 1fr;
  gap: 10px;
}
.data-list-01 > div {
  font-size: 12px;
}
.data-list-01 > div:nth-child(odd) {
  font-weight: 900;
}

.notas {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.notas article {
  font-size: 11px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-left: 2px solid #636363;
  background: #63636311;
  padding: 5px 2px 5px 9px;
}
.notas article header {
  display: grid;
  grid-template: "." "." / 1fr;
}
</style>