<template>
	<div class="container">
  
	  <section class="content">
		<form @submit.prevent="onSubmit" class="login-form">
		  <input
      :id="fieldNames.email"
      class="email"
      type="text"
      autocomplete="email username"
			v-model="eValue"
			:class="{ invalid: eError }"
			@blur="eBlur"
		  />
		  <label :for="fieldNames.email">Email</label>
		  <small class="helper-text" :class="{ invalid: eError }">{{ eError}}</small>
  
		  <input
      :id="fieldNames.password"
      class="password"
			type="password"
      autocomplete="new-password"
			:class="{ invalid: pError }"
			v-model="pValue"
			@blur="pBlur"
		  />
		  <label :for="fieldNames.password">{{ getLocalizedText("Password") }}</label>
		  <small class="helper-text" :class="{ invalid: pError }">{{ pError}}</small>
  
		  <template v-if="loginFlag === 'register'">
			<input
      :id="fieldNames.username"
      type="text"
        class="username"
        autocomplete="username"
			  v-model="nValue"
			  :class="{ invalid: nError }"
			  @blur="nBlur"
			/>
			<label :for="fieldNames.username">Им'я</label>
			<small class="helper-text" :class="{ invalid: nError }">{{ nError }}</small>
		  </template>
  
		  <div>
			<input type="submit" value="Log in" />
      <a 
      @click.prevent="fogot = !fogot"
      >Lost your password?</a>
		  </div>
		</form>

    <FogorPassword 
    v-if="fogot"
    @isClose="$emit('isClose')"
    />

	  </section>
  
	</div>
  </template>

<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useField, useForm } from "vee-validate";
import * as yup from "yup";
import { getLocalizedText } from '@/locale'
import FogorPassword from './FogorPassword.vue';

const emits = defineEmits({
  isClose: null
});
const props = defineProps({
	loginFlag: {
		type: String,
		required: false
	}
});

const store = useStore()
const fogot = ref(false)

const MIN_LENGHT_PASS = 6;

const fieldNames = {
  email: `email${props.loginFlag}`,
  password: `password${props.loginFlag}`,
  username: `username${props.loginFlag}`,
};

// Функция для создания правил для поля
function getFieldRules(fieldName) {
  let rules = yup.string().trim();
  
  switch (fieldName) {
    case fieldNames.email:
      rules = rules.required(getLocalizedText("EnterEmail")).email(getLocalizedText("MustBeValidEmail"));
      break;
    case fieldNames.password:
      rules = rules.required(getLocalizedText("EnterPassword")).min(
        MIN_LENGHT_PASS,
        `${getLocalizedText("PasswordCannotBeSmaller")} ${MIN_LENGHT_PASS} ${getLocalizedText("Symbols")}.`
      );
      break;
    case fieldNames.username:
      if (props.loginFlag === 'register') {
        rules = rules.required(getLocalizedText("EnterName"));
      }
      break;
    default:
      break;
  }

  return rules;
}

const { handleSubmit } = useForm();

const {
  value: eValue,
  errorMessage: eError,
  handleBlur: eBlur,
} = useField(
  fieldNames.email,
  getFieldRules(fieldNames.email)
);

const {
  value: pValue,
  errorMessage: pError,
  handleBlur: pBlur,
} = useField(
  fieldNames.password,
  getFieldRules(fieldNames.password)
);

const {
  value: nValue,
  errorMessage: nError,
  handleBlur: nBlur,
} = useField(
  fieldNames.username,
  getFieldRules(fieldNames.username)
);

const onSubmit = handleSubmit(async (val, { resetForm }) => {
  const date = {
    email: val[fieldNames.email], 
    password: val[fieldNames.password],
  }
  if(val[fieldNames.username]) {
    date.name = val[fieldNames.username]
  }
  try {
    const localLocale = store.getters['requests/clientInfo']
    const rezult = await store.dispatch(`auth/${props.loginFlag}`, date);
    if (rezult) {
      if(localLocale !== null) {
        rezult.locale = localLocale.locale
        await store.dispatch(`requests/updateInfo`, rezult);
      }
      emits('isClose')
   }
    resetForm();
  } catch (error) {
    /* empty */
  }
});


</script>



<script>
export default {
  name: 'FormRegIsteredLogin',
}
</script>

