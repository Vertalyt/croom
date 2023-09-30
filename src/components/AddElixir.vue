<template>
  <div class="modal" @click.stop="isClose"></div>
  <div class="modal-content">
    <span @click="isClose" class="close">&times;</span>
    <h3>Доступно: {{ countElix }} | Использовано: {{ numberDrinks }}</h3>
    <ManekenStatParams
      :statParams="statParams"
      :elixCheck="true"
      :inputShow="true"
    >
      <template #statManeken="{ summBase }">
        <ManekenSlot
          :hasddisabledLastElix="hasddisabledLastElix"
          :key="idrebut"
          :elixShow="true"
          :classCheck="availabilityFlag"
          :statParam="summBase"
          :addElix="addParam"
          :accessibleStats="countElix"
          @handleStatDecrease="handleStatDecrease"
          @handleStatIncrease="handleStatIncrease"
          @handleStatInputChange="handleStatInputChange"
        />
      </template>
    </ManekenStatParams>

    <div class="form__items">
      <select 
      name="addLastElix"
      :disabled="hascountElix" v-model="lastElix" @change="addLastElix" class="select-css select-css-elix">
        <option value="change" disabled selected>Випити останнім</option>
        <option v-for="e in lastElixParam" :key="e.key" :value="e.key">
          {{ e.name }}
        </option>
      </select>
      <div>
        <div class="checkbox">
          <button
            :disabled="!hasLastElix"
            @click="resetLostElix"
            class="tab-button maneckenBtn"
            :class="{ 'tab-button-disabled': !hasLastElix }"
          >
            <p class="p__tab-button p__tab-button-elix">Обнулення мікстур</p>
          </button>
        </div>
        <div class="checkbox">
          <button
            :disabled="MAX_ELIX_FOR_LVL - countElix === 0"
            @click="resetElix"
            class="tab-button maneckenBtn"
            :class="{ 'tab-button-disabled': MAX_ELIX_FOR_LVL - countElix === 0 }"
          >
            <p class="p__tab-button p__tab-button-elix">Скинути еліксири</p>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ManekenSlot from './use/slots/ManekenSlot.vue'
import ManekenStatParams from '../components/Manekenstatparams.vue'
import { useStore } from 'vuex'
import { computed, ref, onMounted, watch } from 'vue'
import { statInputChange } from '../utils/modifyStat'
import { checkStatRequirementsForClothing } from '../utils/modifyStat'

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
  classMinParam: {
    type: Object,
    requared: true
  }
})
const emits = defineEmits({
  isCloseElix: null,
  numberDrinks: [Number, null]
})
// массив с изменениями параметров
const addParam = ref([
  { key: 'dstrength', count: 0, type: 'elix' },
  { key: 'ddexterity', count: 0, type: 'elix' },
  { key: 'dintel', count: 0, type: 'elix' },
  { key: 'dluck', count: 0, type: 'elix' },
  { key: 'dreaction', count: 0, type: 'elix' },
  { key: 'dwisdom', count: 0, type: 'elix' },
  { key: 'dconst', count: 0, type: 'elix' }
])

const lastElixParam = [
  { key: 'dstrength', name: 'Настій сили', type: 'lastElix' },
  { key: 'ddexterity', name: 'Настій ловкості', type: 'lastElix' },
  { key: 'dintel', name: 'Настій інтелект', type: 'lastElix' },
  { key: 'dluck', name: 'Настій удачи', type: 'lastElix' },
  { key: 'dreaction', name: 'Настій реакції', type: 'lastElix' },
  { key: 'dwisdom', name: 'Настій мудрості', type: 'lastElix' },
  { key: 'dconst', name: 'Настій Статури', type: 'lastElix' },
  { key: 'dSecolach', name: 'Еліксир Секолаха', type: 'elixSecolah' }
]

const store = useStore()
const countElix = ref(0)
const hasLastElix = ref(false)
const hasddisabledLastElix = ref(false)
const lastElix = ref('change')
const COUNT_STAT_MIXTURE = 3
let availabilityFlag = true
let avaiStatFlag = true

const listStat = computed(() => store.getters['statChange/listStat'](props.idMannequin))
const elixStats = computed(() => listStat.value.find((item) => item.type === 'elixStats'))
const listManeken = computed(() => store.getters['listManeken'](props.idMannequin))
//получаю сами распредленные базовые статы
const baseParamManecken = computed(() => store.getters['listManekenBase'](props.idMannequin))


// флаг перерисовки ManekenSlot
const oldValueInput = ref(true)
// идентификатор перерисовки ManekenSlot
const idrebut = ref(1)
const hascountElix = ref(false)

// возможное количество эликсиров
const MAX_ELIX_FOR_LVL = ref(listManeken.value.lvl * 3 + 1)
// функция расчета и перерасчета свободных стат эликсиров


