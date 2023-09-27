
<template>
  <div
  v-if="message"
  >
  <div class="modalNotification" @click.stop="isClose"></div>
  <div class="modal-contentNotification">
      <p>{{ message }}</p>
  </div>
</div>

</template>


<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const message = computed( () => store.getters['message'])


</script>

<script>
export default {
  name: 'AppNotification',
}
</script>

<style scoped>
.modalNotification {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #1718189e;
}
.modal-contentNotification {
  position: fixed;
  left: 0;
  right: 0;
  top: 50%;
  z-index: 100;
  margin: 0 auto;
  max-height: 80%;
  background-color: white;
  border-radius: 10px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px;
  width: 300px;
  background-image: url('./src/assets/img/AL_mobail.png');
  border: 3px solid rgb(97, 34, 34);
}
</style>