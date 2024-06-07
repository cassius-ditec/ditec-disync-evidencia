<template>
  <Init>
    <pre>
      {{ currentPosition }}
    </pre>

    <GmapMap
      class="mapmin"
      :center="markers[0]?.gps ?? center"
      :zoom="30"
      :options="gmapConfig.options"
    >

      <GmapPolyline
        :path="markers.map((marker) => marker.gps)"
        :options="{
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2,
        }"
      />

      <!-- Adicione o marcador aqui -->
      <GmapMarker
        :position="currentPosition"
      />
    </GmapMap>
    <Divider>Localização</Divider>
    <div class="box-table">
      <div>Endereço</div>
      <div>Latitude</div>
      <div>Longitude</div>
    </div>

    <RelacionalFileAudio
      :evidencia="evidencia"
      v-if="evidencia.tipo_Arquivo == 1"
    />

    <RelacionalFileVideo
      @videoTimeUpdate="handleVideoTimeUpdate"
      :evidencia="evidencia"
      v-if="evidencia.tipo_Arquivo == 2"
    />

    <RelacionalFileDocument
      :evidencia="evidencia"
      v-if="evidencia.tipo_Arquivo == 3"
    />
    <RelacionalFileImage
      :evidencia="evidencia"
      v-if="evidencia.tipo_Arquivo == 4"
    />
  </Init>
</template>
  
  <script>
import { mapGetters } from "vuex";
import { gmapConfig } from "@/plugins/maps/themes/ditec";
import { get, post } from "@/services/api";
export default {
  props: ["evidencia"],
  data() {
    return {
      center: { lat: -0, lng: -0 },
      markers: [{ gps: { lat: -0, lng: -0 } }],
      zoom: 10,
      gmapConfig,
      pin: {
        path: "M -2,0 0,-2 2,0 0,2 z",
        strokeColor: "#F00",
        fillColor: "#F00",
        fillOpacity: 1,
      },
      currentPosition: null,
    };
  },
  computed: {
    ...mapGetters("auth", ["getUserEmpresa"]),
  },
  mounted() {
    this.initMapa();
  },
  methods: {
    async initMapa() {
      await get("/api/VideoDataGPS/VideoData/evidencia", {
        id: this.evidencia.iD_Evidencia,
      }).then((data) => {
        this.markers = data.map((el) => ({
          ...el,
          gps: { lat: parseFloat(el.latitude), lng: parseFloat(el.longitude) },
        }));
      });
    },
    handleVideoTimeUpdate(currentTime) {
      var tempo_video = parseInt(currentTime);

      // Use tempo_video como índice para acessar os dados de GPS
      if (tempo_video >= 0 && tempo_video < this.markers.length) {
        this.currentPosition = this.markers[tempo_video].gps;
      }
      
    },
  },
};
</script>
  
  <style>
</style>