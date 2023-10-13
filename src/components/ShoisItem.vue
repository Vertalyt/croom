
<template>
  <div @click="accordionOpen" class="accordion">
    <div class="accordionFaceButton">
      <img :src="getImageUrl(image)" :alt="name" class="accordionFaceImg" />
      {{ name }}
    </div>
  </div>
  <div class="panel" :class="{ open: isOpen }">
  </div>
</template>


<script setup>
defineEmits({});
defineProps({})
</script>

<script>
export default {
  name: 'ShoisItem',
}
</script>

