<template>
  <div class="principal" :class="{ 'aovivo': aovivo}">
    <div class="titles">
      <header v-show="!hidden">
        <div><Icon :type="icon" /></div>
        <h4>{{ title }}</h4>
        <div>
          <slot name="header"></slot>
        </div>
      </header>
    </div>
    <div class="options">
      <slot name="option"></slot>
    </div>
    <div class="content"><slot /></div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
    hidden: {
      type: Boolean,
      default: false,
    },
    aovivo:{
      type: Boolean,
      default: false
    }
  },
};
</script>


<style scoped>
.principal {
  display: grid;
  height: 100%;
  grid-template: "t" min-content "o" min-content "c" 1fr / 1fr;
}
.principal > .titles {
  grid-area: t;
}
.principal > .options {
  grid-area: o;
}
.principal > .content {
  grid-area: c;
  overflow: auto;
}

.titles header {
  display: grid;
  grid-template: "i t o" 1fr / min-content 1fr max-content;
  color: white;
  background: #343a40;
  gap: 10px;
  padding: 15px;
  align-items: center;
}

.titles header > *:nth-child(1) {
  grid-area: i;
}
.titles header > *:nth-child(2) {
  grid-area: t;
}
.titles header > *:nth-child(3) {
  grid-area: o;
  display:flex;
  gap:5px;
}


.principal.aovivo .titles header {
  background: #a22522;
}
.principal.aovivo .content {
  background: #202124;
}

</style>