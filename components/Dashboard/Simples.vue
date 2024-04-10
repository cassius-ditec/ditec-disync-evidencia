<template>
  <section>
    <aside><Icon :type="icon" /></aside>
    <header>{{ label }}</header>
    <footer>{{ value }}</footer>
  </section>
</template>

<script>
import { get } from "@/services/api";
export default {
  props: ["column"],
  data(){
    return {
      ...this.column
    }
  },
  mounted(){
    if(this.api){
      this.consultaApi()
    }
  },
  methods:{
    async consultaApi(){
      await get(this.api.get)
      .then( data => {
        let field = data[this.api.field]
        if(this.api.mask){
          field = this.api.mask.replace("%s", field)
        }
        this.value = field
      })
      .catch( _ => this.value = 0)
    }
  }
};
</script>

<style scoped>
section {
  display: grid;
  grid-template: "header aside" "footer aside" / 1fr min-content;
  gap: 5px 10px;
}
section > aside {
  grid-area: aside;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 40px;
}
section > header {
  grid-area: header;
  font-weight: 600;
  color: #98a6ad;
}
section > footer {
  grid-area: footer;
  font-size: 25px;
  font-weight: 600;
}
</style>