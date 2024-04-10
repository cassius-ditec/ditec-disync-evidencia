<template>
  <Init class="grid-login">
    <aside>
      <img src="/pages/login/logo_disync_evidencias.png" />
      <img src="/pages/login/logo_disync_obras.png" />
    </aside>
    <main>
      <NuxtChild />
    </main>
  </Init>
</template>


<style scoped>
* {
  box-sizing: border-box;
}
.grid-login {
  display: grid;
  grid-template: "art main" 1fr / 1fr 480px;
  height: 100vh;
}

@media only screen and (max-width: 480px) {
  .grid-login {
    grid-template: "art" min-content "main" 1fr / 1fr;
  }
}

.grid-login > aside {
  grid-area: art;
  background: url("/pages/login/fundo.jpg") center center no-repeat;
  background-size: cover;

  display: flex;
  flex-direction: row;
  gap: 30px;
  align-items: center;
  justify-content: center;

  padding: 50px;
}
.grid-login > aside img {
  width: 100%;
  max-width: 350px;
  height: auto;
}
.grid-login > main {
  grid-area: main;
  padding: 40px;
  background: #f5f7f9;
}
</style>