<style scoped>
body {
  background: #DCDDDF url('https://sabzero.biz/croomTemplate/assets/img/7AF2Qzt.webp');
  color: #000;
  font: 14px Arial;
  margin: 0 auto;
  padding: 0;
  position: relative;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-size: 28px;
}

small {
  font-size: 10px;
}

b,
strong {
  font-weight: bold;
}

a {
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.left {
  float: left;
}

.right {
  float: right;
}

.alignleft {
  float: left;
  margin-right: 15px;
}

.alignright {
  float: right;
  margin-left: 15px;
}

.clearfix:after,
form:after {
  content: ".";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}

.container {
  margin: 15px 0;
}

.content {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  background: #f9f9f9;
  background: -moz-linear-gradient(top, rgba(248, 248, 248, 1) 0%, rgba(249, 249, 249, 1) 100%);
  background: -webkit-linear-gradient(top, rgba(248, 248, 248, 1) 0%, rgba(249, 249, 249, 1) 100%);
  background: -o-linear-gradient(top, rgba(248, 248, 248, 1) 0%, rgba(249, 249, 249, 1) 100%);
  background: -ms-linear-gradient(top, rgba(248, 248, 248, 1) 0%, rgba(249, 249, 249, 1) 100%);
  background: linear-gradient(top, rgba(248, 248, 248, 1) 0%, rgba(249, 249, 249, 1) 100%);
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#f8f8f8', endColorstr='#f9f9f9', GradientType=0);
  -webkit-box-shadow: 0 1px 0 #fff inset;
  -moz-box-shadow: 0 1px 0 #fff inset;
  -ms-box-shadow: 0 1px 0 #fff inset;
  -o-box-shadow: 0 1px 0 #fff inset;
  box-shadow: 0 1px 0 #fff inset;
  border: 1px solid #c4c6ca;
  margin: 0 auto;
  padding: 25px 0 0;
  position: relative;
  text-align: center;
  text-shadow: 0 1px 0 #fff;
  width: 270px;
}

.content h1 {
  color: #7E7E7E;
  font: bold 25px Helvetica, Arial, sans-serif;
  letter-spacing: -0.05em;
  line-height: 20px;
  margin: 10px 0 30px;
}

.content h1:before,
.content h1:after {
  content: "";
  height: 1px;
  position: absolute;
  top: 10px;
  width: 27%;
}

.content h1:after {
  background: rgb(126, 126, 126);
  background: -moz-linear-gradient(left, rgba(126, 126, 126, 1) 0%, rgba(255, 255, 255, 1) 100%);
  background: -webkit-linear-gradient(left, rgba(126, 126, 126, 1) 0%, rgba(255, 255, 255, 1) 100%);
  background: -o-linear-gradient(left, rgba(126, 126, 126, 1) 0%, rgba(255, 255, 255, 1) 100%);
  background: -ms-linear-gradient(left, rgba(126, 126, 126, 1) 0%, rgba(255, 255, 255, 1) 100%);
  background: linear-gradient(left, rgba(126, 126, 126, 1) 0%, rgba(255, 255, 255, 1) 100%);
  right: 0;
}

.content h1:before {
  background: rgb(126, 126, 126);
  background: -moz-linear-gradient(right, rgba(126, 126, 126, 1) 0%, rgba(255, 255, 255, 1) 100%);
  background: -webkit-linear-gradient(right, rgba(126, 126, 126, 1) 0%, rgba(255, 255, 255, 1) 100%);
  background: -o-linear-gradient(right, rgba(126, 126, 126, 1) 0%, rgba(255, 255, 255, 1) 100%);
  background: -ms-linear-gradient(right, rgba(126, 126, 126, 1) 0%, rgba(255, 255, 255, 1) 100%);
  background: linear-gradient(right, rgba(126, 126, 126, 1) 0%, rgba(255, 255, 255, 1) 100%);
  left: 0;
}

.content:after,
.content:before {
  background: #f9f9f9;
  background: -moz-linear-gradient(top, rgba(248, 248, 248, 1) 0%, rgba(249, 249, 249, 1) 100%);
  background: -webkit-linear-gradient(top, rgba(248, 248, 248, 1) 0%, rgba(249, 249, 249, 1) 100%);
  background: -o-linear-gradient(top, rgba(248, 248, 248, 1) 0%, rgba(249, 249, 249, 1) 100%);
  background: -ms-linear-gradient(top, rgba(248, 248, 248, 1) 0%, rgba(249, 249, 249, 1) 100%);
  background: linear-gradient(top, rgba(248, 248, 248, 1) 0%, rgba(249, 249, 249, 1) 100%);
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#f8f8f8', endColorstr='#f9f9f9', GradientType=0);
  border: 1px solid #c4c6ca;
  content: "";
  display: block;
  height: 100%;
  left: -1px;
  position: absolute;
  width: 100%;
}

.content:after {
  -webkit-transform: rotate(2deg);
  -moz-transform: rotate(2deg);
  -ms-transform: rotate(2deg);
  -o-transform: rotate(2deg);
  transform: rotate(2deg);
  top: 0;
  z-index: -1;
}

.content:before {
  -webkit-transform: rotate(-3deg);
  -moz-transform: rotate(-3deg);
  -ms-transform: rotate(-3deg);
  -o-transform: rotate(-3deg);
  transform: rotate(-3deg);
  top: 0;
  z-index: -2;
}

.content form {
  margin: 0 20px;
  position: relative;
}

.content form input[type="text"],
.content form input[type="password"] {
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  -ms-border-radius: 3px;
  -o-border-radius: 3px;
  border-radius: 3px;
  -webkit-box-shadow: 0 1px 0 #fff, 0 -2px 5px rgba(0, 0, 0, 0.08) inset;
  -moz-box-shadow: 0 1px 0 #fff, 0 -2px 5px rgba(0, 0, 0, 0.08) inset;
  -ms-box-shadow: 0 1px 0 #fff, 0 -2px 5px rgba(0, 0, 0, 0.08) inset;
  -o-box-shadow: 0 1px 0 #fff, 0 -2px 5px rgba(0, 0, 0, 0.08) inset;
  box-shadow: 0 1px 0 #fff, 0 -2px 5px rgba(0, 0, 0, 0.08) inset;
  -webkit-transition: all 0.5s ease;
  -moz-transition: all 0.5s ease;
  -ms-transition: all 0.5s ease;
  -o-transition: all 0.5s ease;
  transition: all 0.5s ease;
  background: #eae7e7 url('https://sabzero.biz/croomTemplate/assets/img/8bcLQqF.webp') no-repeat;
  border: 1px solid #c8c8c8;
  color: #777;
  font: 13px Helvetica, Arial, sans-serif;
  margin: 10px 15px 10px 0px;
  padding: 15px 10px 15px 40px;
  width: 80%;
}

.content form input[type="text"]:focus,
.content form input[type="password"]:focus {
  -webkit-box-shadow: 0 0 2px #5da324 inset;
  -moz-box-shadow: 0 0 2px #5da324 inset;
  -ms-box-shadow: 0 0 2px #5da324 inset;
  -o-box-shadow: 0 0 2px #5da324 inset;
  box-shadow: 0 0 2px #5da324 inset;
  background-color: #fff;
  border: 1px solid #5da324;
  outline: none;
}

.email {
  background-position: 10px 10px !important;
}

.username {
  background-position: 10px 10px !important;
}

.password {
  background-position: 10px -53px !important;
}

.content form input[type="submit"] {
  background: rgb(254, 231, 154);
  background: -moz-linear-gradient(top, rgba(254, 231, 154, 1) 0%, rgba(254, 193, 81, 1) 100%);
  background: -webkit-linear-gradient(top, rgba(254, 231, 154, 1) 0%, rgba(254, 193, 81, 1) 100%);
  background: -o-linear-gradient(top, rgba(254, 231, 154, 1) 0%, rgba(254, 193, 81, 1) 100%);
  background: -ms-linear-gradient(top, rgba(254, 231, 154, 1) 0%, rgba(254, 193, 81, 1) 100%);
  background: linear-gradient(top, rgba(254, 231, 154, 1) 0%, rgba(254, 193, 81, 1) 100%);
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#fee79a', endColorstr='#fec151', GradientType=0);
  -webkit-border-radius: 30px;
  -moz-border-radius: 30px;
  -ms-border-radius: 30px;
  -o-border-radius: 30px;
  border-radius: 30px;
  -webkit-box-shadow: 0 1px 0 rgba(255, 255, 255, 0.8) inset;
  -moz-box-shadow: 0 1px 0 rgba(255, 255, 255, 0.8) inset;
  -ms-box-shadow: 0 1px 0 rgba(255, 255, 255, 0.8) inset;
  -o-box-shadow: 0 1px 0 rgba(255, 255, 255, 0.8) inset;
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.8) inset;
  border: 1px solid #D69E31;
  color: #85592e;
  cursor: pointer;
  float: left;
  font: bold 15px Helvetica, Arial, sans-serif;
  height: 35px;
  margin: 0px 15px 15px 0px;
  position: relative;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
  width: 120px;
}

