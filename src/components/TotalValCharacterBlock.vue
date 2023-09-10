<template>
  <div class="options__itemBlock options__itemBlock_button">
    <table class="table">
      <tbody>
        <tr v-for="p in nameCost" :key="p.key">

          <td >
            <img :src="p.link" :alt="p.key" />
            {{ p.name }}
          </td>
          <td>{{ p.cost }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { ref, computed, watch, onMounted } from 'vue'
// import { fetchAPIData } from '../api/fetchApi'


const props = defineProps({
  idMannequin: {
    type: Number,
    required: true
  }
})

const store = useStore()

const listManeken = computed(() => store.getters['listManeken'](props.idMannequin))
const listStat = computed( () => store.getters['statChange/listStat'](props.idMannequin))

const nameCost = ref([
  { key: 'life', name: 'Життя', cost: 15, link:'https://sabzero.biz/croomTemplate/assets/img/icon/svg/health.svg' },
  { key: 'mana', name: 'Мана', cost: 18, link:'https://sabzero.biz/croomTemplate/assets/img/icon/svg/mana.svg'  },
  { key: 'dstamina', name: 'Енергія', cost: 100, link:'https://sabzero.biz/croomTemplate/assets/img/icon/svg/power.svg'  },
  { key: 'rating', name: 'Рейтинг', cost: 6, link:'https://sabzero.biz/croomTemplate/assets/img/icon/svg/rating.svg'  }
])
// const spells = ref([])

// const filtersClasses = ref({
//   category: 'spells'
// })

onMounted(async () => {
    // spells.value = await fetchAPIData(filtersClasses.value)
    // console.log(spells.value);
} )


watch(listManeken, (val) => {
  const lvl = val.lvl
  const rating = ratingCalculation(val)
  const dwisdom = listManeken.value.statModule.find((item) => item.key === 'dwisdom').summStatBonusAndBase
  const dconst = listManeken.value.statModule.find((item) => item.key === 'dconst').summStatBonusAndBase
  const hp = Math.round((5*Number(dconst))*(1+(Number(lvl)/10)));

  nameCost.value.forEach(item => {
    if(item.key === 'life') {
      item.cost = hp
    }
    if(item.key === 'mana') {
      item.cost = Number(dwisdom) * 6
    }
    if(item.key === 'rating') {
      item.cost = rating
    }
  })
})

watch(listStat, val => {
  const totalEnergy = val.reduce((total, item) => {
    const bonusStat = item.param.find(characteristics => characteristics.bonusAndBase);
    if (bonusStat) {
      const energy = bonusStat.bonusAndBase.find(d => d.key === 'dstamina');
      total += energy ? energy.count : 0;
    }
    return total;
  }, 0);

  nameCost.value.forEach(item => {
    if (item.key === 'dstamina') {
      item.cost = 100 + totalEnergy;
    }
  });
});


function ratingCalculation(val) {

 // const rating_v1 = ((0.3*all_params)+(all_armor*0.1)+(all_defsmag*0.2))*(1 + lvl/15) + RSPELLS1;
  let rating = 0
  // Пройдемся по каждому объекту в массиве
  val.statModule.forEach((obj) => {
    if (obj.type === 'stat') {
      // Если тип "stat", умножаем на 3 и добавляем к общей сумме
      rating += obj.summStatBase * 0.3
    } else if (obj.type === 'armor') {
      // Если тип "armor", просто записываем значение
      rating += obj.summStatBase * 0.1
    } else if (obj.type === 'protectionMagick') {
      // Если тип "protectionMagick"
        rating += obj.summStatBase * 0.2
    }
  })
  return Math.floor(rating)
}
</script>

<script>
export default {
  name: 'TotalValCharacterBlock'
}
</script>
