<template>
  <GmapMap
    :center="center"
    :zoom="zoom"
    class="map"
    :options="gmapConfig.options"
  >
    <GmapCluster :zoomOnClick="true" :animation="2">
      <GmapCustomMarker
        v-for="device in getDeviceWithLocation"
        :key="device.IMEI"
        :marker="device.mapa"
        @click="focoZoom(device.mapa)"
      >
        <div class="device-grid">
          <div><Icon type="md-globe" color="#90C418" /></div>
          <div>{{ device.listen.DEVID }}</div>
          <div @click.prevent="foco(device)">{{ device.listen.AGENTE }}</div>
          <div>
            <Button
              size="small"
              icon="md-play"
              @click.prevent="startStreaming(device)"
            />
          </div>
        </div>
      </GmapCustomMarker>
    </GmapCluster>
  </GmapMap>
</template>

<script>
import { gmapConfig } from "@/plugins/maps/themes/ditec";
import { get } from "@/services/api";
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      pinCentral: "",
      zoom: 7,
      gmapConfig,
      markers: [],
    };
  },
  computed: {
    ...mapGetters("device", ["center","getDeviceWithLocation", "getDeviceImei"]),
  },
  mounted() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        this.centerMap({
          lat: coords.latitude,
          lng: coords.longitude,
        });
      });
    }
  },

  methods: {
    ...mapActions("device", ["updateDetalhe", "add_camera", "centerMap"]),
    foco(device) {
      this.updateDetalhe({
        show: true,
        device: this.getDeviceImei(device.listen.IMEI),
      });
      let { lat, lng } = device.mapa;
      this.centerMap({ lat, lng });
      this.zoom = 20;
    },
    startStreaming(device) {
      let imei = device.listen.IMEI;
      get("/api/ComandosCamera/StartVideoStreaming", { imei }).finally((_) => {
        this.add_camera(imei);
      });
    },
  },
};
</script>

<style>
.map {
  width: 100%;
  height: 100%;
}

.mapmin {
  width: 100%;
  height: 200px;
}
</style>

<style scoped>
.device-grid {
  display: grid;
  padding: 5px 10px;
  margin: 0px;
  grid-template:
    "icon equipamento botao" min-content
    "icon agente botao" min-content
    / min-content 1fr max-content;
  font-size: 12px;
  color: #808080;
  gap: 2px 5px;
  background: white;
  border-radius: 6px;
  box-shadow: rgba(0, 0, 0, 0.18) 0px 2px 4px;
}
.device-grid > div {
  display: flex;
  align-items: center;
}
.device-grid > div:nth-child(1) {
  grid-area: icon;
  font-size: 14px;
}
.device-grid > div:nth-child(2) {
  grid-area: equipamento;
  font-size: 9px;
  font-weight: 900;
}
.device-grid > div:nth-child(3) {
  grid-area: agente;
  color: #17233d;
  cursor: pointer;
}
.device-grid > div:nth-child(4) {
  grid-area: botao;
}

.device-grid::after {
  content: "";
  position: absolute;
  bottom: -10px;
  left: calc((100% - 2 * 5px) / 2);
  border-width: 5px; /* Tamanho do triângulo */
  border-style: solid;
  border-color: #ffffff transparent transparent transparent;
}
</style>