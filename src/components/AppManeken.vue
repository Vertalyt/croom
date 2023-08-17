
<template>
          <div class="dummy" v-if="dummy">

            <div class="dummy__part">
                <div 
                v-for="(d, idx) in dummyPartLeft"
                class="parameter__mat__img"
                :key="`${d.location}_${d.name}${idx}`"
                :id="`${d.location}_${d.name}${idx}`"
                >
                  <img :src="d.link" :alt="d.name">
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
                  <img :src="d.link" :alt="d.name">
              </div>
              </div>

              <div class="dummy__center__center">
                <div class="options">
                  <div class="options__itemBlock">
                    <table class="table">
                      <thead>
                        <td class="options__table__title" colspan="5"><h3>Манекен 1</h3></td>
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
                            <img :src="p.link" :alt="p.name">
                            {{ p.name }}</td>
                          <td>{{ p.summStatBase }}</td>
                          <td><input v-model="p.nameModel"  class="options__input" /></td>
                          <td>
                            <button 
                            @click="statPlus(p.name)"
                            class="button__reset"
                            >
                              <span class="material-symbols-outlined">stat_2</span>
                            </button>
                          </td>
                          <td>
                            <button 
                            @click="statMinus(p.name)"
                            class="button__reset">
                              <span class="material-symbols-outlined">stat_minus_2</span>
                            </button>
                          </td>
                        </tr>


                        <!-- <tr>
                          <td>
                            <img src="../assets/img/icon/svg/agility.svg" alt="agility">
                            Ловкость</td>
                          <td>{{ agility }}</td>
                          <td><input v-model="agilityModel"  class="options__input" /></td>
                          <td>
                            <button class="button__reset">
                              <span class="material-symbols-outlined">stat_2</span>
                            </button>
                          </td>
                          <td>
                            <button class="button__reset">
                              <span class="material-symbols-outlined">stat_minus_2</span>
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <img src="../assets/img/icon/svg/intelledgy.svg" alt="intelledgy">
                            Интелект</td>
                          <td>{{ intellegy }}</td>
                          <td><input v-model="intellegyModel"  class="options__input" /></td>
                          <td>
                            <button class="button__reset">
                              <span class="material-symbols-outlined">stat_2</span>
                            </button>
                          </td>
                          <td>
                            <button class="button__reset">
                              <span class="material-symbols-outlined">stat_minus_2</span>
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <img src="../assets/img/icon/svg/luck.svg" alt="luck">
                            Удача</td>
                          <td>{{ luck }}</td>
                          <td><input v-model="luckModel"  class="options__input" /></td>
                          <td>
                            <button class="button__reset">
                              <span class="material-symbols-outlined">stat_2</span>
                            </button>
                          </td>
                          <td>
                            <button class="button__reset">
                              <span class="material-symbols-outlined">stat_minus_2</span>
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <img src="../assets/img/icon/svg/reaction.svg" alt="reaction">
                            Реакция</td>
                          <td>{{ reaction }}</td>
                          <td><input v-model="reactionModel"  class="options__input" /></td>
                          <td>
                            <button class="button__reset">
                              <span class="material-symbols-outlined">stat_2</span>
                            </button>
                          </td>
                          <td>
                            <button class="button__reset">
                              <span class="material-symbols-outlined">stat_minus_2</span>
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <img src="../assets/img/icon/svg/wisdom.svg" alt="wisdom">
                            Мудрость</td>
                          <td>{{ wisdom }}</td>
                          <td><input v-model="wisdomModel"  class="options__input" /></td>
                          <td>
                            <button class="button__reset">
                              <span class="material-symbols-outlined">stat_2</span>
                            </button>
                          </td>
                          <td>
                            <button class="button__reset">
                              <span class="material-symbols-outlined">stat_minus_2</span>
                            </button>
                          </td>
                        </tr>

                        <tr>
                          <td>
                            <img src="../assets/img/icon/svg/constitution.svg" alt="constitution">
                            Сложение</td>
                          <td>{{ constitution }}</td>
                          <td><input v-model="constitutionModel" class="options__input" /></td>
                          <td>
                            <button class="button__reset">
                              <span class="material-symbols-outlined">stat_2</span>
                            </button>
                          </td>
                          <td>
                            <button class="button__reset">
                              <span class="material-symbols-outlined">stat_minus_2</span>
                            </button>
                          </td>
                        </tr> -->


                      </tbody>
                    </table>
                  </div>

                  <div class="options__itemBlock">
                    <div class="form">
                      <form action="">
                        <div class="form__items">
                          <select class="form__input_rase select-css" v-model="raseModel" @change ="changeRaseSelect">
                            <option value="change" disabled selected>Выбери расу</option>
                            <option value="human" >Человек</option>
                            <option value="gnom" >Гном</option>
                            <option value="elf" >Эльф</option>
                            <option value="vampire" >Вампир</option>
                            <option value="ork" >Орк</option>
                            <option value="trol" >Троль</option>
                          </select>

                          <select class="form__input_lvl select-css">
                            <option disabled selected>Выбери уровень</option>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                            <option>6</option>
                            <option>7</option>
                            <option>8</option>
                            <option>9</option>
                            <option>10</option>
                            <option>11</option>
                            <option>12</option>
                            <option>13</option>
                            <option>14</option>
                            <option>15</option>
                            <option>16</option>
                            <option>17</option>
                            <option>18</option>
                            <option>19</option>
                            <option>20</option>
                            <option>21</option>
                            <option>22</option>
                            <option>23</option>
                            <option>24</option>
                            <option>25</option>
                            <option>26</option>
                            <option>27</option>
                            <option>28</option>
                            <option>29</option>
                            <option>30</option>
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
                  <img :src="d.link" :alt="d.name">
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

                  <img :src="d.link" :alt="d.name">
                </div>
              
            </div>
          </div>
</template>


<script setup>
import { ref } from 'vue'

const props = defineProps({
  dummy: {
    type: Array,
    requared: true
  },
  paramArr: {
    type: Array,
    requared: true
  },
})

const emits = defineEmits({
  statPlus: String,
  statMinus: String,
  changeRase: String
})

const raseModel = ref('change')

const changeRaseSelect = () => {
  emits('changeRase', raseModel.value)
}


const dummyPartLeft = props.dummy.filter( d =>  d.location === 'dummyPartLeft' )
const dummyPartRight = props.dummy.filter( d =>  d.location === 'dummyPartRight' )
const dummyPartCenterTop = props.dummy.filter( d =>  d.location === 'dummyPartCenterTop' )
const dummyPartCenterBottom = props.dummy.filter( d =>  d.location === 'dummyPartCenterBottom')


const statPlus = (statName) => {
  console.log(statName);
  emits('statPlus', statName)
}

const statMinus = (statName) => {
  emits('statMinus', statName)
}


</script>

<script>
export default {
  name: 'AppManeken',
}
</script>

