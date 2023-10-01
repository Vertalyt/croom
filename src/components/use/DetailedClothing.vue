
<template>
  <div 
  v-if="isModalBackground"
  class="modal" @click.stop="isClose"></div>
  <div 
  class="modal-content modal-infiCloth"
  :class="{ 'modal-rightInfiCloth' : dummyLocation === 'rightDummyPart', 'modal-topInfiCloth': dummyLocation === 'centerTopDummyPart'}"
  >

    <span @click="isClose" class="close">&times;</span>

    <div class="wrapperAccordion">
      <div class="clothDetailInfo">
      <div class="header">
        <h3>{{ otherInfo.name }}</h3>
      </div>
      <div class="otherInfo">
        <div class="clothImg">
          <img :src="`https://files.nura.biz/site/images/things100x100/${otherInfo.image}.png`" :alt="otherInfo.name">
        </div>
        <div class="detailOtherInfo">
          <div class="prise">
          <p>Ціна:</p>  
          <p>Тали: {{ priseInfo.price }}</p>  
          <p v-if="priseInfo.goldprice">Золоті тали: {{ priseInfo.goldprice }}</p> 
          <p v-if="priseInfo.ratnikprice">Ратник: {{ priseInfo.ratnikprice }}</p> 
          <p v-if="priseInfo.obmenprice">Обміни: {{ priseInfo.obmenprice }}</p> 
          <p v-if="priseInfo.reliktprice">Реліквії: {{ priseInfo.reliktprice }}</p>
          </div>
          <p>Уровень вещи: {{  otherInfo.minlevel }}</p>
          <p>Макс. прочность: {{ otherInfo.durability }}</p>
        </div>
      </div>

      <div class="bodyInfo">
        <div class="minParam">
          <SmallTableDetailCloth 
          v-if="newBaseParam"
          :items="newBaseParam" nameTable="Требования" />

        </div>
        <div class="addParam">
          <SmallTableDetailCloth :items="addStat" nameTable="Характеристики" />
          <SmallTableDetailCloth :items="armor" nameTable="Броня" />
          <SmallTableDetailCloth :items="protectionMagick" nameTable="Защита от магии" />


        </div>
      </div>
    </div>

    </div>


  </div>
</template>


<script setup>
import { computed, ref } from 'vue'

import SmallTableDetailCloth from './SmallTableDetailCloth.vue';

const emits = defineEmits({
  isClothInfo: () => Boolean
})
const props = defineProps({
  isOpenInfoCloth: {
    type: Boolean,
    required: true
  },
  elementParam: {
    type: Object,
    required: true
  },
  dummyLocation: {
    type: String,
    required: true
  }
})

let isModalBackground = true
  if ('ontouchstart' in window === false) {
    isModalBackground = false
  }


const otherInfo = computed( () => props.elementParam.param.find(item => item.otherInfo).otherInfo);
const priseInfo = computed( () => props.elementParam.param.find(item => item.priseInfo).priseInfo);



const normalizeNameStat = [
  { key: "dstrength", name : 'Сила', type: 'stat' },
  { key: "ddexterity", name : 'Ловкість', type: 'stat'  },
  { key: "dintel", name : 'Інтелект', type: 'stat'  },
  { key: "dluck", name : 'Удача', type: 'stat'  },
  { key: "dreaction", name : 'Реакція', type: 'stat'  },
  { key: "dwisdom", name : 'Мудрість', type: 'stat'  },
  { key: "dconst", name : 'Статура', type: 'stat'  },
  { key: 'whitemagicprotection', name: 'Світанок', type: 'protectionMagick' },
  { key: 'blackmagicprotection', name: 'Полнолуння', type: 'protectionMagick' },
  { key: 'astralmagicprotection', name: 'Астрал', type: 'protectionMagick' },
  { key: 'headarmor', name: 'Голова', type: 'armor' },
  { key: 'bodyarmor', name: 'Тулуб', type: 'armor' },
  { key: 'lefthandarmor', name: 'Ліва рука', type: 'armor' },
  { key: 'righthandarmor', name: 'Права рука', type: 'armor' },
  { key: 'lagsarmor', name: 'Ноги', type: 'armor' },
  { key: 'dstamina', name: 'Енергія', type: 'armor' },
]

const bonusAndBase = computed( () => props.elementParam.param.find(item => item.bonusAndBase).bonusAndBase);
const base = computed( () => props.elementParam.param.find(item => item.base).base );

function baseWithNames(arr) {
  // Пройти массив base и добавить name из normalizeNameStat
  return arr.map(item => {
    const matchingStat = normalizeNameStat.find(stat => stat.key === item.key);
    if (matchingStat) {
        return {
            ...item,
            name: matchingStat.name,
            type: matchingStat.type,
        };
    }
    return item;
});
}
const newBaseParam = ref()
if(base.value) {
  newBaseParam.value = baseWithNames(base.value)
}


const newBonusAndBase = ref()

const addStat = ref()
const protectionMagick = ref()
const armor = ref()

function parameterSeparation(params) {
  return newBonusAndBase.value.filter(item => item.type === params)
}

if(bonusAndBase.value) {
  newBonusAndBase.value = baseWithNames(bonusAndBase.value)
  addStat.value = parameterSeparation('stat')
  protectionMagick.value = parameterSeparation('protectionMagick')
  armor.value = parameterSeparation('armor')
}

const isClose = () => {
  emits('isClothInfo', { status: false} )
}

</script>

<script>
export default {
  name: 'DetailedClothing',
}
</script>

<style scoped>

.modal-content {
    width: 400px;
}

.modal-infiCloth {
  left: 50%;
  right: auto;
  transform: translateX(-50%);
}

.modal-rightInfiCloth {
  top: 20%;
  left: 30%;
}

.modal-topInfiCloth {
  top: 30%;
}

.accordionFace {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.wrapperAccordion {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
  justify-content: space-around;
}

.clothDetailInfo {
    display: grid;
    justify-content: center;
    padding: 0 5px;
}


.otherInfo {
    display: flex;
    justify-content: space-between;
}

.clothImg {
width: 100px
}

.detailOtherInfo{
    width: 250px;
    display: grid;
    justify-content: end;
}

.prise {
display: flex;
flex-wrap: wrap;
}

.bodyInfo {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.minParam {
  width: 85px;
}
.addParam{
  
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
}




@media screen and (max-width: 600px) {
  .accordionFace {
    margin-bottom: 0;
  }
}

@media screen and (max-width: 460px) {

  .modal-content {
    width: 380px;
}
  .close {
    top: 30px;
    right: 50px;
}
.minParam {
  width: 80px;
}

}


</style>