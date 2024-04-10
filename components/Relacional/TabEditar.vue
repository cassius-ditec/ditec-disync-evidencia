<template>
  <Init>
    <WizardForm
      :form="form"
      @on-validate="enviarNotaEvidencia"
      btSend="Salvar evidência"
    >
      <FormItem label="Ocorrência">
        <Input v-model="form.fields.ocorrencia"></Input>
      </FormItem>

      <FormItem label="Tags">
        <Input v-model="form.fields.tags"></Input>
      </FormItem>
    </WizardForm>
  </Init>
</template>

<script>
import { get, put } from "@/services/api";
export default {
  props: ["evidencia"],
  data() {
    return {
      listaNotas: [],
      form: {
        name: "form-wizard-" + Math.floor(Math.random() * 100),
        fields: {
          ocorrencia: "",
          tags: "",
        },
        rules: {
          tags: [
            {
              required: true,
              message: "Campo obrigatório",
            },
          ],
          ocorrencia: [
            {
              required: true,
              message: "Campo obrigatório",
            },
          ],
        },
      },
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      this.form.fields.ocorrencia = this.evidencia.ocorrencia;
      this.form.fields.tags = this.evidencia.tags;
    },
    async enviarNotaEvidencia() {
      const schema = {
        ...this.evidencia,
        iD_Evidencia: this.evidencia.iD_Evidencia,
        ocorrencia: this.form.fields.ocorrencia,
        tags: this.form.fields.tags,
      };

      await put("/api/Evidencias/" + this.evidencia.iD_Evidencia, schema) // Substitua pela sua rota API correta
        .then(() => {
          this.$Notice.success({
            title: "Evidencia editada com sucesso",
          });
        })
        .catch((error) => {
          // Lógica de erro
          console.log(error);
        });
    },
  },
};
</script>
