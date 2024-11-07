//routes/diaryRoutes
const express = require('express');
const {
    createDiary,
    //updateDiary,
    getAllDiaries,
    getDiaryById,
    deleteDiary,
    // searchDiaries
} = require('../controllers/diaryController');
const router = express.Router();

router.post('/diaries/create', createDiary); // 새로운 일기 작성
router.get('/diaries/check', getAllDiaries); // 모든 일기 조회
router.get('/diaries/:diary_id/check', getDiaryById); // 특정 일기 조회
// router.get('/diaries/search', searchDiaries); // 일기 검색 (해시태그 기반)
router.post('/diaries/:diary_id/delete', deleteDiary); // 일기 삭제
// router.post('/diaries/:id', updateDiary); // 일기 업데이트

module.exports = router;
