let bg = document.querySelector('.bg');
let city = document.querySelector('.city');
let citySelect = document.querySelector('.city-select');
let weatherContainer = document.querySelector('.weather-container');
let infoIcon = document.querySelector('.info-icon');
let infoTemp = document.querySelector('.info-temp');
let windSpeed = document.querySelector('.wind-speed');
let windDirection = document.querySelector('.wind-direction');
let date = document.querySelector('.date');
let sunrise = document.querySelector('.sunrise');
let sunset = document.querySelector('.sunset');

let timeUpdateInterval = null;

const param = {
    "url": "https://api.openweathermap.org/data/2.5/",
    "appid": "71cd991faddfdeb6c8c3e8423d81218d"
};

function getWeather() {
    let cityValue = citySelect.value;

    // Отримуємо поточну погоду та дані про схід/захід
    fetch(`${param.url}weather?id=${cityValue}&units=metric&APPID=${param.appid}`)
        .then(weather => weather.json())
        .then(currentWeather => {
            // Отримуємо прогноз на 5 днів
            fetch(`${param.url}forecast?id=${cityValue}&units=metric&APPID=${param.appid}&cnt=8`)
                .then(forecast => forecast.json())
                .then(forecastData => {
                    // Об'єднуємо дані
                    const combinedData = {
                        ...currentWeather,
                        list: forecastData.list
                    };
                    showWeather(combinedData);
                });
        });

    if (cityValue == '703448') {
        weatherContainer.style.backgroundImage = 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(img/kyiv.jpg)';
        bg.style.backgroundImage = 'url(img/kyiv.jpg)';
    } else if (cityValue == '6356055') {
        weatherContainer.style.backgroundImage = 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(img/barcelona.jpg)';
        bg.style.backgroundImage = 'url(img/barcelona.jpg)';
    } else if (cityValue == '7530768') {
        weatherContainer.style.backgroundImage = 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(img/krakuw.jpg)';
        bg.style.backgroundImage = 'url(img/krakuw.jpg)';
    } else if (cityValue == '1689969') {
        weatherContainer.style.backgroundImage = 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(img/san-francisco.jpg)';
        bg.style.backgroundImage = 'url(img/san-francisco.jpg)';
    } else if (cityValue == '1819729') {
        weatherContainer.style.backgroundImage = 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(img/hong-kong.jpg)';
        bg.style.backgroundImage = 'url(img/hong-kong.jpg)';
    }
}

function showWeather(data) {
    console.log(data);
    city.textContent = data.name;

    // Використовуємо дані з поточної погоди
    infoIcon.innerHTML = `<i class="wi wi-owm-${data.weather[0]['id']}"></i>`;
    infoTemp.innerHTML = Math.round(data.main.temp) + '&deg;';
    windSpeed.innerHTML = Math.round(data.wind['speed']) + ' ' + 'm/s';
    windDirection.innerHTML = `<i class="wi wi-wind towards-${data.wind['deg']}-deg"></i>`;

    let timezone;
    let cityValue = citySelect.value;

    if (cityValue === '703448') {
        timezone = 'Europe/Kiev';
    } else if (cityValue === '6356055') {
        timezone = 'Europe/Madrid';
    } else if (cityValue === '7530768') {
        timezone = 'Europe/Warsaw';
    } else if (cityValue === '1689969') {
        timezone = 'America/Los_Angeles';
    } else if (cityValue === '1819729') {
        timezone = 'Asia/Hong_Kong';
    }

    // Тепер використовуємо правильні дані з weather API
    console.log('Raw sunrise:', data.sys.sunrise);
    console.log('Raw sunset:', data.sys.sunset);

    let sunRise = moment.unix(data.sys.sunrise).tz(timezone);
    console.log('Processed sunrise:', sunRise.format('HH:mm'));
    sunrise.innerHTML = sunRise.format('HH:mm');

    let sunSet = moment.unix(data.sys.sunset).tz(timezone);
    console.log('Processed sunset:', sunSet.format('HH:mm'));
    sunset.innerHTML = sunSet.format('HH:mm');

    if (timeUpdateInterval) {
        clearTimeout(timeUpdateInterval);
    }

    // Hourly forecast
    const hourlyList = document.querySelector('.hourly-list');
    hourlyList.innerHTML = '';

    if (data.list) {
        data.list.forEach(item => {
            const li = document.createElement('li');
            li.className = 'hourly-item';

            const timeString = moment.unix(item.dt).tz(timezone).format('HH:mm');

            li.innerHTML = `
        <div class="hourly-time">${timeString}</div>
        <div class="hourly-icon">
          <i class="wi wi-owm-${item.weather[0].id}"></i>
        </div>
        <div class="hourly-temp">${Math.round(item.main.temp)}&deg;</div>
        <div class="hourly-time">
          <span class="wind-speed">${Math.round(item.wind.speed)}&nbsp;m/s</span>
          <i class="wi wi-wind towards-${item.wind.deg}-deg"></i>
        </div>
      `;

            hourlyList.appendChild(li);
        });
    }

    function date_time() {
        date.innerHTML = moment().tz(timezone).format('DD MMMM YYYY, HH:mm');
        timeUpdateInterval = setTimeout(date_time, 1000);
    }
    date_time();
}

getWeather();
citySelect.onchange = getWeather;