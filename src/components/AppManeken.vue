<template>
  <div class="dummy" v-if="dummy">
    <div class="dummy__part">
      <div
        v-for="(d, idx) in dummyPartLeft"
        class="parameter__mat__img"
        :key="`${d.location}_${d.name}${idx}`"
        :id="`${d.location}_${d.name}${idx}`"
      >
        <img :src="d.link" :alt="d.name" />
      </div>
    </div>

    <div class="dummy__center">
      <div class="dummy__center__top">
        <div
          v-for="(d, idx) in dummyPartCenterTop"
          class="parameter__mat__img parameter__mat__small"
          :key="`${d.location}_${d.name}${idx}`"
          :id="`${d.location}_${d.name}${idx}`"
        >
          <img :src="d.link" :alt="d.name" />
        </div>
      </div>

      <div class="dummy__center__center">
        <div class="options">
          <div class="options__itemBlock">
            <table class="table">
              <thead>
                <tr>
                  <td class="options__table__title" colspan="5"><h3>Манекен 1</h3></td>
                </tr>
                <tr v-if="accessibleStats !== 0">
                  <td class="options__table__title" colspan="5">
                    <small>Очки распределения:</small> {{ accessibleStats }}
                  </td>
                </tr>
              </thead>
              <tbody class="options__tbody">
                <tr>
                  <td>Параметры</td>
                  <td>Сумма</td>
                  <td>Базовые</td>
                  <td></td>
                  <td></td>
                </tr>

                <tr v-for="p in paramArr" :key="p.name">
                  <td>
                    <img :src="p.link" :alt="p.name" />
                    {{ p.name }}
                  </td>
                  <td>{{ p.summStatBase }}</td>
                  <td><input v-model="p.nameModel" class="options__input" /></td>
                  <td>
                    <button @click="statPlus(p.key)" class="button__reset">
                      <span class="material-symbols-outlined">stat_2</span>
                    </button>
                  </td>
                  <td>
                    <button @click="statMinus(p.key)" class="button__reset">
                      <span class="material-symbols-outlined">stat_minus_2</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="options__itemBlock">
            <div class="form">
              <form action="">
                <div class="form__items">
                  <select
                    class="form__input_rase select-css"
                    v-model="raseModel"
                    @change="changeRaseSelect"
                  >
                    <option value="change" disabled selected>Выбери расу</option>
                    <option value="human">Человек</option>
                    <option value="gnom">Гном</option>
                    <option value="elf">Эльф</option>
                    <option value="vampire">Вампир</option>
                    <option value="ork">Орк</option>
                    <option value="trol">Троль</option>
                  </select>

                  <select
                    v-model="lvlSelect"
                    @change="lvlSelectChange"
                    class="form__input_lvl select-css"
                  >
                    <option value="change" disabled selected>Выбери уровень</option>
                    <option v-for="l in optionLvl" :key="l">{{ l }}</option>
                  </select>
                </div>

                <div class="form__items">
                  <select class="form__input_rase select-css">
                    <option disabled selected>Крепость</option>
                    <option>Нет</option>
                    <option>Новичок</option>
                    <option>Продвинутый</option>
                    <option>Эксперт</option>
                    <option>Мастер</option>
                    <option>Грандмастер</option>
                  </select>
                </div>
                <div class="form__items">
                  <a href="#" class="form__link">Выпить эликсир</a>
                  <p>Выпито: 0</p>
                </div>
              </form>

              <div class="form__items">
                <input id="html" type="checkbox" />
                <label for="html">То что можно одеть</label>
                <a href="#" class="form__link">Сбросить все</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="dummy__center__buttom">
        <div
          v-for="(d, idx) in dummyPartCenterBottom"
          class="parameter__mat__img parameter__mat__Armor__img"
          :key="`${d.location}_${d.name}${idx}`"
          :id="`${d.location}_${d.name}${idx}`"
        >
          <img :src="d.link" :alt="d.name" />
        </div>
      </div>
    </div>

    <div class="dummy__part">
      <div
        v-for="(d, idx) in dummyPartRight"
        class="parameter__mat__img"
        :key="`${d.location}_${d.name}`"
        :id="`${d.location}_${d.name}${idx}`"
      >
        <img :src="d.link" :alt="d.name" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { baseStatFromLvl } from '../initialization/baseStatFromLvl'
import { modifyStat } from '../utils/modifyStat'

const props = defineProps({
  dummy: {
    type: Array,
    requared: true
  },
  paramArr: {
    type: Array,
    requared: true
  }
})
const emits = defineEmits({
  statChange: Array,
  changeRase: String,
  accessibleStats: Number
})

const raseModel = ref('human')
const lvlSelect = ref('change')
const accessibleStats = ref(0)
const optionLvl = 30
const baseStat = baseStatFromLvl()

const addParam = ref([
  { key: 'strong', count: 0 },
  { key: 'agility', count: 0 },
  { key: 'intelledgy', count: 0 },
  { key: 'luck', count: 0 },
  { key: 'reaction', count: 0 },
  { key: 'wisdom', count: 0 },
  { key: 'constitution', count: 0 },
  { key: 'dawn', count: 0 },
  { key: 'fullMoon', count: 0 },
  { key: 'astral', count: 0 }
])

//props
const dummyPartLeft = props.dummy.filter((d) => d.location === 'dummyPartLeft')
const dummyPartRight = props.dummy.filter((d) => d.location === 'dummyPartRight')
const dummyPartCenterTop = props.dummy.filter((d) => d.location === 'dummyPartCenterTop')
const dummyPartCenterBottom = props.dummy.filter((d) => d.location === 'dummyPartCenterBottom')
//

const lvlSelectChange = () => {
  accessibleStats.value = baseStat.find((l) => l.lvl === Number(lvlSelect.value)).stat
  addParam.value.map((p) => (p.count = 0))
  emits('statChange', addParam.value)
}

// emits
const changeRaseSelect = () => {
  emits('changeRase', {
    raseModel: raseModel.value,
    addParam: addParam.value,
  })
}

const modifyStatAndEmit = (statKey, increment) => {
  const { addParam: updatedAddParam, accessibleStats: updatedAccessibleStats } = modifyStat({
    accessibleStats: accessibleStats.value,
    addParam: addParam.value,
    statKey,
    increment
  });
  addParam.value = updatedAddParam;
  accessibleStats.value = updatedAccessibleStats;
  emits('statChange', addParam.value);
};

const statPlus = (statKey) => {
  modifyStatAndEmit(statKey, 1);
};
const statMinus = (statKey) => {
  modifyStatAndEmit(statKey, -1);
};


//
</script>

<script>
export default {
  name: 'AppManeken'
}
</script>
