<script setup>
import { ref, computed, watch } from 'vue'
import AppHeader from '@/components/appHeader.vue'
import AppManeken from './components/AppManeken.vue'
import AppManekenResult from './components/AppManekenResult.vue'
import AppNotification from './components/AppNotification.vue'

import { basickParamsRase, baseStatModule } from './initialization/baseParams'
import ManeckenModal from './components/use/ManeckenModal.vue'
import { aggregateStatValues } from './utils/aggregateStatValues'
import { useStore } from 'vuex'

const basickParams = ref(basickParamsRase) // поиск значений по расе
const store = useStore()
const idMannequin = ref(1); // айди манекена, в будущем буду менять в зависимости от манекена
const updatedStatConfigurations = ref(baseStatModule) // передаю в таблицу итоговый суммарный результат
const isOpen = ref(false)
const cellOptions = ref()

const baseManekenConfig = computed( () => store.getters['listManeken'](idMannequin.value));// базовое значение конкретной расы, и их переменные, стартовое люди
const raseParams = ref(baseManekenConfig.value.raseParams)
const baseStatConfigurations = ref(baseManekenConfig.value.statModule)
const lvlPerson = ref(0)

const listStat = computed(() => store.getters['statChange/listStat'](idMannequin.value)) // слежу за массивом, который хранит в себе все обьекты изменения стат
const rezetManecken = ref(0)

const mannequinChange = (val) => {
  idMannequin.value = val
  raseParams.value = baseManekenConfig.value.raseParams
  baseStatConfigurations.value = baseManekenConfig.value.statModule
  lvlPerson.value = baseManekenConfig.value.lvl
  rezetManecken.value++
}

function updateBaseConfigAndStats(newBaseConfig, idMannequin, lvl) {
  const updatedConfigurations = newBaseConfig.map((i) => {
    const updatedStats = baseManekenConfig.value.raseParams
      ? {
          summStatBase: baseManekenConfig.value.raseParams.find((param) => param.key === i.key)?.count || i.summStatBase,
          summStatBonusAndBase: baseManekenConfig.value.raseParams.find((param) => param.key === i.key)?.count || i.summStatBonusAndBase
        }
      : {};
    return {
      ...i,
      ...updatedStats
    };
  });

  const { arrUpdate } = aggregateStatValues({
    baseUpdate: updatedConfigurations,
    idMannequin,
  });

  updatedStatConfigurations.value = arrUpdate;

  store.commit('updateManekenInfo', { idMannequin, statModule: arrUpdate, lvl });
}

watch([raseParams, listStat], _ => {

  const newBaseConfig = baseStatConfigurations.value.map((i) => ({ ...i }));
  updateBaseConfigAndStats(newBaseConfig, idMannequin.value, lvlPerson.value);
}, { deep: true });


const updateLvl = (lvl) => {
  lvlPerson.value = lvl;
  const newBaseConfig = baseStatConfigurations.value.map((i) => ({ ...i }));
  updateBaseConfigAndStats(newBaseConfig, idMannequin.value, lvl);
}

const changeRase = ({ raseModel }) => {
  //получаю все данные по ноой рассе
  raseParams.value = basickParams.value.find((r) => r.availableRaces === raseModel).date
  store.commit('updateManekenInfo', { 
    raseParams : raseParams.value,
    raseName: raseModel,
    idMannequin : idMannequin.value })
}

const modalOpen = (param) => {
  cellOptions.value = param
  isOpen.value = true
}
const isClose = () => {
  isOpen.value = false
}

const minstats = computed(() => {
  return updatedStatConfigurations.value
    .filter((stat) => typeof stat.summStatBase !== 'undefined' && stat.summStatBase !== 0)
    .map((stat) => {
      return {
        minKey: stat.minKey,
        summStatBase: stat.summStatBase
      }
    })
})

const lvlSearch = ref([
  { id: 'minLvl', count: 'change' },
  { id: 'maxLvl', count: 'change' }
])

const minLvl = ref(lvlSearch.value[0].count)
const maxLvl = ref(lvlSearch.value[1].count)

const handleLvlMinMaxChange = ({lvlMinMax, id}) => {
  lvlSearch.value = lvlMinMax
  const foundTypeLvl = lvlMinMax.find(item => item.id === id)
  if(foundTypeLvl.id === 'minLvl') {
    minLvl.value = foundTypeLvl.count
  } else {
    maxLvl.value = foundTypeLvl.count
  }
}



</script>


<template>
  <div class="room-container">
    <AppNotification />
    <div class="wrapper">
      <div class="conteiner">
        <ManeckenModal
          v-if="isOpen"
          :lvlPerson="lvlPerson"
          :cellOptions="cellOptions"
          :minStats="minstats"
          :idMannequin="idMannequin"
          :minLvl="minLvl"
          :maxLvl="maxLvl"
          :lvlSearch="lvlSearch"
          @isClose="isClose"
          @lvlMinMaxChange="handleLvlMinMaxChange"
        />
        <AppHeader 
        @mannequinChange="mannequinChange"
        />

        <main class="main-wrapper">
          <AppManeken
            :updatedStatConfigurations="updatedStatConfigurations"
            :idMannequin="idMannequin"
            @changeRase="changeRase"
            @modalOpen="modalOpen"
            @updateLvl="updateLvl"

          />
          <AppManekenResult
            v-if="updatedStatConfigurations"
            :updatedStatConfigurations="updatedStatConfigurations"
            :idMannequin="idMannequin"
          />
        </main>
      </div>
    </div>
  </div>
</template>
