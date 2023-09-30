<template>
  <form @submit.prevent="onSubmit">
    <div class="locale">
      <div id="locale" class="locale_flag">

        <select ref="selectCategory" v-model="locale">
          <option v-for="l in localeFlag" :key="l.flag" :value="l.flag">{{ l.value }}</option>
        </select>

      </div>

      <button class="button" type="submit">
        {{ getLocalizedText('refresh') }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { computed, watch, ref } from 'vue'

import { getLocalizedText, localeFlag } from '@/locale'


const emits = defineEmits({
  onChangeLocale: String
})
const props = defineProps({
  localeSait: {
    type: String
  }
})

const locale = ref()
const localeComputed = computed( () => props.localeSait )

watch(localeComputed, val => {
  locale.value = val
}, { immediate: true }  )

const onSubmit = () => {
  emits('onChangeLocale', locale.value)
}
</script>

<script>
export default {
  name: 'LocaleChange'
}
</script>


<style scoped>

form {
    border: 1px solid #373c358a;
    border-radius: 10px;
    padding: 10px;
}

.locale {
  display: grid
}

.locale_flag {
    display: grid;
    margin: 15px 0;
}

</style>