<template>
  <WizardForm :form="form" @on-validate="enviar">
    <FormItem label="Nome" prop="nome">
      <Input v-model="form.fields.nome"></Input>
    </FormItem>
    <div class="mp-2">
      <RadioGroup v-model="usuario">
        <Radio label="isAdmin" border>Administrador</Radio>
        <Radio label="isSupervisor" border>Supervisor</Radio>
        <Radio label="isUser" border>Padrão</Radio>
      </RadioGroup>
    </div>
    <div class="mp-2">
      <Collapse>
        <Panel v-for="(perfil, index) in response.perfil_Data" :key="index">
          {{ perfil.modulo }}
          <template #content>
            <CheckboxGroup v-model="checkboxValues">
              <div
                v-for="(value, label) in perfil"
                :key="`${perfil.iD_Perfil_Data}|${label}`"
              >
                <Checkbox
                  :label="`${perfil.iD_Perfil_Data}|${label}`"
                  border
                  v-if="Object.keys(moduloOpcoes).includes(label)"
                  style="width: 100%"
                >
                  {{ moduloOpcoes[label] }} {{ perfil.modulo }}
                </Checkbox>
              </div>
            </CheckboxGroup>
          </template>
        </Panel>
      </Collapse>
    </div>
  </WizardForm>
</template>
<script>
import { get, put } from "@/services/api";
export default {
  data() {
    return {
      self: {},
      form: {
        title: "Editar perfil",
        name: "form-wizard-" + Math.floor(Math.random() * 100),
        back: { name: "painel-perfil" },
        fields: {
          nome: "",
        },
        rules: {
          nome: [
            {
              required: true,
              message: "Campo obrigatório",
              trigger: "blur",
            },
          ],
        },
      },
      response: {},
      moduloOpcoes: {
        list: "Listar",
        put: "Editar",
        post: "Cadastrar",
        delete: "Excluir",
        upload: "Upload",
        download: "Download",
        print: "Imprimir",
        access: "Acessar",
        detail: "Detalhes",
        export: "Exportar",
      },
      checkboxValues: [], // Array para controlar os checkboxes
      usuario: "", // Inicialmente nenhum dos radios é selecionado
    };
  },
  mounted() {
    this.selfData();
  },
  computed: {
    modulosPermitidos() {
      return this.response.perfil_Data.filter((o) =>
        Object.keys(this.moduloOpcoes).includes(o)
      );
    },
  },
  methods: {
    async selfData() {
      let id = this.$route.params.iD_Perfil;
      await get(`/api/Perfils/${id}`).then((data) => {
        this.self = data
        this.form.fields.nome = data.nome;
        if (data.isAdmin) {
          this.usuario = "isAdmin";
        }
        if (data.isSupervisor) {
          this.usuario = "isSupervisor";
        }
        if (data.isUser) {
          this.usuario = "isUser";
        }
        this.response = data;
        this.updateCheckboxValues();
      });
    },
    updateCheckboxValues() {
      this.checkboxValues = [];
      this.response.perfil_Data.forEach((perfil) => {
        Object.keys(this.moduloOpcoes).forEach((label) => {
          if (perfil[label] === true) {
            this.checkboxValues.push(`${perfil.iD_Perfil_Data}|${label}`);
          }
        });
      });
    },
    async enviar({ validation }) {
      if (!validation) return;
      let { iD_Perfil, iD_Empresa } = this.self;
      let schemaPerfil = {
        iD_Perfil,
        iD_Empresa,
        nome: this.form.fields.nome,
        isAdmin: this.usuario == "isAdmin",
        isSupervisor: this.usuario == "isSupervisor",
        isUser: this.usuario == "isUser",
      };


      this.response.perfil_Data.forEach(el => {
        el.list = false;
        el.put = false;
        el.post = false;
        el.delete = false;
        el.upload = false;
        el.download = false;
        el.print = false;
        el.access = false;
        el.detail = false;
        el.export = false;
      });


      this.checkboxValues.forEach((itemAtivo) => {
        let [iD_Perfil_Data, label] = itemAtivo.split("|");
        let index = this.response.perfil_Data.findIndex(
          (pd) => pd.iD_Perfil_Data == iD_Perfil_Data
        );
        this.response.perfil_Data[index][label] = true;
      });

      this.response.perfil_Data.forEach(async (perfilData) => {
        let id = perfilData.iD_Perfil_Data;
        await put(`/api/Perfil_data/${id}`, perfilData);
      });

      await put(`/api/Perfils/${iD_Perfil}`, schemaPerfil)
        .then(() => {
          this.$router.push({ name: "painel-perfil" });
          this.$Notice.success({
            title: "Perfil editado com sucesso",
          });
        })
        .catch((error) => {
          this.$Notice.error({
            title: "Erro ao editar perfil",
            desc: error,
          });
        });
    },
  },
};
</script>
<style scoped>
.mp-2 {
  margin: 10px 0px;
}
</style>
