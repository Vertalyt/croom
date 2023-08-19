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
              </thead>
              <tbody class="options__tbody">
                <tr>
                  <td>Параметри</td>
                  <td>Сума</td>
                  <td>Базові</td>
                  <td></td>
                  <td></td>
                </tr>

                <tr v-for="p in paramStatArr" :key="p.name">
                  <td>
                    <img :src="p.link" :alt="p.name" />
                    {{ p.name }}
                  </td>
                  <td>{{ p.summStatBase }}</td>
                  <td><input
                    :disabled="accessibleStats === null"
                    @change="statInputShange(p)"
                    v-model="p.nameModel" 
                    class="options__input" /></td>
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
                <tr v-if="accessibleStats !== null">
                  <td class="options__table__title" colspan="5">
                    <small>Очки розподілу:</small> {{ accessibleStats }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="options__itemBlock">

                <div class="form__items">
                  <select
                    class="form__input_left select-css"
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
                    class="form__input select-css"
                  >
                    <option value="change" disabled selected>Выберіть рівень</option>
                    <option v-for="l in optionLvl" :key="l">{{ l }}</option>
                  </select>
                </div>

                <div class="form__items">

                  <!-- <select 
                    v-model="classModel"
                    @change="changeClass"
                  class="form__input_left select-css"
                  >
                    <option value="none" selected>Нема</option>
                    <option value="barbarian" >Варвар</option>
                    <option value="juggernaut" >Джагернаут</option>
                    <option value="priest" >Жрець</option>
                    <option value="magician" >Маг</option>
                    <option value="shieldmaster" >Мастер щита</option>
                    <option value="ranger" >Рейнджер</option>
                  </select> -->

                  <select class="form__input select-css">
                    <option disabled selected>Крепость</option>
                    <option>Нема</option>
                    <option>Новичок</option>
                    <option>Продвинутий</option>
                    <option>Експерт</option>
                    <option>Мастер</option>
                    <option>Грандмастер</option>
                  </select>
                </div>


                <div class="form__items">
                  <a href="#" class="form__link">Випити еліксир</a>
                  <p>Випито: 0</p>
                </div>

              <div class="form__items">
                <input id="html" type="checkbox" />
                <label for="html">Те, що можна одягнути</label>
                <a 
                @click="rezetManecken"
                href="#" 
                class="form__link">Скинути все</a>
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
import { ref, computed } from 'vue'
import { baseStatFromLvl } from '../initialization/baseStatFromLvl'
import { modifyStat } from '../utils/modifyStat'
import { classParams } from '../initialization/baseParams'

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
})

const raseModel = ref('human')
const lvlSelect = ref('change')
const accessibleStats = ref(null)
const optionLvl = 30
const baseStat = baseStatFromLvl()
const classModel = ref('none')
const OllParamClass = classParams 

// массив с изменениями параметров базовых стат
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

// сдежение за изменением суммарного массива paramArr
const paramStatArr =  computed(() => props.paramArr.filter((d) => d.type === 'stat') )  

// emits
// сброс массива addParam изменения стат при смене уровня
const lvlSelectChange = () => {
  accessibleStats.value = baseStat.find((l) => l.lvl === Number(lvlSelect.value)).stat
  addParam.value.map((p) => (p.count = 0))
  emits('statChange', addParam.value)
}

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
  modifyStatAndEmit(statKey, Number(1));
};
const statMinus = (statKey) => {
  modifyStatAndEmit(statKey, Number(-1));
};

const statInputShange = (stat) => {
  const oldBaseStat = paramStatArr.value.find(s => s.key === stat.key).summStatBase // ищу предыдущие значение стата 
  let statChange = Number(stat.nameModel) - Number(oldBaseStat) //высчитываю разницу, на которое буду изменять
  if(accessibleStats.value < statChange) {
    statChange = accessibleStats.value // при избыточной разнице
  }
  modifyStatAndEmit(stat.key, statChange);
}

const rezetManecken = () => {
  addParam.value.map((p) => (p.count = 0))
  emits('changeRase', {
    raseModel: 'human',
    addParam: addParam.value,
  })
  raseModel.value = 'human'
  lvlSelect.value = 'change'
  accessibleStats.value = null
  classModel.value = 'none'
}

const changeClass = () => {
  const gameClass = OllParamClass.find(c => c.class === classModel.value)
  if(!gameClass) {
    console.log('Клас не выбран');
    return
  }
  console.log(gameClass);
  if(lvlSelect.value < gameClass.lvl) {
    console.log(`Минимальный укровень для подкласса ${gameClass.subclass} ${gameClass.lvl}`);
  } else {
     emits('statChange', gameClass.addStat)
  }

}


</script>

<script>
export default {
  name: 'AppManeken'
}
</script>
