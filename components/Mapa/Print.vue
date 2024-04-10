<template >
  <Modal
    v-model="openPrint"
    :title="datePrint.devid"
    @on-cancel="close"
    :width="920"
  >
    <Row :gutter="16" justify="center">
      <Col span="12">
        <WizardForm :form="form" @on-validate="submit" :showBack="false">

          <FormItem :label="getUser.empresa.flagInfo ? 'Ocorrência' : 'Caso'" prop="caso" inline>
            <div style="display:flex; width:100%; gap: 0.5rem;">
              <Select v-model="form.fields.idCaso" :disabled="temNovoCaso">
              <Option
                v-for="(caso, i) in casos"
                :value="caso.idCasos"
                :key="i"
                >{{ caso.ocorrencia }}</Option
              >
              </Select>
              <Button type="primary" @click="temNovoCaso = !temNovoCaso">
                {{ btnNewCaso }}
              </Button>
            </div>
          </FormItem>

          <div v-if="temNovoCaso">
            <FormItem label="Nova ocorrência" prop="ocorrencia">
              <Input v-model="form.fields.ocorrencia"></Input>
            </FormItem>

            <FormItem
              :label="getUser.empresa.flagInfo ? 'Data da Ocorrência' : 'Data do Caso'"
              prop="dataCaso"
            >
              <DatePicker
                type="date"
                format="dd/MM/yyyy"
                v-model="datePrint.data"
                style="width: 100%"
              />
            </FormItem>

            <FormItem label="Classificação" prop="idClassificacao">
              <Select v-model="form.fields.idClassificacao" inline>
                <Option
                  v-for="(classificacao, indexClassificacao) in classificacao"
                  :value="classificacao.idClassificacao"
                  :key="indexClassificacao"
                  >{{ classificacao.descricao }}</Option
                >
              </Select>
            </FormItem>

            <FormItem
              :label="getUser.empresa.flagInfo ? 'Ordem de serviço' : 'Vulgo'"
            >
              <Input v-model="form.fields.titulo"></Input>
            </FormItem>
          </div>

          <Divider />

          <FormItem label="Tags">
            <Input v-model="form.fields.tagsPrint"></Input>
          </FormItem>

          <FormItem
            :label="getUser.empresa.flagInfo ? 'Data da Ocorrência' : 'Data do Caso'"
            prop="dataCaso"
          >
            <DatePicker
              type="date"
              format="dd/MM/yyyy"
              v-model="datePrint.data"
              style="width: 100%"
            />
          </FormItem>

          <FormItem label="Classificação" prop="classificacaoPrint">
            <Select v-model="form.fields.classificacaoPrint" inline>
              <Option
                v-for="(classificacao, indexClassificacao) in classificacao"
                :value="classificacao.idClassificacao"
                :key="indexClassificacao"
                >{{ classificacao.descricao }}</Option
              >
            </Select>
          </FormItem>

          <FormItem label="Agente" prop="agente">
            <Select v-model="form.fields.agente" filterable>
              <Option
                v-for="(agente, i) in agente"
                :value="agente.iD_Usuario"
                :key="i"
                >{{ agente.nome }}</Option
              >
            </Select>
          </FormItem>

        </WizardForm>
      </Col>
      <Col span="12">
        <img :src="datePrint.printUrl" alt="Captura de imagem" />
      </Col>
    </Row>
    <div slot="footer">
      <Button @click="close">Cancelar</Button>
    </div>
  </Modal>
</template>

<script>
import { mapGetters } from "vuex";
import { get, post } from "@/services/api";

