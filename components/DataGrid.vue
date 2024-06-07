<template>
  <main class="dataGrid">
    <h2 v-show="titulo">{{ titulo }}</h2>
    <div v-show="$slots['list-left']">
      <slot name="list-left" />
    </div>
    <div v-show="$slots['list-right']">
      <slot name="list-right" />
    </div>
    <div v-show="$slots['search']">
      <slot name="search" />
    </div>
    <div v-show="$slots['table']">
      <slot name="table" />
    </div>
    <div v-show="$slots['pagination']">
      <slot name="pagination" />
    </div>
  </main>
</template>

<script>
export default {
  props: {
    titulo: {
      default: null,
    },
  },
};
</script>

<style scoped>
.dataGrid {
  display: grid;
  gap: 10px;
  grid-template:
    "titulo titulo" min-content
    "direta esquerda" min-content
    "pesquisa pesquisa" min-content
    "tabela tabela" min-content
    "paginacao paginacao" min-content
    / min-content 1fr;
}
.dataGrid > *:nth-child(1) {
  grid-area: titulo;
}
.dataGrid > *:nth-child(2) {
  grid-area: direta;
}
.dataGrid > *:nth-child(3) {
  grid-area: esquerda;
  display: flex;
  justify-content: flex-end;
  gap:20px;
}
.dataGrid > *:nth-child(4) {
  grid-area: pesquisa;
}
.dataGrid > *:nth-child(5) {
  grid-area: tabela;
}
.dataGrid > *:nth-child(6) {
  grid-area: paginacao;
  display: flex;
  justify-content: center;
}
</style>