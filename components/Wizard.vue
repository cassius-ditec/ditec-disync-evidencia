<template>
  <main class="wizardGrid">
    <h2>{{ title }}</h2>
    <Form :model="form" :rules="rules" ref="form-wizard" :label-colon="true">
      <slot />
      <slot name="footer">
        <FormItem>
          <Button type="primary" @click.prevent="sendForm">Salvar</Button>
        </FormItem>
      </slot>
    </Form>
  </main>
</template>

<script>
export default {
  props: ["title", "form", "rules"],
  methods: {
    sendForm() {
      this.$emit( "submit", this.$refs['form-wizard'] )
    },
  },
};
</script>
<style scoped>
.wizardGrid > h2 {
  margin-bottom: 25px;
}
</style>