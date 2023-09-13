<template>
  <div class="modal" @click.stop="isClose"></div>
  <div class="modal-content">
    <span @click="isClose" class="close">&times;</span>
    <h3>Доступно: {{ countElix }} | Использовано: {{ lvlPers - countElix }}</h3>
    <ManekenStatParams
      :statParams="statParams"
      :accessibleStats="countElix"
      :elixCheck="true"
      :inputShow="true"
    >
      <template #statManeken="{ summBase }">
        <ManekenSlot
          :key="idrebut"
          :elixShow="true"
          :classCheck="subclassCheck"
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
import ManekenSlot from './use/slots/ManekenSlot.vue'
import ManekenStatParams from '../components/Manekenstatparams.vue'
import { useStore } from 'vuex'
import { computed, ref, onMounted, watch } from 'vue'
import { statInputChange } from '../utils/modifyStat'

const props = defineProps({
  statParams: {
    type: Object,
    requared: true
  },
  idMannequin: {
    type: Number,
    requared: true
  },
  summBase: {
    type: Object,
    requared: true
  },
  classMinParam:{
    type: Object,
    requared: true
  }
})

// массив с изменениями параметров
const addParam = ref([
  { key: 'dstrength', count: 0 },
  { key: 'ddexterity', count: 0 },
  { key: 'dintel', count: 0 },
  { key: 'dluck', count: 0 },
  { key: 'dreaction', count: 0 },
  { key: 'dwisdom', count: 0 },
  { key: 'dconst', count: 0 }
])

const store = useStore()
const countElix = ref(0)
const lvlPers = ref()
const subclassCheck = ref(true)
const listStat = computed(() => store.getters['statChange/listStat'](props.idMannequin))
const elixStats = computed(() => listStat.value.find((item) => item.type === 'elixStats'))
const listManeken = computed(() => store.getters['listManeken'](props.idMannequin))
const oldValueInput = ref(true)
const idrebut = ref(1)

lvlPers.value = listManeken.value.lvl


function addCountElix() {
  if (elixStats.value) {
    addParam.value = elixStats.value.param[0].base
    let totalSum = 0
    elixStats.value.param[0].base.forEach((item) => {
      totalSum += item.count
      countElix.value = lvlPers.value - totalSum
    })
  } else {
    countElix.value = lvlPers.value
  }
}

onMounted(() => {
  addCountElix()

})

watch(elixStats, (_) => {
  addCountElix()
})

const updateParam = (val, operation, count) => {
  return addParam.value.map((item) => {
    if (
      (operation === 'decrease' && item.key === val && item.count > 0) ||
      (operation === 'increase' && item.key === val)
    ) {
      return {
        ...item,
        count: operation === 'decrease' ? item.count - count : item.count + count
      }
    } else {
      return item
    }
  })
}

function subclassChecking(stat) {
  // проверяю на наличие записей о подклассе, для проверки возможности понижения стат
  if (props.classMinParam) {
    // оставляю только текущий стат
    const minParamClass = props.classMinParam.find(item => item.key === stat)

    // фильтрую, оставляю только текущий стат
    const statModule = listManeken.value.statModule.find(item => item.key === stat)
    if(minParamClass.count < statModule.summStatBase) {
      subclassCheck.value = true
    } else {

      subclassCheck.value = false
      idrebut.value++

    console.log(`Понижение не возможно, параметр '${minParamClass.key}' будет меньше требований подкласса: ${minParamClass.count} < ${statModule.summStatBase}`)
    }
  }
}

const handleStatChange = (val, operation, count) => {

  if (operation === 'decrease' && countElix.value >= 0 && countElix.value < lvlPers.value) {
    
    countElix.value += count
  } else if (operation === 'increase' && countElix.value > 0) {
    countElix.value -= count
  } else {
    console.log('Не достаточно эликсиров')
    return
  }
  const changeParam = updateParam(val, operation, count)
  store.commit('statChange/statChange', {
    addParam: [{ base: changeParam }],
    type: 'elixStats',
    idMannequin: props.idMannequin
  })
  addParam.value = changeParam
}

const handleStatDecrease = (val) => {
  subclassChecking(val)
  if(subclassCheck.value === true) {
    handleStatChange(val, 'decrease', 1)
  }
}

const handleStatIncrease = (val) => {
  handleStatChange(val, 'increase', 1)
}

const handleStatInputChange = (stat) => {
  const { key, statChange } = statInputChange({
    stat,
    statParams: props.statParams,
    accessibleStats: countElix.value
  })
  if(statChange < 0) {
    subclassChecking(key)
  }

  if(subclassCheck.value === true) {
    handleStatChange(key, 'increase', statChange)
    oldValueInput.value = false
  } else {
    oldValueInput.value = true
  }

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
  name: 'AddElixir'
}
</script>
