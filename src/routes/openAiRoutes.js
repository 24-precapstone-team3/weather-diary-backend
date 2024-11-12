// routes/openAiRoutes.js
const express = require('express');
const router = express.Router();
const {analyzeContent, provideCounseling} = require('../controllers/openAiController');

// 일기 추출 요청 라우트
router.post('/analyze',analyzeContent);

//일기 상담 요청 라우트 
router.post('/counsel', provideCounseling);

module.exports = router;