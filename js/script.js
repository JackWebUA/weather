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

  fetch(`${param.url}forecast?id=${cityValue}&units=metric&APPID=${param.appid}&cnt`)
    .then(weather => {
      return weather.json();
    }).then(showWeather);

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
  city.textContent = data.city.name;
  infoIcon.innerHTML = `<i class="wi wi-owm-${data.list[0].weather[0]['id']}"></i>`;
  infoTemp.innerHTML = Math.round(data.list[0].main.temp) + '&deg;';
  windSpeed.innerHTML = Math.round(data.list[0].wind['speed']) + ' ' + 'm/s';
  windDirection.innerHTML = `<i class="wi wi-wind towards-${data.list[0].wind['deg']}-deg"></i>`;

  const hourlyList = document.querySelector('.hourly-list');
  hourlyList.innerHTML = '';

  data.list.slice(0, 8).forEach(item => {
    const li = document.createElement('li');
    li.className = 'hourly-item';

    const timeString = moment(item.dt * 1000).format('HH:mm');

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
  })

  let timezone;
  let cityValue = citySelect.value;

  if (cityValue == '703448') {
    timezone = 'Europe/Kiev';
  } else if (cityValue == '6356055') {
    timezone = 'Europe/Madrid';
  } else if (cityValue == '7530768') {
    timezone = 'Europe/Warsaw';
  } else if (cityValue == '1689969') {
    timezone = 'America/Los_Angeles';
  } else if (cityValue == '1819729') {
    timezone = 'Asia/Hong_Kong';
  }

  let sunRise = moment.unix(data.city.sunrise).tz(timezone);
  sunrise.innerHTML = sunRise.format('HH:mm');

  let sunSet = moment.unix(data.city.sunset).tz(timezone);
  sunset.innerHTML = (sunSet.format('HH:mm'));

  if (timeUpdateInterval) {
    clearTimeout(timeUpdateInterval);
  }

  function date_time() {
    date.innerHTML = moment().tz(timezone).format('DD MMMM YYYY, HH:mm');
    timeUpdateInterval = setTimeout(date_time, 1000);
  }
  date_time();

  console.log('Raw sunrise:', data.city.sunrise);
  console.log('Raw sunset:', data.city.sunset);
  console.log('Sunrise in SF:', moment.unix(data.city.sunrise).tz('America/Los_Angeles').format('HH:mm'));
  console.log('Current time in SF:', moment().tz('America/Los_Angeles').format('HH:mm'));
}

getWeather();
citySelect.onchange = getWeather;