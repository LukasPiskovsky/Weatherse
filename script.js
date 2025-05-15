/****DOM****/
const cityInput = document.getElementById("city-input")
const submitBtn = document.getElementById("submit")
const gridContainer = document.getElementById("grid-container")
const languageBtn = document.getElementById("language")
const html = document.querySelector("html")
const footer = document.querySelector("footer")

/****LANGUAGE****/
let language = JSON.parse(localStorage.getItem("language")) ?? true
console.log(language)
languageBtn.addEventListener("click", () =>{
    language = !language
    localStorage.setItem("language", language)
    renderCities()
    if(language){
        languageBtn.children[0].src = "img/czech.png"
        html.lang = "en"
        cityInput.placeholder = "Enter city"
        submitBtn.value = "Submit"
    } else {
        languageBtn.children[0].src = "img/great-britain.png"
        html.lang = "cs"
        cityInput.placeholder = "Napiš název města"
        submitBtn.value = "Odeslat"
    }

})

if(language){
    languageBtn.children[0].src = "img/czech.png"
    html.lang = "en"
    cityInput.placeholder = "Enter city"
    submitBtn.value = "Submit"
} else {
    languageBtn.children[0].src = "img/great-britain.png"
    html.lang = "cs"
    cityInput.placeholder = "Napiš název města"
    submitBtn.value = "Odeslat"
}

/****WEATHER****/
let apiKey = "fb10fb940f990fd432e361f4596cbb42"

let weatherApi = async function (cityName) {
    try{
        if(language){
            let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`)

            if(!response.ok){
                throw new Error("HTTP error! status: " + response.status);
            }
    
            const weatherData = await response.json();
            return weatherData;
        } else{
            let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric&lang=cz`)

            if(!response.ok){
                throw new Error("HTTP error! status: " + response.status);
            }
    
            const weatherData = await response.json();
            return weatherData;
        }

    }
    catch(error){
        let message = language ? "The weather data were not fetched, problem:" : "Počasí není dostupné, problém: "
        console.log(message, error);
        setTimeout( () => {
            resultArray.pop()
            localStorage.setItem("savedCities", JSON.stringify(resultArray))
            cityInput.value = ""
        }, 200)
        // alert("city was not found")
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
        let message = language ? "Error fetching weather for city: " : "Počasí není dostupné, problém: "
        console.log(message, city, error)
    }
})

cityInput.addEventListener("keydown", async (e) => {
    if(e.key == "Enter"){
        let city = cityInput.value 
        cityInput.value = ""
        try{
            let weather = await weatherApi(city)
            resultArray.push(weather)
            localStorage.setItem("savedCities", JSON.stringify(resultArray))
            renderCities()
        }
        catch(error){
            let message = language ? "Error fetching weather for city: " : "Počasí není dostupné, problém: "
            console.log(message, city, error)
        }
    }

})

/****UPDATE VALUES****/
let updateValuesForAll = async () =>{
    for(let i = 0; i < resultArray.length; i++){
        try{
            let updatedData = await weatherApi(resultArray[i].name)
            resultArray[i] = { ...resultArray[i], ...updatedData }
        }
        catch(error){
            let message = language ? "error fetching data from update: " : "Chyba při načítání dat, problém: "
            console.log(message, error)
        }
    }
    localStorage.setItem("savedCities", JSON.stringify(resultArray))
    renderCities()
}

updateValuesForAll()

setInterval( async ()=>{
    updateValuesForAll()
}, 5000)



/****RENDER GRID ITEMS****/
let renderCities = async() =>{
    gridContainer.innerHTML = ""
    // console.log(resultArray)
    resultArray.forEach(  (city, index) =>{
        let cityContainer = document.createElement("div")

        let heading = document.createElement("h2")
        heading.textContent = city.name

        let weatherBox = document.createElement("div")
        let weather = document.createElement("p")
        weather.textContent = `${language? "Temp: " : "Teplota: "} ${Math.round(city.main.temp)} °C`
        let weatherIcon = document.createElement("img")
        weatherIcon.src = `https://openweathermap.org/img/wn/${city.weather[0].icon}@2x.png`

        let windBox = document.createElement("div")
        let wind = document.createElement("p")
        wind.textContent = `${language? "Wind speed: " : "Rychlost větru: "} ${city.wind.speed} ms`
        let windIcon = document.createElement("img")
        windIcon.src = (city.wind.speed < 5) ? "img/keyboard_arrow_up.png" : "img/keyboard_double_arrow_up.png"
        // windIcon.src = "img/keyboard_arrow_up.png"
        windIcon.style.transform = `rotate(${city.wind.deg}deg)`
        let deleteItem = document.createElement("button")
        deleteItem.textContent = language ? "Delete" : "Vymazat"
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

/****SET ANIMATION TO APPLY ONCE****/
window.addEventListener("DOMContentLoaded", () => {
    const gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach(item => item.classList.add('animate-shadow'));
  });


/***FOOTER DISPLAY*/
window.addEventListener("scroll", ()=>{


    console.log((window.innerHeight + window.pageYOffset) == html.scrollHeight)

    if((window.innerHeight + window.pageYOffset) == html.scrollHeight){
        footer.style.visibility = "visible"
    }
    else{
        footer.style.visibility = "hidden"
    }
})

if((window.innerHeight + window.pageYOffset) == html.scrollHeight){
    footer.style.visibility = "visible"
}
else{
    footer.style.visibility = "hidden"
}