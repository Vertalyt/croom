
<template>

  <div class="modal-overlay"></div>

  <div id="modal1" class="modal modal-fixed-footer"  ref="modal">
    <div class="modal-content">

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

const modal = ref()
const collapsible = ref()

const modalInstances = ref()
const collapsibleInstances = ref()

onMounted( ()=> {
  M.updateTextFields();
  modalInstances.value = M.Modal.init(modal.value).open()
  collapsibleInstances.value = M.Collapsible.init(collapsible.value);
} )

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
.modal {
  overflow-y: inherit !important;
 } 

.collapsible {
  width: calc(100% - 48px);
}
</style>