<template>
  <WizardForm :form="form" @on-validate="enviar">
    <FormItem label="Ocorrência" prop="ocorrencia">
      <Input v-model="form.fields.ocorrencia"></Input>
    </FormItem>

    <FormItem :label="getUser.empresa.flagInfo ? 'Data da Ocorrência' : 'Data do Caso'" 
      prop="dataCaso">
      <DatePicker
        format="dd/MM/yyyy"
        v-model="form.fields.dataCaso"
        placeholder="Selecione a data do caso"
        style="width: 100%"
      />
    </FormItem>

    <FormItem label="Classificação" prop="idClassificacao">
      <Select v-model="form.fields.idClassificacao" filterable>
        <Option
          v-for="(classificacao, indexClassificacao) in classificacao.data"
          :value="classificacao.value"
          :key="indexClassificacao"
          >{{ classificacao.label }}</Option
        >
      </Select>
    </FormItem>

    <FormItem :label="getUser.empresa.flagInfo  ? 'Ordem de serviço' : 'Vulgo'">
      <Input v-model="form.fields.titulo"></Input>
    </FormItem>
  </WizardForm>
</template>
<script>
import { mapGetters } from "vuex";
import { get, put } from "@/services/api";
export default {
  data() {
    return {
      id: this.$route.params.idCasos,
      self: {},
      caso: {},
      form: {
        title: "Editar caso",
        name: "form-wizard-" + Math.floor(Math.random() * 100),
        back: { name: "painel-caso" },
        fields: {
          titulo: "",
          dataCaso: "",
          ocorrencia: "",
          tags: "",
          idClassificacao: "",
        },
        rules: {
          ocorrencia: [
            {
              required: true,
              message: "Campo obrigatório",
              trigger: "blur",
            },
          ],
          dataCaso: [
            {
              required: true,
              type: "date",
              message: "Campo obrigatório",
              trigger: "blur",
            },
          ],
          idClassificacao: [
            {
              required: true,
              message: "Campo obrigatório",
            },
          ],
        },
      },
      classificacao: {
        data: [],
        originalData: [],
      },
    };
  },
  mounted() {
    this.initData();
  },
  watch: {
    "classificacao.originalData"(to) {
      this.classificacao.data = to.map((el) => ({
        value: el.idClassificacao,
        label: el.descricao,
      }));
    },
  },
  computed: {
    ...mapGetters("auth", ["getUser"]),
  },
  created() {
    if (this.getUser.empresa.flagInfo == 1) {
      this.form.title = "Editar ocorrência";
    }
  },
  methods: {
    async initData() {
      await get("/api/ClassificacaoCasos/ativos").then(
        (data) => (this.classificacao.originalData = data)
      );

      await get(`/api/Casos/${this.id}`).then((data) => {
        this.caso = data;
        this.form.fields.titulo = data.titulo;
        this.form.fields.dataCaso = this.$moment(data.dataCaso).format(
          "DD/MM/YYYY"
        );
        this.form.fields.idClassificacao = data.idClassificacao;
        this.form.fields.ocorrencia = data.ocorrencia;
        this.form.fields.tags = data.tags;
      });
    },
    async enviar({ validation }) {
      if (!validation) return;

      let { idCasos, del, idUsuario, iD_Empresa } = this.caso;
      let { titulo, dataCaso, idClassificacao, ocorrencia, tags } =
        this.form.fields;

      if (dataCaso) {
        dataCaso = this.$moment(dataCaso).format("YYYY-MM-DD[T]HH:mm:ss");
      } else {
        dataCaso = "";
      }

      let schema = {
        idCasos,
        del,
        idUsuario,
        iD_Empresa,
        titulo,
        dataCaso,
        idClassificacao,
        ocorrencia,
        tags,
      };

      await put(`/api/Casos/${this.id}`, schema)
        .then((data) => {
          this.$router.push({ name: "painel-caso" });
          this.$Notice.success({
            title: this.getUser.empresa.flagInfo ? 'Ocorrência editada com sucesso' : 'Caso editado com sucesso',
          });
        })
        .catch((error) => {
          this.$Notice.error({
            title: "Notificação de Erro ao cadastrar",
            desc: error,
          });
        });
    },
  },
};
</script>
