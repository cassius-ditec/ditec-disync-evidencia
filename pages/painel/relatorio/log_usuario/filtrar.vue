<template>
  <WizardForm :form="form" @on-validate="enviar" btSend="Filtrar">
    <div class="grid-relacional">
      <div class="grid-relacional_colunas">
        <section style="--row: 1">
          <FormItem label="Agentes" prop="agentes">
            <Select filterable clearable v-model="form.fields.agentes">
              <Option
                v-for="(agente, i) in agentes.data"
                :key="i"
                :value="agente.value"
                :label="agente.label"
              >
                <span>{{ agente.label }}</span>
                <span
                  style="float: right; color: tomato; opacity: 0.5"
                  v-if="agente.inativo"
                  >inativo</span
                >
              </Option>
            </Select>
          </FormItem>
        </section>
        <section style="--row: 1">
          <FormItem label="Unidade">
            <Select filterable clearable v-model="form.fields.unidades">
              <Option
                v-for="(unidade, i) in unidades.data"
                :key="i"
                :value="unidade.value"
                :label="unidade.label"
              >
                <span>{{ unidade.label }}</span>
              </Option>
            </Select>
          </FormItem>
        </section>
        <section>
          <FormItem label="Módulo">
            <Select filterable clearable v-model="form.fields.modulo">
              <Option
                v-for="(modulo, i) in modulo.data"
                :key="i"
                :value="modulo.value"
                :label="modulo.label"
              >
                <span>{{ modulo.label }}</span>
              </Option>
            </Select>
          </FormItem>
          <FormItem label="Ação">
            <Select filterable clearable v-model="form.fields.acao">
              <Option
                v-for="(acao, i) in acao.data"
                :key="i"
                :value="acao.value"
                :label="acao.label"
              >
                <span>{{ acao.label }}</span>
              </Option>
            </Select>
          </FormItem>
        </section>
      </div>
      <div class="grid-relacional_colunas">
        <Card :bordered="true">
          <FormItem label="Data de" prop="data">
            <DatePicker
              transfer
              :model-value="form.fields.data"
              @on-change="dataEvent"
              :options="optionsDate"
              format="dd/MM/yyyy"
              type="daterange"
              placement="bottom-end"
              placeholder="Selecione as datas"
              style="width: 100%"
            />
          </FormItem>
        </Card>
      </div>
    </div>
  </WizardForm>
</template>
<script>
import { get } from "@/services/api";
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      search: false,
      loading: true,
      pagination: {
        current: 1,
        size: 10,
      },
      columns: [
        {
          title: "Método",
          key: "metodo",
          sortable: true,
        },
        {
          title: "Usuário",
          key: "usuario.nome",
          sortable: true,
        },
        {
          title: "Unidade",
          key: "unidade.nome",
          sortable: true,
        },
        {
          title: "Data",
          key: "data",
          sortable: true,
        },
        {
          title: "IP Remoto",
          key: "iP_Remoto",
          sortable: true,
        },
        {
          title: "Controller",
          key: "controller",
          sortable: true,
        },
        {
          title: "Ação",
          key: "acao",
          sortable: true,
        },
        {
          title: "Módulo",
          key: "modulo",
          sortable: true,
        },
      ],
      optionsDate: {
        disabledDate(date) {
          let today = new Date();
          today.setHours(0, 0, 0, 0);
          return date && date.valueOf() > today.valueOf();
        },
      },
      form: {
        title: "Log de Usuários",
        name: "form-wizard-" + Math.floor(Math.random() * 100),
        back: { name: "painel" },
        fields: {
          agentes: 0,
          data: [],
          unidades: 0,
          modulo: "",
          acao: "",
        },
        rules: {
          data: [
            {
              required: true,
              type: "array",
              min: 2,
              message: "A data é obrigatoria",
              trigger: "change",
            },
          ],
        },
      },
      agentes: {
        data: [],
        originalData: [],
      },
      unidades: {
        originalData: [],
        data: [],
      },
      acao: {
        originalData: [],
        data: [],
      },
      modulo: {
        originalData: [],
        data: [],
      },
      resultado: [],
    };
  },
  computed: {
    ...mapGetters("log_usuario", ["getLogUsuario"]),
  },
  mounted() {
    this.initData();
  },
  watch: {
    "agentes.originalData"(to) {
      this.agentes.data = [
        {
          value: 0,
          label: "Todos os agentes",
          inativo: false,
        },
        ...to.map((el) => ({
          value: el.iD_Usuario,
          label: el.nome,
          inativo: el.inativo,
        })),
      ];
    },
    "unidades.originalData"(to) {
      this.unidades.data = [
        {
          value: 0,
          label: "Todos as unidades",
        },
        ...to.map((el) => ({
          value: el.iD_Unidade,
          label: el.nome,
        })),
      ];
    },
    "acao.originalData"(to) {
      this.acao.data = [
        {
          value: 0,
          label: "Todas as ações",
        },
        ...to.map((el) => ({
          value: el.descricao,
          label: el.descricao,
        })),
      ];
    },
    "modulo.originalData"(to) {
      this.modulo.data = [
        {
          value: 0,
          label: "Todos os módulos",
        },
        ...to.map((el) => ({
          value: el.alias,
          label: el.name,
        })),
      ];
    },
  },
  methods: {
    ...mapActions("log_usuario", ["setLogUsuarios"]),
    async initData() {
      await get("/api/Usuarios/TokenFilhos/Ativos", { ativos: true }).then(
        (data) => (this.agentes.originalData = data)
      );
      await get("/api/Unidades/filhosToken").then(
        (data) => (this.unidades.originalData = data)
      );
      await get("/api/Auxiliar/ControllersInQuery").then(
        (data) => (this.modulo.originalData = data)
      );
      await get("/api/Auxiliar/GetAcaoUsuario").then(
        (data) => (this.acao.originalData = data)
      );
    },
    dataEvent(Evt) {
      this.form.fields.data = Evt;
    },
    async enviar({ validation }) {
      if (!validation) return;
      let { agentes, data, unidades, modulo, acao } = this.form.fields;

      let GetLogUsuarioAll = {
        DataInicial: this.$moment(data[0], "DD/MM/YYYY").format("YYYY-MM-DD[T00:00:00]"),
        DataFinal: this.$moment(data[1], "DD/MM/YYYY").format("YYYY-MM-DD[T23:59:59]"),
        IdUsuario: agentes ?? 0,
        IdUnidade: unidades ?? 0,
        modulo: modulo,
        acao: acao,
      };

      await get("/api/LogUsuarios/GetLogUsuarioAll", GetLogUsuarioAll)
        .then((data) => this.createLogUsuarios(data))
        .finally(() => (this.loading = false));
    },
    createLogUsuarios(data) {
      this.startLoading();
      //this.resultado = data;
      this.setLogUsuarios(data).finally(() => this.criarResultado());
    },
    startLoading() {
      this.$Spin.show();
    },
    criarResultado() {
      this.$Spin.hide();
      this.$router.push({ name: "painel-relatorio-log_usuario-resultado" });
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString(); // Você pode ajustar o formato conforme sua preferência
    },
  },
};
</script>


<style scoped>
.grid-relacional {
  display: grid;
  grid-template: ". ." min-content / 1fr 480px;
  gap: 20px;
}

.grid-relacional_colunas {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.grid-relacional section {
  --row: 2;
  display: grid;
  grid-template-columns: repeat(var(--row), 1fr);
  gap: 20px;
}
</style>