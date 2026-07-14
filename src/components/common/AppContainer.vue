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

  padding: 40px 20px;

  box-sizing: border-box;
}

/* 모바일 */

@media (max-width: 768px) {
  .container {
    padding: 24px 16px;
  }
}
</style>
