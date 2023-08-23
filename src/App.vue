<script setup>
import { ref } from 'vue'
import AppHeader from './components/AppHeader.vue';
import AppManeken from './components/AppManeken.vue'
import AppManekenRezult from './components/AppManekenRezult.vue'
import { baseDummyParams, basickParamsRase, baseParam } from './initialization/baseParams'
import ManeckenModal from './components/use/ManeckenModal.vue';


const dummy = baseDummyParams
const baseParamArr = ref(baseParam) // базовое значение конкретной расы, и их переменные, стартовое люди
const basickParams = ref(basickParamsRase) // поиск значений по расе
const paramArr = ref(baseParam) // передаю в таблицу итоговый суммарный результат
const isOpen = ref(false)

        // переменная для записи всех дополнительных значений, помимо  базовых, от всего шмота например.
const paramsPlus = ref([
            {key: 'strength_bonus', count: 0 },
            {key: 'dexterity_bonus', count: 0 },
            {key: 'intelligence_bonus', count: 0 },
            {key: 'luck_bonus', count: 0 },
            {key: 'reaction_bonus', count: 0 },
            {key: 'wisdom_bonus', count: 0 },
            {key: 'constitution_bonus', count: 0 },
  ])

function combinationParam(addParam, baseAndCommonStats) {
  return baseParamArr.value.map(baseItem => {
  const matchingAddParam = addParam.find(addItem => addItem.key === baseItem.key);
  // const matchingAddParamPlus = paramsPlus.value.find(addItem => addItem.key === baseItem.key);


  if (matchingAddParam) {
      if(baseAndCommonStats === 'areCommon') {
        return {  ...baseItem,
      summStatBase: baseItem.summStatBase + matchingAddParam.count,
      summStatBaseOll: baseItem.summStatBaseOll + matchingAddParam.count,
        }
      } else {
        return {  ...baseItem,
      summStatBaseOll: baseItem.summStatBaseOll + matchingAddParam.count,
        }
      }
  }

  return baseItem;
});
}
const statChange = ({ addParam, baseAndCommonStats = 'areCommon'}) => {
  paramArr.value = combinationParam(addParam, baseAndCommonStats)
}
const changeRase = ({ raseModel, addParam }) => {
  const raseParams = basickParams.value.find(r => r.rase === raseModel);

  if (raseParams) {
    const updatedParamArr = baseParamArr.value.map(p => {
      const matchingParam = raseParams.date.find(rp => rp.key === p.key);
      const matchingPlusParam = paramsPlus.value.find(pp => pp.key === p.key);

      let { summStatBase, summStatBaseOll } = p;

      if (matchingParam) {
        summStatBase = matchingParam.count;
        summStatBaseOll = matchingParam.count;
      }

      if (matchingPlusParam) {
        summStatBaseOll += matchingPlusParam.count;
      }

      return { ...p, summStatBase, summStatBaseOll };
    });

    baseParamArr.value = updatedParamArr;
    paramArr.value = combinationParam(addParam)
  }
}

const modalOpen = () => {
  isOpen.value = true
}

const isClose = () => {
  isOpen.value = false
}
// eslint-disable-next-line no-unused-vars
const components = {
  AppHeader,
  ManeckenModal,
  AppManekenRezult,
  AppManeken
}
</script>
<template>
  <div class="room-container">
    <div class="wrapper">
      <div class="conteiner">
        <ManeckenModal v-if="isOpen" @isClose="isClose"/>
        <AppHeader />
        
        <main class="main-wrapper">
          <AppManeken 
          v-if="dummy" 
          :dummy="dummy" 
          :paramArr="paramArr"
          @statChange="statChange"
          @changeRase="changeRase"
          @modalOpen="modalOpen"
          />
          <AppManekenRezult 
          v-if="paramArr" 
          :paramArr="paramArr"
          />
        </main>
      </div>
    </div>
  </div>
</template>