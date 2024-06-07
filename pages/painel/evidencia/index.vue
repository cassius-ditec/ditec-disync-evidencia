<template>
  <WizardForm :form="form" @on-validate="enviar" btSend="Filtrar">
    <div class="grid-relacional">
      <div class="grid-relacional_colunas">
        <section>
          <FormItem label="Cameras">
            <Select transfer filterable clearable v-model="form.fields.cameras">
              <Option
                v-for="(camera, i) in cameras.data"
                :key="i"
                :value="camera.value"
                :label="camera.label"
              >
                <span>{{ camera.label }}</span>
                <span
                  style="
                    float: right;
                    color: #ccc;
                    padding-left: 10px;
                    margin-bottom: 5px;
                  "
                  v-if="camera.agente"
                  >{{ camera.agente }}</span
                >
              </Option>
            </Select>
          </FormItem>
          <FormItem label="Agentes">
            <Select transfer filterable clearable v-model="form.fields.agentes">
              <Option
                v-for="(agente, i) in agentes.data"
                :key="i"
                :value="agente.value"
                :label="agente.label"
              >
                <span>{{ agente.label }}</span>
                <span
                  style="float: right; color: tomato; opacity: 0.5"
                  v-if="agente.inativo"
                  >inativo</span
                >
              </Option>
            </Select>
          </FormItem>
        </section>

        <section style="--row: 1">
          <FormItem label="Ocorrência">
            <Input clearable v-model="form.fields.ocorrencia"></Input>
          </FormItem>
        </section>

        <section style="--row: 1; gap: 0px">
          <FormItem label="Formato do Arquivo" prop="formatoArquivo">
            <div style="clear: both">
              <CheckboxGroup v-model="form.fields.formatoArquivo">
                <Checkbox
                  v-for="(formato, i) in formatoArquivos.data"
                  :key="i"
                  :label="formato.value"
                  border
                >
                  {{ formato.label }}
                </Checkbox>
              </CheckboxGroup>
            </div>
          </FormItem>
        </section>

        <section style="--row: 1">
          <FormItem label="Compartilhados">
            <div style="clear: both">
              <RadioGroup v-model="form.fields.compartilhado">
                <Radio label="1" border>Trazer Evidências Compartilhadas</Radio>
                <Radio label="0" border
                  >Não Trazer Evidências Compartilhadas</Radio
                >
              </RadioGroup>
            </div>
          </FormItem>
        </section>
      </div>

      <div class="grid-relacional_colunas">
        <Card :bordered="true" v-if="hasDate">
          <FormItem label="Data de" prop="tipodata">
            <Tabs v-model="form.fields.tipodata" style="clear: both">
              <TabPane label="Gravação" name="1"> </TabPane>
              <TabPane label="Upload" name="2"> </TabPane>
              <TabPane label="Expurgo" name="3"> </TabPane>
              <TabPane label="Modificação" name="4"> </TabPane>
            </Tabs>
          </FormItem>

          <section class="dataHora">
            <FormItem
              :label="isIntervalo ? 'Data Inicial' : 'Data'"
              prop="dtStart"
            >
              <DatePicker
                type="date"
                v-model="form.fields.dtStart"
                format="dd/MM/yyyy"
                style="width: 100%"
                :options="optionsDateStart"
              />
            </FormItem>

            <FormItem v-if="isIntervalo" label="Hora Inicial" prop="hrStart">
              <TimePicker
                transfer
                v-model="form.fields.hrStart"
                style="width: 100%"
              />
            </FormItem>

            <FormItem v-if="isIntervalo" label="Data Final" prop="dtFinish">
              <DatePicker
                type="date"
                transfer
                format="dd/MM/yyyy"
                v-model="form.fields.dtFinish"
                style="width: 100%"
                :options="optionsDateFinish"
              />
            </FormItem>

            <FormItem v-if="isIntervalo" label="Hora Final" prop="hrFinish">
              <TimePicker
                transfer
                v-model="form.fields.hrFinish"
                style="width: 100%"
              />
            </FormItem>

            <Checkbox v-model="form.fields.diatodo"> Todo Dia</Checkbox>
          </section>
          <span style="float: right; color: #c0c0c0">
            Exceto quando ocorrência</span
          >
        </Card>
        <Card :bordered="true">
          <template #title>Tags:</template>
          <Select
            v-model="form.fields.tags"
            filterable
            multiple
            allow-create
            @on-create="createTags"
          >
            <Option
              v-for="tag in tags.data"
              :value="tag.value"
              :key="tag.value"
              >{{ tag.label }}</Option
            >
          </Select>
        </Card>
      </div>
    </div>
  </WizardForm>
</template>

