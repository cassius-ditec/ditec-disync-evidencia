<template>
  <Double :title="title">
    <template #form>
      <WizardForm :form="form" @on-validate="enviar">
        <FormItem label="Título" prop="titulo">
          <Input v-model="form.fields.titulo"></Input>
        </FormItem>

        <FormItem label="Conteudo" prop="nota">
          <Input type="textarea" :rows="10" v-model="form.fields.nota"></Input>
        </FormItem>

        <FormItem label="Data" prop="data">
          <DatePicker
            format="dd/MM/yyyy"
            v-model="form.fields.data"
            type="date"
            placeholder="Selecione a data da nota"
            style="width: 100%"
          />
        </FormItem>
      </WizardForm>
    </template>
    <Timeline>
      <TimelineItem v-for="(notas, data) in notasPorData" :key="data">
        <p class="time">{{ $moment(data).format("DD/MM/YYYY") }}</p>
        <List border>
          <ListItem v-for="(nota, iNota) in notas" :key="iNota">
            <ListItemMeta
              :title="nota.titulo"
              :description="nota.nota"
            />
          </ListItem>

        </List>
      </TimelineItem>
    </Timeline>
  </Double>
</template>

<script>
import { get, post } from "@/services/api";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      id: this.$route.params.id,
      title: "Notas do caso",
      caso: {},
      notas: [],
      form: {
        title: "",
        name: "form-wizard-" + Math.floor(Math.random() * 100),
        back: { name: "painel-caso" },
        fields: {
          titulo: "",
          nota: "",
          data: "",
        },
        rules: {
          titulo: [
            {
              required: true,
              message: "Campo obrigatório",
            },
          ],
          nota: [
            {
              required: true,
              message: "Campo obrigatório",
            },
          ],
          data: [
            {
              required: true,
              message: "Campo obrigatório",
            },
          ],
        },
      },
    };
  },
  computed: {
    ...mapGetters("auth", ["getUser"]),
    notasPorData() {
      let todasDatas = this.notas.map((ev) =>
        this.$moment(ev.dataNota).format("YYYY-MM-DD")
      );
      let datas = [...new Set(todasDatas)].sort((a, b) => b.localeCompare(a));
      let grupo = {};
      datas.forEach((data) => {
        grupo[data] = this.notas.filter(
          (ev) => this.$moment(ev.dataNota).format("YYYY-MM-DD") === data
        );
      });
      return grupo;
    },
  },
  mounted() {
    this.init();
  },
  created() {
    if (this.getUser.empresa.flagInfo == 1) {
      this.title = "Notas da ocorrência";
    }
  },
  methods: {
    async init() {
      this.form.fields.data = this.$moment().format("DD/MM/YYYY");
      await get(`/api/Casos/${this.id}`).then((data) => (this.caso = data));
      await get(`/api/NotasCasos/Casos/${this.id}`).then(
        (data) => (this.notas = data)
      );
    },
    async enviar({ form, validation }) {
      if (!validation) return;
      let schema = {
        idCasos: this.id,
        titulo: this.form.fields.titulo,
        nota: this.form.fields.nota,
        dataNota: this.form.fields.data,
      };
      await post("/api/NotasCasos", schema)
        .then(() => {
          this.$Notice.success({
            title: this.getUser.empresa.flagInfo ? 'Nota da ocorrência cadastrada com sucesso' : 'Nota do caso cadastrada com sucesso',
          });
          form.resetFields();
          this.init();
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

<style>
</style>