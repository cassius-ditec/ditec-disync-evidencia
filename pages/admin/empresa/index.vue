<template>
  <Init>
    <DataGrid titulo="Empresa">
      <template #list-left>
        <Button type="primary" icon="md-add-circle" :to="{ name: 'admin-empresa-new' }">Nova Empresa</Button>
      </template>
      <template #table>
        <Table stripe :columns="columns" :data="data" ref="table" :show-header="false">
          <template #empresa="{ row }">
            <div class="empresa">
              <section><span> UUID: </span> {{ row.iD_Empresa }} </section>
              <section><span> Empresa: </span> {{ row.razao }} </section>
              <section><span> Tipo da Empresa: </span>
                {{ row.flagInfo == 1 ? "Obras" : "Evidências" }} </section>
              <section><span> CNPJ: </span> {{ row.cnpj }} </section>
              <section><span> Responsável: </span> {{ row.responsavel }} </section>
              <section><span> CPF: </span> {{ row.cpF_Responsavel }} </section>
              <section v-if="row.usuarioPadrao"><span> Usuário Padrão: </span>
                {{ row.objUsuario.nome }}
                <Button type="primary" icon="md-remove" shape="circle" size="small" style="margin-left: 10px"
                  @click.prevent="openDesvincularUsuario(row)">Desvincular</Button>
              </section>
              <section v-else><span> Usuário Padrão: </span>
                <Button type="primary" icon="md-add" shape="circle" size="small" 
                  @click.prevent="openModalVincular(row)">Vincular</Button>
              </section>
              <section><span> Ações: </span>
                <div>
                  <Button long :to="{ name: 'admin-empresa-iD_Empresa', params: row }" icon="md-create">Editar</Button>
                  <Button type="error" icon="md-trash" @click.prevent="openModalDelete(row.iD_Empresa)"></Button>
                </div>
              </section>
            </div>
          </template>
        </Table>
      </template>
    </DataGrid>
    <Modal v-model="modalOpen" title="Vincular Usuário" @on-ok="vincularUsuario">
      <Select v-model="sendVinculo.usuarioPadrao">
        <Option v-for="(usuario, iUser) in usuariosDaEmpresa" :key="iUser" :value="usuario.iD_Usuario">{{ usuario.nome }}
        </Option>
      </Select>
    </Modal>
  </Init>
</template>

<script>
import { get, put, del } from "@/services/api";
export default {
  data() {
    return {
      columns: [
        {
          title: "Empresa",
          slot: "empresa",
        },
      ],
      data: [],
      originalData: [],
      modalOpen: false,
      sendVinculo: { iD_Empresa: 0, usuarioPadrao: 0 },
      usuariosDaEmpresa: [],
      empresa: {}
    };

  },
  mounted() {
    this.initData();
  },
  methods: {
    /*LISTA DE MODALS*/
    openModalVincular({ iD_Empresa }) {
      this.sendVinculo.iD_Empresa = iD_Empresa;
      this.getUsuarioEmpresa( iD_Empresa ).then( _ => {
        this.modalOpen = true;
      })      
    },

    openDesvincularUsuario({ iD_Empresa }) {
      this.sendVinculo.iD_Empresa = iD_Empresa;
      this.sendVinculo.usuarioPadrao = 0;

      this.getUsuarioEmpresa( iD_Empresa ).then( _ => {
        this.vincularUsuario()
      })
    },

    async vincularUsuario(){

      await put(`/api/Empresa/${this.sendVinculo.iD_Empresa}/usuarioPadrao`, {usuarioPadrao: this.sendVinculo.usuarioPadrao})
        .then( data => console.log(data) )
        .catch( _ => console.error('DEU RUIM') )
        .finally( _ => {
          this.modalOpen = false
          this.initData()
        })
    },


    /*FIM LISTA DE MODALS*/
    async initData() {
      await get("/api/Empresa")
        .then((data) => (this.originalData = this.data = data))
        .catch(({ error, code }) => {
          console.log(error, code);
        })
        .finally(() => (this.loading = false));      
    },

    async getUsuarioEmpresa( empresa ){
      await get(`/api/Empresa/${empresa}`).then( (data) => (this.empresa = data ) )
      await get("/api/Usuarios/Cliente", {empresa})
        .then((data) => (this.usuariosDaEmpresa = data))
    },

    openModalDelete(id) {
      this.$Modal.confirm({
        title: "Deseja excluir?",
        onOk: () => {
          this.deleteRow(id);
        },
      });
    },
    async deleteRow(id) {
      await del(`/api/Empresa/${id}`)
        .then(() => {
          this.initData();
          this.$Notice.success({
            title: "Empresa excluida com sucesso",
          });
        })
        .catch((error) => {
          this.$Notice.error({
            title: "Notificação de Erro ao excluir",
            desc: error,
          });
        });
    },
  },
};
</script>


<style scoped>
.empresa {
  padding: 10px;
  padding-bottom: 40px;
  display: grid;
  gap: 8px;
  grid-template:
    'A B B C D'
    'E F G G H'
    / 1fr 1fr 1fr 1fr 1fr;
}

.empresa>section>span {
  font-size: 12px;
  font-weight: 900;
  color: #7a7a7a;
  display: block;
  margin-bottom: 5px;
}

.empresa>section:nth-child(1) {
  grid-area: A;
}

.empresa>section:nth-child(2) {
  grid-area: B;
}

.empresa>section:nth-child(3) {
  grid-area: C;
}

.empresa>section:nth-child(4) {
  grid-area: D;
}

.empresa>section:nth-child(5) {
  grid-area: E;
}

.empresa>section:nth-child(6) {
  grid-area: F;
}

.empresa>section:nth-child(7) {
  grid-area: G;
}

.empresa>section:nth-child(8) {
  grid-area: H;
}
.empresa>section:nth-child(8)>div{
  display: flex;
  gap: 5px;
}
</style>