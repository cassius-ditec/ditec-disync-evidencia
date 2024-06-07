<template>
  <main class="grid-split">
    <header>
        <h2>{{ title }}</h2> 
    </header>
    <aside>
        <slot name="form" />
    </aside>
    <section>
        <slot />
    </section>
  </main>
</template>

<script>
export default {
    props: ["title"],

}
</script>

<style scoped>
    .grid-split{
        display:grid;
        grid-template: "header header" "aside section"/ 400px 1fr;
        gap: 15px;
    }
    .grid-split > header{
        grid-area: header;
    }
    .grid-split > aside{
        grid-area: aside;
    }
    .grid-split > section{
        grid-area: section;
        display: flex;
        flex-direction: column;
        gap: 25px;
    }
</style>