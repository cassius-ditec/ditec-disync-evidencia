<template>
  <WizardForm :form="form" @on-validate="enviar">
    <FormItem label="Nome" prop="nome">
      <Input v-model="form.fields.nome"></Input>
    </FormItem>
    <FormItem label="Pertence a Unidade">
      <Cascader v-model="unidade.value" :data="unidade.data" change-on-select />
    </FormItem>
  </WizardForm>
</template>
<script>
import { get, put } from "@/services/api";
export default {
  data() {
    return {
      self:{},
      form: {
        title: "Editar unidade",
        name: "form-wizard-" + Math.floor(Math.random() * 100),
        back: { name: "painel-unidade" },
        fields: {
          nome: "",
        },
        rules: {
          nome: [
            {
              required: true,
              message: "Campo obrigatório",
              trigger: "blur",
            },
          ],
        },
      },
      unidade: {
        value: [],
        data: [],
        originalData: [],
      },
    };
  },
  mounted() {
    this.initData();
    this.selfData();
  },
  watch: {
    "unidade.originalData": {
      immediate: true,
      handler(v) {
        this.unidade.data = this.criarHierarquia(v);
      },
    },
  },
  methods: {
    async initData() {
      await get("/api/Unidades/filhosToken").then(
        (data) => (this.unidade.originalData = data)
      );
    },
    async selfData() {
      let id = this.$route.params.iD_Unidade;
      await get(`/api/Unidades/${id}`).then((data) => {
        this.self = data
        this.form.fields.nome = data.nome;
      });
      await get(`/api/Unidades/ParentID?id=${id}`).then((data) => {
        this.unidade.value = data
          .filter((arr) => arr.iD_Unidade != id)
          .map((child) => child.iD_Unidade);
      });
    },
    criarHierarquia(arr, parent = 0) {
      let id = this.$route.params.iD_Unidade;
      return arr
        .filter((item) => item.parent_ID === parent)
        .map((child) => ({
          value: child.iD_Unidade,
          label: child.nome,
          children: this.criarHierarquia(arr, child.iD_Unidade),
        }));
    },
    async enviar({ validation }) {
      if (!validation) return;
      //validação do nodes de array em PARENT ID
      let parent_ID =
        this.unidade.value.length > 0
          ? this.unidade.value[this.unidade.value.length - 1]
          : 0;

      let { iD_Unidade, iD_Empresa } = this.self;
      let schema = {
        iD_Unidade,
        iD_Empresa,
        nome: this.form.fields.nome,
        parent_ID,
      };
      await put(`/api/Unidades/${iD_Unidade}`, schema)
        .then(() => {
          this.$router.push({ name: "painel-unidade" });
          this.$Notice.success({
            title: "Unidade editada com sucesso",
          });
        })
        .catch((error) => {
          this.$Notice.error({
            title: "Notificação de Erro ao editar",
            desc: error,
          });
        });
    },
  },
};
</script>
