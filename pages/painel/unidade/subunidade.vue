<template>
  <WizardForm :form="form" @on-validate="enviar">
    <FormItem label="Subunidade" prop="subunidade">
      <Input v-model="form.fields.subunidade"></Input>
    </FormItem>
  </WizardForm>
</template>
<script>
import { post } from "@/services/api";
export default {
  async asyncData({ route, redirect }) {
    if (!route.params.iD_Unidade) {
      redirect({ name: "painel-unidade" });
    }
    const { nome, iD_Unidade } = route.params; // Desestruturação para obter o valor de 'nome'
    const title = `Cadastrar subunidade em: ${nome}`;

    return await {
      title,
      parent_ID: iD_Unidade,
    };
  },
  created() {
    this.form.title = this.title;
  },
  data() {
    return {
      form: {
        name: "form-wizard-" + Math.floor(Math.random() * 100),
        back: { name: "painel-unidade" },
        fields: {
          subunidade: "",
        },
        rules: {
          subunidade: [
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
      let schema = {
        nome: this.form.fields.subunidade,
        parent_ID: this.parent_ID,
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