const numberDrinks = computed(() => MAX_ELIX_FOR_LVL.value - countElix.value  )

watch(numberDrinks, val => {
  emits('numberDrinks', val)
})


function addCountElix() {
  if (!elixStats.value) {
    countElix.value = MAX_ELIX_FOR_LVL.value
    return
  }

  addParam.value = elixStats.value.param[0].base
  hasLastElix.value = elixStats.value.param[0].base.some((item) => item.type === 'lastElix')
  const hasSecolach = elixStats.value.param[0].base.some((item) => item.dSecolach === true)

  let totalSum = 0
  elixStats.value.param[0].base.forEach((item) => {
    if (hasSecolach && item.dSecolach === true) {
      totalSum += item.count
    } else {
      totalSum += item.count
    }
  })
  if (hasSecolach && totalSum > MAX_ELIX_FOR_LVL.value) {
    countElix.value = 0
    hasddisabledLastElix.value = true
    hascountElix.value = true
  } else if (hasLastElix.value && totalSum > MAX_ELIX_FOR_LVL.value) {
    countElix.value = 0
    hasddisabledLastElix.value = true
    return
  } else {
    countElix.value = MAX_ELIX_FOR_LVL.value - totalSum
  }
}

onMounted(() => {
  addCountElix()
  if (countElix.value === 0) {
    hascountElix.value = true
  }
})

watch(elixStats, (_) => {
  addCountElix()
})

// изменяю значение в addParam.value при выпитом или отнятом обычном постоянном эликсире
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
  let flag = true
  // проверяю на наличие записей о подклассе, для проверки возможности понижения стат
  if (props.classMinParam) {
    // оставляю только текущий стат в минимальных параметрах класса
    const minParamClass = props.classMinParam.find((item) => item.key === stat)

    // фильтрую, оставляю только текущий стат в базовых статах манекена
    const statModule = listManeken.value.statModule.find((item) => item.key === stat)
    if (minParamClass.count < statModule.summStatBase) {
      flag = true
    } else {
      flag = false
      idrebut.value++
      store.dispatch('setMessage', `Понижение не возможно, параметр '${minParamClass.key}' будет меньше требований подкласса: ${minParamClass.count} < ${statModule.summStatBase}`)
    }
  }
  return flag
}

const handleStatChange = (val, operation, count) => {
  const changeParam = updateParam(val, operation, count)

  store.commit('statChange/statChange', {
    addParam: [{ base: changeParam }],
    type: 'elixStats',
    idMannequin: props.idMannequin
  })
  addParam.value = changeParam
}

const handleStatDecrease = (val) => {
  const hasLastElix = addParam.value.find((item) => item.type === 'lastElix' && item.key === val)
  const hasSecolach = addParam.value.find((item) => item.dSecolach === true && item.key === val)
  let availabilityElixFlag = true

  if (hasLastElix) {
    availabilityElixFlag =
      hasLastElix.count > COUNT_STAT_MIXTURE
        ? true
        : (store.dispatch('setMessage', `Оставшиеся очки стата дает эликсир`), false)
  }

  if (hasSecolach) {
    availabilityElixFlag = hasSecolach.count > COUNT_STAT_MIXTURE
  } else if (hasLastElix && hasLastElix.key === val) {
    availabilityElixFlag = hasLastElix.count > COUNT_STAT_MIXTURE
  }
  if (!availabilityElixFlag)  store.dispatch('setMessage', 'Оставшиеся очки стата дает эликсир')


  // проверка на минимальные параметры вещей
  availabilityFlag = checkStatRequirementsForClothing(
    props.idMannequin,
    baseParamManecken.value,
    val
  )
  // проверка на минимальные параметры подкласса
  avaiStatFlag = subclassChecking(val)

  if (availabilityFlag && avaiStatFlag && availabilityElixFlag) {
    handleStatChange(val, 'decrease', 1)
  }
}

const handleStatIncrease = (val) => {
  if (countElix.value - 1 >= 0) {
    handleStatChange(val, 'increase', 1)
  }
}

function lastElixStatCoast(statChange, key) {
  const hasLastElix = addParam.value.find((item) => item.type === 'lastElix' && item.key === key)
  const hasSecolach = addParam.value.find((item) => item.dSecolach === true && item.key === key)

  if (hasLastElix) {
    const count = hasLastElix.count - COUNT_STAT_MIXTURE - Math.abs(statChange)
    if (count <= COUNT_STAT_MIXTURE) {
      return -(hasLastElix.count - COUNT_STAT_MIXTURE)
    } else return statChange
  }

  if (hasSecolach) {
    const count = hasSecolach.count - COUNT_STAT_MIXTURE - Math.abs(statChange)
    if (count <= COUNT_STAT_MIXTURE) {
      return -(hasSecolach.count - COUNT_STAT_MIXTURE)
    } else return statChange
  }

  return statChange
}

