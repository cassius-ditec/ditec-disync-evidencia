<template>
  <Init>
    <DataGrid titulo="Log de Usuário">
      <template #list-right>

          <Button icon="md-search" @click.prevent="search = !search"
            >Pesquisar</Button
          >
          <Button icon="md-mail" @click.prevent="openModalEmail = true"
            >Enviar por e-mail</Button
          >
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
        <Perfil
          modulo="Log Usuários"
          controller="list"
          action="log_usuario-list-all"
        >
          <Table
            stripe
            :columns="columns"
            :data="flattenedData"
            :loading="loading"
            ref="table"
          >
          </Table>
        </Perfil>
      </template>
      <template #pagination v-if="!loading">
        <Page :total="pagination.size" :current="pagination.current" />
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
import { post } from "@/services/api";
import { createPDF } from "@/services/exportData/pdf";
import { createExcel } from "@/services/exportData/excel";
import { createEmail } from "@/services/exportData/email";
import { mapGetters } from "vuex";
import moment from "moment";
export default {
  data() {
    return {
      evidencia: {},

      openModalEmail: false,
      toEmail: "",
      emailValido: true,

      search: false,
      query: "",
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
          title: "Data",
          key: "data",
          sortable: true,
          sortType: "desc",
          render: (h, params) => {
            const date = params.row.data;
            const formattedDate = moment(date).format(
              "DD/MM/YYYY [às] HH:mm:ss"
            );
            return h("span", formattedDate);
          },
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
          title: "IP",
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
      data: [],
      originalData: [],
    };
  },
  computed: {
    ...mapGetters("log_usuario", [
      "showLogUsuarios",
      "getLogUsuarios",
      "getLogUsuariosGroupData",
    ]),

    // Utilize esta computed para criar um novo array de dados com propriedades de primeiro nível
    flattenedData() {
      return this.originalData.map((row) => {
        return {
          ...row,
          dataFormata: moment(row.data).format("DD/MM/YYYY [ás] HH:mm:ss"),
          "usuario.nome": row.usuario ? row.usuario.nome : "", // Acessa a propriedade aninhada
          "unidade.nome": row.unidade ? row.unidade.nome : "", // Acessa a propriedade aninhada
        };
      });
    },
  },
  mounted() {
    if (!this.showLogUsuarios) {
      this.$router.push({ name: "painel-relatorio-log_usuario-filtrar" });
    }
    this.initData();
  },
  methods: {
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
        "Logs Usuário",
        this.flattenedData,
        [
          ["Metodo", "metodo"],
          ["Data", "dataFormata"],
          ["Usuario", "usuario.nome"],
          ["Unidade", "unidade.nome"],
          ["IP", "iP_Remoto"],
          ["Controller", "controller"],
          ["Ação", "acao"],
          ["Modulo", "modulo"],
        ]
      );

      const formData = new FormData();
      formData.append("ToEmail", this.toEmail);
      formData.append("Subject", `LOG ACESSO USUARIO :: ${fileName}`);
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
            desc: "Em instantes o email sera enviado."
          });
        })
        .catch((data) => {console.error(data)
          this.$Notice.error({
            title: "E-mail não enviado",
            desc: "Tente novamente em instantes, instabilidade no servidor SMTP."
          });
        })
        .finally(() => console.warn("EMAIL ENVIADO"));
    },
    showLogUsuario(evidencia) {
      this.evidencia = evidencia;
    },
    limparEvidencia() {
      this.evidencia = {};
    },
    dataBr(data) {
      return moment(data).format("DD/MM/YYYY");
    },
    horaBr(data) {
      return moment(data).format("HH:mm");
    },
    dataFullBr(data) {
      if (!data) return;
      return moment(data).format("DD/MM/YYYY [ás] HH:mm:ss");
    },

    async initData() {
      this.originalData = JSON.parse(JSON.stringify(this.getLogUsuarios));
      this.data = JSON.parse(JSON.stringify(this.getLogUsuarios));
      this.loading = false;
    },
    refreshData() {
      this.loading = true;
      this.initData();
    },
    openModal(id) {
      this.$Modal.confirm({
        title: "Deseja excluir?",
        onOk: () => {
          this.deleteRow(id);
        },
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
          createPDF("Logs Usuário", this.flattenedData, [
            ["Metodo", "metodo"],
            ["Data", "dataFormata"],
            ["Usuario", "usuario.nome"],
            ["Unidade", "unidade.nome"],
            ["IP", "iP_Remoto"],
            ["Controller", "controller"],
            ["Ação", "acao"],
            ["Modulo", "modulo"],
          ]);
          break;
        case "excel":
          createExcel("Logs Usuário", this.flattenedData, [
            ["Metodo", "metodo"],
            ["Data", "dataFormata"],
            ["Usuario", "usuario.nome"],
            ["Unidade", "unidade.nome"],
            ["IP", "iP_Remoto"],
            ["Controller", "controller"],
            ["Ação", "acao"],
            ["Modulo", "modulo"],
          ]);
          break;
      }
    },
  },
  watch: {
    query(to, from) {
      this.originalData = this.data.filter((obj) => this.searchInJSON(obj, to));
    },
  },
};
</script>

<style scoped>
.time {
  font-size: 14px;
  font-weight: bold;
}
.content {
  padding-left: 5px;
}
</style>