<template>
  <WizardForm :form="form" @on-validate="enviar">
    <FormItem label="Descrição" prop="descricao">
      <Input v-model="form.fields.descricao"></Input>
    </FormItem>
  </WizardForm>
</template>
<script>
import { get, put } from "@/services/api";
export default {
  data() {
    return {
      form: {
        title: "Editar classificação",
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
      self:{},
    };
  },
  mounted() {
    this.selfData();
  },
  methods: {
    
    async selfData() {
      let id = this.$route.params.idClassificacao;
      await get(`/api/ClassificacaoCasos/${id}`).then((data) => {
        this.self = data
        this.form.fields.descricao =  this.self.descricao;
      });
    },
    
    async enviar({ validation }) {
      if (!validation) return;
      //validação do nodes de array em PARENT ID

      let { idClassificacao, iD_Empresa, idUsuario } = this.self
      let schema = {
        idClassificacao,
        del: null,
        iD_Empresa,
        idUsuario,
        descricao: this.form.fields.descricao,
      };
      await put(`/api/ClassificacaoCasos/${idClassificacao}`, schema)
        .then(() => {
          this.$router.push({ name: "painel-classificacao" });
          this.$Notice.success({
            title: "Classificação editada com sucesso",
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
