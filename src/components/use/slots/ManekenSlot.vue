<template>
                  <td><input
                    :disabled="accessibleStats === null"
                    :value="statParam.summStatBase"
                    @change="updateStatParam"
                    class="options__input" />
                  </td>
                  <td>
                    <button 
                    
                    @click ="$emit('handleStatIncrease', statParam.key)" 
                    class="button__reset"
                    :class="{ 'noactive' : accessibleStats === null }"
                    >
                      <span class="material-symbols-outlined">stat_2</span>
                    </button>
                  </td>
                  <td>
                    <button 
                    @click="$emit('handleStatDecrease', statParam.key)" 
                    class="button__reset"
                    :class="{ 'noactive' : accessibleStats === null }"
                    >
                      <span class="material-symbols-outlined">stat_minus_2</span>
                    </button>
                  </td>
</template>

<script setup>
const props = defineProps({
  statParam:{
    type: Object,
    requared: true
  },
  accessibleStats: {
    type: Number,
    requared: true
  }
})
const emits = defineEmits({
  handleStatInputChange: (statParam) => ({ statParam }),
  handleStatDecrease: (key) => ({ key }),
  handleStatIncrease: (key) => ({ key }),
})

let updatedStatValue = props.statParam.summStatBase;
const updateStatParam = (event) => {
  updatedStatValue = parseFloat(event.target.value);
  const updatedStatParam = { ...props.statParam, summStatBase: updatedStatValue };
  emits('handleStatInputChange', updatedStatParam);
}


</script>

<script>
export default {
  name: 'ManekenSlot'
}
</script>

<style scoped>
.noactive {
  opacity: 0.3;
}
</style>