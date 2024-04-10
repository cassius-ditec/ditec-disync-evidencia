<template>
  <Init class="layout">
    <aside></aside>
    <header>
      <div class="left">
        <img :src="imagePath" />
      </div>
      <div class="right"></div>
    </header>
    <main><NuxtChild @flagInfo="logoTipoEmpresa" /></main>
  </Init>
</template>

<script>
export default {
  data() {
    return {
      imagePath: "",
    };
  },
  methods: {
    logoTipoEmpresa(flag) {
      if (flag == 1) {
        this.imagePath = "/pages/painel/logo_disync_obras.png";
      } 
      else {
        this.imagePath = "/pages/painel/logo_disync_evidencias.png";
      }
    },
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}
.layout {
  display: grid;
  grid-template: "aside header" min-content "aside main" 1fr / min-content 1fr;
  max-width: 100vw;
  height: 100vh;
}

.layout > aside {
  grid-area: aside;
  overflow: hidden;
  overflow-y: auto;
  border-right: 1px solid #f5f5f5;
}

.layout > header {
  grid-area: header;
  padding: 0px 0px 0px 15px;
  display: flex;
  gap: 15px;
  justify-content: space-between;
  border-bottom: 2px solid #f5f7f9;
}
.layout > header .left,
.layout > header .right {
  display: flex;
  gap: 15px;
  align-items: center;
}
img {
  height: 50px;
  padding: 5px;
}
.layout > main {
  grid-area: main;
  overflow: auto;
}
.layout > main > main {
  padding: 15px;
}
.grid-dropdown {
  display: grid;
  grid-template: "unidade botao" min-content "nome botao" min-content / 1fr 30px;
  border-left: 2px solid #f5f7f9;
  padding: 10px 20px;
  align-items: center;
  justify-items: end;
}
.grid-dropdown > *:nth-child(1) {
  font-size: 10px;
  font-weight: 900;
  grid-area: unidade;
}
.grid-dropdown > *:nth-child(2) {
  font-size: 14px;
  grid-area: nome;
}
.grid-dropdown > *:nth-child(3) {
  grid-area: botao;
  align-items: center;
}
.mouse_hover {
  cursor: pointer;
}
</style>