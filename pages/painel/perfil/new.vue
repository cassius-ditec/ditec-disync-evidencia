<template>
  <WizardForm :form="form" @on-validate="enviar">
    <FormItem label="Nome" prop="nome">
      <Input v-model="form.fields.nome"></Input>
    </FormItem>
  </WizardForm>
</template>
<script>
import { get, post } from "@/services/api";
export default {
  data() {
    return {
      form: {
        title: "Criar novo perfil",
        name: "form-wizard-" + Math.floor(Math.random() * 100),
        back: { name: "painel-perfil" },
        fields: {
          nome: "",
          dashboard_lista: [],
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
    };
  },
  methods: {
    async enviar({ validation }) {
      if (!validation) return;
      //validação do nodes de array em PARENT ID
      let schema = {
        nome: this.form.fields.nome,
      };
      await post("/api/Perfils", schema)
        .then(() => {
          this.$router.push({ name: "painel-perfil" });
          this.$Notice.success({
            title: "Perfil cadastrado com sucesso",
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
