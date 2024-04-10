<template>
  <Init>
    <WizardForm :form="form" @on-validate="enviar">
      <Row :gutter="24">
        <Col span="12">
          <FormItem label="Senha" prop="senha">
            <Input type="password" password v-model="form.fields.senha"></Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="Repete Senha" prop="check_senha">
            <Input type="password" password v-model="form.fields.check_senha"></Input>
          </FormItem>
        </Col>
      </Row>
    </WizardForm>
  </Init>
</template>

<script>
import { put } from "@/services/api";
import { mapGetters } from "vuex";
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
        title: "Alterar Senha",
        name: "form-wizard-" + Math.floor(Math.random() * 100),
        back: { name: "painel-usuario" },
        fields: {
          senha: "",
          check_senha: "",
        },
        rules: {
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
        },
      },
      usuario: {},
    };
  },
  computed: {
    ...mapGetters("auth", ["getUserEmpresa"]),
  },
  mounted() {
    let { params } = this.$route;
    if (!params.iD_Usuario) {
      this.$router.push({ name: "painel" });
    }
    this.form.back = { name: params.back, params };
    this.usuario = params;
  },
  methods: {
    async enviar({ validation }) {
      if (!validation) return;
      let { iD_Usuario } = this.$route.params;
      let schema = {
        iD_Usuario,
        userID: this.usuario.userID,
        nome: this.usuario.nome,
        email: this.usuario.email,
        cpf: this.usuario.cpf,
        senha: this.form.fields.senha,
        telefone: this.usuario.telefone,
        iD_Unidade: this.usuario.iD_Unidade,
        iD_Perfil: this.usuario.iD_Perfil,
        iD_Empresa: this.getUserEmpresa,
      };
      await put(`/api/Usuarios/${iD_Usuario}`, schema)
        .then(() => {
          this.$router.push(this.form.back);
          this.$Notice.success({
            title: "Senha alterada com sucesso",
          });
        })
        .catch((error) => {
          this.$Notice.error({
            title: "Notificação de Erro ao alterar a senha",
            desc: error,
          });
        });
    },
  },
};
</script>

<style>
</style>