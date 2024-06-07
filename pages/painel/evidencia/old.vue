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
                  style="float: right; color: #ccc; padding-left: 10px"
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
            <Input v-model="form.fields.ocorrencia"></Input>
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
        <Card :bordered="true">
          <FormItem label="Data de" prop="data">
            <Tabs v-model="form.fields.tipodata" style="clear: both">
              <TabPane label="Gravação" name="1"> </TabPane>
              <TabPane label="Upload" name="2"> </TabPane>
              <TabPane label="Expurgo" name="3"> </TabPane>
              <TabPane label="Modificação" name="4"> </TabPane>
            </Tabs>

            <DatePicker
              transfer
              :model-value="form.fields.data"
              @on-change="dataEvent"
              :options="optionsDate"
              format="dd/MM/yyyy HH:mm:ss"
              type="datetimerange"
              placement="bottom-end"
              placeholder="Selecione as datas"
              style="width: 100%"
            />
            <span style="float: right; color: #c0c0c0">
              Exceto quando ocorrência</span
            >
          </FormItem>
          <pre>{{ form.fields.data }}</pre>
          <pre>{{ dataEvent }}</pre>
          <pre>{{ optionsDate }}</pre>
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
  data() {
    return {
      optionsDate: {
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
          tipodata: "1",
          data: [],
          tags: [],
          formatoArquivo: [],
          ocorrencia: "",
          compartilhado: "0",
        },
        rules: {
          data: [
            {
              required: true,
              type: "array",
              min: 2,
              message: "A data é obrigatoria",
            },
          ],
          formatoArquivo: [
            {
              required: true,
              type: "array",
              min: 1,
              message: "Um item é Obrigatorio",
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
      tags: {
        data: [],
      },
      formatoArquivos: {
        originalData: [],
        data: [],
      },
      dataGet: {},
    };
  },
  mounted() {
    this.initData();
  },
  watch: {
    "form.fields.ocorrencia"(to) {
      if (to) {
        this.form.rules.data[0].required = false;
      } else {
        this.form.rules.data[0].required = true;
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
    dataEvent(Evt) {
      this.form.fields.data = Evt;
    },
    createTags(tag) {
      this.tags.data.push({
        value: tag,
        label: tag,
      });
    },
    async enviar({ validation }) {
      if (!validation) return;
      this. startLoading()

      let {
        cameras,
        agentes,
        data,
        tipodata,
        tags,
        formatoArquivo,
        ocorrencia,
        compartilhado,
      } = this.form.fields;

      let GetEvidencias = {
        DataInicial: this.$moment(data[0], "DD/MM/YYYY HH:mm:ss").format(
          "YYYY-MM-DD[T]HH:mm:ss"
        ),
        DataFinal: this.$moment(data[1], "DD/MM/YYYY HH:mm:ss").format(
          "YYYY-MM-DD[T]HH:mm:ss"
        ),
        IdAgente: agentes ?? 0,
        Bodycam: cameras ?? 0,
        tipoData: tipodata,
      };

      let GetEvidenciasTag = {
        DataInicial: this.$moment(data[0], "DD/MM/YYYY HH:mm:ss").format(
          "YYYY-MM-DD[T]HH:mm:ss"
        ),
        DataFinal: this.$moment(data[1], "DD/MM/YYYY HH:mm:ss").format(
          "YYYY-MM-DD[T]HH:mm:ss"
        ),
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
      } else {
        //APENAS TAGS
        if (tags[0]) {
          await get("/api/Evidencias/GetEvidenciasTag", GetEvidenciasTag)
            .then((data) => evidencias.push(...data))
            .finally(() => {
              this.dataGet.endpoint = "/api/Evidencias/GetEvidenciasTag";
              this.dataGet.data = GetEvidenciasTag;
            });
        } else {
          //GERAL
          await get("/api/Evidencias/GetEvidencias", GetEvidencias)
            .then((data) => evidencias.push(...data))
            .finally(() => {
              this.dataGet.endpoint = "/api/Evidencias/GetEvidencias";
              this.dataGet.data = GetEvidencias;
            });
        }
      }

      //JOIN COMPARTILHADAS
      this.dataGet.share = false;
      if (compartilhado == "1") {
        await get("/api/Evidencias/GetEvidenciasCompartilhadas")
          .then((data) => evidencias.push(...data))
          .finally(() => {
            this.dataGet.share = true;
          });
      }

      this.createEvidencias(evidencias)
    },
    createEvidencias(data) {
      this.startLoading();
      let { formatoArquivo } = this.form.fields;

      this.dataGet.formato = formatoArquivo;
      this.dataGet.formatos = this.formatoArquivos.data;

      this.setEvidencias(data)
        .then(() =>
          this.updateEvidenciasFormatos({
            value: formatoArquivo,
            formatos: this.formatoArquivos.data,
          })        )
        .finally(() => this.criarResultado());
    },
    startLoading() {
      this.$Spin.show();
    },
    criarResultado() {
      this.setEndpoint(this.dataGet);
      this.$router.push({ name: "painel-evidencia-resultado" });
    },
  },
};
</script>


<style scoped>
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

.grid-relacional section {
  --row: 2;
  display: grid;
  grid-template-columns: repeat(var(--row), 1fr);
  gap: 20px;
}
</style>