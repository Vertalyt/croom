<template>
                  <td><input
                    :disabled="accessibleStats === null || hasddisabledLastElix"
                    type="number"
                    :value="statParam.summStatBase"
                    @change="updateStatParam"
                    class="options__input" />
                  </td>


                  <td
                  v-if="elixShow">
                      {{ addElixParam.count }}
                  </td>
                

                  <td>
                    <button
                    :disabled="accessibleStats === 0 || hasddisabledLastElix"
                    @click ="$emit('handleStatIncrease', statParam.key)" 
                    class="button__reset"
                    :class="{ 'noactive' : accessibleStats === null || accessibleStats === 0 || hasddisabledLastElix}"
                    >
                      <span class="material-symbols-outlined">stat_2</span>
                    </button>
                  </td>
                  <td>
                    <button 
                    :disabled="hasddisabledLastElix"
                    @click="$emit('handleStatDecrease', statParam.key)" 
                    class="button__reset"
                    :class="{ 'noactive' : accessibleStats === null || hasddisabledLastElix}"
                    >
                      <span class="material-symbols-outlined">stat_minus_2</span>
                    </button>
                  </td>
</template>

<script setup>
import { computed, watch, ref } from 'vue'


const props = defineProps({
  statParam:{
    type: Object,
    requared: true
  },
  accessibleStats: {
    type: Number,
    requared: true
  },
  elixShow: {
    type: Boolean,
    requared: false
  },
  addElix: {
    type: Object,
    requared: true
  },
  classCheck:{
    type: Boolean,
    requared: false
  },
  hasddisabledLastElix: {
    type: Boolean,
    requared: false
  }
})
const emits = defineEmits({
  handleStatInputChange: (statParam) => ({ statParam }),
  handleStatDecrease: (key) => ({ key }),
  handleStatIncrease: (key) => ({ key }),
})

const updatedStatValue = ref(props.statParam.summStatBase)
const addElixParam = computed( () => props.addElix.find(item => item.key === props.statParam.key) ) 

const subclassFlag = computed(() => props.classCheck ) 
watch(subclassFlag, val => {
  if(val === false) {
    updatedStatValue.value = props.statParam.summStatBase
  }
}, { immediate: true })

const updateStatParam = (event) => {
  const updatedStatParam = { ...props.statParam, summStatBase: parseFloat(event.target.value) };
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