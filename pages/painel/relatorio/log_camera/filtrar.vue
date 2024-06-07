<template>
  <WizardForm :form="form" @on-validate="enviar" btSend="Filtrar">
    <div class="grid-relacional">
      <div class="grid-relacional_colunas">
        <section style="--row: 1">
          <FormItem label="Cameras" prop="cameras">
            <Select
              transfer
              filterable
              clearable
              v-model="form.fields.bodycams"
            >
              <Option
                v-for="(camera, i) in bodycams.data"
                :key="i"
                :value="camera.value"
                :label="camera.label"
              >
                <span>{{ camera.label }}</span>
                <span
                  style="float: right; color: #ccc; padding-left: 10px"
                  v-if="camera.agente"
                  >{{ camera.agente }}</span
                >
              </Option>
            </Select>
          </FormItem>
        </section>
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
export default {
  data() {
    return {
      optionsDate: {
        disabledDate(date) {
          let today = new Date();
          today.setHours(0, 0, 0, 0);
          return date && date.valueOf() > today.valueOf();
        },
      },
      form: {
        title: "Log de Bodycams",
        name: "form-wizard-" + Math.floor(Math.random() * 100),
        back: { name: "painel" },
        fields: {
          bodycams: 0,
          agentes: 0,
          data: [],
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
      bodycams: {
        data: [],
        originalData: [],
      },
      resultado: [],
      query: {
        camera: 0,
        agente: 0,
        data: [],
      },
    };
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
    "bodycams.originalData"(to) {
      this.bodycams.data = [
        {
          value: 0,
          label: "Todos as bodycams",
          agente: "",
        },
        ...to.map((el) => ({
          value: el.iD_Bodycam,
          label: el.deviceID,
          agente: el.agente ? el.agente.nome : "",
        })),
      ];
    },
  },
  methods: {
    async initData() {
      await get("/api/Bodycam?ativos=true").then(
        (data) => (this.bodycams.originalData = data)
      );
      await get("/api/Usuarios/TokenFilhos/Ativos", { ativos: true }).then(
        (data) => (this.agentes.originalData = data)
      );
    },
    dataEvent(Evt) {
      this.form.fields.data = Evt;
    },
    async enviar({ validation }) {
      this.query = {
        ...this.query,
        camera: this.form.fields.bodycams,
        agente: this.form.fields.agentes,
        data: this.form.fields.data.map((data, index) => {
          if(index == 0){
            return this.$moment(data, "DD/MM/YYYY").format("YYYY-MM-DD[T00:00:00]")
          }else{
            return this.$moment(data, "DD/MM/YYYY").format("YYYY-MM-DD[T23:59:59]")
          }          
        }),
      };
      if (!validation) return;
    
      this.$router.push({
        name: 'painel-relatorio-log_camera-resultado',
        query: this.query,
      });

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