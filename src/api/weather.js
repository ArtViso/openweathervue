export default function (instance) {
    return {
        getWeather(nameCity) {
            return instance.get(`?q=${nameCity}&appid=${process.env.VUE_APP_KEY}`)
        },
        showLocationWeather(latitude, longitude) {
            return instance.get(`?lat=${latitude}&lon=${longitude}&appid=${process.env.VUE_APP_KEY}`)
        },
    }
}
