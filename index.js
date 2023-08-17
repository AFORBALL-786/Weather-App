const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const grantAccessContainer = document.querySelector(".grant-location");
const userInfoContainer = document.querySelector(".display-info");

const grantBtn = document.querySelector("[data-grantAccess]");


let currentTab = userTab;
const API_KEY ="d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("current-tab");

grantAccessContainer.classList.add("active");


function renderInfo(data){
    const cityName = document.querySelector("[data-cityName]");
    const flagIcon = document.querySelector("[data-countryFlag]");
    const desc = document.querySelector("[data-weatherDes]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-tempr]");
    const windSpeed = document.querySelector("[data-wind]");
    const humidity = document.querySelector("[data-humidity]");
    const cloud = document.querySelector("[data-cloud]");

    // filling the value dyanamically
    cityName.innerText = data?.name;
    flagIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    desc.innerText = data?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temp.innerText = `${data?.main?.temp} °C`;
    windSpeed.innerText = `${data?.wind?.speed} m/s`;
    humidity.innerText = `${data?.main?.humidity}%`;
    cloud.innerText = `${data?.clouds?.all}%`;

}

async function fetchUserWeatherInfo(cordinates){
    const {lat, lon} = cordinates;
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");
    // API CALL

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderInfo(data);  //rendering on UI
    }
    catch(e){
        loadingScreen.classList.remove("active");
        alert("Check Your Connection");
    }

}

function getuserInfo(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if (!localCoordinates) {
        grantAccessContainer.classList.add("active");
    } 
    else 
    {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}


function switchTab(newTab){
    if(currentTab != newTab){
        currentTab.classList.remove("current-tab");
        currentTab = newTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            grantAccessContainer.classList.remove("active");
            userInfoContainer.classList.remove("active");
            searchForm.classList.add("active");
        }

        else { //already on search tab
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getuserInfo();
        }
    }

}

userTab.addEventListener("click", () => {
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    switchTab(searchTab);
});

function showPosition(position){
    const userCoordinates =  {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("userCordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("GeoLocation Feature is not supporting in this device");
    }
}

grantBtn.addEventListener("click", getLocation);

// search api call
let searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if(searchInput.value === "") return;
    fetchSearchWeatherInfo(searchInput.value);
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`); 
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderInfo(data);
    }
    catch(e){
        loadingScreen.classList.remove("active");
        alert("Check Your Connection");
    }
}