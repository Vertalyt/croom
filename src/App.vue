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
const cellOptions = ref()

        // переменная для записи всех дополнительных значений, помимо  базовых, от всего шмота например.
const paramsPlus = ref([
            {key: 'dstrength', count: 0 },
            {key: 'ddexterity', count: 0 },
            {key: 'dintel', count: 0 },
            {key: 'dluck', count: 0 },
            {key: 'dreaction', count: 0 },
            {key: 'dwisdom', count: 0 },
            {key: 'dconst', count: 0 },
  ])

function combinationParam(addParam, baseAndCommonStats) {
  return baseParamArr.value.map(baseItem => {
  const matchingAddParam = addParam.find(addItem => addItem.key === baseItem.key);
  // const matchingAddParamPlus = paramsPlus.value.find(addItem => addItem.key === baseItem.key);


  if (matchingAddParam) {
      if(baseAndCommonStats === 'areCommon') {
        return {  ...baseItem,
      summStatBase: baseItem.summStatBase + matchingAddParam.count,
      summStatOll: baseItem.summStatOll + matchingAddParam.count,
        }
      } else {
        return {  ...baseItem,
      summStatOll: baseItem.summStatOll + matchingAddParam.count,
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

      let { summStatBase, summStatOll } = p;

      if (matchingParam) {
        summStatBase = matchingParam.count;
        summStatOll = matchingParam.count;
      }

      if (matchingPlusParam) {
        summStatOll += matchingPlusParam.count;
      }

      return { ...p, summStatBase, summStatOll };
    });

    baseParamArr.value = updatedParamArr;
    paramArr.value = combinationParam(addParam)
  }
}

const modalOpen = (param) => {
  cellOptions.value = param
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
        <ManeckenModal v-if="isOpen" :cellOptions="cellOptions"  @isClose="isClose" />
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