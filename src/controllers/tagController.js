// controllers/tagController.js
const Tag = require('../models/Tag');

// 해시태그 저장
exports.addTags = (req, res) => {
    const { tags, diary_id } = req.body;

    if (!Array.isArray(tags) || tags.length === 0) {
        return res.status(400).json({ error: "적어도 하나 이상의 태그가 필요합니다." });
    }

    Tag.addTags(tags, diary_id)
        .then((message) => {
            res.status(201).json({ message });
        })
        .catch((error) => {
            console.error("태그 저장 오류:", error);
            res.status(500).json({ error });
        });
};

// 특정 태그와 연관된 일기 목록 조회
exports.getDiariesByTag = (req, res) => {
    const { tagName } = req.params;

    Tag.getDiariesByTag(tagName)
        .then((rows) => {
            res.json(rows);
        })
        .catch((error) => {
            console.error("태그로 일기 검색 오류:", error);
            res.status(500).json({ error });
        });
};

// 특정 일기에 등록된 태그 조회
exports.getTagsByDiaryId = (req, res) => {
    const { diary_id } = req.params;

    Tag.getTagsByDiaryId(diary_id)
        .then((tags) => {
            res.json(tags);
        })
        .catch((error) => {
            console.error("일기에 대한 태그 조회 오류:", error);
            res.status(500).json({ error });
        });
};


// 특정 일기에 등록된 전체 태그 삭제
exports.deleteTagsFromDiary = (req, res) => {
    const { diary_id } = req.params; // diary_id를 URL 파라미터로 받음

    Tag.deleteTagsFromDiary(diary_id)
        .then((message) => {
            res.status(200).json({ message });
        })
        .catch((error) => {
            console.error("일기에서 전체 태그 삭제 오류:", error);
            res.status(500).json({ error });
        });
};