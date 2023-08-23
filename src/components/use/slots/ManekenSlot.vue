<template>
                  <td><input
                    :disabled="accessibleStats === null"
                    :value="statParam.summStatBase"
                    @change="statInputShange(statParam)"
                    class="options__input" />
                  </td>
                  <td>
                    <button 
                    @click="$emit('statPlus', statParam.key)" 
                    class="button__reset">
                      <span class="material-symbols-outlined">stat_2</span>
                    </button>
                  </td>
                  <td>
                    <button 
                    @click="$emit('statMinus', statParam.key)" 
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
  statInputShange: (statParam) => ({ statParam }),
  statMinus: (key) => ({ key }),
  statPlus: (key) => ({ key }),
})
</script>

<script>
export default {
  name: 'ManekenSlot'
}
</script>
