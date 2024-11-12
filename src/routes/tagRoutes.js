// routes/tagRoutes.js
const express = require('express');
const router = express.Router();
const {addTags, getDiariesByTag, getTagsByDiaryId, deleteTagsFromDiary} = require('../controllers/tagController');

// 해시태그 추가
router.post('/tag', addTags);

// 특정 태그와 연관된 일기 목록 조회
router.get('/tag/search/:tagName', getDiariesByTag);

// 특정 일기에 등록된 태그 조회
router.get('/tag/:diary_id', getTagsByDiaryId);

// 태그 삭제
router.delete('/tag/:diary_id', deleteTagsFromDiary);

module.exports = router;