function updateDateTime() {
    const dateTimeElement = document.getElementById('date-time');
    const now = new Date();

    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit' };

    const date = now.toLocaleDateString('ru-RU', dateOptions);
    const time = now.toLocaleTimeString('ru-RU', timeOptions);

    dateTimeElement.textContent = `${date}, ${time}`;
}

function updateWeather() {
    const weatherElement = document.getElementById('weather');

    fetch('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Turkmenistan%20Turkmenabat?unitGroup=metric&key=E6ZCEZ8X5UHBXE83MCRP79FDV&contentType=json')
    .then(response => response.json())
    .then(data => {
        const city = data.address;
        const condition = data.days[0].conditions;
        const temperature = data.days[0].temp;
        const windSpeed = data.days[0].windspeed;
        const date = data.days[0].datetime;

        weatherElement.innerHTML = `
            <h2>Погода в ${city}</h2>
            <p>Дата: ${date}</p>
            <p>Погода: ${condition}</p>
            <p>Температура: ${temperature}°C</p>
            <p>Скорость ветра: ${windSpeed} км/ч</p>
        `;

        // Сохранение в localStorage
        localStorage.setItem('weatherData', JSON.stringify(data));

    })
        .catch(error => {
            weatherElement.innerHTML = `<p>Не удалось получить прогноз погоды. Загружаю последние сохраненные данные</p>`;
            // Загрузка из localStorage при ошибке
            const cachedData = localStorage.getItem('weatherData');
            if (cachedData) {
                const data = JSON.parse(cachedData);
                const city = data.address;
                const condition = data.days[0].conditions;
                const temperature = data.days[0].temp;
                const windSpeed = data.days[0].windspeed;
                 const date = data.days[0].datetime;

                weatherElement.innerHTML = `
                    <h2>Погода в ${city}</h2>
                    <p>Дата: ${date}</p>
                    <p>Погода: ${condition}</p>
                    <p>Температура: ${temperature}°C</p>
                    <p>Скорость ветра: ${windSpeed} км/ч</p>
                `;
            }
        });
}


updateDateTime();
setInterval(updateDateTime, 1000);

updateWeather();