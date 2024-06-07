<template>
  <Drawer
    title="Detalhes do Equipamento"
    width="400"
    placement="right"
    :closable="false"
    :draggable="true"
    v-model="show"
  >
    <main class="box-collection" v-if="detalhe.device.listen">
      <div class="box-01">
        <div>{{ detalhe.device.listen.DEVID }}</div>
        <div>{{ detalhe.device.listen.AGENTE }}</div>
      </div>

      <h4>Endereço</h4>
      <div class="box-02">
        <div>{{ detalhe.device.listen.ADDRESS }}</div>
        <div>Latitude: {{ detalhe.device.listen.LAT }}</div>
        <div>Longitude: {{ detalhe.device.listen.LON }}</div>
      </div>

      <h4>Equipamento</h4>
      <div class="box-03">
        <div>Bodycam</div>
        <div>{{ detalhe.device.ID_Bodycam }}</div>
        <div>IMEI</div>
        <div>{{ detalhe.device.listen.IMEI }}</div>
        <div>Última Atualização</div>
        <div>{{ ddmmyyyy() }}</div>
        <div>Firmware</div>
        <div>{{ detalhe.device.VersaoFirmware }}v</div>
        <div>Velocidade</div>
        <div>{{ detalhe.device.listen.SPEED }}km</div>
        <div>Bateria</div>
        <div>{{ detalhe.device.listen.POWER }}%</div>
      </div>

      <h4>Status</h4>
      <div class="box-03">
        <div>Rastreando</div>
        <div>{{ detalhe.device.status.equipamentoLigado ? "sim" : "Não" }}</div>
        <div>Streaming</div>
        <div>{{ detalhe.device.status.streaming ? "sim" : "Não" }}</div>
        <div>Gravando</div>
        <div>{{ detalhe.device.status.gravacao ? "sim" : "Não" }}</div>
      </div>

      <div>
        <h4>Metadados</h4>
        <Form>
          <FormItem label="Ocorrência">
            <Input />
          </FormItem>
          <FormItem label="Tags">
            <Input />
          </FormItem>
          <FormItem label="Classificações">
            <Input />
          </FormItem>
        </Form>
      </div>
    </main>
    <main></main>
  </Drawer>
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      show: false,
    };
  },
  computed: {
    ...mapState("device", ["detalhe"]),
  },
  watch: {
    "detalhe.show"(to) {
      if (to) {
        this.show = true;
      }
    },
    show(to) {
      if (!to) {
        this.updateDetalhe({
          show: false,
          device: {},
        });
      }
    },
  },
  methods: {
    ...mapActions("device", ["updateDetalhe"]),
    ddmmyyyy() {
      let { DATE_TIME_GPS } = this.detalhe.device.listen;
      return this.$moment(DATE_TIME_GPS * 1000)
        .format("DD/MM/YYYY [às] HH:mm:ss");
    },
  },
};
</script>

<style scoped>
.box-collection {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.box-01 {
  display: grid;
  grid-template-rows: max-content max-content;
}
.box-01 > div:first-child {
  font-size: 14px;
  font-weight: 900;
}
.box-01 > div {
  font-size: 18px;
}
.box-02 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-columns: 1fr 1fr;
  gap: 15px;
  font-size: 12px;
}
.box-02 div:first-child {
  grid-area: 1 / span 2;
  font-size: 14px;
}
.box-03 {
  display: grid;
  grid-template-columns: max-content 1fr;
  grid-auto-columns: max-content 1fr;
  gap: 10px;
  font-size: 12px;
}
</style>
