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
import { ref, computed, watch } from 'vue'


const props = defineProps({
  idMannequin: {
    type: Number,
    required: true
  }
})

const store = useStore()
const spellsReiting = ref(0)
const rating = ref(0)

const listManeken = computed(() => store.getters['listManeken'](props.idMannequin))
const listStat = computed( () => store.getters['statChange/listStat'](props.idMannequin))
const spells = computed( () => store.getters['spells/spells'](props.idMannequin).find((el) => el.spellsList) )


const nameCost = ref([
  { key: 'life', name: 'Життя', cost: 15, link:'https://sabzero.biz/croomTemplate/assets/img/icon/svg/health.svg' },
  { key: 'mana', name: 'Мана', cost: 18, link:'https://sabzero.biz/croomTemplate/assets/img/icon/svg/mana.svg'  },
  { key: 'dstamina', name: 'Енергія', cost: 100, link:'https://sabzero.biz/croomTemplate/assets/img/icon/svg/power.svg'  },
  { key: 'rating', name: 'Рейтинг', cost: 6, link:'https://sabzero.biz/croomTemplate/assets/img/icon/svg/rating.svg'  }
])


function sunnRatingSpells(val) {
  // переменная для хранения общей суммы значений rating
let totalRating = 0;
// Пройдитесь по каждой категории магии
for (const category in val.spellsList) {
    if (Object.prototype.hasOwnProperty.call(val.spellsList, category)) {
        const spells = val.spellsList[category];

        // Пройдитесь по каждому заклинанию в текущей категории
        for (const spell of spells) {
            // Проверьте, есть ли ключ "check" и он равен true
            if (Object.prototype.hasOwnProperty.call(spell, "check") && spell.check === true) {
                // Если условие выполняется, добавьте значение "rating" к общей сумме
                totalRating += parseInt(spell.rating, 10);
            }
        }
    }
}
return totalRating
}

watch(spells, val => {
spellsReiting.value = sunnRatingSpells(val)
rating.value += spellsReiting.value
}, {deep : true}  )


watch(rating, val => {
  nameCost.value.forEach(item => {
    if(item.key === 'rating') {
      item.cost = val
    }
  })
})

watch(listManeken, (val) => {
  const lvl = val.lvl
  rating.value += ratingCalculation(val)
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
