<template>
  <WizardForm :form="form" @on-validate="enviar">
    <FormItem label="Razão Social" prop="razao">
      <Input v-model="form.fields.razao"></Input>
    </FormItem>

    <FormItem label="CNPJ" prop="cnpj">
      <Input v-model="form.fields.cnpj"></Input>
    </FormItem>

    <FormItem label="Responsável" prop="responsavel">
      <Input v-model="form.fields.responsavel"></Input>
    </FormItem>

    <FormItem
      label="CPF Responsável (Administrador do Sistema)"
      prop="cpF_Responsavel"
    >
      <Input v-model="form.fields.cpF_Responsavel"></Input>
    </FormItem>

    <FormItem label="Email" prop="email">
      <Input v-model="form.fields.email"></Input>
    </FormItem>

    <FormItem label="Telefone">
      <Input v-model="form.fields.telefone"></Input>
    </FormItem>

    <FormItem label="Endereco">
      <Input v-model="form.fields.endereco"></Input>
    </FormItem>

    <FormItem label="Tipo de empresa">
      <div class="mp-2" style="clear: both">
        <RadioGroup v-model="form.fields.flagInfo">
          <Radio label="0" border>Monitoramento / Policiais</Radio>
          <Radio label="1" border>Manutenção</Radio>
        </RadioGroup>
      </div>
    </FormItem>

    <FormItem label="Observacoes">
      <Input v-model="form.fields.observacoes"></Input>
    </FormItem>

    <Divider orientation="left">Google</Divider>

    <FormItem label="Chave Google API">
      <Input v-model="form.fields.chaveGoogle"></Input>
    </FormItem>

    <Divider orientation="left">CLOUD</Divider>

    <FormItem label="idCloud" prop="idCloud">
      <Select v-model="form.fields.idCloud" filterable>
        <Option
          v-for="(cloud, indexCloud) in cloud.data"
          :value="cloud.value"
          :key="indexCloud"
          >{{ cloud.label }}</Option
        >
      </Select>
    </FormItem>

    <FormItem label="Espaço Disco" prop="espacoDisco">
      <Input v-model="form.fields.espacoDisco"></Input>
    </FormItem>

    <FormItem label="Unidade Espaço Disco" prop="uniEspacoDisco">
      <Input v-model="form.fields.uniEspacoDisco"></Input>
    </FormItem>

    <FormItem label="Tempo de armazemanto em Meses" prop="armazenamentoMeses">
      <Input v-model="form.fields.armazenamentoMeses"></Input>
    </FormItem>

    <FormItem
      label="Armazenamento em Meses para arquivos com Casos/Ocorrências"
      prop="armazenamentoMesesCriticos"
    >
      <Input v-model="form.fields.armazenamentoMesesCriticos"></Input>
    </FormItem>

    <div v-if="form.fields.idCloud == '1'">
      <Divider orientation="left">Servidor FTP</Divider>

      <FormItem label="Host FTP" prop="hostSFTP">
        <Input v-model="form.fields.hostSFTP"></Input>
      </FormItem>

      <FormItem label="Port FTP" prop="portSFTP">
        <Input v-model="form.fields.portSFTP"></Input>
      </FormItem>

      <FormItem label="User FTP" prop="userSFTP">
        <Input v-model="form.fields.userSFTP"></Input>
      </FormItem>

      <FormItem label="Pass SFTP" prop="passSFTP">
        <Input v-model="form.fields.passSFTP"></Input>
      </FormItem>

      <FormItem label="Path Files FTP" prop="pathFilesSFTP">
        <Input v-model="form.fields.pathFilesSFTP"></Input>
      </FormItem>
    </div>

    <div v-if="form.fields.idCloud == '2'">
      <Divider orientation="left">Azure</Divider>

      <FormItem label="Azure Account Name" prop="azureAccountName">
        <Input v-model="form.fields.azureAccountName"></Input>
      </FormItem>

      <FormItem label="Azure Account Key" prop="azureAccountKey">
        <Input v-model="form.fields.azureAccountKey"></Input>
      </FormItem>

      <FormItem label="Azure Service Uri" prop="azureServiceUri">
        <Input v-model="form.fields.azureServiceUri"></Input>
      </FormItem>

      <FormItem label="Azure Container" prop="azureContainer">
        <Input v-model="form.fields.azureContainer"></Input>
      </FormItem>
    </div>

    <Divider orientation="left">SMTP(Envio de E-mail)</Divider>

    <FormItem label="Email(s) de recebimento(s)">
      <Input v-model="form.fields.emailAdministrador"></Input>
    </FormItem>

    <FormItem label="Email de envio(Resposta)">
      <Input v-model="form.fields.emailEnvio"></Input>
    </FormItem>

    <FormItem label="URL SMTP">
      <Input v-model="form.fields.hostSMTP"></Input>
    </FormItem>

    <FormItem label="Porta SMTP">
      <Input v-model="form.fields.portSMTP"></Input>
    </FormItem>

    <FormItem label="Usa credencial Padrão">
      <div class="mp-2" style="clear: both">
        <RadioGroup v-model="form.fields.useDefaultCredentialsSMTP">
          <Radio label="true" border>Sim</Radio>
          <Radio label="false" border>Não</Radio>
        </RadioGroup>
      </div>
    </FormItem>

    <FormItem label="SSL">
      <div class="mp-2" style="clear: both">
        <RadioGroup v-model="form.fields.enableSSLSMTP">
          <Radio label="true" border>Sim</Radio>
          <Radio label="false" border>Não</Radio>
        </RadioGroup>
      </div>
    </FormItem>

    <FormItem label="Usuário">
      <Input v-model="form.fields.userSMTP"></Input>
    </FormItem>

    <FormItem label="Senha">
      <Input v-model="form.fields.senhaSMTP"></Input>
    </FormItem>
  </WizardForm>
