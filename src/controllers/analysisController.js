// controllers/analysisController.js
const AnalysisResult = require('../models/AnalysisResult');

// 피드백 저장
exports.saveFeedback = (req, res) => {
    const { diary_id, feedback } = req.body;

    if (!diary_id || !feedback) {
        return res.status(400).json({ error: "Both diary_id and feedback are required" });
    }

    AnalysisResult.saveFeedback(diary_id, feedback, (err, results) => {
        if (err) {
            console.error("Error saving feedback:", err);
            return res.status(500).json({ error: "Error saving feedback" });
        }
        res.status(201).json({ message: "Feedback saved successfully", result_id: results.insertId });
    });
};

// 특정 일기의 피드백 조회
exports.getFeedbackByDiaryId = (req, res) => {
    const { diary_id } = req.params;

    AnalysisResult.getFeedbackByDiaryId(diary_id, (err, rows) => {
        if (err) {
            console.error("Error fetching feedback:", err);
            return res.status(500).json({ error: "Error fetching feedback" });
        }
        if (rows.length === 0) {
            return res.status(404).json({ message: "No feedback found for this diary" });
        }
        res.status(200).json(rows);
    });
};

// 피드백 삭제
exports.deleteFeedback = (req, res) => {
    const { diary_id } = req.params;

    AnalysisResult.deleteFeedback(diary_id, (err, results) => {
        if (err) {
            console.error("Error deleting feedback:", err);
            return res.status(500).json({ error: "Error deleting feedback" });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "No feedback found to delete for this diary" });
        }
        res.status(200).json({ message: "Feedback deleted successfully" });
    });
};