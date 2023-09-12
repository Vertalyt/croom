<template>
  <div class="modal" @click.stop="isClose"></div>
  <div class="modal-content">
    <span @click="isClose" class="close">&times;</span>

    <h3>Доступно: {{ countElix }} | Использовано: {{  lvlPers - countElix }}</h3>

    <ManekenStatParams
    :statParams="statParams" 
    :accessibleStats="countElix"
    :additionalCheck="true"
    :inputShow="true"
    >
      <template #statManeken=" {summBase}" >
        <ManekenSlot
        :inputShow="true" 
        :statParam="summBase"
        :addElix="addParam"
        :accessibleStats="countElix"
        @handleStatDecrease="handleStatDecrease"
        @handleStatIncrease="handleStatIncrease"
        @handleStatInputChange="handleStatInputChange"
        />
      </template>
    </ManekenStatParams>

  </div>
</template>


<script setup>
import ManekenSlot from './use/slots/ManekenSlot.vue';
import ManekenStatParams from '../components/Manekenstatparams.vue'
import {  useStore } from 'vuex'
import { computed, ref, onMounted, watch } from 'vue'
import { statInputChange } from '../utils/modifyStat'


const props = defineProps({
  statParams:{
    type: Object,
    requared: true
  },
  idMannequin:{
    type: Number,
    requared: true
  },
  summBase: {
    type: Object,
    requared: true
  },

})


// массив с изменениями параметров
const addParam = ref([
  { key: 'dstrength', count: 0 },
  { key: 'ddexterity', count: 0 },
  { key: 'dintel', count: 0 },
  { key: 'dluck', count: 0 },
  { key: 'dreaction', count: 0 },
  { key: 'dwisdom', count: 0 },
  { key: 'dconst', count: 0 },
])



const store = useStore()
const countElix = ref(0)
const lvlPers = ref()


const listStat = computed(() => store.getters['statChange/listStat'](props.idMannequin) ) 
const elixStats = computed(() => listStat.value.find(item => item.type === 'elixStats'))


function addCountElix(){

  if(elixStats.value) {
    addParam.value = elixStats.value.param[0].base
    let totalSum = 0;
    elixStats.value.param[0].base.forEach(item => {
    totalSum += item.count;
    countElix.value = lvlPers.value - totalSum
    })
  } else {
    countElix.value = lvlPers.value
  } 
}

onMounted( () => {
  lvlPers.value = store.getters['listManeken'](props.idMannequin).lvl 
  addCountElix()
})

watch(elixStats, _ => {
  addCountElix()
})

const updateParam = (val, operation, count) => {
  return addParam.value.map(item => {
    if ((operation === 'decrease' && item.key === val && item.count > 0) ||
        (operation === 'increase' && item.key === val)) {
      return {
        ...item,
        count: operation === 'decrease' ? item.count - count : item.count + count
      };
    } else {
      return item;
    }
  });
};

const handleStatChange = (val, operation, count) => {
  if (operation === 'decrease' && countElix.value >= 0 && countElix.value < lvlPers.value) {
    countElix.value += count;
  } else if (operation === 'increase' && countElix.value > 0) {
    countElix.value -= count;
  } else {
    console.log('Не достаточно эликсиров');
    return;
  }
  const changeParam = updateParam(val, operation, count);
  store.commit('statChange/statChange', {
    addParam: [{ base: changeParam }],
    type: 'elixStats',
    idMannequin: props.idMannequin
  });
  addParam.value = changeParam
};

const handleStatDecrease = (val) => {
  handleStatChange(val, 'decrease', 1);
};

const handleStatIncrease = (val) => {
  handleStatChange(val, 'increase', 1);
};

const handleStatInputChange = (stat) => {
const { key, statChange } = statInputChange({ stat, statParams: props.statParams, accessibleStats: countElix.value })
handleStatChange(key, 'increase', statChange);
}

const emits = defineEmits({
  isCloseElix: null
})


const isClose = () => {
  emits('isCloseElix')
}


</script>

<script>
export default {
  name: 'AddElixir',
}
</script>

