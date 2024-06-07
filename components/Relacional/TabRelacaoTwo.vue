<template>
  <section id="relacao" v-if="evidencia.iD_Evidencia">
    <GmapMap
      class="mapmin"
      :center="localizacao?.center ?? center"
      :zoom="zoom"
      :options="gmapConfig.options"
    >
      <GmapPolyline
        :path="markers.map((marker) => marker.gps)"
        :options="{
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2,
        }"
        v-if="localizacao.center"
      />
      <GmapMarker :position="currentPosition" />
    </GmapMap>

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

    <section class="localizacao" >
      <div>
        <h5>Endereço</h5>
        {{ localizacaoAtual.end }}
      </div>
      <div>
        <h5>Latitude</h5>
        {{ localizacaoAtual.lat }}
      </div>
      <div>
        <h5>Longitude</h5>
        {{ localizacaoAtual.lng }}
      </div>
    </section>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import { gmapConfig } from "@/plugins/maps/themes/ditec";
import { get } from "@/services/api";
export default {
  props: ["evidencia"],
  data() {
    return {
      center: { lat: -15.7213698, lng: -65.8917826 },
      markers: [{ gps: { lat: -0, lng: -0 } }],
      zoom: 3,
      gmapConfig,
      pin: {
        path: "M -2,0 0,-2 2,0 0,2 z",
        strokeColor: "#FFF",
        fillColor: "#F00",
        fillOpacity: 3,
      },
      localizacao: {},
      currentPosition: null,
      start: false,
    };
  },
  watch: {
    evidencia(item) {
      if (Object.keys(item).length === 0) {
        this.localizacao = {}
        this.currentPosition = null
        this.start = false,
        this.center = { lat: -15.7213698, lng: -65.8917826 },
        this.markers = [{ gps: { lat: -0, lng: -0 } }]
      } 
      else if([1, 3, 4].includes(item.tipo_Arquivo)) {
        this.initMapa();
      }
    },
  },
  computed: {
    ...mapGetters("auth", ["getUserEmpresa"]),
    localizacaoAtual(){
      return {
        ...{ end: "-", lat: "-", lng: "-" },
        ...this.localizacao
      }
    }
  },
  methods: {
    async initMapa() {
      await get("/api/VideoDataGPS/VideoData/evidencia", {  
        id: this.evidencia.iD_Evidencia,
      }).then((data) => {
        this.markers = data.map((el) => ({
          ...el,
          gps: {
            lat: parseFloat(el.latitude),
            lng: parseFloat(el.longitude),
          },
        }));
        if(this.evidencia.tipo_Arquivo !== 2) {
          if (this.markers.length > 0) {
            let marker = this.markers[0];
            this.currentPosition = marker.gps;
            this.localizacao = {
              end: marker.endereco,
              lat: marker.gps.lat,
              lng: marker.gps.lng,
              center: marker.gps,
            };
          }
        }
      });
    },
    handleVideoTimeUpdate(currentTime) {
      if (!this.start) {
        this.initMapa();
        this.start = !this.start;
        this.zoom = 6;
      }
      var tempo_video = parseInt(currentTime);
      let marker;
      if (tempo_video >= 0 && tempo_video < this.markers.length) {
        marker = this.markers[tempo_video];
        this.currentPosition = marker.gps;
        this.localizacao = {
          end: marker.endereco,
          lat: marker.gps.lat,
          lng: marker.gps.lng,
          center: marker.gps,
        };
      }
    },
  },
};
</script>

<style scoped>
#relacao {
  display: grid;
  grid-template: ". ." "end end"/ 1fr 1fr;
  gap: 10px 0px;
  align-items: center;
  background: #343a40;
}
#relacao .localizacao {
  grid-area: end;
  padding: 20px;
  color: white;
  display: grid;
  grid-template: ". . ." / 1fr 100px 100px;
  gap: 20px;
}
</style>