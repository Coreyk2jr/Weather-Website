const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');

const API_KEY = '9f89d5ae67eec558fb22e3b4f1f5e519';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Function to update date and time
function updateDateTime() {
    const now = new Date();
    const month = now.getMonth();
    const date = now.getDate();
    const day = now.getDay();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM';

    const formattedHour = hour % 12 || 12; // Convert hour to 12-hour format
    const formattedMinute = minute < 10 ? '0' + minute : minute;

    timeEl.innerHTML = `${formattedHour}:${formattedMinute} <span id="am-pm">${ampm}</span>`;
    dateEl.innerHTML = `${days[day]}, ${date} ${months[month]}`;
}

// Function to fetch current weather data from OpenWeatherMap API
function fetchWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            getWeatherData(latitude, longitude);
            getForecastData(latitude, longitude);
        }, error => {
            console.error('Error fetching location:', error);
            alert('Error fetching location. Please allow location access.');
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

// Function to fetch current weather data
function getWeatherData(latitude, longitude) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${API_KEY}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Current Weather Data:', data);
            showCurrentWeatherData(data);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data');
        });
}

// Function to display current weather data
function showCurrentWeatherData(data) {
    const { main, weather, sys, name } = data;

    timezone.innerHTML = `Timezone: GMT${sys.timezone / 3600}`;
    countryEl.innerHTML = `${name}, ${sys.country}`;

    currentWeatherItemsEl.innerHTML = `
        <div class="weather-item">
            <div class="weather-icon">
                <img src="https://openweathermap.org/img/wn/10d@2x.png" alt="weather icon" class="w-icon">
            </div>
            <div class="weather-info">
                <div class="weather-label">Temperature</div>
                <div class="weather-value">${main.temp}&#176; F</div>
            </div>
        </div>
        <div class="weather-item">
            <div class="weather-icon">
                <img src="https://openweathermap.org/img/wn/10d@2x.png" alt="weather icon" class="w-icon">
            </div>
            <div class="weather-info">
                <div class="weather-label">Humidity</div>
                <div class="weather-value">${main.humidity}%</div>
            </div>
        </div>
        <div class="weather-item">
            <div class="weather-icon">
                <img src="https://openweathermap.org/img/wn/10d@2x.png" alt="weather icon" class="w-icon">
            </div>
            <div class="weather-info">
                <div class="weather-label">Pressure</div>
                <div class="weather-value">${main.pressure} hPa</div>
            </div>
        </div>
        <div class="weather-item">
            <div class="weather-icon">
                <img src="https://openweathermap.org/img/wn/10d@2x.png" alt="weather icon" class="w-icon">
            </div>
            <div class="weather-info">
                <div class="weather-label">Wind Speed</div>
                <div class="weather-value">${data.wind.speed} mph</div>
            </div>
        </div>
        <div class="weather-item">
            <div class="weather-icon">
                <img src="https://openweathermap.org/img/wn/10d@2x.png" alt="weather icon" class="w-icon">
            </div>
            <div class="weather-info">
                <div class="weather-label">Weather</div>
                <div class="weather-value">${weather[0].description}</div>
            </div>
        </div>
    `;
}

// Function to fetch weather forecast data
function getForecastData(latitude, longitude) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${API_KEY}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Forecast Data:', data);
            showForecastData(data);
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
            alert('Error fetching forecast data');
        });
}

// Function to display weather forecast data
function showForecastData(data) {
    const forecast = data.list;

    // Clear previous forecast
    weatherForecastEl.innerHTML = '';

    // Track days already displayed
    const displayedDays = [];

    forecast.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = days[date.getDay()];

        // Check if day is already displayed
        if (!displayedDays.includes(day)) {
            displayedDays.push(day);

            const tempDay = item.main.temp_max.toFixed(1);
            const tempNight = item.main.temp_min.toFixed(1);

            const forecastItem = document.createElement('div');
            forecastItem.classList.add('weather-forecast-item');
            forecastItem.innerHTML = `
                <div class="day">${day}</div>
                <img src="https://openweathermap.org/img/wn/10d@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Night - ${tempNight}&#176; F</div>
                <div class="temp">Day - ${tempDay}&#176; F</div>
            `;
            weatherForecastEl.appendChild(forecastItem);
        }
    });
}

// Update date and time initially and every second
updateDateTime();
setInterval(updateDateTime, 1000);
