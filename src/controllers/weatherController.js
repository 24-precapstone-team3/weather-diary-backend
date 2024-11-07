// controllers/weatherController.js
const { getWeather } = require('../models/Weather');

const getWeatherInfo = async (req, res) => {
    const {location } = req.query;
    //const { date, location } = req.body; // 프론트엔드에서 보낸 데이터

    if (!location) {
        return res.status(400).json({ message: '위치를 제공해야 합니다.' });
    }

    try {
        const weatherData = await getWeather(location);
        const response = {
            location,
            weather: {
                temperature: weatherData.main.temp, // 현재 온도
                description: weatherData.weather[0].description, // 날씨 설명
                rain: weatherData.rain ? weatherData.rain["1h"] : 0 // 비가 온다면 1시간 기준으로 강수량, 아니면 0       
            },
            message: `${location}의 날씨를 성공적으로 조회했습니다.`,
        };
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { getWeatherInfo };
