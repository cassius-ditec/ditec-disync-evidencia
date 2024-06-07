<template></template>
<script>
export default {
  mounted() {
    if( ! (this.$route.query == undefined || this.$route.query == "") ){
      let {query } = this.$route
      window.location.href = this.$router.resolve( { name: query.url } ).href
    }
  },
};
</script>