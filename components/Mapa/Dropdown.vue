<template>
  <Dropdown :transfer="true" trigger="click" class="dropdown-block">
    <div class="dropdown">
      <Icon type="md-more" />
      <Icon type="ios-arrow-down"></Icon>
    </div>
    <template #list>
      <div class="dropdown-list">
        <div class="dropdown-item-02">
          <section>
            <Button icon="md-desktop" long @click.prevent="mapInformacoes"
              >Informações</Button
            >
            <Button icon="md-pin" @click.prevent="centerMap( device.mapa )" v-if="device.mapa?.lat != 0"></Button>
            <Button
              type="error"
              @click.prevent="removeItem"
              icon="md-close-circle"
              v-if="close"
            ></Button>
          </section>
        </div>
        <div class="dropdown-item-01">
          <h5>Streaming</h5>
          <section>
            <Button icon="md-play" @click.prevent="startStreaming"></Button>
            <Button icon="md-square" @click.prevent="stopStreaming"></Button>
          </section>
        </div>
        <Perfil
          modulo="Comandos Bodycam"
          controller="access"
          action="painel-monitoramento"
        >
          <div class="dropdown-item-01">
            <h5>Gravação</h5>
            <section>
              <Button
                icon="md-radio-button-on"
                @click.prevent="startVideoRecording"
              ></Button>
              <Button
                icon="md-pause"
                @click.prevent="stopVideoRecording"
              ></Button>
            </section>
          </div>
        </Perfil>
        <!--
        <div class="dropdown-item-01">          
          <h5>Smart Record</h5>
          <section>
            <Button icon="md-play"></Button>
            <Button icon="md-pause"></Button>
            <Button icon="md-square"></Button>
          </section>
        </div>
        -->
        <div class="dropdown-item-02">
          <section>
            <Perfil
              modulo="Comandos Bodycam"
              controller="access"
              action="painel-monitoramento"
            >
              <Button icon="ios-camera" @click.prevent="takePhoto"
                >Tirar Foto</Button
              >
              <Button icon="ios-wifi" @click.prevent="vibrate">Vibrar</Button>
            </Perfil>
          </section>
        </div>
        <div class="drop-item-1" v-if="close">
          <Button icon="ios-alert-outline" long @click.prevent="handlePrint">
            {{getUser.empresa.flagInfo ? 'Criar ocorrência' : 'Criar caso'}}
          </Button>
        </div>
      </div>
    </template>
  </Dropdown>
</template>

<script>
import { get } from "@/services/api";
import { mapActions, mapGetters } from "vuex";
export default {
  props: ["device", "close"],
  computed: {
    ...mapGetters("device", ["getDeviceImei"]),
    ...mapGetters("auth", ["getUser"]),
  },
  methods: {
    ...mapActions("device", [
      "updateDetalhe",
      "add_camera",
      "remove_camera",
      "centerMap",
    ]),
    mapInformacoes() {
      this.updateDetalhe({
        show: true,
        device: this.getDeviceImei(this.device.listen.IMEI),
      });
      if (this.device.mapa?.lat != 0) {
        this.centerMap(this.device.mapa);
      }
    },
    removeItem() {
      let imei = this.device.listen.IMEI;
      this.remove_camera(imei);
    },
    startVideoRecording() {
      let imei = this.device.listen.IMEI;
      get("/api/ComandosCamera/StartVideoRecording", { imei }).finally(
        (_) => {}
      );
    },
    stopVideoRecording() {
      let imei = this.device.listen.IMEI;
      get("/api/ComandosCamera/StopVideoRecording", { imei }).finally(
        (_) => {}
      );
    },
    takePhoto() {
      let imei = this.device.listen.IMEI;
      get("/api/ComandosCamera/takePhoto", { imei }).finally((_) => {});
    },
    vibrate() {
      let imei = this.device.listen.IMEI;
      get("/api/ComandosCamera/Vibrate", { imei }).finally((_) => {});
    },
    handlePrint() {
      this.$emit('handleOpenAndPrint');
    },
    startStreaming() {
      let imei = this.device.listen.IMEI;
      get("/api/ComandosCamera/StartVideoStreaming", { imei }).finally((_) => {
        this.add_camera(imei);
      });
    },
    pauseStreaming() {
      let imei = this.device.listen.IMEI;
      this.add_camera(imei);
    },
    stopStreaming() {
      let imei = this.device.listen.IMEI;
      get("/api/ComandosCamera/StopVideoStreaming", { imei }).finally((_) => {
        this.remove_camera(imei);
      });
    },
  },
};
</script>

<style scoped>
.dropdown {
  display: flex;
  gap: 5px;
  align-items: center;
}
.dropdown-list {
  display: flex;
  flex-direction: column;
  padding: 5px;
  gap: 10px;
}

.dropdown-item-01 {
  display: grid;
  grid-template: ". ." / max-content max-content;
  align-items: center;
  justify-content: space-between;
}
.dropdown-item-01 > section {
  display: flex;
  justify-content: flex-end;
  gap: 5px;
}
.dropdown-item-02 {
  display: grid;
  grid-template: "." / 1fr;
  align-items: center;
}
.dropdown-item-02 > section {
  display: flex;
  justify-content: space-around;
  gap: 5px;
}
</style>
<style>
.ivu-select-dropdown {
  max-height: 500px;
}
</style>