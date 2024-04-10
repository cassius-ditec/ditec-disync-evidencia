import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'

import GmapCustomMarker from 'vue2-gmap-custom-marker';

import GmapCluster from "vue2-google-maps/src/components/cluster";

import { getLocalStorage } from '@/plugins/local-storage'

let user = getLocalStorage("user")

var chave_google_map = user?.empresa?.chaveGoogle

Vue.use(VueGoogleMaps, {
  load: {
      key: chave_google_map,
      libraries: 'places',
  },
})

Vue.component('GmapCustomMarker', GmapCustomMarker)

Vue.component("GmapCluster", GmapCluster)

