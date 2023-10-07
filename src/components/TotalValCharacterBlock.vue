<template>
  <div class="options__itemBlock options__itemBlock_button">
    <table class="table">
      <tbody>
        <tr v-for="p in nameCost" :key="p.key">
          <td>
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
const hpWithoutFortress = ref(0)
const fortressComputed = computed(() =>
  store.getters['listManekenSearch']({ id: props.idMannequin, element: 'fortress' }))

const lvlPers = computed(() => store.getters['listManeken'](props.idMannequin).lvl)
const statModule = computed(() => store.getters['statModule'](props.idMannequin))
const spells = computed(() =>
  store.getters['spells/spells'](props.idMannequin).find((el) => el.spellsList)
)

const nameCost = ref([
  {
    key: 'life',
    name: 'Життя',
    cost: 15,
    link: 'https://sabzero.biz/croomTemplate/assets/img/icon/svg/health.svg'
  },
  {
    key: 'mana',
    name: 'Мана',
    cost: 18,
    link: 'https://sabzero.biz/croomTemplate/assets/img/icon/svg/mana.svg'
  },
  {
    key: 'dstamina',
    name: 'Енергія',
    cost: 100,
    link: 'https://sabzero.biz/croomTemplate/assets/img/icon/svg/power.svg'
  },
  {
    key: 'rating',
    name: 'Рейтинг',
    cost: 6,
    link: 'https://sabzero.biz/croomTemplate/assets/img/icon/svg/rating.svg'
  }
])

function summRatingSpells(val) {
  // переменная для хранения общей суммы значений rating
  let totalRating = 0
  // Проход по всем элементам, если check === true считаем рейтинг
  val.forEach((category) => {
    for (const spellList of Object.values(category)) {
      for (const spell of spellList) {
        if (spell.check === true) {
          totalRating += parseInt(spell.rating)
        }
      }
    }
  })
  return totalRating
}

watch([fortressComputed, hpWithoutFortress], val => {
  if(val[0]) {
   const newLife = nameCost.value.find((item) => item.key === 'life')
   newLife.cost = Math.round(val[1] * Number(val[0].bonusHealthMutiplier))
  }
}, { immediate: true })

watch(
  spells,
  (val) => {
    spellsReiting.value = summRatingSpells(val.spellsList)
    rating.value += spellsReiting.value
  },
  { deep: true, immediate: true }
)

watch(rating, (val) => {
  nameCost.value.forEach((item) => {
    if (item.key === 'rating') {
      item.cost = Number(val)
    }
  })
}, { immediate: true })

let statSubclass = 0;
let armorSubclass = 0;
let protectionMagickSubClass = 0;

watch(statModule, (val) => {
  rating.value = ratingCalculation(val, lvlPers.value)

  const dwisdom = val.find(
    (item) => item.key === 'dwisdom'
  ).summStatBonusAndBase

  const dstamina = val.find(
    (item) => item.key === 'dstamina'
  ).summStatBonusAndBase


  const dconst = val.find(
    (item) => item.key === 'dconst'
  ).summStatBonusAndBase


  hpWithoutFortress.value = Math.round(5 * Number(dconst) * (1 + Number(lvlPers.value) / 10))

  nameCost.value.forEach((item) => {
    if (item.key === 'life') {
      item.cost = hpWithoutFortress.value
    }
    if (item.key === 'mana') {
      item.cost = Number(dwisdom) * 6
    }
    if (item.key === 'dstamina') {
      item.cost = Number(dstamina)
    }
  })
}, { immediate: true })


// убираю бонусф подкласса с рейтинга
function unscribeSubclass() {
statSubclass = 0;
armorSubclass = 0;
protectionMagickSubClass = 0;
const unscribeSubclass = store.getters['statChange/listStat'](props.idMannequin);
const unscribeSubclassParam = unscribeSubclass.find(item => item.type === 'subclass')?.param;
if (unscribeSubclassParam) {
  const unscribeSubclassParamBonusAndBase = unscribeSubclassParam.find(item => item.bonusAndBase).bonusAndBase
    const stat = ['dstrength', 'ddexterity', 'dintel', 'dluck', 'dreaction', 'dwisdom', 'dconst'];
  const armor = ['headarmor', 'bodyarmor', 'lefthandarmor', 'righthandarmor', 'lagsarmor'];
  const protectionMagick = ['whitemagicprotection', 'blackmagicprotection', 'astralmagicprotection'];
  unscribeSubclassParamBonusAndBase.forEach((obj) => {
    if (stat.includes(obj.key)) {
      statSubclass += Number(obj.count);
    } else if (armor.includes(obj.key)) {
      armorSubclass += Number(obj.count);
    } else if (protectionMagick.includes(obj.key)) {
      protectionMagickSubClass += Number(obj.count);
    }
  });
}
}
// подсчет рейтинга
function ratingCalculation(val, lvl) {
  // функция высчитывает бонусы подкласа для отнимания с ретийнга, он их не учитываает
  unscribeSubclass()
  let ollStat = 0
  let ollArmor = 0
  let ollProtectionMagick = 0
  let ollDstamina = 0
  // const rating_v1 = ((0.3*all_params)+(all_armor*0.1)+(all_defsmag*0.2) + ((dstamina -100)*3.6))*(1 + lvl/15) + RSPELLS1;
  // let ratingCoast = 0
  // Пройдемся по каждому объекту в массиве
  val.forEach((obj) => {
    if (obj.type === 'stat') {
      // Если тип "stat", умножаем на 3 и добавляем к общей сумме
      ollStat += Number(obj.summStatBonusAndBase )
      // ratingCoast += Number(obj.summStatBonusAndBase ) * 0.3
    } else if (obj.type === 'armor') {
      // Если тип "armor", просто записываем значение
      ollArmor += Number(obj.summStatBonusAndBase)
      // ratingCoast += Number(obj.summStatBonusAndBase) * 0.1
    } else if (obj.type === 'protectionMagick') {
      // Если тип "protectionMagick"
      ollProtectionMagick += Number(obj.summStatBonusAndBase)
      // ratingCoast += Number(obj.summStatBonusAndBase) * 0.2
    } 
    else if (obj.type === 'dstamina') {
      // Если тип "dstamina"
      ollDstamina += Number(obj.summStatBonusAndBase)
      // ratingCoast += Number(obj.summStatBonusAndBase) * 0.2
    }
  })

  const ollDstaminaMinusBaseCount = ollDstamina > 100 ? (ollDstamina - 100) * 3.6 : 0;
  // return Math.floor(ratingCoast * (1 + lvl/15))
  return Math.ceil((((ollStat - statSubclass) * 0.3) + ((ollArmor - armorSubclass) * 0.1) + ((ollProtectionMagick - protectionMagickSubClass) * 0.2) + ollDstaminaMinusBaseCount ) * (1 + lvl/15))
}
</script>

<script>
export default {
  name: 'TotalValCharacterBlock'
}
</script>
