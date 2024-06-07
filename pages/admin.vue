<template>
  <Init class="layout" ref="layout" v-if="showPage">
    <aside>
      <MenuPainelAdmin v-if="menuLateral" @menulateral="hiddenAside" />
    </aside>
    <header>
      <div class="left">
        <Button type="dashed" icon="md-menu" size="large" @click.prevent="menuLateral = !menuLateral"></Button>
        <img src="/pages/painel/logo_disync_evidencias.png" />
        <img src="/pages/painel/logo_disync_obras.png" />
      </div>
      <div class="right">
        <Dropdown placement="bottom-end" @on-click="dropdown">
          <span class="mouse_hover grid-dropdown">
            <span>{{ unidade }}</span>
            <span>{{ usuario }}</span>
            <Icon type="ios-arrow-down"></Icon>
          </span>
          <DropdownMenu slot="list">
            <DropdownItem name="self">Configuração</DropdownItem>
            <DropdownItem name="logoff" style="color: #ed4014" divided>Sair do sistema</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </header>
    <main>
      <NuxtChild />
    </main>
  </Init>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { get } from "@/services/api";
export default {
  data() {
    return {
      showPage: false,
      menuLateral: false,
      id: null,
      unidade: "",
      usuario: "",
    };
  },
  mounted() {
    this.validateUserEmpresa()
    this.start();
    let status = this.$store.getters["auth/getStatus"];
    if (!status) {
      this.$router.push({ name: "login" });
      this.zerar();
      this.$Notice.error({
        title: "Usuário deslogado",
      });
    } else {
      let usuario = this.$store.getters["auth/getUser"];
      this.id = usuario.iD_Usuario;
      this.validateUser();
    }
  },
  watch: {
    $route() {
      this.validateUser();
    },
    getUserEmpresa(v){
      if(!!!v) return
      if( v == 1 ) {
        if (this.getUserId == 1) return
      }
      this.$router.push({ name: "login" });
    }
  },
  computed: {
    ...mapGetters("auth", ["getUserEmpresa","getUserId"]),
  },
  methods: {
    ...mapActions("auth", ["start", "zerar", "setUser"]),
    async validateUser() {
      let id = this.id;
      await get(`/api/Usuarios/id/${id}`)
        .then((data) => {
          this.setUser(data);
          this.usuario = data.nome;
          this.unidade = data.unidade.nome;
          this.showPage = true;
        })
        .catch(() => {
          this.$router.push({ name: "login" });
          this.zerar();
          this.$Notice.error({
            title: "Usuário deslogado por inatividade",
          });
        });
    },
    dropdown(action) {
      switch (action) {
        case "self":
          this.$router.push({ name: "painel-usuario-self" });
          break;
        case "logoff":
          this.zerar();
          this.$router.push({ name: "login" });
          break;
      }
    },
    hiddenAside() {
      this.menuLateral = false
    },
    validateUserEmpresa(){
      
    }
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

.layout>aside {
  grid-area: aside;
  overflow: hidden;
  overflow-y: auto;
  border-right: 1px solid #f5f5f5;
}

.layout>header {
  grid-area: header;
  padding: 0px 0px 0px 15px;
  display: flex;
  gap: 15px;
  justify-content: space-between;
  border-bottom: 2px solid #f5f7f9;
}

.layout>header .left,
.layout>header .right {
  display: flex;
  gap: 15px;
  align-items: center;
}

img {
  height: 50px;
  padding: 5px;
}

.layout>main {
  grid-area: main;
  overflow: auto;
}

.layout>main>main {
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

.grid-dropdown>*:nth-child(1) {
  font-size: 10px;
  font-weight: 900;
  grid-area: unidade;
}

.grid-dropdown>*:nth-child(2) {
  font-size: 14px;
  grid-area: nome;
}

.grid-dropdown>*:nth-child(3) {
  grid-area: botao;
  align-items: center;
}

.mouse_hover {
  cursor: pointer;
}
</style>