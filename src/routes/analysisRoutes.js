// routes/analysisRoutes.js
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
const {saveFeedback, getFeedbackByDiaryId, deleteFeedback} = require('../controllers/analysisController');

router.use(authMiddleware); // 미들웨어 적용
// 피드백 저장 라우트
router.post('/feedback', saveFeedback);

// 특정 일기의 피드백 조회 라우트
router.get('/feedback/:diary_id', getFeedbackByDiaryId);

// 피드백 삭제
router.delete('/feedback/:diary_id', deleteFeedback);

module.exports = router;