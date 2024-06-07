<template>
  <Poptip title="Notificações" placement="bottom-end" :offset="0">
    <Badge :count="notificacoes.length" style="cursor: pointer">
      <Icon type="md-notifications-outline" size="20" />
    </Badge>
    <template #content>
      <div v-if="notificacoes.length">
        <table>
          <thead>
            <tr>
              <th>Mensagens</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(notificacao, iNotificacao) in notificacoes"
              :key="iNotificacao"
            >
              <td class="link" @click.prevent="abrirNotificacao(notificacao)">
                {{ notificacao.mensagem }}
              </td>
            </tr>
          </tbody>
        </table>
        <div class="table-footer">
          <Button type="info" size="small" @click.prevent="marcarTudoComLido"
            >Marcar como lidas</Button
          >
        </div>
      </div>
      <div v-else>Sem notificações</div>
      <RelacionalEvidencia
        :evidencia="evidencia"
        @limpar-evidencia="limparEvidencia"
      />
    </template>
  </Poptip>
</template>

<script>
import { get, post } from "@/services/api";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      notificacoes: [],
      evidencia: {},
    };
  },
  computed: {
    ...mapGetters("auth", ["getUserId"]),
  },
  mounted() {
    this.initNotificacao();
    setInterval(this.initNotificacao, 60000);
  },
  methods: {
    async initNotificacao() {
      await get("/api/Notifica")
        .then((data) => {
          this.notificacoes = data.reverse();
        })
        .catch(() => console.log("sem notificacao"));
    },
    async abrirNotificacao(notificacao) {
      let IdEvidencia = notificacao.idEvidencia;
      await get("/api/Evidencias/GetEvidenciasId", { IdEvidencia })
        .then((data) => {
          this.evidencia = data[0];
          this.marcarComLido(notificacao);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async marcarComLido(notificacao) {
      let notificacaoLida = {
        dataLida: this.$moment().format("YYYY-MM-DD[T]HH:mm:ss"),
        idNotifica: notificacao.idNotifica,
        idUsuario: this.getUserId,
        iD_Empresa: notificacao.iD_Empresa,
      };
      await post("/api/NotificaLida", notificacaoLida).finally(() =>
        this.initNotificacao()
      );
    },
    async marcarTudoComLido() {
      this.notificacoes.forEach((notificacao) =>
        this.marcarComLido(notificacao)
      );
      await this.initNotificacao();
    },
    limparEvidencia() {
      this.evidencia = {};
    },
  },
};
</script>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
}

td,
th {
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #f2f2f2;
}

tr:hover {
  background-color: #ddd;
}

th {
  padding-top: 5px;
  padding-bottom: 5px;
  text-align: left;
  background-color: #f18a11;
  color: white;
}
.table-footer {
  width: 100%;
  display: flex;
  gap: 30px;
  flex-direction: row;
  justify-content: flex-end;
  padding: 10px 0px;
}
.link {
  cursor: pointer;
  font-size: 12px;
}
</style>
<style>
.ivu-poptip-popper {
  z-index: 5;
}
</style>