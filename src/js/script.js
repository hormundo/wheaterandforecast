const KEY = "1dc82a28b0407cd1aab188ddebb887d6";
const URLBASE = "https://api.openweathermap.org/data/2.5/forecast";

document.addEventListener("DOMContentLoaded", e => {
    //Pedir activación de ubicación

    if (navigator.geolocation) navigator.geolocation.getCurrentPosition(function(pos) {
       
        //Si es aceptada guardamos lo latitud y longitud
        lat = pos.coords.latitude;
        lon = pos.coords.longitude;

        getCity(lat, lon, null);

    }, function(error) {

        //Si es rechazada enviamos de error por consola
        console.log('Ubicación no activada');
    });
})

const forecastCity = json => {
    document.querySelector(".btn-type-term--c").style.display = "flex";
    document.querySelector(".btn-type-term--f").style.display = "flex";

    const forecast = {
        dia: "",
        icon: "",
        desc: "",
        mintemp: "",
        maxtemp: ""
    }

    document.querySelector(".forecasts").innerHTML = "";

    const $template = document.querySelector(".forecast-template").content;
    const $fragment = document.createDocumentFragment();

    for (let i = 5; i < 40; i+=8) {
        let dia = json.list[i].dt_txt.split(" ");

        forecast.dia = dia[0];
        forecast.icon = json.list[i].weather[0].icon;
        forecast.desc = json.list[i].weather[0].description;
        forecast.mintemp = Math.round(json.list[i].main.temp_min);
        forecast.maxtemp = Math.round(json.list[i].main.temp_max);
        
        $template.querySelector("h6").textContent = forecast.dia;
        $template.querySelector(".current-wheater img").src = `./src/images/${forecast.icon}@2x.png`;
        $template.querySelector(".description").textContent = forecast.desc;
        $template.querySelector(".mintemp").textContent = forecast.mintemp;
        $template.querySelector(".maxtemp").textContent = forecast.maxtemp;

        $clone = document.importNode($template, true);

        $fragment.appendChild($clone);
    }

    document.querySelector(".forecasts").appendChild($fragment);
}

const hightlights = json => { 
    document.querySelector(".hightlights").style.display = "grid";
    document.querySelector(".wind-status .wind-speed").textContent = `${json.list[0].wind.speed} Kmh`;
    let $humidityBar = document.querySelector(".wind-status .progress-humidity");
    $humidityBar.style.width = json.list[0].main.humidity+"%";
    
    document.querySelector(".humidity-percent").textContent = `${json.list[0].main.humidity} %`;
    document.querySelector(".presure").textContent = `${json.list[0].main.pressure} mts`;
    document.querySelector(".sea-level").textContent = `${json.list[0].main.sea_level} mts`;
}

async function getCity(lat, lon, city, unit) {
    let url = "";
    
    if(unit) {
        url = `${URLBASE}?q=${city}&lang=es&units=${unit}&appid=${KEY}`;
    } else {
        if (!city) {
            url = `${URLBASE}?lat=${lat}&lon=${lon}&lang=es&units=metric&appid=${KEY}`;
        } else {
            url = `${URLBASE}?q=${city}&lang=es&units=metric&appid=${KEY}`;
        }    
    }
    
    try {
        let res = await fetch(url);
        let json = await res.json();
        
        document.querySelector(".current-wheater img").src = `./src/images/${json.list[0].weather[0].icon}@2x.png`;
        document.querySelector(".current-location").textContent = json.city.name;
        document.querySelector(".population").textContent = ` ${json.city.population} Hab.`;

        let temperature = document.querySelector(".current-temperature");
        temperature.textContent = Math.round(json.list[0].main.temp);
        
        let sub = document.createElement("SUB");
        sub.classList.add("text-gray-semibold");
        sub.textContent = "°C";

        document.querySelector(".current-phenomenom-atmospheric").textContent = json.list[0].weather[0].description;
        
        let sunset = moment.unix(json.city.sunset);
        let sunsetHour = sunset._d.getHours();
        let sunsetMinutes = sunset._d.getHours();
        let sunrise = moment.unix(json.city.sunrise);
        let sunriseHour = sunrise._d.getHours();
        let sunriseMinutes = sunrise._d.getHours();

        document.querySelector(".sunrise").textContent = `${(sunriseHour < 10) ? "0"+sunriseHour : sunriseHour}:${(sunriseMinutes < 10 ? "0"+sunriseMinutes : sunriseMinutes)}`;
        document.querySelector(".sunset").textContent = `${(sunsetHour < 10) ? "0"+sunsetHour : sunsetHour}:${sunsetMinutes < 10 ? "0"+sunsetMinutes : sunsetMinutes}`;

        temperature.insertAdjacentElement("beforeend", sub);

        let date = new Date();
        let dayWeek;

        switch (date.getUTCDay()) {
            
            case 1: dayWeek = "Lunes";
                    break;
            case 2: dayWeek = "Martes";
                    break;
            case 3: dayWeek = "Miércoles";
                    break;
            case 4: dayWeek = "Jueves";
                    break;
            case 5: dayWeek = "Viernes";
                    break;
            case 6: dayWeek = "Sábado";
                    break;
            case 0: dayWeek = "Domingo";
                    break;
        }

        document.querySelector(".date").textContent = `${dayWeek}, ${date.toLocaleDateString()}`;

        if (!res.ok) throw {status: res.status, statusText: res.statusText};

        document.querySelector(".current-temperature").style.display = "block";
        document.querySelector(".current-location").style.display = "block";
        document.querySelector(".sunrise").style.display = "flex";
        document.querySelector(".sunset").style.display = "flex";

        forecastCity(json);
        hightlights(json);

    } catch(err) {
        let message = err.statusText || "Ocurrio un error";
        document.querySelector(".content").insertAdjacentHTML("afterend",`<p><b>Error ${err.status} ${message}</b></p>`)
    }
}

document.addEventListener('click', e => {
    if(e.target.matches(".btn-search-location")) {
        document.querySelector(".menu").classList.add("visible");
    }

    if(e.target.matches(".fa-times")) {
        document.querySelector(".menu").classList.remove("visible");
    }


    if(e.target.matches(".btn-current-location")) {
        navigator.geolocation.getCurrentPosition(function(pos) {
       
            //Si es aceptada guardamos lo latitud y longitud
            lat = pos.coords.latitude;
            lon = pos.coords.longitude;
            getCity(lat, lon);
    
        })
    }

    if(e.target.matches(".btn-search")) {
        let city = document.querySelector("input").value;
        document.querySelector(".menu").classList.remove("visible");

        getCity(null, null, city, null);
    }

    if(e.target.matches(".btn-type-term--c")) {
        city = document.querySelector(".current-location").textContent;
        let unit = "metric";

        e.target.classList.add("active");
        document.querySelector(".btn-type-term--f").classList.remove("active");

        getCity(null, null, city, unit);
    }

    if(e.target.matches(".btn-type-term--f")) {
        city = document.querySelector(".current-location").textContent;
        let unit = "imperial";

        e.target.classList.add("active");
        document.querySelector(".btn-type-term--f").classList.remove("active");

        getCity(null, null, city, unit);
    }
})
