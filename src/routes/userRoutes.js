const express = require('express');
const { checkOrCreateUser, getUserInfo, deleteUser } = require('../controllers/userController'); // 사용자 컨트롤러 가져오기
const router = express.Router();


router.post('/users/create',  checkOrCreateUser); // 회원가입
router.get('/users/:firebase_uid/check', getUserInfo);// 사용자 정보 조회
router.post('/user/delete', deleteUser); // 사용자 탈퇴

module.exports = router;
