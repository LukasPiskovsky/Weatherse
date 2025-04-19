/****DOM****/
const cityInput = document.getElementById("city-input")
const submitBtn = document.getElementById("submit")
const gridContainer = document.getElementById("grid-container")

/****WEATHER****/
let apiKey = "fb10fb940f990fd432e361f4596cbb42"

let weatherApi = async function (cityName) {
    try{
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`)

        if(!response.ok){
            throw new Error("HTTP error! status: " + response.status);
        }

        const weatherData = await response.json();
        return weatherData;
    }
    catch(error){
        console.log("The weather data were not fetched, problem:", error);
        setTimeout( () => {
            resultArray.pop()
            localStorage.setItem("savedCities", JSON.stringify(resultArray))
        }, 200)
        alert("city was not found")
    }
}

/****INPUT****/

let resultArray = JSON.parse(localStorage.getItem("savedCities")) ?? []

submitBtn.addEventListener("click", async () => {
    let city = cityInput.value 
    cityInput.value = ""
    try{
        let weather = await weatherApi(city)
        resultArray.push(weather)
        localStorage.setItem("savedCities", JSON.stringify(resultArray))
        renderCities()
    }
    catch(error){
        console.log("Error fetching weather for city: ", city, error)
    }
})

/****RENDER GRID ITEMS****/
let renderCities = async() =>{
    gridContainer.innerHTML = ""
    console.log(resultArray)
    resultArray.forEach(  (city, index) =>{
        let cityContainer = document.createElement("div")

        let heading = document.createElement("h2")
        heading.textContent = city.name

        let weatherBox = document.createElement("div")
        let weather = document.createElement("p")
        weather.textContent = `Temp: ${Math.round(city.main.temp)} °C`
        let weatherIcon = document.createElement("img")
        weatherIcon.src = `https://openweathermap.org/img/wn/${city.weather[0].icon}@2x.png`

        let windBox = document.createElement("div")
        let wind = document.createElement("p")
        wind.textContent = `Wind speed: ${city.wind.speed} ms`
        let windIcon = document.createElement("img")
        windIcon.src = (city.wind.speed < 15) ? "img/keyboard_arrow_up.png" : "img/keyboard_double_arrow_up.png"
        // windIcon.src = "img/keyboard_arrow_up.png"
        windIcon.style.transform = `rotate(${city.wind.deg}deg)`
        let deleteItem = document.createElement("button")
        deleteItem.textContent = "Delete"
        deleteItem.addEventListener("click", (e) => {
            resultArray.splice(index, 1)

            localStorage.setItem("savedCities", JSON.stringify(resultArray))
            renderCities()
        })

        cityContainer.classList.add("grid-item")
        cityContainer.appendChild(heading)

        weatherBox.classList.add("weather-box")
        weatherBox.appendChild(weather)
        weatherBox.appendChild(weatherIcon)
        cityContainer.appendChild(weatherBox)

        windBox.classList.add("wind-box")
        windBox.appendChild(wind)
        windBox.appendChild(windIcon)
        cityContainer.appendChild(windBox)

        cityContainer.appendChild(deleteItem)

        gridContainer.appendChild(cityContainer)
    })
}

renderCities()

/****SET ANIMATION****/
window.addEventListener("DOMContentLoaded", () => {
    const gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach(item => item.classList.add('animate-shadow'));
  });