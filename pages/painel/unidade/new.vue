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
import { get, post } from "@/services/api";
export default {
  data() {
    return {
      form: {
        title: "Criar nova unidade",
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
    criarHierarquia(arr, parent = 0) {
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

      let schema = {
        nome: this.form.fields.nome,
        parent_ID,
      };
      await post("/api/Unidades", schema)
        .then(() => {
          this.$router.push({ name: "painel-unidade" });
          this.$Notice.success({
            title: "Subunidade cadastrada com sucesso",
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
