<template>
  <div class="loading" v-if="loading">
    <LoadingWeather/>
  </div>
  <div class="weather" v-else>
    <div class="weather_main" v-if="!errorWeather">
      <div class="weather_main_date">
        <input v-on:keyup.enter="getWeather" v-model="nameCity">
        <h1>{{ getUTS }}</h1>
        <h1>{{ getDateNow }}</h1>
      </div>
      <div class="weather_main_icon">
        <img class="iconAnimation" alt="cloud" :src="require(`@/assets/iconWeather/${getIconWeather}.svg`)">
      </div>
      <div class="weather_main_temp">
        <h1>{{townWeather.weather[0].description.toUpperCase()}}</h1>
        <div class="temp" @click="toggleCondition = !toggleCondition">
          <img alt="thermometer" src="@/assets/thermometer.svg">
          <h1 v-if="!toggleCondition">{{ getTempCelsius }}</h1>
          <h1 v-else>{{ getTempFahrenheit }}</h1>
        </div>
      </div>
      <div class="weather_main_info">
        <div>
          <img src="@/assets/compass.svg" alt="compass">
          <h1>{{`${Math.trunc (townWeather.visibility / 1000)}`}}km</h1>
        </div>
        <div>
          <img src="@/assets/cloudy.svg" alt="cloudy">
          <h1>{{townWeather.main.pressure}}hPa</h1>
        </div>
        <div>
          <img src="@/assets/rain.svg" alt="rain">
          <h1>{{townWeather.main.humidity}}%</h1>
        </div>
      </div>
    </div>
    <div class="weather_main_error" v-else>
      <img alt="tornado" src="@/assets/tornado.svg">
      <h2>Something went wrong!</h2>
      <h5>Sorry! Something went wrong! Please try again </h5>
      <button @click="errorWeather = null">TRY AGAIN</button>
    </div>
  </div>
</template>

<script>
import {onMounted, ref, computed} from "vue";
import axios from "axios";
import LoadingWeather from "./LoadingWeather"

export default {
  name: 'Weather',
  components: {
    LoadingWeather,
  },
  setup() {
    const nameCity = ref('');
    const townWeather = ref('');
    const errorWeather = ref('');
    const getUTS = new Date().toUTCString().slice(0, -12);
    const getDateNow = ref('');
    const loading = ref(true);
    const toggleCondition = ref(false);
    const getIconWeather = ref('');
    const getTempCelsius = computed(() => `${Math.trunc(townWeather.value.main.temp - 273.15)}℃`);
    const getTempFahrenheit = computed(() => `${Math.trunc(((townWeather.value.main.temp - 273.15) * 1.8) + 32)}℉`)

    const printTime = () => {
      loading.value = true;
      setInterval(() => {
        getDateNow.value = new Date().toLocaleTimeString().slice(0, -3);
      }, 40)
    }

    const getWeather = () => {
      loading.value = true;
      axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${nameCity.value}&appid=${process.env.VUE_APP_KEY}`)
          .then((result) => {
            townWeather.value = result.data;
            nameCity.value = result.data.name;
            getIconWeather.value = result.data.weather[0].icon;
            loading.value = false;
          })
          .catch((error) => {
            errorWeather.value = error.message;
            loading.value = false;
          })
    }

    const getLocation = () => navigator.geolocation.getCurrentPosition(showLocationWeather);

    const showLocationWeather = (position) => {
      loading.value = true;
      axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${process.env.VUE_APP_KEY}`)
          .then((result) => {
            townWeather.value = result.data;
            nameCity.value = result.data.name
            getIconWeather.value = result.data.weather[0].icon
            loading.value = false;
          })
          .catch((error) => {
            errorWeather.value = error.message;
            loading.value = false;
          })
    }

    onMounted(() => {
      getLocation();
      printTime();
    })

    return {
      nameCity,
      getWeather,
      townWeather,
      errorWeather,
      getUTS,
      getDateNow,
      loading,
      toggleCondition,
      getTempCelsius,
      getTempFahrenheit,
      getIconWeather
    }
  }
}
</script>
<style scoped>

h1{
  color: #272727;
}

.weather {
  display: flex;
  justify-content: center;
}

.weather_main {
  margin: auto;
  border-radius: 15px;
  box-shadow: 0 5px 10px 2px rgba(34, 60, 80, 0.2);
}

.temp {
  display: flex;
  width: 50px;
  text-align: center;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.temp h1 {
  font-size: 55px;
  margin: 20px 0 0 -20px;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.weather_main_info{
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: space-evenly;
}

.weather_main_icon img{
  width: 150px;
  height: 150px;
}
.weather_main_temp {
  margin: 20px 0 20px 0;
}

.weather_main_temp img{
  margin: 20px 0 0 -20px;
  width: 100px;
  height: 100px;
}

.weather_main_info img {
  width: 70px;
  height: 70px;
}

.weather_main_info h1{
  margin: 0 0 20px;
}

.weather_main_error {
  padding: 50px 15px 0 15px;
  border-radius: 15px;
  box-shadow: 0 5px 10px 2px rgba(34, 60, 80, 0.2);
}

.weather_main_error h2, h5 {
  margin: 5px 0 0 0;
  color: #272727;
}

.weather_main_error button {
  padding: 4px 15px 1px 15px;
  color: #FF0000FF;
  outline: none;
  background: none;
  font-size: 20px;
  font-weight: bold;
  margin: 100px 0 20px 0;
  border: none;
  border-radius: 10px;
  transition: 0.8s;
}

.weather_main_error button:hover {
  color: #f20000;
  background: #f0f0f0;
}

.weather_main_error img {
  width: 150px;
  height: 150px;
  padding: 0 0 40px 0;
}

.weather_main_date input {
  font-size: 30px;
  font-weight: bold;
  color: #272727;
  background: none;
  border: none;
  text-align: center;
  outline: none;
  padding: 10px;
  border-bottom: 2px solid #272727;
  transition: 0.8s;
}
.weather_main_date input:hover {
  border-radius: 10px 10px 0 0;
  background: #eaeaea;
}


</style>
