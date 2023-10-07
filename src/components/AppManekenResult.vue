<template>
  <div class="dummy__rezult">
    <div class="options__itemBlock options__itemBlock_button">
      <ManekenStatParams :statParams="statParams" :additionalCheck="true">
        <template #statManeken="{ summBase }">
          <ManekenResultSlot :statParam="summBase" />
        </template>
      </ManekenStatParams>
    </div>
    
    <div class="options__itemBlock options__itemBlock_button">
      <div class="armor__title"><h3>{{ getLocalizedText('Armor') }}</h3></div>

      <ParamItemsManeken :paramItems="finalyArmor" :withItemsManecken="true" />

      <ParamItemsManeken :paramItems="magicParams" :withItemsManecken="false" />

    </div>

    <TotalValCharacterBlock :idMannequin="idMannequin" />

    <div class="options__itemBlock options__itemBlock_button">
      <table class="table">
        <thead>
          <td class="options__table__title" colspan="5"><h3>{{ getLocalizedText('Cost') }}</h3></td>
        </thead>
        <tbody>
          <tr>
            <td v-for="n in nameCost" :key="n.name">{{ n.name }}</td>
          </tr>
          <tr>
            <td v-for="n in nameCost" :key="n.key">{{ n.cost }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, ref } from 'vue'
import ManekenStatParams from './ManekenStatParams.vue'
import ManekenResultSlot from './use/slots/ManekenResultSlot.vue'
import ParamItemsManeken from './use/ParamItemsManeken.vue'
import TotalValCharacterBlock from './TotalValCharacterBlock.vue'

import { useStore } from 'vuex'
import { totalCostCloth } from '../utils/totalCostCloth'
import { getLocalizedText } from '@/locale/index'


const props = defineProps({
  updatedStatConfigurations: {
    type: Array,
    required: true
  },
  idMannequin: {
    type: Number,
    required: true
  }
})

const store = useStore()


const nameCost = ref([
  {key: 'price', name: getLocalizedText('Tall'), cost: 0},
  {key: 'goldprice', name: getLocalizedText('GoldTall'), cost: 0},
  {key: 'ratnikprice', name: getLocalizedText('Warrior'), cost: 0},
  {key: 'obmenprice', name: getLocalizedText('Exchanges'), cost: 0},
  {key: 'reliktprice', name: getLocalizedText('Relics'), cost: 0},
])



// Computed properties для улучшенной читаемости
const statParams = computed(() => props.updatedStatConfigurations.filter((d) => d.type === 'stat'))
const armorParams = computed(() => props.updatedStatConfigurations.filter((d) => d.type === 'armor'))
const magicParams = computed(() => props.updatedStatConfigurations.filter((d) => d.type === 'protectionMagick'))
const priseInfo = computed( () => store.getters['statChange/priseInfoCloth'](props.idMannequin))


const armorMasteryComputed = computed(() =>
  store.getters['listManekenSearch']({ id: props.idMannequin, element: 'armorMastery' }))

  const finalyArmor = ref()

  watch([armorParams, armorMasteryComputed], val => {
    finalyArmor.value = val[0]
    if(val[1]) {
      finalyArmor.value = finalyArmor.value.map( item => {
        return {
          ...item,
          summStatBonusAndBase: Math.floor(item.summStatBonusAndBase * val[1].bonusArmorMutiplier)
        }
      })
    }
}, { immediate: true })


const totalPriseInfo = ref([]);
watch(priseInfo, val => {
  totalPriseInfo.value = totalCostCloth(val);

  nameCost.value.forEach(item => {
    const priseFind = totalPriseInfo.value.find(priсe => Object.prototype.hasOwnProperty.call(priсe, item.key));
    if (priseFind) {
      item.cost = priseFind[item.key].toFixed(2);
    }
  });
});




</script>

<script>
export default {
  name: 'AppManekenResult'
}
</script>
