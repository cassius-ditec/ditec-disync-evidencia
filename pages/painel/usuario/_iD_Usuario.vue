<template>
  <WizardForm :form="form" @on-validate="enviar">
    <Init style="padding-bottom:20px; display:flex; justify-content: end">
      <Button
        type="warning"
        icon="md-key"
        :to="{ name: 'painel-usuario-password', params: {...this.usuario, back: 'painel-usuario-iD_Usuario'} }"
        >Mudar senha</Button
      >
    </Init>
    <Row :gutter="24">
      <Col span="16">
        <FormItem label="Nome" prop="nome">
          <Input v-model="form.fields.nome"></Input>
        </FormItem>
      </Col>
      <Col span="8">
        <FormItem label="UUID" prop="userID">
          <Input v-model="form.fields.userID" maxlength="7">
            <template #append>
              <Button icon="md-refresh-circle" @click.prevent="gerarUUID"
                >Gerar UUID Único</Button
              >
            </template></Input>
        </FormItem>
      </Col>
    </Row>
    <FormItem label="E-mail" prop="email">
      <Input v-model="form.fields.email"></Input>
    </FormItem>
    <FormItem label="CPF" prop="cpf">
      <Input v-model="form.fields.cpf"></Input>
    </FormItem>
    <FormItem label="Telefone" prop="telefone">
      <Input v-model="form.fields.telefone"></Input>
    </FormItem>
    <FormItem label="Unidade" prop="unidade">
      <Cascader v-model="unidade.value" :data="unidade.data" change-on-select />
    </FormItem>
    <FormItem label="Perfil" prop="perfil">
      <Select v-model="perfil.value" filterable>
        <Option
          v-for="item in perfil.data"
          :value="item.value"
          :key="item.value"
          >{{ item.label }}</Option
        >
      </Select>
    </FormItem>
  </WizardForm>
</template>
<script>
import { get, put } from "@/services/api";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      form: {
        title: "Editar usuário",
        name: "form-wizard-" + Math.floor(Math.random() * 100),
        back: { name: "painel-usuario" },
        fields: {
          userID: "",
          nome: "",
          email: "",
          cpf: "",
          telefone: "",
          senha_atual: "",
        },
        rules: {
          userID: [
            {
              required: true,
              message: "Campo obrigatório",
              trigger: "blur",
            },
          ],
          nome: [
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
            {
              type: "email",
              message: "Formato de email incorreto",
              trigger: "blur",
            },
          ],
          cpf: [
            {
              required: true,
              message: "Campo obrigatório",
              trigger: "blur",
            },
          ],
          telefone: [
            {
              required: true,
              message: "Campo obrigatório",
              trigger: "blur",
            },
          ],
          unidade: [
            {
              required: true,
              message: "Campo obrigatório",
              validator: () => this.unidade.value.length > 0,
              trigger: "change",
            },
          ],
          perfil: [
            {
              required: true,
              message: "Campo obrigatório",
              validator: () => this.perfil.value.length != "",
              trigger: "change",
            },
          ],
        },
      },
      usuario: {},
      unidade: {
        value: [],
        data: [],
        originalData: [],
      },
      perfil: {
        value: "",
        data: [],
        originalData: [],
      },
    };
  },
  computed: {
    ...mapGetters("auth", ["getUserEmpresa"]),
  },
  mounted() {
    this.initData();
    this.selfData();
  },
  watch: {
    "unidade.originalData": {
      immediate: true,
      handler(v) {
        this.unidade.data = this.criarHierarquia(v);
      },
    },
    "perfil.originalData": {
      immediate: true,
      handler(v) {
        this.perfil.data = this.selectPerfil(v);
      },
    },
  },
  methods: {
    async initData() {
      await get("/api/Unidades/filhosToken").then(
        (data) => (this.unidade.originalData = data)
      );
      await get("/api/Perfils").then(
        (data) => (this.perfil.originalData = data)
      );
    },
    async selfData() {
      let id = this.$route.params.iD_Usuario;
      let unidade = {};
      let perfil = {};
      await get(`/api/Usuarios/id/${id}`).then((data) => {
        this.form.fields.userID = data.userID;
        this.form.fields.nome = data.nome;
        this.form.fields.email = data.email;
        this.form.fields.cpf = data.cpf;
        this.form.fields.telefone = data.telefone;
        this.form.fields.senha_atual = data.senha;
        unidade = data.unidade;
        perfil = data.perfil;
        this.perfil.value = perfil.iD_Perfil;
        this.usuario = data;
      });
      await get(`/api/Unidades/ParentID?id=${unidade.iD_Unidade}`).then(
        (data) => {
          this.unidade.value = data
            .filter((arr) => arr.iD_Unidade != id)
            .map((child) => child.iD_Unidade);
        }
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
    selectPerfil(arr) {
      return arr.map((child) => ({
        value: child.iD_Perfil,
        label: child.nome,
      }));
    },
    async enviar({ validation }) {
      if (!validation) return;
      //validação do nodes de array em PARENT ID
      let parent_ID =
        this.unidade.value.length > 0
          ? this.unidade.value[this.unidade.value.length - 1]
          : 0;

      let { iD_Usuario } = this.$route.params;

      let schema = {
        iD_Usuario,
        userID: this.form.fields.userID,
        nome: this.form.fields.nome,
        email: this.form.fields.email,
        cpf: this.form.fields.cpf,
        senha: this.form.fields.senha_atual,
        telefone: this.form.fields.telefone,
        iD_Unidade: parent_ID,
        iD_Perfil: this.perfil.value,
        iD_Empresa: this.getUserEmpresa,
      };
      await put(`/api/Usuarios/${iD_Usuario}`, schema)
        .then(() => {
          this.$router.push({ name: "painel-usuario" });
          this.$Notice.success({
            title: "Usuário cadastrado com sucesso",
          });
        })
        .catch((error) => {
          this.$Notice.error({
            title: "Notificação de Erro ao cadastrar",
            desc: error,
          });
        });
    },
    gerarUUID() {
      let nomeCompleto = "";
      if (this.form.fields.nome.length == 0) {
        nomeCompleto = "A A A";
      } else {
        nomeCompleto = this.form.fields.nome;
      }
      let tokens = nomeCompleto.split(" ");
      let iniciais = "";
      tokens.forEach((token) => {
        if (token.length > 0) {
          iniciais += token[0].toUpperCase();
        }
      });
      let numerosAleatoriosNecessarios = 7 - iniciais.length;
      let numerosAleatorios = Math.floor(
        Math.random() * Math.pow(10, numerosAleatoriosNecessarios)
      ).toString();
      let chaveUnica = iniciais + numerosAleatorios;
      this.form.fields.userID = chaveUnica;
    },
  },
};
</script>
