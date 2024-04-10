<template>
  <main class="wizardGrid">
    <h2 v-if="form?.title">{{ form?.title }}</h2>
    <Form
      :ref="form.name"
      :model="form.fields"
      :rules="form.rules"
      :label-colon="true"
    >
      <slot />
      <FormItem class="btForm">
        <Button type="primary" @click.prevent="submitForm">{{ btSend || "Salvar"}}</Button>
        <Button :to="form.back" v-if="form?.back && showBack">Voltar</Button>
      </FormItem>
    </Form>
  </main>
</template>

<script>
export default {
  props: {
  form: Object,
  btSend: String,
  showBack: {
    type: Boolean,
    default: true
  },
},
  mounted() {
    const formElement = this.$refs[this.form.name].$el;
    formElement.addEventListener("keydown", this.handleEnterKey);
  },
  methods: {
    handleEnterKey(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        this.submitForm();
      }
    },
    async submitForm() {
      let form = this.$refs[this.form.name];
      let valid = await form.validate((valid) => valid);
      this.$emit("on-validate", {
        form,
        validation: valid,
      });
    },
  },
};
</script>

<style scoped>
.wizardGrid > h2 {
  margin-bottom: 25px;
}
.btForm {
  margin-top: 25px;
}
</style>