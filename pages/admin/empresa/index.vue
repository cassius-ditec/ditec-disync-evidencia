<template>
  <Init>    
    <DataGrid titulo="Empresa">
      <template #list-left>
          <Button
            type="primary"
            icon="md-add-circle"
            :to="{ name: 'admin-empresa-new' }"
            >Nova Empresa</Button
          >
      </template>
      <template #table>
          <Table
            stripe
            :columns="columns"
            :data="data"
            :loading="loading"
            ref="table"
          >
          <template #tipoEmpresa="{ row }">
            {{ row.flagInfo == 1 ? "Manutenção" : "Monitoramento / Policiais" }}
          </template>

            <template #action="{ row }">

                <Button
                  :to="{
                    name: 'admin-empresa-iD_Empresa',
                    params: row,
                  }"
                  icon="md-create"
                  >Editar</Button
                >

                <Button
                  type="error"
                  icon="md-trash"
                  @click.prevent="openModal(row.iD_Empresa)"
                ></Button>

            </template>
          </Table>

      </template>
    </DataGrid>
  </Init>
</template>

<script>
import { get, del } from "@/services/api";
export default {
  data() {
    return {
      search: false,
      query: "",
      loading: true,
      pagination: {
        current: 1,
        size: 10,
      },
      columns: [
        {
          title: "UUID",
          key: "iD_Empresa",
          sortable: true,
          maxWidth: 100,
        },
        {
          title: "Empresa",
          key: "razao",
          sortable: true,
          width: "auto",
        },
        {
          title: "Tipo empresa",
          slot: "tipoEmpresa",
          sortable: true,
          width: "auto",
        },
        {
          title: "CNPJ",
          key: "cnpj",
          sortable: true,
          maxWidth: 200,
        },
        {
          title: "Responsável",
          key: "responsavel",
          sortable: true,
        },
        {
          title: "CPF Responsável",
          key: "cpF_Responsavel",
          sortable: true,
          maxWidth: 200,
        },
        {
          title: " ",
          slot: "action",
          align: "right",
          width: 200,
        },
      ],
      data: [],
      originalData: [],
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      await get("/api/Empresa")
        .then((data) => (this.originalData = this.data = data))
        .catch(({ error, code }) => {
          console.log(error, code);
        })
        .finally(() => (this.loading = false));
    },

    openModal(id) {
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
