<template>
  <div class="modal" @click.stop="isClose"></div>
  <div class="modal-content">
    <span @click="isClose" class="close">&times;</span>


      <div class="bg-checkbox-wrap"
      v-if="lvlPerson >= 6"
      >
    <input type="checkbox" id="bg-checkbox" v-model="checkboxType"/>
    <label id="bg-checkbox-button" for="bg-checkbox">
        <div id="knob"></div>
        <div id="art">Артефакты</div>
        <div id="cloth">Вещи</div>
    </label>
        </div>


      <ArtCloth 
      v-if="!checkboxType"
      :lvlPerson="lvlPerson"
      :cellOptions="cellOptions"
      :idMannequin="idMannequin"
      @isClose="$emit('isClose')"
      />

    <SelClothListSort
    v-if="checkboxType"
     :cellOptions="cellOptions"
     :minStats="minStats"
     :idMannequin="idMannequin"
     @isClose="$emit('isClose')"
    />




  </div>
</template>

<script setup>
import { ref } from 'vue'
import SelClothListSort from '../SelClothListSort.vue'
import ArtCloth from './ArtCloth.vue';

defineProps({
  cellOptions: {
    type: Object,
    required: true
  },
  minStats: {
    type: Object,
    required: true
  },
  idMannequin:{
    type: Number,
    required: true
  },
  lvlPerson:{
    type: Number,
    required: true
  },
})

const emits =defineEmits({
  isClose: null
})

const checkboxType = ref(true)

const isClose = () => {
  emits('isClose')
}


</script>

<script>
export default {
  name: 'ManeckenModal'
}
</script>

<style>

.bg-checkbox-wrap * {
	box-sizing: content-box;
}	
.bg-checkbox-wrap {
    display: flex;
	justify-content: center;
  margin-bottom: 15px;
}
#bg-checkbox {
	display: none;
}
#bg-checkbox-button {
	position: relative;
	display: block;
	width: 225px;
	height: 94px;
	background-color: #337AB7;
	border-radius: 87px;
	cursor: pointer;
	transition: 0.4s ease background-color;  
    border: 4px solid #BFE2FF;
}
#bg-checkbox-button #knob {
	width: 72px;
	height: 72px;
	background-image: url('../../assets//img//check/helm.png');
	background-size: 225px;
	position: relative;
	top: 7px;
	left: 7px;
	border-radius: 50%;
	transition: 0.4s ease left, 0.4s ease background-position;
	z-index: 2;
	border: 4px solid #BFE2FF;
}
#bg-checkbox-button #art,
#bg-checkbox-button #cloth {
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	color: #fff;
	font-size: 13px;
	font-weight: bold;
	font-family: Verdana, sans-serif;
	text-transform: uppercase;
	margin-left: 102px;
	z-index: 1;
	transition: 0.4s ease opacity;   
}
#bg-checkbox-button #cloth {
	margin-left: 30px;
	opacity: 0;
}
#bg-checkbox:checked + #bg-checkbox-button #cloth {
	opacity: 1;
}
#bg-checkbox:checked + #bg-checkbox-button #art {
	opacity: 0;
}
#bg-checkbox:checked + #bg-checkbox-button #knob {
	left: 138px;
	background-position: -125px 0;
}


</style>
