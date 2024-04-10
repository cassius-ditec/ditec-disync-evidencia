<template>
  <section>
    <aside><Icon :type="icon" /></aside>
    <header>{{ label }}</header>
    <footer>
      <Progress :percent="atual" :stroke-width="20"/>
    </footer>
    <main>Total em Disco: {{ total }}GB</main>
  </section>
</template>

<script>
import { get } from "@/services/api";
export default {
  props: ["column"],
  data() {
    return {
      ...this.column,
      atual: 100,
      total: 0,
    };
  },
  mounted(){
    this.consultaApi()
  },
  methods:{
    async consultaApi(){
      await get("/api/Estatistica/EspacoUtilizadoGBytes")
      .then( data => {
        let { totalFloat, parcialFloat } = data
        let HD_percent = ( parcialFloat / totalFloat ) * 100
        this.atual = parseFloat(HD_percent.toFixed(2))
        this.total = parseFloat(totalFloat.toFixed(0))
      })
    }
  }
};
</script>

<style scoped>
section {
  display: grid;
  grid-template: "header aside" "footer aside" "main main"/ 1fr min-content min-content;
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
section > main {
  grid-area: main;
  font-size: 10px;
  font-weight: 600;
  color: #98a6ad;
}
</style>