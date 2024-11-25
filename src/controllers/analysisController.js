const AnalysisResult = require('../models/AnalysisResult');
const Diary = require('../models/Diary'); // 다이어리 모델 추가

// 피드백 저장
exports.saveFeedback = async (req, res) => {
    const firebase_uid = req.headers['firebase-uid']; // 헤더에서 firebase_uid 추출
    const { diary_id, feedback } = req.body;

    if (!firebase_uid || !diary_id || !feedback) {
        return res.status(400).json({ error: "firebase_uid, diary_id, feedback가 필요합니다." });
    }

    try {
        // 사용자의 diary_id가 올바른지 확인
        const isOwner = await Diary.verifyDiaryOwner(firebase_uid, diary_id);
        if (!isOwner) {
            return res.status(403).json({ error: "Unauthorized: You do not own this diary" });
        }

        // 피드백 저장
        const feedbackId = await AnalysisResult.saveFeedback(diary_id, feedback);
        res.status(201).json({ message: "피드백 저장 성공", feedback_id: feedbackId });
    } catch (err) {
        res.status(500).json({ error: err.message || "피드백 저장 중 오류 발생" });
    }
};

// 특정 일기의 피드백 조회
exports.getFeedbackByDiaryId = async (req, res) => {
    const firebase_uid = req.headers['firebase-uid']; // 헤더에서 firebase_uid 추출
    const { diary_id } = req.params;

    if (!firebase_uid || !diary_id) {
        return res.status(400).json({ error: "firebase_uid와 diary_id가 필요합니다." });
    }

    try {
        // 사용자의 diary_id가 올바른지 확인
        const isOwner = await Diary.verifyDiaryOwner(firebase_uid, diary_id);
        if (!isOwner) {
            return res.status(403).json({ error: "Unauthorized: You do not own this diary" });
        }

        // 피드백 조회
        const feedback = await AnalysisResult.getFeedbackByDiaryId(diary_id);
        res.json(feedback);
    } catch (err) {
        res.status(500).json({ error: err.message || "피드백 조회 중 오류 발생" });
    }
};

// 특정 일기의 피드백 삭제
exports.deleteFeedback = async (req, res) => {
    const firebase_uid = req.headers['firebase-uid']; // 헤더에서 firebase_uid 추출
    const { diary_id } = req.params;

    if (!firebase_uid || !diary_id) {
        return res.status(400).json({ error: "firebase_uid와 diary_id가 필요합니다." });
    }

    try {
        // 사용자의 diary_id가 올바른지 확인
        const isOwner = await Diary.verifyDiaryOwner(firebase_uid, diary_id);
        if (!isOwner) {
            return res.status(403).json({ error: "Unauthorized: You do not own this diary" });
        }

        // 피드백 삭제
        const affectedRows = await AnalysisResult.deleteFeedback(diary_id);
        if (affectedRows === 0) {
            return res.status(404).json({ message: "삭제할 피드백이 없습니다." });
        }
        res.status(200).json({ message: "피드백 삭제 성공" });
    } catch (err) {
        res.status(500).json({ error: err.message || "피드백 삭제 중 오류 발생" });
    }
};
