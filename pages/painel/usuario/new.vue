<template>
  <WizardForm :form="form" @on-validate="enviar">
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
            </template>
          </Input>
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
    <Row :gutter="24">
      <Col span="12">
        <FormItem label="Senha" prop="senha">
          <Input type="password" password v-model="form.fields.senha"></Input>
        </FormItem>
      </Col>
      <Col span="12">
        <FormItem label="Repete Senha" prop="check_senha">
          <Input
            type="password"
            password
            v-model="form.fields.check_senha"
          ></Input>
        </FormItem>
      </Col>
    </Row>

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
import { get, post } from "@/services/api";
export default {
  data() {
    const validatePassCheck = (rule, value, callback) => {
      if (value != this.form.fields.senha) {
        callback(new Error(rule));
      }
      callback();
    };
    return {
      form: {
        title: "Criar novo usuário",
        name: "form-wizard-" + Math.floor(Math.random() * 100),
        back: { name: "painel-usuario" },
        fields: {
          userID: "",
          nome: "",
          email: "",
          cpf: "",
          senha: "",
          check_senha: "",
          telefone: "",
        },
        rules: {
          userID: [
            {
              required: true,
              message: "Campo obrigatório",
              trigger: "change",
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
          senha: [
            {
              required: true,
              message: "Campo obrigatório",
              trigger: "blur",
            },
          ],
          check_senha: [
            {
              required: true,
              message: "Campo obrigatório",
              trigger: "blur",
            },
            {
              validator: validatePassCheck,
              message: "Senhas devem ser iguais",
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
  mounted() {
    this.initData();
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

      let schema = {
        userID: this.form.fields.userID,
        nome: this.form.fields.nome,
        email: this.form.fields.email,
        cpf: this.form.fields.cpf,
        senha: this.form.fields.senha,
        telefone: this.form.fields.telefone,
        iD_Unidade: parent_ID,
        iD_Perfil: this.perfil.value,
      };
      await post("/api/Usuarios", schema)
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
