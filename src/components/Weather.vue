<template>
  <div class="loading" v-if="loading">
    <LoadingWeather/>
  </div>
  <div class="weather" v-else>
    <div class="weather-main" v-if="!errorWeather">
      <div class="weather-main__date">
        <input v-on:keyup.enter="getWeather" v-model="nameCity">
        <h2>{{ getUTC }}</h2>
        <h2>{{ getDateNow }}</h2>
      </div>
      <div class="weather-main__icon">
        <img class="iconAnimation" alt="cloud" :src="require(`@/assets/iconWeather/${getIconWeather}.svg`)">
      </div>
      <div class="weather-main__temp">
        <h2>{{ descriptionWeather }}</h2>
        <div class="temp" @click="showCelsius = !showCelsius">
          <img alt="thermometer" src="@/assets/thermometer.svg">
          <p v-if="!showCelsius">{{ getTempCelsius }}</p>
          <p v-else>{{ getTempFahrenheit }}</p>
        </div>
      </div>
      <div class="weather-main__info">
        <div>
          <img src="@/assets/compass.svg" alt="compass">
          <h2>{{ visibility }}km</h2>
        </div>
        <div>
          <img src="@/assets/cloudy.svg" alt="cloudy">
          <h2>{{ pressure }}hPa</h2>
        </div>
        <div>
          <img src="@/assets/rain.svg" alt="rain">
          <h2>{{ humidity }}%</h2>
        </div>
      </div>
    </div>
    <div class="weather-main__error" v-else>
      <img alt="tornado" src="@/assets/tornado.svg">
      <h2>Something went wrong!</h2>
      <h5>Sorry! Something went wrong! Please try again </h5>
      <button @click="errorWeather = null">TRY AGAIN</button>
    </div>
  </div>
</template>

<script>
import {onMounted, ref, computed, inject} from "vue";
import LoadingWeather from "./LoadingWeather"

export default {
  name: 'Weather',
  components: {
    LoadingWeather,
  },
  setup() {
    const nameCity = ref('');
    const api = inject('api');
    const townWeather = ref('');
    const errorWeather = ref('');
    const getUTC = ref(new Date().toUTCString().slice(0, -12));
    const getDateNow = ref('');
    const loading = ref(true);
    const showCelsius = ref(false);

    const getTempCelsius = computed(() => `${Math.trunc(townWeather.value.main.temp - 273.15)}℃`);
    const getTempFahrenheit = computed(() => `${Math.trunc(((townWeather.value.main.temp - 273.15) * 1.8) + 32)}℉`);
    const descriptionWeather = computed(() => townWeather.value.weather[0].description.toUpperCase());
    const visibility = computed(() => Math.trunc(townWeather.value.visibility / 1000));
    const getIconWeather = computed(() => townWeather.value.weather[0].icon);
    const pressure = computed(() => townWeather.value.main.pressure);
    const humidity = computed(() => townWeather.value.main.humidity);

    const printTime = () => {
      loading.value = true;
      setInterval(() => {
        getDateNow.value = new Date().toLocaleTimeString().slice(0, -3);
      }, 40)
    }
    const getLocation = () => navigator.geolocation.getCurrentPosition(showLocationWeather);

    const getWeather = async () => {
      loading.value = true;
      try {
        townWeather.value = (
            await api.getWeather(nameCity.value)
        ).data;
        loading.value = false;
      } catch (error) {
        errorWeather.value = error.response.data.message;
        loading.value = false;
      }
    }

    const showLocationWeather = async (position) => {
      loading.value = true;
      try {
        townWeather.value = (
            await api.showLocationWeather(position.coords.latitude, position.coords.longitude)
        ).data;
        nameCity.value = townWeather.value.name
        loading.value = false;
      } catch (error) {
        errorWeather.value = error.response.data.message;
        loading.value = false;
      }
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
      getUTC,
      getDateNow,
      loading,
      showCelsius,
      getTempCelsius,
      getTempFahrenheit,
      getIconWeather,
      descriptionWeather,
      visibility,
      pressure,
      humidity
    }
  }
}
</script>
<style scoped>

h1 {
  color: #272727;
}

.weather {
  display: flex;
  justify-content: center;
}

.weather-main {
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

.temp p {
  font-size: 55px;
  margin: 20px 0 0 -20px;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.weather-main__info {
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: space-evenly;
}

.weather-main__icon img {
  width: 150px;
  height: 150px;
}

.weather-main__temp {
  margin: 20px 0 20px 0;
}

.weather-main__temp img {
  margin: 20px 0 0 -20px;
  width: 100px;
  height: 100px;
}

.weather-main__info img {
  width: 70px;
  height: 70px;
}

.weather-main__info h1 {
  margin: 0 0 20px;
}

.weather-main__error {
  padding: 50px 15px 0 15px;
  border-radius: 15px;
  box-shadow: 0 5px 10px 2px rgba(34, 60, 80, 0.2);
}

.weather-main__error h2, h5 {
  margin: 5px 0 0 0;
  color: #272727;
}

.weather-main__error button {
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

.weather-main__error button:hover {
  color: #f20000;
  background: #f0f0f0;
}

.weather-main__error img {
  width: 150px;
  height: 150px;
  padding: 0 0 40px 0;
}

.weather-main__date input {
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
  cursor: pointer;
}

.weather-main__date input:hover {
  border-radius: 10px 10px 0 0;
  background: #eaeaea;
}

</style>
