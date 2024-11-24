//routes/diaryRoutes
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const {
    createDiary,
    updateDiary,
    getAllDiaries,
    getDiaryById,
    deleteDiary,
} = require('../controllers/diaryController');
const router = express.Router();
// 미들웨어 적용
router.use(authMiddleware);
router.post('/diaries/create', createDiary); // 새로운 일기 작성
router.get('/diaries/check', getAllDiaries); // 모든 일기 조회
router.get('/diaries/:diary_id/check', getDiaryById); // 특정 일기 조회
router.post('/diaries/:diary_id/delete', deleteDiary); // 일기 삭제
router.post('/diaries/:diary_id/update', updateDiary); // 일기 업데이트

module.exports = router;
