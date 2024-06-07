<template>
  <Init>
    <DataGrid titulo="Restaurar usuários">
      <template #list-right>
        <ButtonGroup>
          <Button icon="md-refresh-circle" @click.prevent="refreshData"
            >Recarregar</Button
          >
          <Button icon="md-search" @click.prevent="search = !search"
            >Pesquisar</Button
          >
        </ButtonGroup>
      </template>
      <template #search v-if="search">
        <Input search placeholder="Pesquisar" />
      </template>
      <template #table>
        <Perfil modulo="Usuários" controller="delete" action="usuario-list-trash">
          <Table
            stripe
            :columns="columns"
            :data="data"
            :loading="loading"
            ref="table"
          >
            <template #unidade="{ row }">
              {{ row.unidade.nome }}
            </template>
            <template #perfil="{ row }">
              {{ row.perfil.nome }}
            </template>
            <template #action="{ row }">
              <Button @click.prevent="ativar(row)">Restaurar</Button>
            </template>
          </Table>
        </Perfil>
      </template>
      <template #pagination v-if="!loading">
        <Page :total="pagination.size" :current="pagination.current" />
      </template>
    </DataGrid>
  </Init>
</template>

<script>
import { get, put } from "@/services/api";
export default {
  data() {
    return {
      search: false,
      loading: true,
      pagination: {
        current: 1,
        size: 10,
      },
      columns: [
        {
          title: "UUID",
          key: "userID",
          sortable: true,
        },
        {
          title: "Usuário",
          key: "nome",
          sortable: true,
        },
        {
          title: "Perfil",
          slot: "perfil",
          sortable: true,
        },
        {
          title: "Unidade",
          slot: "unidade",
          sortable: true,
        },
        {
          title: " ",
          slot: "action",
          align: "right",
          width: 300,
        },
      ],
      data: [],
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      await get("/api/Usuarios/TokenFilhos/Ativos", { ativos: false })
        .then((data) => (this.data = data))
        .finally(() => (this.loading = false));
    },
    refreshData() {
      this.loading = true;
      this.initData();
    },
    async statusUsuario(row, status) {
      let usuario = {
        iD_Usuario: row.iD_Usuario,
		iD_Empresa: row.iD_Empresa,
        userID: row.userID,
        nome: row.nome,
        email: row.email,
        cpf: row.cpf,
        senha: row.senha,
        telefone: row.telefone,
        iD_Unidade: row.iD_Unidade,
        iD_Perfil: row.iD_Perfil,
        inativo: status,
      };
      await put(`/api/Usuarios/${row.iD_Usuario}`, usuario)
        .then(() => {
          this.$Notice.success({
            title: "Usuário ativado com sucesso",
          });
          this.$router.push({name: "painel-usuario"})
        })
        .catch((error) => {
          this.$Notice.error({
            title: "Notificação de Erro ao cadastrar",
            desc: error,
          });
        });
    },
    ativar(row) {
      this.$Modal.confirm({
        title: "Deseja ativar usuário?",
        onOk: () => {
          this.statusUsuario(row, false);
        },
      });
    },
  },
};
</script>
