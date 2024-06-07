<template>
  <WizardForm :form="form" @on-validate="enviar">
    <FormItem label="Modelo Bodycam" prop="modelo">
      <div style="clear: both">
        <RadioGroup v-model="form.fields.modelo">
          <Radio
            v-for="(modelo, iModelo) in modelos"
            :key="iModelo"
            :label="modelo.id"
            border
          >
            {{ modelo.descricao }}
          </Radio>
        </RadioGroup>
      </div>
    </FormItem>

    <FormItem label="Número de Serie" prop="numeroSerie">
      <Input v-model="form.fields.numeroSerie"></Input>
    </FormItem>

    <FormItem label="Device ID" prop="deviceID">
      <Input v-model="form.fields.deviceID"></Input>
    </FormItem>

    <FormItem label="Alias">
      <Input v-model="form.fields.alias"></Input>
    </FormItem>

    <div v-if="form.fields.modelo == 2">
      <FormItem label="IMEI" prop="imei">
        <Input v-model="form.fields.imei"></Input>
      </FormItem>

      <FormItem label="Versão do Firmware" prop="versaoFirmware">
        <Input v-model="form.fields.versaoFirmware"></Input>
      </FormItem>

      <FormItem label="Server Listen" prop="server_Listen">
        <Input v-model="form.fields.server_Listen"></Input>
      </FormItem>

      <FormItem label="Server SRS" prop="server_SRS">
        <Input v-model="form.fields.server_SRS"></Input>
      </FormItem>
    </div>
  </WizardForm>
</template>

<script>
import { get, post } from "@/services/api";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      form: {
        title: "Criar nova bodycam",
        name: "form-wizard-" + Math.floor(Math.random() * 100),
        back: { name: "painel-bodycam" },
        fields: {
          imei: "",
          modelo: null,
          numeroSerie: "",
          deviceID: "",
          versaoFirmware: "",
          server_Listen: "",
          server_SRS: "",
          alias: "",
        },
        rules: {
          modelo: [
            {
              required: true,
              message: "Um item é Obrigatorio",
            },
          ],
          imei: [
            {
              required: true,
              message: "Campo obrigatório",
              trigger: "blur",
            },
          ],
          numeroSerie: [
            {
              required: true,
              message: "Campo obrigatório",
              trigger: "blur",
            },
          ],
          deviceID: [
            {
              required: true,
              message: "Campo obrigatório",
              trigger: "blur",
            },
          ],
          versaoFirmware: [
            {
              required: true,
              message: "Campo obrigatório",
              trigger: "blur",
            },
          ],
          server_Listen: [
            {
              required: true,
              message: "Campo obrigatório",
              trigger: "blur",
            },
          ],
          server_SRS: [
            {
              required: true,
              message: "Campo obrigatório",
              trigger: "blur",
            },
          ],
        },
      },
      modelos: [],
    };
  },
  computed: {
    ...mapGetters("auth", ["getUserEmpresa"]),
  },
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      await get("/api/Auxiliar/ModelCamera").then(
        (data) => (this.modelos = data)
      );
    },
    async enviar({ validation }) {
      if (!validation) return;
      let schema = {
        iD_Empresa: this.getUserEmpresa,
        imei: this.form.fields.imei,
        modelo: this.form.fields.modelo,
        numeroSerie: this.form.fields.numeroSerie,
        deviceID: this.form.fields.deviceID,
        versaoFirmware: this.form.fields.versaoFirmware,
        server_Listen: this.form.fields.server_Listen,
        server_SRS: this.form.fields.server_SRS,
        alias: this.form.fields.alias,
      };
      await post("/api/Bodycam", schema)
        .then(() => {
          this.$router.push({ name: "painel-bodycam" });
          this.$Notice.success({
            title: "Bodycam cadastrada com sucesso",
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

<style>
</style>