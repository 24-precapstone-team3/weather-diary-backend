// controllers/userController.js
const userModel = require('../models/User');  // User 모델

// 사용자 확인 및 자동 등록
const checkOrCreateUser = async (req, res) => {
    const { firebase_uid } = req.body;

    try {
        // Firebase UID로 사용자 조회
        const [results] = await userModel.findUserByFirebaseUID(firebase_uid);
        
        // UID가 존재하면 기존 사용자 메시지 반환
        if (results.length > 0) {
            return res.status(200).json({ message: '기존 사용자입니다.', firebase_uid });
        }

        // UID가 없으면 새 사용자 등록
        await userModel.createUser(firebase_uid);
        res.status(201).json({ message: '새 사용자 등록 완료!', firebase_uid });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 사용자 정보 조회
const getUserInfo = async (req, res) => {
    //const userId = req.user.firebase_uid;
    const { firebase_uid } = req.query;

    try {
        const [results] = await userModel.getUserInfo(firebase_uid);
        if (results.length === 0) {
            return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
        }
        res.json(results[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 사용자 탈퇴
const deleteUser = async (req, res) => {
    //const userId = req.user.userId;
    const { firebase_uid } = req.body;

    try {
        await userModel.deleteUser(firebase_uid);
        res.json({ message: '사용자 계정이 삭제되었습니다.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { checkOrCreateUser, getUserInfo, deleteUser };
