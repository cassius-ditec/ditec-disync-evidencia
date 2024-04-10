<template>
  <Init>
    <table>
      <thead>
        <tr>
          <th>Data/Hora</th>
          <th>Ação da Bodycam</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(log, i) in log" :key="i">
          <td>{{ $moment(log.dataHoraLog).format("DD/MM/YYYY [às] HH:mm:ss") }}</td>
          <td>{{ log.action }}</td>
        </tr>
      </tbody>
    </table>
  </Init>
</template>

<script>
import { get } from "@/services/api";
export default {
  props: ["evidencia"],
  data() {
    return {
      log: [],
    };
  },
  mounted() {
    this.initLog();
  },
  methods: {
    async initLog() {
      let { iD_Agente, data, iD_Bodycam } = this.evidencia;
      let schema = {
        DataInicial: this.$moment(data).format("YYYY-MM-DD[T00:00:00]"),
        DataFinal: this.$moment(data).format("YYYY-MM-DD[T23:59:59]"),
        IdAgente: iD_Agente,
        IdDadosCamera: iD_Bodycam,
      };
      await get("/api/LogCameras/GetLogCameras", schema).then(
        (data) => (this.log = data)
      );
    },
    dataBr(data) {
      return this.$moment(data).format("DD/MM/YYYY");
    },
    horaBr(data) {
      return this.$moment(data).format("HH:mm");
    },
    dataFullBr(data) {
      if (!data) return;
      return this.$moment(data).format("DD/MM/YYYY [ás] HH:mm:ss");
    },
  },
};
</script>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
}

td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}
</style>