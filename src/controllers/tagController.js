const Tag = require('../models/Tag');
const { verifyDiaryOwner } = require('../models/Diary');  // verifyDiaryOwner 함수 불러오기

// 태그 추가
exports.addTags = async (req, res) => {
    const firebase_uid = req.headers['firebase-uid']; // 헤더에서 firebase_uid 추출
    const { tags, diary_id } = req.body;

    if (!tags || !Array.isArray(tags) || tags.length === 0 || !diary_id) {
        return res.status(400).json({ error: "태그와 diary_id가 필요합니다." });
    }

    try {
        // firebase_uid와 diary_id를 검증
        const isOwner = await verifyDiaryOwner(firebase_uid, diary_id);
        if (!isOwner) {
            return res.status(403).json({ error: "Unauthorized: You do not own this diary." });
        }

        // 태그 추가
        const message = await Tag.addTags(firebase_uid, tags, diary_id);
        res.status(201).json({ message });
    } catch (err) {
        res.status(500).json({ error: err.message || "태그 추가 중 오류 발생" });
    }
};

// 특정 태그로 일기 목록 조회
exports.getDiariesByTag = async (req, res) => {
    const firebase_uid = req.headers['firebase-uid']; // 헤더에서 firebase_uid 추출
    const tagName = req.query.tagName; // Query Params에서 tagName 추출

    if (!firebase_uid || !tagName) {
        return res.status(400).json({ error: "firebase_uid와 tagName이 필요합니다." });
    }

    try {
        // 특정 사용자의 태그로 검색
        const diaries = await Tag.getDiariesByTag(firebase_uid, tagName);
        res.json(diaries);
    } catch (err) {
        res.status(500).json({ error: err.message || "태그로 일기 조회 중 오류 발생" });
    }
};

// 특정 일기에 연결된 태그 조회
exports.getTagsByDiaryId = async (req, res) => {
    const firebase_uid = req.headers['firebase-uid']; // 헤더에서 firebase_uid 추출
    const { diary_id } = req.params;

    if (!diary_id) {
        return res.status(400).json({ error: "diary_id가 필요합니다." });
    }

    try {
        // firebase_uid와 diary_id를 검증
        const isOwner = await verifyDiaryOwner(firebase_uid, diary_id);
        if (!isOwner) {
            return res.status(403).json({ error: "Unauthorized: You do not own this diary." });
        }

        // 해당 일기에 연결된 태그들 조회
        const tags = await Tag.getTagsByDiaryId(firebase_uid, diary_id);
        res.json(tags);
    } catch (err) {
        res.status(500).json({ error: err.message || "태그 조회 중 오류 발생" });
    }
};

// 특정 일기에서 모든 태그 삭제
exports.deleteTagsFromDiary = async (req, res) => {
    const firebase_uid = req.headers['firebase-uid']; // 헤더에서 firebase_uid 추출
    const { diary_id } = req.params;

    if (!diary_id) {
        return res.status(400).json({ error: "diary_id가 필요합니다." });
    }

    try {
        // firebase_uid와 diary_id를 검증
        const isOwner = await verifyDiaryOwner(firebase_uid, diary_id);
        if (!isOwner) {
            return res.status(403).json({ error: "Unauthorized: You do not own this diary." });
        }

        // 해당 일기에서 모든 태그 삭제
        const affectedRows = await Tag.deleteTagsFromDiary(firebase_uid, diary_id);
        if (affectedRows === 0) {
            return res.status(404).json({ message: "삭제할 태그가 없습니다." });
        }

        // 필요 없는 태그 삭제 처리
        const deletedTags = await Tag.cleanUpTags();
        res.status(200).json({ message: `태그 삭제 성공. 필요 없는 태그 ${deletedTags}개 삭제됨.` });
    } catch (err) {
        res.status(500).json({ error: err.message || "태그 삭제 중 오류 발생" });
    }
};
