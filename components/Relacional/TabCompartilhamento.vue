<template>
  <Init>
    <h4 v-if="title">{{ title }}</h4>
    <WizardForm :form="form" @on-validate="enviar" btSend="Compartilhar">
      <FormItem label="Agentes Disponiveis" prop="agentes">
        <div style="clear: both">
          <Table
            stripe
            disabled-hover
            row-key="value"
            :columns="columns"
            :data="unidades.data"
            border
          >
            <template #agente="{ row }">
              <CheckboxGroup v-model="form.fields.agentes">
                <Checkbox
                  v-for="(agente, i) in row.agentes"
                  :key="i"
                  :label="agente.value"
                  border
                >
                  {{ agente.label }}
                </Checkbox>
              </CheckboxGroup>
            </template>
          </Table>
        </div>
      </FormItem>
    </WizardForm>
  </Init>
</template>

<script>
import { get, post } from "@/services/api";
export default {
  props: ["evidencia", "title"],
  data() {
    return {
      form: {
        name: "form-wizard-" + Math.floor(Math.random() * 100),
        fields: {
          agentes: [],
        },
        rules: {
          agentes: [
            {
              required: true,
              type: "array",
              min: 1,
              message: "Um item é Obrigatorio",
              trigger: "change",
            },
          ],
        },
      },
      columns: [
        {
          title: "Unidades",
          key: "label",
          width: 200,
          ellipsis: true,
          tree: true,
        },
        {
          title: "Agentes",
          slot: "agente",
        },
      ],
      agentes: {
        data: [],
        original: [],
      },
      unidades: {
        data: [],
        original: [],
      },
    };
  },
  watch: {
    "agentes.original"(to) {
      this.agentes.data = to.map((el) => ({
        value: el.iD_Usuario,
        label: el.nome,
        unidade: el.iD_Unidade,
      }));
    },
    "unidades.original": {
      immediate: true,
      handler(v) {
        this.unidades.data = this.criarHierarquia(v);
      },
    },
  },
  mounted() {
    this.initCompartilhar();
  },
  methods: {
    async initCompartilhar() {
      await get("/api/Usuarios/Ativos", { ativos: true }).then(
        (data) => (this.agentes.original = data)
      );
      await get("/api/Unidades").then(
        (data) => (this.unidades.original = data)
      );
    },
    async enviar({ form, validation }) {
      if (!validation) return;
      let schema = {
        idEvidencia: this.evidencia.iD_Evidencia,
        idUsuario: 0,
      };
      let { agentes } = this.form.fields;
      let error = false;
      agentes.forEach(async (el) => {
        schema.idUsuario = el;
        await post("/api/CompartilhamentoInterno", schema).catch(
          (_) => (error = true)
        );
      });
      if(!error){
        this.$Message.success("Compartilhamento Realizado");
      }else{
        this.$Message.error("Erro ao Compartilhamento")
      }
      form.resetFields();
    },
    criarHierarquia(arr, parent = 0) {
      return arr
        .filter((item) => item.parent_ID === parent)
        .map((child) => ({
          value: child.iD_Unidade,
          label: child.nome,
          children: this.criarHierarquia(arr, child.iD_Unidade),
          agentes: this.agentes.data.filter(
            (agente) => agente.unidade == child.iD_Unidade
          ),
        }));
    },
  },
};
</script>