.content form input[type="submit"]:hover {
  background: rgb(254, 193, 81);
  background: -moz-linear-gradient(top, rgba(254, 193, 81, 1) 0%, rgba(254, 231, 154, 1) 100%);
  background: -webkit-linear-gradient(top, rgba(254, 193, 81, 1) 0%, rgba(254, 231, 154, 1) 100%);
  background: -o-linear-gradient(top, rgba(254, 193, 81, 1) 0%, rgba(254, 231, 154, 1) 100%);
  background: -ms-linear-gradient(top, rgba(254, 193, 81, 1) 0%, rgba(254, 231, 154, 1) 100%);
  background: linear-gradient(top, rgba(254, 193, 81, 1) 0%, rgba(254, 231, 154, 1) 100%);
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#fec151', endColorstr='#fee79a', GradientType=0);
}

.content form div a {
  color: #004a80;
  float: right;
  font-size: 12px;
  margin: 10px 15px 10px 0;
  text-decoration: underline;
}

.button {
  background: rgb(247, 249, 250);
  background: -moz-linear-gradient(top, rgba(247, 249, 250, 1) 0%, rgba(240, 240, 240, 1) 100%);
  background: -webkit-linear-gradient(top, rgba(247, 249, 250, 1) 0%, rgba(240, 240, 240, 1) 100%);
  background: -o-linear-gradient(top, rgba(247, 249, 250, 1) 0%, rgba(240, 240, 240, 1) 100%);
  background: -ms-linear-gradient(top, rgba(247, 249, 250, 1) 0%, rgba(240, 240, 240, 1) 100%);
  background: linear-gradient(top, rgba(247, 249, 250, 1) 0%, rgba(240, 240, 240, 1) 100%);
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#f7f9fa', endColorstr='#f0f0f0', GradientType=0);
  -webkit-box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) inset;
  -moz-box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) inset;
  -ms-box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) inset;
  -o-box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) inset;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) inset;
  -webkit-border-radius: 0 0 5px 5px;
  -moz-border-radius: 0 0 5px 5px;
  -o-border-radius: 0 0 5px 5px;
  -ms-border-radius: 0 0 5px 5px;
  border-radius: 0 0 5px 5px;
  border-top: 1px solid #CFD5D9;
  padding: 15px 0;
}

