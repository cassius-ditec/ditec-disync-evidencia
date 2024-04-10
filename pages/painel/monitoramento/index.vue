<template>
  <MapaCanvas>
    <template #aside>
      <MapaMain title="Equipamentos" icon="ios-videocam-outline">
        <Tabs class="tabs-bar-reset">
          <TabPane label="Dispositivos" icon="md-globe">
            <Collapse v-model="tab.device">
              <Panel name="device-on">
                Ligados
                <template #content>
                  <MapaEquipamentos
                    :devices="getDevicesOn"
                    v-if="getDevicesOn.length > 0"
                  />
                  <Alert v-else>Sem equipamentos ligados</Alert>
                </template>
              </Panel>
              <Panel name="device-off">
                Desligados
                <template #content>
                  <MapaEquipamentos :devices="getDevicesOff" />
                </template>
              </Panel>
            </Collapse>
          </TabPane>

          <TabPane label="Unidades" icon="md-briefcase">
            <Collapse v-model="tab.unidade">
              <Panel v-for="unidade in unidades" :key="unidade" :name="unidade">
                {{ unidade }}
                <template #content>
                  <MapaEquipamentos :devices="getDevicesUnidade(unidade)" />
                </template>
              </Panel>
            </Collapse>
          </TabPane>
          <TabPane label="Endereço" icon="md-globe">
            <Collapse v-model="tab.endereco">
              <Panel
                v-for="endereco in enderecos"
                :key="endereco"
                :name="endereco"
              >
                {{ endereco }}

                <template #content>
                  <MapaEquipamentos :devices="getDevicesEndereco(endereco)" />
                </template>
              </Panel>
            </Collapse>
          </TabPane>
        </Tabs>
      </MapaMain>
    </template>

    <template #mapa>
      <MapaMain hidden>
        <MapaGmap />
      </MapaMain>
    </template>

    <template #monitoramento>
      <MapaMain title="Câmeras ao vivo" icon="ios-disc" aovivo>
        <template #header>
          <div class="controllerGrade">
            Grade
            <Icon type="ios-reorder" />
            <input
              type="range"
              name="vol"
              min="1"
              max="15"
              step="1"
              v-model="colunas"
            />
            <Icon type="md-reorder" />
          </div>
        </template>
        <MapaCameras :colunas="colunas" @update-colunas="colunas = $event" />
      </MapaMain>
    </template>

    <template #detalhe>
      <MapaDetalhes />
    </template>
  </MapaCanvas>
</template>

<script>
import { w3cwebsocket } from "websocket";
import { mapActions, mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      client: null,
      colunas: 1,
      tab: {
        default: "device",
        device: ["device-on"],
        unidade: [],
        endereco: [],
      },
    };
  },
  computed: {
    ...mapState("device", ["devices", "unidades", "enderecos"]),
    ...mapGetters("device", [
      "getDevices",
      "getDevicesOn",
      "getDevicesOff",
      "getDevicesUnidade",
      "getDevicesEndereco",
    ]),
    ...mapGetters("auth", [
      "getUserEmpresa",
    ]),
  },
  mounted() {
    this.createWebSocket();
  },
  methods: {
    ...mapActions("device", ["updateDeviceImei", "setDevices"]),
    createWebSocket() {
      this.client = new w3cwebsocket(`${this.$config.serverWS}?IdEmpresa=${this.getUserEmpresa}`);
      this.client.onopen = () => this.client.send(1);

      this.client.onmessage = (Evt) => {
        let data = JSON.parse(Evt.data);
        this.client.send(1);
        if (Array.isArray(data)) {
          this.setDevices(data);
        } else {
          this.updateDeviceImei(data);
        }
      };
    },
  },
};
</script>

<style>
.tabs-bar-reset .ivu-tabs-bar {
  margin-bottom: 0px !important;
}
</style>

<style scoped>
.data-flex {
  display: flex;
}

.controllerGrade {
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;
  gap: 10px;
  font-weight: 600;
}

input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  height: 3px;
  background: #ffffff80;
  outline: none;
  border-radius: 5px;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 15px;
  height: 15px;
  border-radius: 100%;
  background: #fff;
  cursor: pointer;
}
</style>>