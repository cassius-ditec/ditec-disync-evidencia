<template>
  <Init class="dashboard">
    <div class="dashboard_row" v-for="(dash, iDash) in rows" :key="iDash">
      <component
        v-for="row in dash"
        :key="row"
        :column="dashboard[row]"
        :is="dashboard[row].component"
      />
    </div>
  </Init>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      rows: [
        ["hd"],
        ["totalEvidencia", "totalEvidenciaHoje"],
        ["bodycams", "agentes", "docks"],
        ["casos","unidades", "perfils", "classificacoes"],
      ],
      dashboard: {
        hd:{
          label: "Espaço em Disco",
          icon: "md-cloud-outline", 
          component: "DashboardHD",
        },
        totalEvidencia: {
          label: "Total de Evidências",
          value: "-",
          icon: "md-albums",
          component: "DashboardSimples",
          api: {
            get: "/api/Estatistica/TotalVideos",
            field: "totalInt",            
          },
        },
        totalEvidenciaHoje: {
          label: "Total de Evidencias Hoje",
          value: "-",
          icon: "md-albums",
          component: "DashboardSimples",
          api: {
            get: "/api/Estatistica/TotalVideosHoje",
            field: "totalInt",
          },
        },
        casos: {
          label: "Total de Casos",
          value: "-",
          icon: "md-shuffle",
          component: "DashboardSimples",
          api: {
            get: "/api/Estatistica/TotalCasos",
            field: "totalInt",
          },
        },
        bodycams: {
          label: "Bodycams Ativas",
          value: "-",
          component: "DashboardBodycam",
          api: {
            get: "/api/Estatistica/TotalCam",
            field: "totalInt",
          },
        },
        uploadEvidencia: {
          label: "Uploads de Evidências",
          value: "-",
          icon: "md-albums",
          component: "DashboardSimples",
          api: {
            get: "/api/Estatistica/TotalVideos",
            field: "totalInt",
          },
        },
        agentes: {
          label: "Agentes Ativos",
          value: "-",
          icon: "md-person",
          component: "DashboardSimples",
          api: {
            get: "/api/Estatistica/TotalAgente",
            field: "totalInt",
          },
        },
        unidades: {
          label: "Unidade",
          value: "-",
          icon: "md-briefcase",
          component: "DashboardSimples",
          api: {
            get: "/api/Estatistica/TotalUnidade",
            field: "totalInt",
          },
        },
        perfils: {
          label: "Perfil",
          value: "-",
          icon: "md-lock",
          component: "DashboardSimples",
          api: {
            get: "/api/Estatistica/TotalPerfil",
            field: "totalInt",
          },
        },
        classificacoes: {
          label: "Classificação",
          value: "-",
          icon: "md-pricetag",
          component: "DashboardSimples",
          api: {
            get: "/api/Estatistica/TotalClassificacao",
            field: "totalInt",
          },
        },
        docks: {
          label: "Dockstation",
          value: "-",
          icon: "ios-cloud-download",
          component: "DashboardSimples",
          api: {
            get: "/api/Estatistica/TotalDockstation",
            field: "totalInt",
          },
        },
      },
    };
  },
  computed: {
    ...mapGetters("auth", ["getUser"]),
  },
  created() {
    if (this.getUser.empresa.flagInfo == 1) {
      this.dashboard.casos.label = "Total de Ocorrências";
    }
  }
};
</script>


<style scoped>
.dashboard {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 30px;
}
.dashboard .dashboard_row {
  display: flex;
  gap: 30px;
}
.dashboard .dashboard_row > section {
  border-radius: 4px;
  background: white;
  padding: 20px;
  width: 100%;
  box-shadow: 2px 2px 1px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(0, 0, 0, 0.02);
}
</style>