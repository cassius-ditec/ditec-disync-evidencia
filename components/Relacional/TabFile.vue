<template>
  <Init>
        <RelacionalFileAudio
          :evidencia="evidencia"
          v-if="evidencia.tipo_Arquivo == 1"
        />
        <RelacionalFileVideo
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
export default {
  props: ["evidencia"],
};
</script>