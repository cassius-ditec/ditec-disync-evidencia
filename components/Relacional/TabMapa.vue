<template>
  <Init>
    <GmapMap
      class="mapmin"
      :center="markers[0]?.gps ?? center"
      :zoom="30"
      :options="gmapConfig.options"
    >
      <GmapMarker
        v-for="(marker, iMarker) in markers"
        :key="iMarker"
        :position="marker.gps"
        :icon="pin"
      />
    </GmapMap>
    <Divider>Localização</Divider>
    <div class="box-table">
      <div>Endereço</div>
      <div>Latitude</div>
      <div>Longitude</div>
    </div>
  </Init>
</template>

<script>
import { gmapConfig } from "@/plugins/maps/themes/ditec";
import { get, post } from "@/services/api";
export default {
  props: ["evidencia"],
  data() {
    return {
      center: { lat: -0, lng: -0 },
      markers: [ { gps: { lat: -0, lng: -0 }} ],
      zoom: 10,
      gmapConfig,
      pin: {
        path: "M -2,0 0,-2 2,0 0,2 z",
        strokeColor: "#F00",
        fillColor: "#F00",
        fillOpacity: 1,
      },
    };
  },
  mounted(){
    this.initMapa()
  },
  methods:{
    async initMapa(){
      await get("/api/VideoDataGPS/VideoData/evidencia", {
        id: this.evidencia.iD_Evidencia,
      }).then((data) => {
        this.markers = data.map((el) => ({
          ...el,
          gps: { lat: parseFloat(el.latitude), lng: parseFloat(el.longitude) },
        }));
      });
    }
  }

};
</script>

<style>
.mapmin{
width: 100%;
height: 400px;
}
</style>