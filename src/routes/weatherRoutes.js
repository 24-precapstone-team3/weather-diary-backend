// routes/weatherRoutes.js
const express = require('express');
const { getWeatherInfo } = require('../controllers/weatherController');

const router = express.Router();

// 날씨 정보 조회 엔드포인트
router.get('/weather', getWeatherInfo);
//http://localhost:3000/api/weather?location=Seoul

//라우터를 설정하여 파라미터 값 받기
//router.post('/api/weather', getWeatherInfo);

module.exports = router;