</template>
<script>
import { get, put } from "@/services/api";
export default {
  data() {
    return {
      form: {
        title: "Editar empresa",
        name: "form-wizard-" + Math.floor(Math.random() * 100),
        back: { name: "admin-empresa" },
        fields: {
          razao: "",
          cnpj: "",
          responsavel: "",
          cpF_Responsavel: "",
          telefone: "",
          email: "",
          endereco: "",
          observacoes: "",
          chaveGoogle: "",
          idCloud: 0,
          espacoDisco: "",
          uniEspacoDisco: "",
          armazenamentoMeses: "",
          armazenamentoMesesCriticos: "",
          azureAccountName: "",
          azureAccountKey: "",
          azureServiceUri: "",
          azureContainer: "",
          hostSFTP: "",
          portSFTP: "",
          userSFTP: "",
          passSFTP: "",
          pathFilesSFTP: "",
          emailAdministrador: "",
          emailEnvio: "",
          hostSMTP: "",
          portSMTP: "",
          useDefaultCredentialsSMTP: "",
          enableSSLSMTP: "",
          userSMTP: "",
          senhaSMTP: "",
          flagInfo: "",
        },
        rules: {
          razao: [
            {
              required: true,
              message: "Campo obrigatório",
              trigger: "blur",
            },
          ],
          cnpj: [
            {
              required: true,
              message: "Campo obrigatório",
              trigger: "blur",
            },
          ],
          responsavel: [
            {
              required: true,
              message: "Campo obrigatório",
              trigger: "blur",
            },
          ],
          cpF_Responsavel: [
            {
              required: true,
              message: "Campo obrigatório",
              trigger: "blur",
            },
          ],
          email: [
            {
              required: true,
              message: "Campo obrigatório",
              trigger: "blur",
            },
          ],
          idCloud: [
            {
              required: true,
              message: "Campo obrigatório",
              validator: (rule, value) => value != 0,
              trigger: "change",
            },
          ],
          espacoDisco: [
            {
              required: true,
              message: "Campo obrigatório",
              trigger: "blur",
            },
          ],
          uniEspacoDisco: [
            {
              required: true,
              message: "Campo obrigatório",
              trigger: "blur",
            },
          ],
          armazenamentoMeses: [
            {
              required: true,
              message: "Campo obrigatório",
              trigger: "blur",
            },
          ],
          armazenamentoMesesCriticos: [
            {
              required: true,
              message: "Campo obrigatório",
              trigger: "blur",
            },
          ],
          azureAccountName: [
            {
              required: true,
              message: "Campo obrigatório",
              trigger: "blur",
            },
          ],
          azureAccountKey: [
            {
              required: true,
              message: "Campo obrigatório",
              trigger: "blur",
            },
          ],
          azureServiceUri: [
            {
              required: true,
              message: "Campo obrigatório",
              trigger: "blur",
            },
          ],
          azureContainer: [
            {
              required: true,
              message: "Campo obrigatório",
              trigger: "blur",
            },
          ],
          hostSFTP: [
            {
              required: true,
              message: "Campo obrigatório",
              trigger: "blur",
            },
          ],
          portSFTP: [
            {
              required: true,
              message: "Campo obrigatório",
              trigger: "blur",
            },
          ],
          userSFTP: [
            {
              required: true,
              message: "Campo obrigatório",
              trigger: "blur",
            },
          ],
          passSFTP: [
            {
              required: true,
              message: "Campo obrigatório",
              trigger: "blur",
            },
          ],
          pathFilesSFTP: [
            {
              required: true,
              message: "Campo obrigatório",
              trigger: "blur",
            },
          ],
        },
      },
      cloud: {
        data: [],
        originalData: [],
      },
    };
  },
  mounted() {
    this.initData();
  },
  watch: {
    "cloud.originalData"(to) {
      this.cloud.data = to.map((el) => ({
        value: el.id,
        label: el.descricao,
      }));
    },
  },
  methods: {
    async initData() {
      await get("/api/Auxiliar/Cloud").then(
        (data) => (this.cloud.originalData = data)
      );
      let id = this.$route.params.iD_Empresa;
      await get(`/api/Empresa/${id}`).then((data) => {
        this.form.fields = {
          razao: data.razao,
          cnpj: data.cnpj,
          responsavel: data.responsavel,
          cpF_Responsavel: data.cpF_Responsavel,
          telefone: data.telefone,
          email: data.email,
          endereco: data.endereco,
          observacoes: data.observacoes,
          chaveGoogle: data.chaveGoogle,
          idCloud: data.idCloud,
          espacoDisco: `${data.espacoDisco}`,
          uniEspacoDisco: `${data.uniEspacoDisco}`,
          armazenamentoMeses: `${data.armazenamentoMeses}`,
          armazenamentoMesesCriticos: `${data.armazenamentoMesesCriticos}`,
          azureAccountName: data.azureAccountName,
          azureAccountKey: data.azureAccountKey,
          azureServiceUri: data.azureServiceUri,
          azureContainer: data.azureContainer,
          hostSFTP: data.hostSFTP,
          portSFTP:
            data.portSFTP == "" || data.portSFTP == 0 ? "" : `${data.portSFTP}`,
          userSFTP: data.userSFTP,
          passSFTP: data.passSFTP,
          pathFilesSFTP: data.pathFilesSFTP,
          emailAdministrador: data.emailAdministrador,
          emailEnvio: data.emailEnvio,
          hostSMTP: data.hostSMTP,
          portSMTP:
            data.portSMTP == "" || data.portSMTP == 0 ? "" : `${data.portSMTP}`,
          useDefaultCredentialsSMTP: `${data.useDefaultCredentialsSMTP}`,
          enableSSLSMTP: `${data.enableSSLSMTP}`,
          userSMTP: data.userSMTP,
          senhaSMTP: data.senhaSMTP,
          flagInfo:  data.flagInfo == 1 ? "1" : "0",
        };
      });
    },
    async enviar({ validation }) {
      if (!validation) return;

      let { iD_Empresa } = this.$route.params;

      let {
        razao,
        cnpj,
        responsavel,
        cpF_Responsavel,
        telefone,
        email,
        endereco,
        observacoes,
        chaveGoogle,
        idCloud,
        espacoDisco,
        uniEspacoDisco,
        armazenamentoMeses,
        armazenamentoMesesCriticos,
        azureAccountName,
        azureAccountKey,
        azureServiceUri,
        azureContainer,
        hostSFTP,
        portSFTP,
        userSFTP,
        passSFTP,
        pathFilesSFTP,
        emailAdministrador,
        emailEnvio,
        hostSMTP,
        portSMTP,
        useDefaultCredentialsSMTP,
        enableSSLSMTP,
        userSMTP,
        senhaSMTP,
        flagInfo
      } = this.form.fields;

      let schema = {
        iD_Empresa,
        razao,
        cnpj,
        responsavel,
        cpF_Responsavel,
        telefone,
        email,
        endereco,
        observacoes,
        chaveGoogle,
        idCloud,
        espacoDisco,
        uniEspacoDisco,
        armazenamentoMeses,
        armazenamentoMesesCriticos,
        azureAccountName,
        azureAccountKey,
        azureServiceUri,
        azureContainer,
        hostSFTP,
        portSFTP: portSFTP == "" || portSFTP == 0 ? 0 : portSFTP,
        userSFTP,
        passSFTP,
        pathFilesSFTP,
        emailAdministrador,
        emailEnvio,
        hostSMTP,
        portSMTP: portSMTP == "" || portSMTP == 0 ? 0 : portSMTP,
        useDefaultCredentialsSMTP: useDefaultCredentialsSMTP == "true",
        enableSSLSMTP: enableSSLSMTP == "true",
        userSMTP,
        senhaSMTP,
        flagInfo: flagInfo == "1" ? 1 : 0,
      };

      await put(`/api/Empresa/${iD_Empresa}`, schema)
        .then(() => {
          this.$router.push({ name: "admin-empresa" });
          this.$Notice.success({
            title: "Empresa editada com sucesso",
          });
        })
        .catch((error) => {
          this.$Notice.error({
            title: "Erro ao editar a empresa",
            desc: error,
          });
        });
    },
  },
};
</script>
