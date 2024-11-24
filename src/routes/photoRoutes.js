// routes/PhotoRoutes.js
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
const {uploadPhoto, getPhotosByDiaryId, deletePhotosByDiaryId} = require('../controllers/photoController');

router.use(authMiddleware); // 미들웨어 적용
// 사진 파일 업로드 및 경로 저장
router.post('/photo/upload', uploadPhoto);

// 특정 diary_id에 해당하는 사진 조회 라우트 추가
router.get('/photo/:diary_id', getPhotosByDiaryId);

// 특정 diary_id에 연결된 모든 사진 삭제
router.delete('/photo/:diary_id', deletePhotosByDiaryId);

module.exports = router;