export default {
  props: {
    openPrint: Boolean,
    datePrint: Object,
  },
  data() {
    return {
      casos: [],
      agente: [],
      classificacao: [],
      ocorrenciaFiltrada: '',

      form: {
        title: "",
        name: "form-wizard-" + Math.floor(Math.random() * 100),
        back: { name: "painel-monitoramento" },
        fields: {
          idCaso: null,
          dataCaso: this.$moment().format('YYYY-MM-DD[T]HH:mm:ss'),
          ocorrencia: "",
          titulo: "",
          idClassificacao: null,

          classificacaoPrint: null,
          agente: null,
          tagsPrint: ""
        },
        rules: {
          ocorrencia: [
            {
              required: true,
              message: "Campo obrigatório",
            },
          ],
          agente: [
            {
              required: true,
              message: "Campo obrigatório",
            },
          ],
          classificacaoPrint: [
            {
              required: true,
              message: "Campo obrigatório",
            },
          ],
          idClassificacao: [
            {
              required: true,
              message: "Campo obrigatório",
            },
          ],
        }
      },
      temNovoCaso: false,
    };
  },
  mounted() {
    this.init();
  },
  watch: {
    "form.fields.idCaso"(newVal) {
      const casoFiltrado = this.casos.find(caso => caso.idCasos === newVal);
      this.ocorrenciaFiltrada = casoFiltrado ? casoFiltrado.ocorrencia : '';
    },
  },
  computed: {
    ...mapGetters("auth", ["getUser"]),
    btnNewCaso() {
      if (this.temNovoCaso) {
        return 'Cancelar';
      } else if (this.getUser.empresa.flagInfo) {
        return 'Nova Ocorrência';
      } else {
        return 'Novo Caso';
      }
    }
  },
  methods: {
    async init() {
      await get("/api/Casos")
        .then((data) => {
          this.casos = data.filter((el) => el.del != true);
        })
        .catch(({ error, code }) => {
          console.log(error, code);
        });
      await get("/api/ClassificacaoCasos/ativos").then(
        (data) => (this.classificacao = data)
      );
      await get("/api/Usuarios/TokenFilhos/Ativos", { ativos: true }).then(
        (data) => (this.agente = data)
      );
    },
    async submit({validation }) {
      if (!validation) return;
      
      if(this.temNovoCaso) {       
        await this.submitCreateCaso()
      }
      else{
        await this.submitEvidenciaUpload()
      }
    },
    async submitCreateCaso() {
      let schema = {
        titulo: this.form.fields.titulo,
        dataCaso: this.form.fields.dataCaso
          ? this.$moment(this.form.fields.dataCaso).format(
              "YYYY-MM-DD[T]HH:mm:ss"
            )
          : "",
        idClassificacao: this.form.fields.idClassificacao,
        ocorrencia: this.form.fields.ocorrencia,
      };

      await post("/api/Casos", schema)      
        .then((data) => {
          this.form.fields.idCaso = data.idCasos
          return data
        })
        .then(() => this.submitEvidenciaUpload())
        .catch((error) => {
          this.$Notice.error({
            title: "Notificação de Erro ao cadastrar",
            desc: error,
          });
        });
    },
    async submitEvidenciaUpload() {

      let schema = {
        iD_Agente: this.form.fields.agente,
        ocorrencia: this.ocorrenciaFiltrada,
        data: this.form.fields.dataCaso,
        classificacao: this.form.fields.classificacaoPrint,
        tags: this.form.fields.tagsPrint,
        iD_Caso: this.form.fields.idCaso
      };

      schema.data_Gravacao = this.$moment().format("YYYY-MM-DD[T]HH:mm:ss");

      let evidencias = JSON.stringify(schema);

      let blob = await fetch(this.datePrint.printUrl).then(r => r.blob());
      let formData = new FormData();
      formData.append("file", blob, `captura-${this.$moment().format('YYYYMMDDHHmm')}.png`);
      
      await post(`/api/Cloud/UploadArquivoCaso?evidencias=${evidencias}`, formData)
        .then((data) => {
          this.$Notice.success({
            title: "Arquivo enviado com sucesso",
          });
        })
        .catch((error) => {
          this.$Notice.error({
            title: "Arquivo existente",
            desc: error,
          });
        })
        .finally(() => this.close())
    },
    close(){ 
      this.form.fields.idCaso = null,
      this.form.fields.dataCaso = this.$moment().format('YYYY-MM-DD[T]HH:mm:ss'),
      this.form.fields.ocorrencia ="",
      this.form.fields.titulo = "",
      this.form.fields.tagsPrint = "",
      this.form.fields.idClassificacao = null,
      this.form.fields.classificacaoPrint = null,
      this.form.fields.agente = null,
      this.form.fields.tagsPrint = ""

      this.temNovoCaso = false
      URL.revokeObjectURL(this.datePrint.printUrl);
        
      this.$emit("closeModal");
    },
  },
};
</script>

<style scoped>
img {
  width: 100%;
}
.agente {
  padding-top: 15px;
  font-weight: 700;
  font-size: 18px;
  text-transform: uppercase;
}
</style>