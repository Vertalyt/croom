<template>
                  <td><input
                    :disabled="accessibleStats === null"
                    :value="statParam.summStatBase"
                    @change="handleStatInputChange(statParam)"
                    class="options__input" />
                  </td>
                  <td>
                    <button 
                    @click ="$emit('handleStatIncrease', statParam.key)" 
                    class="button__reset">
                      <span class="material-symbols-outlined">stat_2</span>
                    </button>
                  </td>
                  <td>
                    <button 
                    @click="$emit('handleStatDecrease', statParam.key)" 
                    class="button__reset">
                      <span class="material-symbols-outlined">stat_minus_2</span>
                    </button>
                  </td>
</template>

<script setup>
defineProps({
  statParam:{
    type: Object,
    requared: true
  },
  accessibleStats: {
    type: Number,
    requared: true
  }
})
defineEmits({
  handleStatInputChange: (statParam) => ({ statParam }),
  handleStatDecrease: (key) => ({ key }),
  handleStatIncrease: (key) => ({ key }),
})
</script>

<script>
export default {
  name: 'ManekenSlot'
}
</script>
