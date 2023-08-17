<script setup>
import { ref } from 'vue'
import AppHeader from './components/AppHeader.vue';
import AppManeken from './components/AppManeken.vue'
import AppManekenRezult from './components/AppManekenRezult.vue'


const dummy = [
  { location: 'dummyPartLeft', name: 'helmet', link: 'src/assets/img/helmet.png' },
  { location: 'dummyPartLeft', name: 'armor', link: 'src/assets/img/armor.png' },
  { location: 'dummyPartLeft', name: 'belt', link: 'src/assets/img/belt.png' },
  { location: 'dummyPartLeft', name: 'boots', link: 'src/assets/img/boots.png' },
  { location: 'dummyPartLeft', name: 'earring', link: 'src/assets/img/earring.png' },
  { location: 'dummyPartLeft', name: 'ring', link: 'src/assets/img/ring.png' },
  { location: 'dummyPartLeft', name: 'ring', link: 'src/assets/img/ring.png' },
  { location: 'dummyPartRight', name: 'necklace', link: 'src/assets/img/necklace.png' },
  { location: 'dummyPartRight', name: 'bracers', link: 'src/assets/img/bracers.png' },
  { location: 'dummyPartRight', name: 'gloves', link: 'src/assets/img/gloves.png' },
  { location: 'dummyPartRight', name: 'leggings', link: 'src/assets/img/leggings.png' },
  { location: 'dummyPartRight', name: 'earring', link: 'src/assets/img/earring.png' },
  { location: 'dummyPartRight', name: 'ring', link: 'src/assets/img/ring.png' },
  { location: 'dummyPartRight', name: 'ring', link: 'src/assets/img/ring.png' },
  { location: 'dummyPartCenterTop', name: 'relic', link: 'src/assets/img/relic.png' },
  { location: 'dummyPartCenterTop', name: 'relic', link: 'src/assets/img/relic.png' },
  { location: 'dummyPartCenterTop', name: 'relic', link: 'src/assets/img/relic.png' },
  { location: 'dummyPartCenterTop', name: 'relic', link: 'src/assets/img/relic.png' },
  { location: 'dummyPartCenterBottom', name: 'weapons', link: 'src/assets/img/weapons.png' },
  { location: 'dummyPartCenterBottom', name: 'weapons', link: 'src/assets/img/weapons.png' },
]

const baseParamArr = ref([
        { key: 'strong', name: 'Сила', nameModel: 3, summStatBase: 3, link: 'src/assets/img/icon/svg/strong.svg' },
        { key: 'agility', name: 'Ловкость', nameModel: 3, summStatBase: 3, link: 'src/assets/img/icon/svg/agility.svg' },
        { key: 'intelledgy', name: 'Интеллект', nameModel: 3, summStatBase: 3, link: 'src/assets/img/icon/svg/intelledgy.svg' },
        { key: 'luck', name: 'Удача', nameModel: 3, summStatBase: 3, link: 'src/assets/img/icon/svg/luck.svg' },
        { key: 'reaction', name: 'Реакция', nameModel: 3, summStatBase: 3, link: 'src/assets/img/icon/svg/reaction.svg' },
        { key: 'wisdom', name: 'Мудрость', nameModel: 3, summStatBase: 3, link: 'src/assets/img/icon/svg/wisdom.svg' },
        { key: 'constitution', name: 'Сложение', nameModel: 3, summStatBase: 3, link: 'src/assets/img/icon/svg/constitution.svg' },
      ])

const paramArr = ref([
        { key: 'strong', name: 'Сила', nameModel: 3, summStatBase: 3, link: 'src/assets/img/icon/svg/strong.svg' },
        { key: 'agility', name: 'Ловкость', nameModel: 3, summStatBase: 3, link: 'src/assets/img/icon/svg/agility.svg' },
        { key: 'intelledgy', name: 'Интеллект', nameModel: 3, summStatBase: 3, link: 'src/assets/img/icon/svg/intelledgy.svg' },
        { key: 'luck', name: 'Удача', nameModel: 3, summStatBase: 3, link: 'src/assets/img/icon/svg/luck.svg' },
        { key: 'reaction', name: 'Реакция', nameModel: 3, summStatBase: 3, link: 'src/assets/img/icon/svg/reaction.svg' },
        { key: 'wisdom', name: 'Мудрость', nameModel: 3, summStatBase: 3, link: 'src/assets/img/icon/svg/wisdom.svg' },
        { key: 'constitution', name: 'Сложение', nameModel: 3, summStatBase: 3, link: 'src/assets/img/icon/svg/constitution.svg' },
      ])

  const statPlus = (statName) => {
  paramArr.value.map(p => {
    if(p.name === statName) {
      p.nameModel += 1
      p.summStatBase += 1
    }
  })
}