function maxiAvailableValueElixirs(statChange, key) {
  const availabilityQuantity = addParam.value.find((item) => item.key === key).count
  if (availabilityQuantity < Math.abs(statChange)) {
    return -availabilityQuantity
  } else return statChange
}

const handleStatInputChange = (stat) => {
  // получаю значениен ключа и фактическую разницу для изменения стата
  let { key, statChange } = statInputChange({
    stat,
    statParams: props.statParams,
    accessibleStats: countElix.value
  })

  // считаю логику для отрицательных изменений
  if (statChange < 0) {
    // проверяю на наличие записей о последних эликсирах, считаю необходимсть изменения количества стат
    statChange = lastElixStatCoast(statChange, key)

    // высчитываю необходимость понижения очков в statChange от количества в availabilityQuantity
    statChange = maxiAvailableValueElixirs(statChange, key)
    availabilityFlag = subclassChecking(key)
    avaiStatFlag = checkStatRequirementsForClothing(props.idMannequin, baseParamManecken.value, key)
  }

  if (availabilityFlag && avaiStatFlag) {
    const editCoastElix = countElix.value - statChange
    if (editCoastElix < 0) {
      statChange = statChange - editCoastElix
    }

    handleStatChange(key, 'increase', statChange)
    oldValueInput.value = false
  } else {
    oldValueInput.value = true
    idrebut.value++
  }
}

// Функция для уменьшения счетчика "lastElix" и сброса типа
function decreaseLastElixCount(item) {
  return {
    ...item,
    count: item.count - COUNT_STAT_MIXTURE,
    type: 'elix'
  }
}

// Функция для увеличения счетчика "dSecolach" и установки флага
function increaseDsecolachCount(item) {
  return {
    ...item,
    count: item.count + COUNT_STAT_MIXTURE,
    dSecolach: true
  }
}

// Функция для снижения счетчика "dSecolach" и установки флага в false
function decreaseDsecolachCount(item) {
  return {
    ...item,
    count: item.count - COUNT_STAT_MIXTURE,
    dSecolach: false
  }
}

// Функция для обновления параметров
function updateParams(params, updateFunction) {
  return params.map((item) => {
    if (updateFunction(item)) {
      return updateFunction(item)
    }
    return item
  })
}

const resetLostElix = () => {
  removeOldLastElix()
  store.commit('statChange/statChange', {
    addParam: [{ base: addParam.value }],
    type: 'elixStats',
    idMannequin: props.idMannequin
  })
  lastElix.value = 'change'
  hascountElix.value = false
  hasddisabledLastElix.value = false
  idrebut.value++
}

const resetElix = () => {
  addParam.value = addParam.value.map((item) => {
    return {
      ...item,
      count: 0,
      type: 'elix',
      dSecolach: false
    }
  })

  store.commit('statChange/statChange', {
    addParam: [{ base: addParam.value }],
    type: 'elixStats',
    idMannequin: props.idMannequin
  })
  lastElix.value = 'change'
  hascountElix.value = false
  hasddisabledLastElix.value = false
  idrebut.value++
}

function removeOldLastElix() {
  addParam.value = updateParams(addParam.value, (item) =>
    item.type === 'lastElix' ? decreaseLastElixCount(item) : item
  )
  addParam.value = updateParams(addParam.value, (item) =>
    item.dSecolach === true ? decreaseDsecolachCount(item) : item
  )
}

const addLastElix = () => {
  // проверяю перед изменением наличие старых эликсиров и сбрасываю значение
  removeOldLastElix()
  if (lastElix.value !== 'dSecolach') {
    const changeParam = updateParam(lastElix.value, 'increase', COUNT_STAT_MIXTURE)
    const newParam = updateParams(changeParam, (item) =>
      item.key === lastElix.value ? { ...item, type: 'lastElix' } : item
    )
    store.commit('statChange/statChange', {
      addParam: [{ base: newParam }],
      type: 'elixStats',
      idMannequin: props.idMannequin
    })
    addParam.value = newParam
  }

  if (lastElix.value === 'dSecolach') {
    addParam.value = updateParams(addParam.value, increaseDsecolachCount)
    store.commit('statChange/statChange', {
      addParam: [{ base: addParam.value }],
      type: 'elixStats',
      idMannequin: props.idMannequin
    })
  }
}

const isClose = () => {
  emits('isCloseElix')
}
</script>

<script>
export default {
  name: 'AddElixir'
}
</script>

<style scoped>

.p__tab-button-elix {
  font-size: 12px;
  line-height: 14px;
}

@media screen and (max-width: 400px) {

  p {
    padding: 2px 5px;
}

.select-css-elix {
  padding: 2px 20px 2px 5px;
}

}
</style>
