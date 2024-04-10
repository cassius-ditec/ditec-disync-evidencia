<template>
  <div class="slot-wrapper" v-if="active">
    <slot />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: ["action","modulo","controller"],
  data() {
    return {
      active: false
    };
  },
  mounted(){
    let modulo = this.modulo ?? 'Unidades'
    let permissao = this.getPermission(modulo)
    let controller = this.controller ?? 'post'
    let userControlAdmin = this.getUser.perfil.isAdmin

    
    if(userControlAdmin){
      this.active = true;
    }else if (permissao && permissao[controller] !== undefined) {
      if(permissao[controller]){
        this.active = true;
      }
    }
  },
  computed: {
    ...mapGetters("auth", ["getPermission","getUser"]),
  },
};
</script>


<style scoped>
.slot-wrapper {
  display: contents;
}
</style>