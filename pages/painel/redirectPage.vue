<template>
    <Alert type="error" show-icon v-if="!getIsGoogleApi">
        API GOOGLE Inexistente
        <template #desc>
            É preciso que a chave api seja configurada para que a tela de monitoramento esteja acessivel!
        </template>
    </Alert>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters("auth", ["getIsGoogleApi"]),
  },
  mounted() {
    if( this.getIsGoogleApi ){
      window.location.href = '/painel/monitoramento'
    }
  },
};
</script>