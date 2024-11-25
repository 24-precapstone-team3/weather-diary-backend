const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

// 사용자 인증 없이 접근 가능한 날씨 조회 경로 설정
router.get('/weather', weatherController.getWeatherInfo);

module.exports = router;
