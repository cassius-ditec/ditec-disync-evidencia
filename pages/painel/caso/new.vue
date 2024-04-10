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
import { get, post } from "@/services/api";
export default {
  data() {
    return {
      form: {
        title: "Criar novo caso",
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
    this.form.fields.dataCaso = this.$moment().format("DD/MM/YYYY")
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
      this.form.title = "Criar nova ocorrência";
    }
  },
  methods: {
    async initData() {
      await get("/api/ClassificacaoCasos/ativos").then(
        (data) => (this.classificacao.originalData = data)
      );
    },
    async enviar({ validation }) {
      if (!validation) return;

      let schema = {
        titulo: this.form.fields.titulo,
        dataCaso: this.form.fields.dataCaso
          ? this.$moment(this.form.fields.dataCaso).format(
              "YYYY-MM-DD[T]HH:mm:ss"
            )
          : "",
        idClassificacao: this.form.fields.idClassificacao,
        ocorrencia: this.form.fields.ocorrencia,
        tags: this.form.fields.tags,
      };

      await post("/api/Casos", schema)
        .then((data) => {
          this.$router.push({ name: "painel-caso" });
          this.$Notice.success({
            title: this.getUser.empresa.flagInfo ? 'Ocorrência cadastrada com sucesso' : 'Caso cadastrado com sucesso',
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
