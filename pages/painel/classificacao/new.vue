<template>
  <WizardForm :form="form" @on-validate="enviar">
    <FormItem label="Descrição" prop="descricao">
      <Input v-model="form.fields.descricao"></Input>
    </FormItem>
  </WizardForm>
</template>
<script>
import { get, post } from "@/services/api";
export default {
  data() {
    return {
      form: {
        title: "Criar nova classificação",
        name: "form-wizard-" + Math.floor(Math.random() * 100),
        back: { name: "painel-classificacao" },
        fields: {
          descricao: "",
        },
        rules: {
          descricao: [
            {
              required: true,
              message: "Campo obrigatório",
              trigger: "blur",
            },
          ],
        },
      },
    };
  },
  methods: {
    async enviar({ validation }) {
      if (!validation) return;
      //validação do nodes de array em PARENT ID
      let schema = {
        descricao: this.form.fields.descricao,
      };
      await post("/api/ClassificacaoCasos", schema)
        .then(() => {
          this.$router.push({ name: "painel-classificacao" });
          this.$Notice.success({
            title: "Classificação cadastrado com sucesso",
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
