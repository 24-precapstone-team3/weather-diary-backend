// models/AnalysisResult.js
const db = require('../db');

const AnalysisResult = {};

// 피드백 저장
AnalysisResult.saveFeedback = (diary_id, feedback, callback) => {
    const query = `
        INSERT INTO Analysis_results (diary_id, feedback, created_at)
        VALUES (?, ?, NOW())
    `;
    const values = [diary_id, feedback];
    db.query(query, values, callback);
};

// 특정 일기의 피드백 조회
AnalysisResult.getFeedbackByDiaryId = (diary_id, callback) => {
    const query = `
        SELECT feedback, created_at
        FROM Analysis_results
        WHERE diary_id = ?
    `;
    db.query(query, [diary_id], callback);
};

// 피드백 삭제
AnalysisResult.deleteFeedback = (diary_id, callback) => {
    const query = `
        DELETE FROM Analysis_results
        WHERE diary_id = ?
    `;
    db.query(query, [diary_id], callback);
};

module.exports = AnalysisResult;