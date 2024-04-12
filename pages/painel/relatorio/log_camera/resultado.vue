<template>
  <Init>
    <DataGrid titulo="Log de Bodycams">
      <template #list-right>
        <Button icon="md-search" @click.prevent="search = !search">Pesquisar</Button>
        <Button icon="md-mail" @click.prevent="openModalEmail = true">Enviar por e-mail</Button>
        <Dropdown @on-click="itemDrop">
          <Button icon="md-download">Download</Button>
          <template #list>
            <DropdownMenu>
              <DropdownItem name="pdf">PDF</DropdownItem>
              <DropdownItem divided name="excel">Excel/CSV</DropdownItem>
            </DropdownMenu>
          </template>
        </Dropdown>
      </template>
      <template #search v-if="search">
        <Input search placeholder="Pesquisar" clearable v-model="query" />
      </template>
      <template #table>
        <Table stripe :columns="columns" :data="response.data" :loading="loading">
        </Table>
      </template>
    </DataGrid>
    <Modal v-model="openModalEmail" title="Enviar email para:">
      <p>Digite o email que ira receber o email:</p>
      <Input v-model="toEmail" />
      <p style="color: tomato" v-show="!emailValido">O email é obrigatório</p>
      <template #footer>
        <Button @click="openModalEmail = false">Cancelar</Button>
        <Button type="primary" @click="enviarEmail">Enviar</Button>
      </template>
    </Modal>
  </Init>
</template>

<script>
import { get, post } from "@/services/api";
import { createPDF } from "@/services/exportData/pdf";
import { createExcel } from "@/services/exportData/excel";
import { createEmail } from "@/services/exportData/email";
export default {
  data() {
    return {
      search: false,

      openModalEmail: false,
      toEmail: "",
      emailValido: true,

      query: "",
      columns: [
        {
          title: "Data/Hora",
          key: "dataHoraLog",
          sortable: true,
          sortType: "desc",
          render: (h, params) => {
            let { dataHoraLog } = params.row;
            let dataFormatada = this.$moment(
              dataHoraLog,
              "YYYY-MM-DD[T]HH:mm:ss"
            ).format("DD/MM/YYYY HH:mm:ss");
            return h("span", dataFormatada);
          },
          width: 190,
        },
        {
          title: "Bodycam",
          key: "idDadosCamera",
          sortable: true,
          render: (h, params) => {
            let { bodycam } = params.row;
            let bodycamNome = bodycam?.deviceID ?? "-";
            return h("span", bodycamNome);
          },
          width: 120,
        },
        {
          title: "Agente",
          key: "idAgente",
          sortable: true,
          render: (h, params) => {
            let { agente } = params.row;
            let agenteNome = agente?.nome ?? agente?.userID ?? "-";
            return h("span", agenteNome);
          },
          width: 260,
        },
        {
          title: "Mensagem",
          key: "action",
        },
      ],
      loading: true,
      response: {
        data: [],
        original: [],
      },
    };
  },
  created() {
    const { query } = this.$route;
    if (Object.keys(query).length === 0) {
      this.$router.push({ name: "painel-relatorio-log_camera-filtrar" });
    }
  },
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      let { camera, agente, data } = this.$route.query;
      let field = {
        DataInicial: data[0],
        DataFinal: data[1],
      };
      if (agente != 0) {
        field.IdAgente = agente;
      }
      if (camera != 0) {
        field.IdDadosCamera = camera;
      }
      await get("/api/LogCameras/GetLogCameras", field)
        .then((data) => {
          this.response.original = this.response.data = data;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    searchInJSON(obj, keyword) {
      for (let key in obj) {
        if (typeof obj[key] === "object") {
          if (this.searchInJSON(obj[key], keyword)) {
            return true;
          }
        } else if (
          typeof obj[key] === "string" &&
          obj[key].toLowerCase().includes(keyword.toLowerCase())
        ) {
          return true;
        }
      }
      return false;
    },
    itemDrop(click) {
      switch (click) {
        case "pdf":
          createPDF("Logs Bodycam", this.response.data, [
            [
              "Data/Hora",
              "dataHoraLog",
              (field) =>
                this.$moment(field, "YYYY-MM-DD[T]HH:mm:ss").format(
                  "DD/MM/YYYY HH:mm:ss"
                ),
            ],
            ["Bodycam", "bodycam", (v) => { return v?.deviceID ?? "#" }],
            ["Agente", "agente", (v) => { return v?.nome ?? "#" }],
            ["Mensagem", "action"],
          ]);
          break;
        case "excel":
          createExcel("Logs Bodycam", this.response.data, [
            [
              "Data/Hora",
              "dataHoraLog",
              (field) =>
                this.$moment(field, "YYYY-MM-DD[T]HH:mm:ss").format(
                  "DD/MM/YYYY HH:mm:ss"
                ),
            ],
            ["Bodycam", "bodycam", (v) => { return v?.deviceID ?? "#" }],
            ["Agente", "agente", (v) => { return v?.nome ?? "#" }],
            ["Mensagem", "action"],
          ]);
          break;
      }
    },
    async enviarEmail() {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (!emailRegex.test(this.toEmail)) {
        this.emailValido = false;
        this.openModalEmail = true;
        return false;
      } else {
        this.emailValido = true;
        this.openModalEmail = false;
      }
      let { buffer, fileName } = createEmail(
        "Logs Bodycam",
        this.response.data,
        [
          [
            "Data/Hora",
            "dataHoraLog",
            (field) =>
              this.$moment(field, "YYYY-MM-DD[T]HH:mm:ss").format(
                "DD/MM/YYYY HH:mm:ss"
              ),
          ],
          ["Bodycam", "bodycam", (v) => { return v?.deviceID ?? "#" }],
          ["Agente", "agente", (v) => { return v?.nome ?? "#" }],
          ["Mensagem", "action"],
        ]
      );

      const formData = new FormData();
      formData.append("ToEmail", this.toEmail);
      formData.append("Subject", `LOG ACESSO BODYCAM :: ${fileName}`);
      formData.append("Body", `#### ARQUIVO GERADO ${fileName} ####`);
      formData.append(
        "Attachments",
        new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        fileName
      );

      await post("/api/Email/enviar", formData)
        .then((data) => {
          this.$Notice.success({
            title: "E-mail enviado",
            desc: "Em instantes o email sera enviado.",
          });
        })
        .catch((data) => {
          console.error(data);
          this.$Notice.error({
            title: "E-mail não enviado",
            desc: "Tente novamente em instantes, instabilidade no servidor SMTP.",
          });
        })
        .finally(() => console.warn("EMAIL ENVIADO"));
    },
  },
  watch: {
    query(to, from) {
      this.response.data = this.response.original.filter((obj) =>
        this.searchInJSON(obj, to)
      );
    },
  },
};
</script>