.button a {
  background: url('https://sabzero.biz/croomTemplate/assets/img/8bcLQqF.webp') 0 -112px no-repeat;
  color: #7E7E7E;
  font-size: 17px;
  padding: 2px 0 2px 40px;
  text-decoration: none;
  -webkit-transition: all 0.3s ease;
  -moz-transition: all 0.3s ease;
  -ms-transition: all 0.3s ease;
  -o-transition: all 0.3s ease;
  transition: all 0.3s ease;
}

.button a:hover {
	background-position: 0 -135px;
  color: #00aeef;
}

.content form input[type="text"].invalid:focus,
.content form input[type="password"].invalid:focus {
  -webkit-box-shadow: 0 0 2px #a81f1f inset;
  -moz-box-shadow: 0 0 2px #a81f1f inset;
  -ms-box-shadow: 0 0 2px #a81f1f inset;
  -o-box-shadow: 0 0 2px #a81f1f inset;
  box-shadow: 0 0 2px #a81f1f inset;
  background-color: #fff;
  border: 1px solid #a81f1f;
  outline: none;
}

.invalid {
  -webkit-box-shadow: 0 0 2px #a81f1f inset;
  -moz-box-shadow: 0 0 2px #a81f1f inset;
  -ms-box-shadow: 0 0 2px #a81f1f inset;
  -o-box-shadow: 0 0 2px #a81f1f inset;
  box-shadow: 0 0 2px #a81f1f inset;
  border: 1px solid #a81f1f;
}

.small {
  padding: 5px 10px;
}

#container {
  margin: 15px 0;
}


</style>