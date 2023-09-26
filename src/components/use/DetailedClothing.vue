
<template>

  <div class="modal-content modal-infiCloth">
    <span @click="isClose" class="close">&times;</span>

    <div class="wrapperAccordion">
      <p>Что то там</p>

    </div>


  </div>
</template>


<script setup>
const emits = defineEmits({
  isClothInfo: () => Boolean
})
defineProps({
  isOpenInfoCloth: ({
    type: Boolean,
    required: true
  })

})

const isClose = () => {
  emits('isClothInfo', false)
}

</script>

<script>
export default {
  name: 'DetailedClothing',
}
</script>

<style scoped>

.modal-infiCloth {
  left: 50%;
  right: auto;
  transform: translateX(-50%);
}

.accordionFace {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.wrapperAccordion {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
  justify-content: space-around;
}

@media screen and (max-width: 600px) {

  .accordionFace {
    margin-bottom: 0;
  }
}

</style>