const statMinus = (statName) => {
  paramArr.value.map(p => {
    if(p.nameModel < 2) {
      console.log('Значение не может быть меньше эдиницы');
      return
    }
    if(p.name === statName ) {
      p.nameModel -= 1
      p.summStatBase -= 1
    } 
  })
}

  const basickParams = [
        {
          rase: 'human', date: [
            {key: 'strong', count: 3 },
            {key: 'agility', count: 3 },
            {key: 'intelledgy', count: 3 },
            {key: 'luck', count: 3 },
            {key: 'reaction', count: 3 },
            {key: 'wisdom', count: 3 },
            {key: 'constitution', count: 3 },
          ]
        },
        {
          rase: 'gnom', date: [
            {key: 'strong', count: 4 },
            {key: 'agility', count: 2 },
            {key: 'intelledgy', count: 2 },
            {key: 'luck', count: 3 },
            {key: 'reaction', count: 2 },
            {key: 'wisdom', count: 4 },
            {key: 'constitution', count: 4 },
          ]
        },
        {
          rase: 'elf', date: [
            {key: 'strong', count: 3 },
            {key: 'agility', count: 5 },
            {key: 'intelledgy', count: 3 },
            {key: 'luck', count: 2 },
            {key: 'reaction', count: 2 },
            {key: 'wisdom', count: 3 },
            {key: 'constitution', count: 3 },
          ]
        },
        {
          rase: 'vampire', date: [
            {key: 'strong', count: 3 },
            {key: 'agility', count: 3 },
            {key: 'intelledgy', count: 3 },
            {key: 'luck', count: 4 },
            {key: 'reaction', count: 2 },
            {key: 'wisdom', count: 3 },
            {key: 'constitution', count: 3 },
          ]
        },
        {
          rase: 'ork', date: [
            {key: 'strong', count: 4 },
            {key: 'agility', count: 3 },
            {key: 'intelledgy', count: 2 },
            {key: 'luck', count: 4 },
            {key: 'reaction', count: 3 },
            {key: 'wisdom', count: 1 },
            {key: 'constitution', count: 4 },
          ]
        },
        {
          rase: 'trol', date: [
            {key: 'strong', count: 5 },
            {key: 'agility', count: 2 },
            {key: 'intelledgy', count: 1 },
            {key: 'luck', count: 3 },
            {key: 'reaction', count: 3 },
            {key: 'wisdom', count: 2 },
            {key: 'constitution', count: 5 },
          ]
        },
  ]

        // переменная для записи всех дополнительных значений, помимо  базовых, от всего шмота например.
  const paramsPlus = ref([
            {key: 'strong', count: 0 },
            {key: 'agility', count: 0 },
            {key: 'intelledgy', count: 0 },
            {key: 'luck', count: 0 },
            {key: 'reaction', count: 0 },
            {key: 'wisdom', count: 0 },
            {key: 'constitution', count: 0 },
  ])


  const changeRase = (raseEmit) => {
  const raseParams = basickParams.find(r => r.rase === raseEmit);

  if (raseParams) {
    const updatedParamArr = baseParamArr.value.map(p => {
      const matchingParam = raseParams.date.find(rp => rp.key === p.key);
      const matchingPlusParam = paramsPlus.value.find(pp => pp.key === p.key);

      let { nameModel, summStatBase } = p;

      if (matchingParam) {
        nameModel = matchingParam.count;
        summStatBase = matchingParam.count;
      }

      if (matchingPlusParam) {
        summStatBase += matchingPlusParam.count;
      }

      return { ...p, nameModel, summStatBase };
    });

    paramArr.value = updatedParamArr;
  }
}



// eslint-disable-next-line no-unused-vars
const components = {
  AppHeader
}
</script>
<template>
  <div class="room-container">
    <div class="wrapper">
      <div class="conteiner">

        <AppHeader />
        <main class="main-wrapper">
          <AppManeken 
          v-if="dummy" 
          :dummy="dummy" 
          :paramArr="paramArr"
          @statPlus="statPlus"
          @statMinus="statMinus"
          @changeRase="changeRase"
          />
          <AppManekenRezult />
        </main>
      </div>
    </div>
  </div>
</template>
