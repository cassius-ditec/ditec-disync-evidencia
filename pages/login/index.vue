<template>
  <Init class="form">
    <h1>Painel de Controle</h1>
    <Form :model="form" :rules="formRules" :ref="nameForm">
      <FormItem label="CPF" prop="cpf" v-if="sendCPF">
        <Input
          type="text"
          v-model="form.cpf"
          placeholder="Digite apenas números"
          size="large"
        >
          <template #prepend>
            <Icon type="md-contact"></Icon>
          </template>
          <template #append>
            <Button @click.prevent="sendCPF = !sendCPF">
              <span>Mudar para E-mail</span>
            </Button>
          </template>
        </Input>
      </FormItem>
      <FormItem label="E-mail" prop="email" v-else>
        <Input
          type="text"
          v-model="form.email"
          placeholder="Digite um email válido"
          size="large"
        >
          <template #prepend>
            <Icon type="md-mail"></Icon>
          </template>

          <template #append>
            <Button @click.prevent="sendCPF = !sendCPF">
              <span>Mudar para CPF</span>
            </Button>
          </template>
        </Input>
      </FormItem>
      <FormItem label="Senha" prop="senha">
        <Input
          type="password"
          v-model="form.senha"
          placeholder="Digite sua senha"
          size="large"
        >
          <template #prepend>
            <Icon type="md-key"></Icon>
          </template>
        </Input>
      </FormItem>
      <FormItem>
        <Button type="primary" size="large" long @click="handleSubmit"
          >Acessar</Button
        >
      </FormItem>
    </Form>
    <h5 v-html="release.version"></h5>
    <section class="nota" v-html="release.update"></section>
  </Init>
</template>

<script>
import { mapActions } from "vuex";
import { release, auth } from "@/services/api";

export default {
  data() {
    return {
      release: {
        version: "",
        update: "",
      },
      tempo_inicio_sessao: this.$moment().unix(),
      nameForm: "formulario",
      sendCPF: true,
      form: {
        cpf: "",
        email: "",
        senha: "",
      },
      formRules: {
        cpf: [
          {
            required: true,
            message: "O campo de CPF é obrigatório",
            trigger: "blur",
          },
        ],
        email: [
          {
            required: true,
            message: "O campo de E-mail é obrigatório",
            trigger: "blur",
          },
          {
            type: "email",
            message: "Formato de Email incorreto",
            trigger: "blur",
          },
        ],
        senha: [
          {
            required: true,
            message: "O campo de Senha é obrigatório",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    const formElement = this.$refs[this.nameForm].$el;
    formElement.addEventListener("keydown", this.handleEnterKey);
    this.zerar();
    this.checkRelease();
  },
  methods: {
    ...mapActions("auth", [
      "start",
      "zerar",
      "setStatus",
      "setToken",
      "setUser",
      "setSession",
    ]),
    async checkRelease() {
      await release("/release/version.txt")
        .then((data) => (this.release.version = data))
        .catch(() => (this.release.version = ""));
      await release("/release/update.txt")
        .then((data) => (this.release.update = data))
        .catch(() => (this.release.update = ""));
    },
    handleEnterKey(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        this.handleSubmit();
      }
    },
    async handleSubmit() {
      let name = this.nameForm;
      let valid = await this.$refs[name].validate((valid) => valid);
      if (!valid) return;
      //CONSTRUÇAO DO SCHEMA
      let schema = {};
      let endpoint = "";
      if (this.sendCPF) {
        schema.cpf = this.form.cpf;
        schema.pwd = this.form.senha;
        endpoint = "/api/Usuarios/LoginCPF";
      } else {
        schema.email = this.form.email;
        schema.pwd = this.form.senha;
        endpoint = "/api/Usuarios/LoginEmail";
      }
      await auth(endpoint, schema)
        .then((res) => {
          this.token = res.token;
          this.setStatus(true);
          this.setUser(res);
        })
        .catch(() => {
          this.setStatus(false);
          this.token = "";
          this.$Notice.error({
            title: "Usuário não encontrado",
          });
        })
        .finally(() => {
          this.setToken(this.token);
          this.setSession(this.tempo_inicio_sessao);
          this.$router.push({ name: "painel" });
        });
    },
  },
};
</script>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 40px;
  align-content: center;
  height: 100%;
  justify-content: center;
}

.form > h1 {
  color: #f18918;
}

h5 {
  text-align: center;
}

</style>
<style>
.nota h5 {
  background: #f18918;
  padding: 10px;
  color: white;
}
</style>