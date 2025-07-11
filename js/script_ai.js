// Конфігурація міст
const CITIES = {
    '703448': { name: 'kyiv', timezone: 'Europe/Kiev' },
    '6356055': { name: 'barcelona', timezone: 'Europe/Madrid' },
    '7530768': { name: 'krakuw', timezone: 'Europe/Warsaw' },
    '1689969': { name: 'san-francisco', timezone: 'America/Los_Angeles' },
    '1819729': { name: 'hong-kong', timezone: 'Asia/Hong_Kong' }
};

// API конфігурація
const API_CONFIG = {
    url: 'https://api.openweathermap.org/data/2.5/',
    key: '71cd991faddfdeb6c8c3e8423d81218d'
};

// DOM елементи
const elements = {
    bg: document.querySelector('.bg'),
    city: document.querySelector('.city'),
    citySelect: document.querySelector('.city-select'),
    weatherContainer: document.querySelector('.weather-container'),
    infoIcon: document.querySelector('.info-icon'),
    infoTemp: document.querySelector('.info-temp'),
    windSpeed: document.querySelector('.wind-speed'),
    windDirection: document.querySelector('.wind-direction'),
    date: document.querySelector('.date'),
    sunrise: document.querySelector('.sunrise'),
    sunset: document.querySelector('.sunset'),
    hourlyList: document.querySelector('.hourly-list')
};

// Глобальні змінні
let timeUpdateInterval = null;

// Встановлення фонових зображень
function setBackgroundImages(cityId) {
    const cityName = CITIES[cityId].name;
    const imageUrl = `url(img/${cityName}.jpg)`;
    const gradientUrl = `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), ${imageUrl}`;

    elements.weatherContainer.style.backgroundImage = gradientUrl;
    elements.bg.style.backgroundImage = imageUrl;
}

// Створення елементу прогнозу на годину
function createHourlyItem(item, timezone) {
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

    return li;
}

// Оновлення годинного прогнозу
function updateHourlyForecast(data, timezone) {
    elements.hourlyList.innerHTML = '';

    data.list.slice(0, 8).forEach(item => {
        const hourlyItem = createHourlyItem(item, timezone);
        elements.hourlyList.appendChild(hourlyItem);
    });
}

// Запуск оновлення часу
function startTimeUpdate(timezone) {
    // Очищуємо попередній таймер
    if (timeUpdateInterval) {
        clearTimeout(timeUpdateInterval);
    }

    function updateTime() {
        elements.date.innerHTML = moment().tz(timezone).format('DD MMMM YYYY, HH:mm');
        timeUpdateInterval = setTimeout(updateTime, 1000);
    }

    updateTime();
}

// Відображення даних про погоду
function showWeather(data) {
    const cityId = elements.citySelect.value;
    const cityConfig = CITIES[cityId];
    const timezone = cityConfig.timezone;

    // Основна інформація
    elements.city.textContent = data.city.name;
    elements.infoIcon.innerHTML = `<i class="wi wi-owm-${data.list[0].weather[0].id}"></i>`;
    elements.infoTemp.innerHTML = `${Math.round(data.list[0].main.temp)}&deg;`;
    elements.windSpeed.innerHTML = `${Math.round(data.list[0].wind.speed)} m/s`;
    elements.windDirection.innerHTML = `<i class="wi wi-wind towards-${data.list[0].wind.deg}-deg"></i>`;

    // Схід і захід сонця
    const sunriseTime = moment.unix(data.city.sunrise).tz(timezone).format('HH:mm');
    const sunsetTime = moment.unix(data.city.sunset).tz(timezone).format('HH:mm');
    elements.sunrise.innerHTML = sunriseTime;
    elements.sunset.innerHTML = sunsetTime;

    // Оновлення прогнозу та часу
    updateHourlyForecast(data, timezone);
    startTimeUpdate(timezone);
}

// Отримання даних про погоду
async function getWeather() {
    const cityId = elements.citySelect.value;

    try {
        const response = await fetch(
            `${API_CONFIG.url}forecast?id=${cityId}&units=metric&APPID=${API_CONFIG.key}&cnt=8`
        );
        const data = await response.json();

        setBackgroundImages(cityId);
        showWeather(data);
    } catch (error) {
        console.error('Помилка при отриманні даних про погоду:', error);
    }
}

// Ініціалізація
function init() {
    getWeather();
    elements.citySelect.addEventListener('change', getWeather);
}

// Запуск програми
init();