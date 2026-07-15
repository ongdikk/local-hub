<template>
  <main class="container">
    <slot />
  </main>
</template>

<style scoped>
.container {
  width: 100%;

  max-width: 900px;

  margin: 0 auto;

  padding: 40px 32px;

  box-sizing: border-box;
}

/* 모바일 */

@media (max-width: 768px) {
  .container {
    margin: 20px auto;

    padding: 0 16px;
  }

  .card {
    padding: 22px;
  }

  .title {
    font-size: 22px;
  }
}
</style>
