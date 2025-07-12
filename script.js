const cityInput = document.querySelector('.city-input');
const searchbtn = document.querySelector('.search-btn');

const weather_section=document.querySelector(".weather-info");
const not_found_section=document.querySelector(".not-found");
const search_city=document.querySelector('.search-city');

const countryTxt=document.querySelector(".country-txt");
const tempTxt=document.querySelector(".temp-txt");
const conditionTxt=document.querySelector(".condition-txt");
const humidityTxt=document.querySelector(".humidity-value-txt");
const windTxt=document.querySelector(".wind-value-txt");
const weatherSummaryimg=document.querySelector(".weather-summary-img");
const currentDate=document.querySelector(".current-date-txt");

const forecastItemscontainer=document.querySelector(".forecast-item-container");


const apiKey= '2b99a2994f502f8396800707e67dd688';

searchbtn.addEventListener('click',()=>{
    if(cityInput.value.trim()!==""){
        update_weather_data(cityInput.value);
         cityInput.value="";
         cityInput.blur();
    }
    else{
        cityInput.value='';
    }
   
})



cityInput.addEventListener("keydown",(event)=>{
    if(event.key=="Enter" && cityInput.value.trim()!==""){
        update_weather_data(cityInput.value);
        cityInput.value="";
        cityInput.blur();
    }
    else if(event.key=="Enter" && cityInput.value.trim()==""){
        cityInput.value='';
    }
    
});

async function getFetchdata(endpoint,city){
    const apiurl=`https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&appid=${apiKey}&units=metric`;

    const response = await fetch(apiurl);

    return response.json();
}



async function update_weather_data(city){
    const weather_data= await getFetchdata('weather',city)
    if (weather_data.cod==200){
            section_display(weather_section);
            console.log(weather_data)

    }else{

        section_display(not_found_section);
    }

    const{
        name: name2,
        main:{temp,humidity},
        weather:[{id,main}],
        wind:{speed}
    }=weather_data

    countryTxt.textContent=name2;
     tempTxt.textContent=Math.round(temp) + ' °C';
     humidityTxt.textContent=humidity+'%';
     conditionTxt.textContent=main;
     windTxt.textContent=speed+'M/s';
    weatherSummaryimg.src =`/weather/${getWeatherid(id)}`;
    currentDate.textContent=getcurrentDate();
    await updateForecastInfo(city)
    
}

async function updateForecastInfo(city){
    const forecastData= await getFetchdata('forecast',city);
    const timeTaken='12:00:00';
    const todaydate= new Date().toISOString().split('T')[0];

    forecastItemscontainer.innerHTML=''
    forecastData.list.forEach(forecastweather=>{
        if(forecastweather.dt_txt.includes(timeTaken) && !forecastweather.dt_txt.includes(todaydate)){
            console.log(forecastweather)
            updateforecastItem(forecastweather)
        }
    })
}

function updateforecastItem(weathers){
    console.log(weathers)
    const{
        dt_txt:date,
        weather:[{id}],
        main:{temp}
    }=weathers

    const dateTaken = new Date(date);
    const dateOption={
        day:'2-digit',
        month:'short',

    }
    const dateResult= dateTaken.toLocaleDateString('en-GB',dateOption)


    const forcastItem =`

            <div class="forecast-item">
                    <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
                        <img src="/weather/${getWeatherid(id)}" class="forecast-item-img">
                    <h5 class="forecast item temp">${Math.round(temp)} °C</h5>
            </div>

    `
    forecastItemscontainer.insertAdjacentHTML('beforeend',forcastItem)
}


function section_display(section){
    [search_city,weather_section,not_found_section].forEach(section => section.style.display = 'none')
    
    section.style.display ='';
}

function getWeatherid(id){
    if (id<=232) return 'thunderstorm.svg'
    if (id<=321) return 'drizzle.svg'
    if (id<=531) return 'rain.svg'
    if (id<=622) return 'snow.svg'
    if (id<=781) return 'atmosphere.svg'
    if (id<=800) return 'clear.svg'
    else return 'clouds.svg'
    
}

function getcurrentDate(){
    const today= new Date();
    const option={
        weekday: 'short',
        day:'2-digit',
        month: 'short',
    }

    return today.toLocaleDateString('en-GB',option)
}