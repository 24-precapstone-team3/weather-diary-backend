const db = require('../config/db');

const AnalysisResult = {};

// 피드백 저장
AnalysisResult.saveFeedback = async (diary_id, feedback) => {
    const query = `
        INSERT INTO Analysis_results (diary_id, feedback, created_at)
        VALUES (?, ?, NOW())
    `;
    const values = [diary_id, feedback];

    return new Promise((resolve, reject) => {
        db.query(query, values, (err, results) => {
            if (err) {
                reject(new Error("Error saving feedback"));
            } else {
                resolve(results.insertId);
            }
        });
    });
};

// 특정 일기의 피드백 조회
AnalysisResult.getFeedbackByDiaryId = async (diary_id) => {
    const query = `
        SELECT feedback, created_at
        FROM Analysis_results
        WHERE diary_id = ?
    `;

    return new Promise((resolve, reject) => {
        db.query(query, [diary_id], (err, rows) => {
            if (err) {
                reject(new Error("Error fetching feedback"));
            } else {
                resolve(rows);
            }
        });
    });
};

// 피드백 삭제
AnalysisResult.deleteFeedback = async (diary_id) => {
    const query = `
        DELETE FROM Analysis_results
        WHERE diary_id = ?
    `;

    return new Promise((resolve, reject) => {
        db.query(query, [diary_id], (err, results) => {
            if (err) {
                reject(new Error("Error deleting feedback"));
            } else {
                resolve(results.affectedRows);
            }
        });
    });
};

module.exports = AnalysisResult;
