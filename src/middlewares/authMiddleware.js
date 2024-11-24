const authMiddleware = (req, res, next) => {
    const firebase_uid = req.headers['firebase_uid'];
    if (!firebase_uid) {
        return res.status(400).json({ error: 'firebase_uid가 필요합니다.' });
    }
    req.firebase_uid = firebase_uid; // 요청 객체에 저장
    next();
};

module.exports = authMiddleware;
