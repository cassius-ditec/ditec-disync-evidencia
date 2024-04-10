<template>
  <main class="grid-evidence">
    <header>
      <h2>{{ title }}</h2>
      <slot name="header"></slot>
    </header>
    <main>
      <slot />
    </main>
    <section>
      <slot name="aside" />
    </section>
  </main>
</template>

<script>
export default {
  props: ["title"],
};
</script>

<style scoped>
.grid-evidence {
  display: grid;
  grid-template: "header header" "aside section"/ 1fr 350px;
  gap: 15px;
}
.grid-evidence > header {
  grid-area: header;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 30px;
}
.grid-evidence > main {
  grid-area: aside;
}
.grid-evidence > section {
  background: vulcano;
  grid-area: section;
  display: flex;
  flex-direction: column;
  gap: 30px;
}
.grid-evidence > section  main{
  display: flex;
  flex-direction: column;
  gap: 30px;
}
</style>