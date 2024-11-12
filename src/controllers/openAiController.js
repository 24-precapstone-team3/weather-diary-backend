// controllers/openAiController.js
const { analyzeDiaryContent, provideCounseling } = require('../models/openAi');

// 일기 내용을 분석하여 정보 추출
exports.analyzeContent = async (req, res) => {
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ error: "Diary content is required" });
    }

    try {
        const result = await analyzeDiaryContent(content);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Error analyzing diary content" });
    }
};
// 일기 내용을 기반으로 심리 상담 제공
exports.provideCounseling = async (req, res) => {
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ error: "Diary content is required" });
    }

    try {
        const result = await provideCounseling(content); // 심리 상담 기능
        res.status(200).json({ counseling: result });
    } catch (error) {
        res.status(500).json({ error: "Error providing counseling" });
    }
};