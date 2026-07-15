<template>
  <div class="login-card">
    <h1>LocalHub</h1>

    <p>지역 커뮤니티에 오신 것을 환영합니다.</p>

    <BaseInput placeholder="아이디" />

    <BaseInput type="password" placeholder="비밀번호" />

    <BaseButton> 로그인 </BaseButton>

    <RouterLink to="/signup" class="signup"> 회원가입 </RouterLink>
  </div>
</template>

<script setup>
import BaseButton from '../common/BaseButton.vue'
import BaseInput from '../common/BaseInput.vue'
</script>

<style scoped>
.login-card {
  width: 420px;
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 18px;
}

h1 {
  color: #3182f6;
}

p {
  color: #777;
}

.signup {
  text-align: center;

  text-decoration: none;

  color: #3182f6;
}

@media (max-width: 480px) {
  .login-card,
  .signup-card {
    width: 100%;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  }
}
</style>
