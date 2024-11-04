const express = require('express');
const path = require('path');
const router = express.Router();

// 기본 경로 ('/')에 대한 응답
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html')); // index.html 파일 응답
});

module.exports = router;