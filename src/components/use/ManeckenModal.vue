
<template>
  <div>
    <div class="modal" @click.stop ="isClose">    </div>
      <div class="modal-content">
        <span @click="isClose" class="close">&times;</span>
        <ul class="collapsible" ref="collapsible">
    <li>
      <div class="collapsible-header"><span class="material-symbols-outlined">filter_drama</span>First</div>
      <div class="collapsible-body"><span>Lorem ipsum dolor sit amet.</span></div>
    </li>
    <li>
      <div class="collapsible-header"><span class="material-symbols-outlined">place</span>Second</div>
      <div class="collapsible-body"><span>Lorem ipsum dolor sit amet.</span></div>
    </li>
    <li>
      <div class="collapsible-header"><span class="material-symbols-outlined">whatshot</span>Third</div>
      <div class="collapsible-body"><span>Lorem ipsum dolor sit amet.</span></div>
    </li>
  </ul>
      </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import M from "materialize-css/dist/js/materialize.min.js";

const emits = defineEmits({
  isClose: null
})

const collapsible = ref()
const modalInstances = ref()
const collapsibleInstances = ref()

onMounted( ()=> {
  // M.updateTextFields();
  collapsibleInstances.value = M.Collapsible.init(collapsible.value);
} )

const isClose = () => {
  emits('isClose')
}


onBeforeUnmount(() => {
  if(modalInstances.value && modalInstances.value.destroy) {
    modalInstances.value.destroy()
  }
  if(collapsibleInstances.value && collapsibleInstances.value.destroy) {
    collapsibleInstances.value.destroy()
  }
})
</script>

<script>
export default {
  name: 'ManeckenModal',
}
</script>

<style scoped>
@import 'materialize-css/dist/css/materialize.min.css';
</style>