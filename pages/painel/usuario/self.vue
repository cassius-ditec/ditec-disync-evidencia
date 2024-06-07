<template>
  <WizardForm :form="form" @on-validate="enviar">
    <Init style="padding-bottom: 20px; display: flex; justify-content: end">
      <Button
        type="warning"
        icon="md-key"
        :to="{
          name: 'painel-usuario-password',
          params: { ...this.usuario, back: 'painel-usuario-self' },
        }"
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
          <Input disabled v-model="form.fields.userID"></Input>
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
  </WizardForm>
</template>
<script>
import { get, put } from "@/services/api";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      form: {
        title: "Editar meu usuário",
        name: "form-wizard-" + Math.floor(Math.random() * 100),
        back: { name: "painel" },
        fields: {
          userID: "",
          nome: "",
          email: "",
          cpf: "",
          telefone: "",
          senha_atual: "",
        },
        rules: {
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
        },
      },
      usuario: {},    
    };
  },
  mounted() {
    this.initData();
    this.selfData();
  },
  computed: {
    ...mapGetters("auth", ["getUserEmpresa"]),
  },
  methods: {
    async initData() {
      this.usuario= this.$store.getters["auth/getUser"];
    },
    async selfData() {
      let { iD_Usuario } = this.usuario;
      await get(`/api/Usuarios/id/${iD_Usuario}`).then((data) => {
        this.form.fields.userID = data.userID;
        this.form.fields.nome = data.nome;
        this.form.fields.email = data.email;
        this.form.fields.cpf = data.cpf;
        this.form.fields.telefone = data.telefone;
        this.form.fields.senha_atual = data.senha;
        this.usuario = data;
      });
    },
    async enviar({ validation }) {
      if (!validation) return;
      //validação do nodes de array em PARENT ID

      let { iD_Usuario } = this.usuario;

      let schema = {
        iD_Usuario,
        userID: this.usuario.userID,
        nome: this.form.fields.nome,
        email: this.form.fields.email,
        cpf: this.form.fields.cpf,
        senha: this.form.fields.senha_atual,
        telefone: this.form.fields.telefone,
        iD_Unidade: this.usuario.iD_Unidade,
        iD_Perfil: this.usuario.iD_Perfil,
        iD_Empresa: this.getUserEmpresa,
        
      };
      await put(`/api/Usuarios/${iD_Usuario}`, schema)
        .then(() => {
          this.$router.push({ name: "painel" });
          this.$Notice.success({
            title: "Usuário atualizado com sucesso",
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
