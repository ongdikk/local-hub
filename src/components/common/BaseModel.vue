<template>
  <div v-if="visible" class="overlay">
    <div class="modal">
      <h3>{{ title }}</h3>

      <slot />

      <div class="buttons">
        <BaseButton @click="$emit('confirm')">
          확인
        </BaseButton>

        <BaseButton @click="$emit('close')">
          취소
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseButton from "./BaseButton.vue"

defineProps({
  visible: Boolean,
  title: {
    type: String,
    default: ""
  }
})

defineEmits([
  "confirm",
  "close"
])
</script>

<style scoped>

.overlay{
    position:fixed;
    inset:0;
    background:rgba(0,0,0,.45);

    display:flex;
    justify-content:center;
    align-items:center;
}

.modal{

    width:420px;

    background:white;

    border-radius:18px;

    padding:28px;

}

.buttons{

    display:flex;

    gap:12px;

    margin-top:20px;

}

</style>