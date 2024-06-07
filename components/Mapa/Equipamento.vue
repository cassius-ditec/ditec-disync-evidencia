<template>
  <div class="equipamento" v-if="device.listen._id">
    <template v-if="device.status.equipamentoLigado">
      <div class="equipamento_ID">
        <Tooltip content="Equipamento ligado" theme="light">
          <Icon type="md-globe" color="#90C418" />
        </Tooltip>
        <h5>{{ device.listen.DEVID }}</h5>
      </div>
      <div class="equipamento_STATUS">
        <Tooltip :content="` Sinal GPS: ${device.status.gps}`" theme="light">
          <Icon type="ios-navigate" color="#90C418" v-if="device.status.gpsLigado"/>
          <Icon type="ios-navigate" v-else/>
        </Tooltip>
        <Tooltip content="Em streaming" theme="light">
          <Icon type="md-disc" color="#FC4850" v-if="device.status.streaming"/>
          <Icon type="md-disc" v-else/>
        </Tooltip>
        <Tooltip content="Em gravação" theme="light">
          <Icon type="ios-recording" color="#FC4850" v-if="device.status.gravacao"/>
          <Icon type="ios-recording" v-else/>
        </Tooltip>
        <Tooltip :content="`Bateria ${device.status.bateria}`" theme="light">
          <Icon
            type="ios-battery-dead"
            color="#FC4850"
            v-if="device.status.bateriaEm == 'low'"
          />
          <Icon type="ios-battery-full" color="#90C418" v-else />
        </Tooltip>
      </div>
      <div class="equipamento_MENU">
        <MapaDropdown :device="device" />
      </div>
      <div class="equipamento_AGENTE">{{ device.listen.AGENTE }}</div>
      <div class="equipamento_ENDERECO">
        <Icon type="md-pin" />
        <span>{{ enderecoCompleto(device.listen) }}</span>
        <Button
          icon="md-pin"
          type="info"
          ghost
          v-if="showEndereco(device.listen)"
          @click.prevent="centerMap( device.mapa )"
        ></Button>
      </div>
      <div class="equipamento_PANICO"></div>
    </template>
    <template v-else>
      <div class="equipamento_ID">
        <Tooltip content="Equipamento Desligado" theme="light">
          <Icon type="md-globe" />
        </Tooltip>
        <h5>{{ device.listen.DEVID }}</h5>
      </div>
      <div class="equipamento_STATUS">
        <Tag color="volcano">Off-line</Tag>
      </div>
      <div class="equipamento_AGENTE">{{ device.listen.AGENTE }}</div>
      <div class="equipamento_PANICO"></div>
    </template>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  props: ["device"],
  methods: {
    ...mapActions("device", ["centerMap"]),
    enderecoCompleto({ ADDRESS_DETAIL }) {
      let { road, suburb, city, municipality, state } = ADDRESS_DETAIL || {};
      return `${road || ""}, ${suburb || ""}, ${city || municipality || ""}, ${
        state || ""
      }`;
    },
    showEndereco({ LAT, LON }) {
      if (LAT == 0 || LON == 0) {
        return false;
      }
      return true;
    },
  },
};
</script>

<style scoped>
.equipamento {
  border: 1px solid #4e5357;
  border-radius: 2px;
  padding: 10px;
  display: grid;
  grid-template:
    "id status menu"
    "agente agente agente"
    "end end end" min-content
    "panico panico panico" min-content
    / max-content 1fr max-content;
  gap: 5px;
  font-size: 14px;
  color: #808080;
}
.equipamento > .equipamento_ID {
  grid-area: id;
  display: flex;
  align-items: center;
  gap: 5px;
}
.equipamento > .equipamento_STATUS {
  grid-area: status;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
}
.equipamento > .equipamento_MENU {
  grid-area: menu;
}
.equipamento > .equipamento_AGENTE {
  grid-area: agente;
  display: flex;
  align-items: center;
  font-weight: 700;
}
.equipamento > .equipamento_ENDERECO {
  grid-area: end;
  display: grid;
  grid-template: ". . ." / min-content 1fr min-content;
  gap: 10px;
  align-items: center;
}

.equipamento > .equipamento_ENDERECO > span {
  font-size: 11px;
}

.equipamento > .equipamento_PANICO {
  grid-area: panico;
}
</style>