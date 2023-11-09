<template>
  <div class="options__pivot options__itemBlock_pivot">


    <div 
    v-if="isLoading"
    class="accordeonContent">
    <table class="table">
      <thead></thead>
      <tbody class="options__tbody">
        <tr>
          <td></td>
          <td colspan="2" aria-label="{{ getLocalizedText('Dummy') }}">{{ getLocalizedText('Dummy') }} 1</td>
          <td colspan="2" aria-label="{{ getLocalizedText('Dummy') }}">{{ getLocalizedText('Dummy') }} 2</td>
        </tr>
        <tr>
          <th aria-label="{{ getLocalizedText('Parameters') }}">{{ getLocalizedText('Parameters') }}</th>
          <th aria-label="{{ getLocalizedText('Sum') }}">{{ getLocalizedText('Sum') }}</th>
          <th aria-label="{{ getLocalizedText('Base') }}">{{ getLocalizedText('Base') }}</th>
          <th aria-label="{{ getLocalizedText('Sum') }}">{{ getLocalizedText('Sum') }}</th>
          <th aria-label="{{ getLocalizedText('Base') }}">{{ getLocalizedText('Base') }}</th>
        </tr>
        <tr v-for="m in 7" :key="m">

          <td aria-label="{{ returnValue(1, m, 'name') }}"><img :src="returnValue(1, m, 'link')" :alt="returnValue(1, m, 'name')" width="18" height="18"> {{ returnValue(1, m, 'name') }}</td>
          <td aria-label="{{ getLocalizedText('Base') }}"> {{ returnValue(1, m, 'summStatBase') }} </td>
          <td aria-label="{{ getLocalizedText('Base') }}"> {{ returnValue(1, m, 'summStatBonusAndBase') }} </td>


          <td> {{ returnValue(2, m, 'summStatBase') }} </td>
          <td> {{ returnValue(2, m, 'summStatBonusAndBase') }} </td>
        </tr>
      </tbody>
    </table>

      <div @click="accordionOpen(1)" class="accordion" :class="{ accordionOpen: 1 }">
        <div class="accordionFace">
          <div class="button">{{ getLocalizedText('Armor') }}</div>
        </div>
      </div>

      <div @click="accordionOpen(2)" class="accordion" :class="{ accordionOpen: 2 }">
        <div class="accordionFace">
          <div class="button">{{ getLocalizedText('ProtectMagic') }}</div>
        </div>
      </div>


      <div @click="accordionOpen(3)" class="accordion" :class="{ accordionOpen: 3 }">
        <div class="accordionFace">
          <div class="button">{{ getLocalizedText('Cost') }}</div>
        </div>
      </div>


      <div @click="accordionOpen(4)" class="accordion" :class="{ accordionOpen: 4 }">
        <div class="accordionFace">
          <div class="button">{{ getLocalizedText('other') }}</div>
        </div>
      </div>


    </div>


    <div class="panel" :class="{ 'open': childAccordionOpen === 1 }">
        <PivotContent 
        :item1="param[0].armor"
        :item2="param[1].armor"
        :nemChar="getLocalizedText('Armor')"
         />
      </div>

      <div class="panel" :class="{ 'open': childAccordionOpen === 2 }">
        <PivotContent 
        :item1="param[0].protectionMagick"
        :item2="param[1].protectionMagick"
        :nemChar="getLocalizedText('ProtectMagic')"
         />
      </div>


      <div class="panel" :class="{ 'open': childAccordionOpen === 3 }">
        <PivotContent 
        :item1="ollСharCoast[0]"
        :item2="ollСharCoast[1]"
        :nemChar="getLocalizedText('Cost')"
        />
      </div>

      <div class="panel" :class="{ 'open': childAccordionOpen === 4 }">
        <PivotContent 
        :item1="genСharValOllMan[0]"
        :item2="genСharValOllMan[1]"
        />
      </div>


  </div>
</template>

<script setup>
import { ref} from 'vue'
import { useStore } from 'vuex'

import PivotContent from './use/PivotContent.vue';
import { getLocalizedText } from '@/locale/index'


defineEmits({})
defineProps({
})
const store = useStore()

const childAccordionOpen = ref(null)

const accordionOpen = (idx) => {
  childAccordionOpen.value = idx

}

const param = [
  { idMannequin: 1, stat: [], armor: [], protectionMagick: []},
  { idMannequin: 2, stat: [], armor: [], protectionMagick: []},
]

const genСharValOllMan = [[], []]
const ollСharCoast = [[], []]


function divisionType(id, arr, type) {
  const rezult = arr.filter(item => item.type === type);
  param[id - 1][type] = rezult;
}

const isLoading = ref(false)

function pivotDate() {
  for (let id = 1; id <= 2; id++) {
  const mannequin = store.getters['statModule'](id);

  const genСharVal = store.getters['listManekenSearch']({ id, element: 'genСharVal' })
  const ollCoast = store.getters['listManekenSearch']({ id, element: 'ollCoast' })

  divisionType(id, mannequin, 'stat');
  divisionType(id, mannequin, 'armor');
  divisionType(id, mannequin, 'protectionMagick');
  divisionType(id, mannequin, 'dstamina');

  genСharValOllMan[id - 1] = genСharVal
  ollСharCoast[id - 1] = ollCoast

}
isLoading.value = true
}

function returnValue(idMannequin, m, variable) {
  return param[idMannequin - 1].stat[m - 1][variable]
}

pivotDate()


</script>

<script>
export default {
  name: 'AppPivotTable'
}
</script>

<style scoped>
.accordion {
  margin-bottom: 20px;
}
.accordeonContent {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    width: 100%;
    background-color: #bbccd9bf;
    margin: 5px 7px;
    border-radius: 5px;
    padding-bottom: 15px;
}

.accordionFace {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.options__pivot {
  width: 100%;
}
.options__itemBlock_pivot {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.panel {
  margin-top: 15px;
  padding: 0 18px;
  max-height: 0;
  overflow: hidden;
  transition:
    max-height 0.5s ease-out,
    opacity 0.5s ease-out;
  opacity: 0; /* Начальная непрозрачность */
  transform: translateY(-10px); /* Начальное смещение */
  border-radius: 10px;
}

.open {
  height: fit-content;
  max-height: 1000px; /* Максимальная высота для открытой панели */
  opacity: 1; /* Полная непрозрачность */
  transform: translateY(0); /* Смещение отсутствует */
  transition:
    max-height 0.5s ease-out,
    opacity 0.5s ease-out,
    transform 0.5s ease-out;
}
</style>
