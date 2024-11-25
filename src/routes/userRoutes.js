const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // 사용자 컨트롤러 가져오기

// 함수 참조를 사용하여 올바르게 정의
router.post('/users/create', userController.checkOrCreateUser); // 회원가입
router.get('/users/check', userController.getAllUsers);  // 모든 사용자 정보 조회
router.post('/user/delete', userController.deleteUser); // 사용자 탈퇴

module.exports = router;
