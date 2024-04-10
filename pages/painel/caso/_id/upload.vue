<template>
  <Double :title="title">
    <template #form>
      <WizardForm :form="form" @on-validate="enviar" btSend="Upload">
        <FormItem label="Upload" prop="file">
          <Upload action="" :before-upload="handleUpload">
            <Button icon="ios-cloud-upload-outline">
              Selecione o arquivo para upload
            </Button>
          </Upload>
          {{ nomeArquivo }}
        </FormItem>

        <FormItem label="Duração">
          <Input v-model="form.fields.duracao"></Input>
        </FormItem>

        <FormItem label="Data">
          <DatePicker
            format="dd/MM/yyyy"
            v-model="form.fields.data"
            type="date"
            placeholder="Selecione a data do upload"
            style="width: 100%"
          ></DatePicker>
        </FormItem>

        <FormItem label="Tags">
          <Input v-model="form.fields.tags"></Input>
        </FormItem>

        <FormItem label="Classificação" prop="classificacao">
          <Select v-model="form.fields.classificacao" filterable>
            <Option
              v-for="(classificacao, i) in classificacao.data"
              :value="classificacao.value"
              :key="i"
              >{{ classificacao.label }}</Option
            >
          </Select>
        </FormItem>

        <FormItem label="Agente" prop="agente">
          <Select v-model="form.fields.agente" filterable>
            <Option
              v-for="(agente, i) in agente.data"
              :value="agente.value"
              :key="i"
              >{{ agente.label }}</Option
            >
          </Select>
        </FormItem>
      </WizardForm>
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
          </Table>
        </div>
      </TimelineItem>
    </Timeline>
  </Double>
</template>

<script>
import { get, post } from "@/services/api";
export default {
  data() {
    return {
      id: this.$route.params.id,
      title: "Upload de Arquivos",
      caso: {},
      evidencias: [],
      evidencia: {},
      agente: {
        data: [],
        originalData: [],
      },
      classificacao: {
        data: [],
        originalData: [],
      },
      form: {
        title: "",
        name: "form-wizard-" + Math.floor(Math.random() * 100),
        back: { name: "painel-caso" },
        fields: {
          agente: "",
          tags: "",
          data: "",
          duracao: null,
          classificacao: "",
          file: null,
        },
        rules: {
          agente: [
            {
              required: true,
              message: "Campo obrigatório",
            },
          ],
          classificacao: [
            {
              required: true,
              message: "Campo obrigatório",
            },
          ],
          file: [
            {
              required: true,
              message: "Campo obrigatório",
            },
          ],
        },
      },
      nomeArquivo: "",
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
    };
  },
  watch: {
    "agente.originalData"(to) {
      this.agente.data = [
        { value: 0, label: "Selecione um agente" },
        ...to.map((el) => ({ value: el.iD_Usuario, label: el.nome })),
      ];
    },
    "classificacao.originalData"(to) {
      this.classificacao.data = [
        { value: 0, label: "Selecione uma classificacao" },
        ...to.map((el) => ({
          value: el.idClassificacao,
          label: el.descricao,
        })),
      ];
    },
  },
  computed: {
    getEvidenciasGroupData() {
      let todasDatas = this.evidencias.map((ev) =>
        this.$moment(ev.data).format("YYYY-MM-DD")
      );
      let datas = [...new Set(todasDatas)].sort((a, b) => b.localeCompare(a));
      let grupo = {};
      datas.forEach((data) => {
        grupo[data] = this.evidencias.filter(
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
      await get(`/api/Casos/${this.id}`).then((data) => (this.caso = data));

      await get("/api/Usuarios/TokenFilhos/Ativos", { ativos: true }).then(
        (data) => (this.agente.originalData = data)
      );
      await get("/api/ClassificacaoCasos/ativos").then(
        (data) => (this.classificacao.originalData = data)
      );
      await get("/api/Casos/GetEvidenciasCaso", { IdCaso: this.id }).then(
        (data) => (this.evidencias = data)
      );
    },
    async enviar({ form, validation }) {
      if (!validation) return;

      let schema = {
        iD_Agente: this.form.fields.agente,
        ocorrencia: this.caso.ocorrencia,
        data: this.form.fields.data,
        classificacao: this.form.fields.classificacao,
        tags: this.form.fields.tags,
        iD_Caso: this.id,
        duracao: this.form.fields.duracao,
      };

      let { lastModified } = this.form.fields.file;

      schema.data_Gravacao = this.$moment(lastModified).format(
        "YYYY-MM-DD[T]HH:mm:ss"
      );

      let evidencias = JSON.stringify(schema);
      
      let formData = new FormData();
      formData.append("file", this.form.fields.file);

      await post(
        `/api/Cloud/UploadArquivoCaso?evidencias=${evidencias}`,
        formData
      )
        .then(() => {
          this.$Notice.success({
            title: "Arquivo enviado com sucesso",
          });
          form.resetFields();
          this.init();
        })
        .catch((error) => {
          this.$Notice.error({
            title: "Arquivo existente",
            desc: error,
          });
        });

    },
    handleUpload(file) {
      this.form.fields.file = file;
      this.nomeArquivo = file.name;
      return false;
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
  },
};
</script>

<style>
</style>