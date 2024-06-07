<template>
  <Init>
    <WizardForm
      :form="form"
      @on-validate="enviarNotasParaAPI"
      btSend="Criar nota"
    >
      <FormItem label="Título">
        <Input v-model="form.fields.titulo"></Input>
      </FormItem>

      <FormItem label="Nota">
        <Input type="textarea" :rows="3" v-model="form.fields.nota"></Input>
      </FormItem>

      <FormItem label="Data da Nota">
        <DatePicker
          format="dd/MM/yyyy"
          v-model="form.fields.data"
          placeholder="Selecione a data do nota"
          style="width: 100%"
          transfer
        />
      </FormItem>
    </WizardForm>

    <Divider>Notas Evidência</Divider>
    <List border v-if="listaNotas.length > 0">
      <ListItem v-for="(nota, iNota) in listaNotas" :key="iNota">
        <ListItemMeta :title="nota.titulo" :description="nota.nota" />
      </ListItem>
    </List>
    <h4 v-else>Nenhuma Nota Cadastrada</h4>
  </Init>
</template>

<script>
import { get, post } from "@/services/api";
export default {
  props: ["evidencia"],
  data() {
    return {
      listaNotas: [],
      form: {
        name: "form-wizard-" + Math.floor(Math.random() * 100),
        fields: {
          titulo: "",
          nota: "",
          data: "",
        },
      },
    };
  },
  mounted() {
    if( this.evidencia.iD_Evidencia ){
      this.initNota();
    }    
  },
  methods: {
    async initNota() {
      await get(
        `/api/NotasEvidencias/Evidencias/${this.evidencia.iD_Evidencia}`
      )
        .then((data) => (this.listaNotas = data))
        .catch(() => console.log("SEM NOTAS EVIDENCIAS"));
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
    async enviarNotasParaAPI({ form }) {
      const schema = {
        idEvidencias: this.evidencia.iD_Evidencia,
        titulo: this.form.fields.titulo,
        nota: this.form.fields.nota,
        dataNota: this.form.fields.data,
      };
      await post("/api/NotasEvidencias", schema)
        .then(() => {
          this.initNota();
          this.$Message.success("Notas cadastradas com sucesso!");
        })
        .catch((error) => {
          this.$Message.error("Erro ao cadastrar notas.");
        });
      form.resetFields();
    },
  },
};
</script>