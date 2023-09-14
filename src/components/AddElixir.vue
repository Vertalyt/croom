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

    <select v-model="lastElix" @change="addLastElix" class="select-css">
      <option value="change" disabled selected>Випити останнім</option>
      <option v-for="e in lastElixParam" :key="e.key" :value="e.key">
        {{ e.name }}
      </option>
    </select>
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
  isCloseElix: null
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
const lvlPers = ref()
const lastElix = ref('change')

let availabilityFlag = true
let avaiStatFlag = true

const listStat = computed(() => store.getters['statChange/listStat'](props.idMannequin))
const elixStats = computed(() => listStat.value.find((item) => item.type === 'elixStats'))
const listManeken = computed(() => store.getters['listManeken'](props.idMannequin))
const oldValueInput = ref(true)
const idrebut = ref(1)

lvlPers.value = listManeken.value.lvl

// function addCountElix() {

//   if (elixStats.value) {
//     addParam.value = elixStats.value.param[0].base

//     let totalSum = 0

// const hasLastElix = elixStats.value.param[0].base.some(item => item.type === 'lastElix');
//  const hasSecolach = elixStats.value.param[0].base.some(item => item.dSecolach === true);


//     elixStats.value.param[0].base.forEach((item) => {
//       if (hasSecolach && item.dSecolach === true) {
//         totalSum += item.count - 3
//       }
//       else {
//         totalSum += item.count
//       }
//     })

//       if(hasSecolach && countElix.value > 0 && lvlPers.value - totalSum <= 21) {

//           countElix.value = 0 
//           return
//          else if (hasSecolach){
//           countElix.value = lvlPers.value - totalSum + 1
//           return
//         }
//       }
//     // Проверка на наличие "lastElix" и условие для countElix.value
//     if (hasLastElix) {
//       if (countElix.value > 0 && lvlPers.value - totalSum <= 3) {
//         countElix.value = 0
//         return
//       } else {
//         countElix.value = lvlPers.value - totalSum
//         return
//       }
//     }
//     countElix.value = lvlPers.value - totalSum
//   } else {
//     countElix.value = lvlPers.value
//   }
// }



function addCountElix() {
  if (!elixStats.value) {
    countElix.value = lvlPers.value;
    return;
  }

  addParam.value = elixStats.value.param[0].base
  const hasLastElix = elixStats.value.param[0].base.some(item => item.type === 'lastElix');
  const hasSecolach = elixStats.value.param[0].base.some(item => item.dSecolach === true);

  let totalSum = 0;

  elixStats.value.param[0].base.forEach((item) => {
    if (hasSecolach && item.dSecolach === true) {
      totalSum += item.count - 3;
    } else {
      totalSum += item.count;
    }
  });

  if (hasSecolach && countElix.value > 0 && lvlPers.value - totalSum <= 21) {
    countElix.value = 0;
  } else if (hasLastElix && (countElix.value > 0) && ((lvlPers.value - totalSum) <= 3)) {
    countElix.value = 0;
  } else {
    countElix.value = lvlPers.value - totalSum + (hasSecolach ? 1 : 0);
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
  let flag = true
  // проверяю на наличие записей о подклассе, для проверки возможности понижения стат
  if (props.classMinParam) {
    // оставляю только текущий стат
    const minParamClass = props.classMinParam.find((item) => item.key === stat)

    // фильтрую, оставляю только текущий стат
    const statModule = listManeken.value.statModule.find((item) => item.key === stat)
    if (minParamClass.count < statModule.summStatBase) {
      flag = true
    } else {
      flag = false
      idrebut.value++
      console.log(
        `Понижение не возможно, параметр '${minParamClass.key}' будет меньше требований подкласса: ${minParamClass.count} < ${statModule.summStatBase}`
      )
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

//получаю сами распредленные базовые статы
const baseParamManecken = computed(() => store.getters['listManekenBase'](props.idMannequin))

const handleStatDecrease = (val) => {
  availabilityFlag = checkStatRequirementsForClothing(
    props.idMannequin,
    baseParamManecken.value,
    val
  )
  avaiStatFlag = subclassChecking(val)

  if (availabilityFlag === true && avaiStatFlag === true) {
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

  if (statChange < 0) {
    availabilityFlag = subclassChecking(key)
    avaiStatFlag = checkStatRequirementsForClothing(props.idMannequin, baseParamManecken.value, key)
  }

  if (availabilityFlag === true && avaiStatFlag === true) {
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
    count: item.count - 3,
    type: 'elix'
  };
}

// Функция для увеличения счетчика "dSecolach" и установки флага
function increaseDsecolachCount(item) {
  return {
    ...item,
    count: item.count + 3,
    dSecolach: true
  };
}

// Функция для снижения счетчика "dSecolach" и установки флага в false
function decreaseDsecolachCount(item) {
  return {
    ...item,
    count: item.count - 3,
    dSecolach: false
  };
}

// Функция для обновления параметров
function updateParams(params, updateFunction) {
  return params.map(item => {
    if (updateFunction(item)) {
      return updateFunction(item);
    }
    return item;
  });
}

function removeOldLastElix() {
  addParam.value = updateParams(addParam.value, item => item.type === 'lastElix' ? decreaseLastElixCount(item) : item);
  addParam.value = updateParams(addParam.value, item => item.dSecolach === true ? decreaseDsecolachCount(item) : item);
}

const addLastElix = () => {
  removeOldLastElix();
  if (lastElix.value !== 'dSecolach') {
    const changeParam = updateParam(lastElix.value, 'increase', 3);
    const newParam = updateParams(changeParam, item => item.key === lastElix.value ? { ...item, type: 'lastElix' } : item);
    store.commit('statChange/statChange', {
      addParam: [{ base: newParam }],
      type: 'elixStats',
      idMannequin: props.idMannequin
    });
    addParam.value = newParam;
  } 

  if (lastElix.value === 'dSecolach' ) {
    addParam.value = updateParams(addParam.value, increaseDsecolachCount);
    store.commit('statChange/statChange', {
      addParam: [{ base: addParam.value }],
      type: 'elixStats',
      idMannequin: props.idMannequin
    });
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