<script>
import { get } from "@/services/api";
import { mapActions } from "vuex";
export default {
  computed: {
    isIntervalo() {
      return !this.form.fields.diatodo;
    },
    hasDate() {
      return this.form.fields.ocorrencia.length == 0;
    },
  },
  watch: {
    isIntervalo(value) {
      if (!value) {
        this.form.fields.dtFinish = this.form.fields.dtStart;
        this.form.fields.hrStart = "00:00:00";
        this.form.fields.hrFinish = "23:59:59";
        this.optionsDateStart.disabledDate = (date) => {
          let today = new Date();
          today.setHours(0, 0, 0, 0);
          return date && date.valueOf() > today.valueOf();
        };
      }
    },
    "form.fields.dtFinish": {
      handler(newDate) {
        this.optionsDateStart.disabledDate = (date) => {
          let today = new Date();
          today.setHours(0, 0, 0, 0);
          return (
            (date && date.valueOf() > today.valueOf()) ||
            date.valueOf() > newDate.valueOf()
          );
        };

        this.optionsDateFinish.disabledDate = (date) => {
          let today = new Date();
          today.setHours(0, 0, 0, 0);
          return (
            (date && date.valueOf() > today.valueOf()) ||
            date.valueOf() < this.form.fields.dtStart.valueOf()
          );
        };
      },
      immediate: true,
    },
    "form.fields.dtStart": {
      handler(newDate) {
        this.optionsDateFinish.disabledDate = (date) => {
          let today = new Date();
          today.setHours(0, 0, 0, 0);
          return (
            (date && date.valueOf() > today.valueOf()) ||
            date.valueOf() < newDate.valueOf()
          );
        };

        this.optionsDateStart.disabledDate = (date) => {
          let today = new Date();
          today.setHours(0, 0, 0, 0);
          return (
            (date && date.valueOf() > today.valueOf()) ||
            date.valueOf() > this.form.fields.dtFinish.valueOf()
          );
        };
      },
      immediate: true,
    },
    "form.fields.ocorrencia"(to) {
      if (to) {
        this.form.rules.dtStart[0].required = false;
        this.form.rules.hrStart[0].required = false;
        this.form.rules.dtFinish[0].required = false;
        this.form.rules.hrFinish[0].required = false;
      } else {
        this.form.rules.dtStart[0].required = true;
        this.form.rules.hrStart[0].required = true;
        this.form.rules.dtFinish[0].required = true;
        this.form.rules.hrFinish[0].required = true;
      }
    },
    "cameras.originalData"(to) {
      this.cameras.data = [
        {
          value: 0,
          label: "Todos as cameras",
          agente: "",
        },
        ...to.map((el) => ({
          value: el.iD_Bodycam,
          label: el.deviceID,
          agente: el.agente ? el.agente.nome : "",
        })),
      ];
    },
    "agentes.originalData"(to) {
      this.agentes.data = [
        {
          value: 0,
          label: "Todos os agentes",
          inativo: false,
        },
        ...to.map((el) => ({
          value: el.iD_Usuario,
          label: el.nome,
          inativo: el.inativo,
        })),
      ];
    },
    "formatoArquivos.originalData"(to) {
      this.formatoArquivos.data = to.map((el) => {
        this.form.fields.formatoArquivo.push(el.id);
        return {
          value: el.id,
          label: `${el.descricao}s`,
        };
      });
    },
  },
  data() {
    let dtStart = new Date();
    let dtFinish = new Date();
    return {
      optionsDateStart: {
        disabledDate(date) {
          let today = new Date();
          today.setHours(0, 0, 0, 0);
          return date && date.valueOf() > today.valueOf();
        },
      },
      optionsDateFinish: {
        disabledDate(date) {
          let today = new Date();
          today.setHours(0, 0, 0, 0);
          return date && date.valueOf() > today.valueOf();
        },
      },
      form: {
        title: "Gestor de Evidências",
        name: "form-wizard-" + Math.floor(Math.random() * 100),
        fields: {
          cameras: 0,
          agentes: 0,
          ocorrencia: "",
          formatoArquivo: [],
          compartilhado: "0",
          tipodata: "1",
          tags: [],
          dtStart: dtStart,
          dtFinish: dtFinish,
          hrStart: "00:00:00",
          hrFinish: "23:59:59",
          diatodo: true,
        },
        rules: {
          formatoArquivo: [
            {
              required: true,
              type: "array",
              min: 1,
              message: "Um item é Obrigatorio",
              trigger: "change",
            },
          ],
          tipodata: [
            {
              required: true,
              message: "Um tipo é obrigatório",
            },
          ],
          dtStart: [
            {
              required: true,
              type: "date",
              message: "Uma data é obrigatória",
              trigger: "change",
            },
          ],
          hrStart: [
            {
              required: true,
              type: "string",
              message: "Uma hora é obrigatória",
              trigger: "change",
            },
          ],
          dtFinish: [
            {
              required: true,
              type: "date",
              message: "Uma data é obrigatória",
              trigger: "change",
            },
          ],
          hrFinish: [
            {
              required: true,
              type: "string",
              message: "Uma hora é obrigatória",
              trigger: "change",
            },
          ],
        },
      },
      cameras: {
        data: [],
        originalData: [],
      },
      agentes: {
        data: [],
        originalData: [],
      },
      formatoArquivos: {
        originalData: [],
        data: [],
      },
      tags: {
        data: [],
      },
      dataGet: {},
    };
  },
  methods: {
    ...mapActions("evidencia", [
      "setEvidencias",
      "updateEvidenciasCaso",
      "updateEvidenciasFormatos",
      "setEndpoint",
    ]),
    async initData() {
      await get("/api/Bodycam?ativos=true").then(
        (data) => (this.cameras.originalData = data)
      );
      await get("/api/Usuarios/TokenFilhos/Ativos", { ativos: true }).then(
        (data) => (this.agentes.originalData = data)
      );
      await get("/api/Auxiliar/TipoArquivo").then(
        (data) => (this.formatoArquivos.originalData = data)
      );
    },
    createTags(tag) {
      this.tags.data.push({
        value: tag,
        label: tag,
      });
    },
    startLoading() {
      this.$Spin.show();
    },
    async enviar({ validation }) {
      if (!validation) return;
      this.startLoading();

      let {
        cameras,
        agentes,
        ocorrencia,
        formatoArquivo,
        compartilhado,
        tipodata,
        tags,
        dtStart,
        dtFinish,
        hrStart,
        hrFinish,
        diatodo,
      } = this.form.fields;

      let DataInicial, DataFinal;

      if (diatodo) {
        DataInicial = this.$moment(dtStart)
          .set({ hour: 0, minute: 0, second: 0 })
          .format("YYYY-MM-DD[T]HH:mm:ss");
        DataFinal = this.$moment(dtStart)
          .set({ hour: 23, minute: 59, second: 59 })
          .format("YYYY-MM-DD[T]HH:mm:ss");
        console.log(DataInicial, DataFinal);
      } else {
        let [hr, min, seg] = hrStart.split(":");
        let [hrF, minF, segF] = hrFinish.split(":");

        DataInicial = this.$moment(dtStart)
          .set({ hour: hr, minute: min, second: seg })
          .format("YYYY-MM-DD[T]HH:mm:ss");

        DataFinal = this.$moment(dtFinish)
          .set({ hour: hrF, minute: minF, second: segF })
          .format("YYYY-MM-DD[T]HH:mm:ss");
      }

      let GetEvidencias = {
        DataInicial,
        DataFinal,
        IdAgente: agentes ?? 0,
        Bodycam: cameras ?? 0,
        tipoData: tipodata,
      };

      let GetEvidenciasTag = {
        DataInicial,
        DataFinal,
        Tag: tags.map((tag) => "#" + tag.replace(/\s/g, "")).join(""),
        tipoData: tipodata,
      };

      let GetEvidenciasOcorrencia = {
        Ocorrencia: ocorrencia,
      };

      let evidencias = [];

      //APENAS OCORRENCIAS
      if (ocorrencia) {
        await get(
          "/api/Evidencias/GetEvidenciasOcorrencia",
          GetEvidenciasOcorrencia
        )
          .then((data) => evidencias.push(...data))
          .finally(() => {
            this.dataGet.endpoint = "/api/Evidencias/GetEvidenciasOcorrencia";
            this.dataGet.data = GetEvidenciasOcorrencia;
          });
      } // Apenas TAGS
      else {
        if (tags[0]) {
          await get("/api/Evidencias/GetEvidenciasTag", GetEvidenciasTag)
            .then((data) => evidencias.push(...data))
            .finally(() => {
              this.dataGet.endpoint = "/api/Evidencias/GetEvidenciasTag";
              this.dataGet.data = GetEvidenciasTag;
            });
        }
        //GERAL
        else {
          await get("/api/Evidencias/GetEvidencias", GetEvidencias)
            .then((data) => evidencias.push(...data))
            .finally(() => {
              this.dataGet.endpoint = "/api/Evidencias/GetEvidencias";
              this.dataGet.data = GetEvidencias;
            });
        }
      }
      this.dataGet.share = false;
      if (compartilhado == "1") {
        await get("/api/Evidencias/GetEvidenciasCompartilhadas")
          .then((data) => evidencias.push(...data))
          .finally(() => {
            this.dataGet.share = true;
          });
      }

      this.createEvidencias(evidencias);
    },
    createEvidencias(data) {
      let { formatoArquivo } = this.form.fields;

      this.dataGet.formato = formatoArquivo;
      this.dataGet.formatos = this.formatoArquivos.data;

      this.setEvidencias(data)
        .then(() =>
          this.updateEvidenciasFormatos({
            value: formatoArquivo,
            formatos: this.formatoArquivos.data,
          })
        )
        .finally(() => this.criarResultado());
    },
    criarResultado() {
      this.setEndpoint(this.dataGet);
      this.$router.push({ name: "painel-evidencia-resultado" });
    },
  },
  mounted() {
    this.initData();
  },
};
</script>

<style>
.grid-relacional {
  display: grid;
  grid-template: ". ." min-content / 1fr 480px;
  gap: 20px;
}

.grid-relacional_colunas {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.grid-relacional_colunas > section {
  --row: 2;
  display: grid;
  grid-template-columns: repeat(var(--row), 1fr);
  gap: 20px;
}

.dataHora {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-flow: row;
  gap: 0px 20px;
  align-items: center;
}
.dataHora > *:last-child {
  background: #f5f5f5;
  margin-top: 10px;
  padding: 7px 17px;
  border-radius: 5px;
}
</style>
